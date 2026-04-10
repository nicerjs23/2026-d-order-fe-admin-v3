import { useEffect, useRef, useState } from 'react';
import type { OrderBoxData } from '../compoenents/orderbox/OrderBox';
import { getOrderManagementWsUrl } from '../utils/getOrderManagementWsUrl';
import { mapSnapshotToOrderBoxData } from '../utils/mapSnapshotToOrderBoxData';
import { applyNewOrder } from '../utils/applyNewOrder';
import { applyOrderUpdate } from '../utils/applyOrderUpdate';
import { applyOrderCompleted } from '../utils/applyOrderCompleted';
import { applyOrderCancelled } from '../utils/applyOrderCancelled';
import {
  isAdminOrderSnapshotMessage,
  isAdminNewOrderMessage,
  isAdminOrderUpdateMessage,
  isAdminOrderCompletedMessage,
  isAdminOrderCancelledMessage,
  isMenuAggregationMessage,
  getOrderWsErrorInfo,
} from '../types/orderManagementWs';
import UserService from '@services/UserService';
import { redirectToLoginPage } from '@utils/redirectToLoginPage';

const AUTH_FAILURE_CLOSE_CODE = 4001;
/** JWT/세션 없음 (Django AdminOrderManagementConsumer._authenticate) */
const NO_BOOTH_CLOSE_CODE = 4003;
const RECONNECT_AFTER_1006_MS = 2000;

export type MenuAggregationCallback = (
  food: { menuName: string; quantity: number }[],
  beverage: { menuName: string; quantity: number }[],
) => void;

export function useOrderManagementWebSocket(
  setOrders: (
    orders: OrderBoxData[] | ((prev: OrderBoxData[]) => OrderBoxData[]),
  ) => void,
  onMenuAggregation?: MenuAggregationCallback,
) {
  const wsRef = useRef<WebSocket | null>(null);
  const setOrdersRef = useRef(setOrders);
  setOrdersRef.current = setOrders;
  const onMenuAggregationRef = useRef(onMenuAggregation);
  onMenuAggregationRef.current = onMenuAggregation;
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let aborted = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const clearReconnectTimer = () => {
      if (reconnectTimer != null) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const attachHandlers = (ws: WebSocket) => {
      ws.onopen = () => {
        if (aborted) {
          try {
            ws.close(1000, 'unmount');
          } catch {
            /* noop */
          }
          return;
        }
        setIsConnected(true);
        console.log('[OrderManagementWS] 연결됨');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string);
          const type =
            (msg && typeof msg.type === 'string' && msg.type) || '(unknown)';
          console.log('[OrderManagementWS] 수신:', type, msg);
          const errInfo = getOrderWsErrorInfo(msg);
          if (errInfo) {
            console.error('[OrderManagementWS] error payload', errInfo);
            const codeStr = errInfo.code != null ? String(errInfo.code) : '';
            if (
              errInfo.code === 'AUTH_ERROR' ||
              codeStr === '401' ||
              errInfo.code === 401
            ) {
              redirectToLoginPage();
            }
            return;
          }
          if (isAdminOrderSnapshotMessage(msg)) {
            const next = mapSnapshotToOrderBoxData(msg.data.orders);
            setOrdersRef.current(next);
          } else if (isAdminNewOrderMessage(msg)) {
            setOrdersRef.current((prev) => applyNewOrder(prev, msg.data));
          } else if (isAdminOrderUpdateMessage(msg)) {
            console.log(
              '[OrderManagementWS] ADMIN_ORDER_UPDATE → 목록 반영',
              msg.data,
            );
            setOrdersRef.current((prev) => applyOrderUpdate(prev, msg.data));
          } else if (isAdminOrderCompletedMessage(msg)) {
            setOrdersRef.current((prev) => applyOrderCompleted(prev, msg.data));
          } else if (isAdminOrderCancelledMessage(msg)) {
            setOrdersRef.current((prev) => applyOrderCancelled(prev, msg.data));
          } else if (
            isMenuAggregationMessage(msg) &&
            onMenuAggregationRef.current
          ) {
            const food = (msg.data.food_summary ?? []).map((row) => ({
              menuName: row.menu_name ?? '',
              quantity: Number(row.total_quantity) || 0,
            }));
            const beverage = (msg.data.beverage_summary ?? []).map((row) => ({
              menuName: row.menu_name ?? '',
              quantity: Number(row.total_quantity) || 0,
            }));
            onMenuAggregationRef.current(food, beverage);
          }
        } catch {
          // non-JSON 등 무시
        }
      };

      ws.onerror = () => {
        console.warn('[OrderManagementWS] 연결 오류 (상세는 onclose code 확인)');
      };

      ws.onclose = (e) => {
        wsRef.current = null;
        setIsConnected(false);
        console.log(
          '[OrderManagementWS] 연결 종료',
          e.code,
          e.reason || '(없음)',
        );

        if (aborted) return;

        if (e.code === AUTH_FAILURE_CLOSE_CODE) {
          redirectToLoginPage();
          return;
        }
        if (e.code === NO_BOOTH_CLOSE_CODE) {
          console.warn(
            '[OrderManagementWS] close 4003 — 로그인은 되었으나 부스(booth) 미연결. 계정/DB 확인.',
          );
          return;
        }

        if (e.code === 1006) {
          console.warn(
            '[OrderManagementWS] 1006 Abnormal Closure — POST /api/v3/django/auth/refresh/ 로 토큰 재발급 후 재연결합니다.',
          );
          void (async () => {
            try {
              await UserService.refreshTokenV3();
              console.info(
                '[OrderManagementWS] 1006 후 토큰 재발급 완료, ' +
                  `${RECONNECT_AFTER_1006_MS}ms 뒤 재연결`,
              );
            } catch (err) {
              console.warn(
                '[OrderManagementWS] 1006 후 토큰 재발급 실패 (재연결은 시도)',
                err,
              );
            }
            if (aborted) return;
            clearReconnectTimer();
            reconnectTimer = setTimeout(() => {
              reconnectTimer = null;
              if (!aborted) connect();
            }, RECONNECT_AFTER_1006_MS);
          })();
        }
      };
    };

    const connect = () => {
      const url = getOrderManagementWsUrl();
      if (!url) {
        console.warn(
          '[OrderManagementWS] WS URL 없음 (VITE_WS_URL 또는 VITE_BASE_URL 확인)',
        );
        return;
      }
      if (aborted) return;

      console.log('[OrderManagementWS] 연결 시도:', url);
      const ws = new WebSocket(url);
      wsRef.current = ws;
      attachHandlers(ws);
    };

    connect();

    return () => {
      aborted = true;
      clearReconnectTimer();
      const w = wsRef.current;
      wsRef.current = null;
      setIsConnected(false);
      // CONNECTING(0) 상태의 WS도 닫아야 함.
      // React 18 StrictMode에서 이중 마운트 시 첫 번째 WS가 CONNECTING 상태에서
      // cleanup을 맞으면, 닫지 않을 경우 서버에 두 개의 consumer가 등록되고
      // 이후 첫 번째가 닫히면서 broadcast 그룹이 꼬여 새 주문을 못 받게 됨.
      if (
        w &&
        (w.readyState === WebSocket.OPEN ||
          w.readyState === WebSocket.CONNECTING)
      ) {
        try {
          w.close(1000, 'unmount');
        } catch {
          /* noop */
        }
      }
    };
  }, []);

  return { isConnected };
}
