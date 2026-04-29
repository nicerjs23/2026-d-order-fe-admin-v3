import { useEffect, useRef } from "react";
import {
  type ConnectionEstablishedEvent,
  type TableDetailWSPayload,
  type WsErrorEvent,
} from "./types";
import { getWsUrl } from "@utils/getWsUrl";

interface UseTableDetailWSOptions {
  tableNum?: number;
  table_num?: number;
  onConnectionEstablished?: (data: ConnectionEstablishedEvent["data"]) => void;
  onOrderUpdate?: (data: unknown) => void;
  onError?: (data: WsErrorEvent["data"]) => void;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 1500;

const isFiniteTableNum = (value: number | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const buildTableDetailWsUrl = (tableNum: number): string => {
  const path = `/ws/django/tables/${tableNum}`;
  const fromUtil = getWsUrl(path);

  if (fromUtil) return fromUtil;

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}${path}`;
};

export const useTableDetailWS = ({
  tableNum,
  table_num,
  onConnectionEstablished,
  onOrderUpdate,
  onError,
}: UseTableDetailWSOptions) => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const manuallyClosedRef = useRef(false);

  const resolvedTableNum = isFiniteTableNum(tableNum)
    ? tableNum
    : isFiniteTableNum(table_num)
    ? table_num
    : undefined;

  useEffect(() => {
    if (!resolvedTableNum) {
      return;
    }

    let active = true;

    const clearReconnectTimer = () => {
      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    const cleanupSocketRef = () => {
      if (socketRef.current) {
        socketRef.current.onopen = null;
        socketRef.current.onmessage = null;
        socketRef.current.onclose = null;
        socketRef.current.onerror = null;
        socketRef.current.close();
        socketRef.current = null;
      }
    };

    const connect = () => {
      if (!active) return;
      if (socketRef.current) return;

      const wsUrl = buildTableDetailWsUrl(resolvedTableNum);
      console.log(`[WS:TableDetail-${resolvedTableNum}] connecting`, wsUrl);

      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttemptsRef.current = 0;
        console.log(`[WS:TableDetail-${resolvedTableNum}] connected`);
      };

      socket.onmessage = (event) => {
        if (!active) return;

        try {
          const payload: TableDetailWSPayload = JSON.parse(event.data);
          console.log(
            `[WS:TableDetail-${resolvedTableNum}] event`,
            payload?.type
          );

          switch (payload.type) {
            case "connection_established":
              onConnectionEstablished?.(payload.data);
              break;
            case "order_update":
              console.log(
                `[WS:TableDetail-${resolvedTableNum}] order_update received -> refetch`
              );
              onOrderUpdate?.(payload.data);
              break;
            case "ERROR":
              console.error(
                `[WS:TableDetail-${resolvedTableNum}] ERROR event`,
                payload.data
              );
              onError?.(payload.data);
              break;
            default:
              console.warn(
                `[WS:TableDetail-${resolvedTableNum}] unknown event`,
                payload
              );
              break;
          }
        } catch (error) {
          console.error(`[WS:TableDetail-${resolvedTableNum}] parse error`, error);
        }
      };

      socket.onerror = (event) => {
        console.error(`[WS:TableDetail-${resolvedTableNum}] socket error`, event);
      };

      socket.onclose = (event) => {
        const { code, reason } = event;
        console.log(
          `[WS:TableDetail-${resolvedTableNum}] closed code=${code} reason=${reason}`
        );

        socketRef.current = null;

        if (!active || manuallyClosedRef.current) return;
        if (code === 1000 || code === 4001) return;
        if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) return;

        reconnectAttemptsRef.current += 1;
        console.log(
          `[WS:TableDetail-${resolvedTableNum}] reconnect attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS}`
        );

        clearReconnectTimer();
        reconnectTimerRef.current = window.setTimeout(() => {
          connect();
        }, RECONNECT_DELAY_MS);
      };
    };

    manuallyClosedRef.current = false;
    reconnectAttemptsRef.current = 0;
    clearReconnectTimer();
    cleanupSocketRef();
    connect();

    return () => {
      active = false;
      manuallyClosedRef.current = true;
      clearReconnectTimer();
      cleanupSocketRef();
    };
  }, [resolvedTableNum, onConnectionEstablished, onOrderUpdate, onError]);

  return { socket: socketRef.current };
};