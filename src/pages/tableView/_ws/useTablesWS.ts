// src/pages/tableView/_ws/useTablesWS.ts
// tableView/_ws/useTablesWS.ts
import { useEffect, useRef } from "react";
import {
    TableWSPayload,
    WsConnectionEstablished,
    WsEnterTable,
    WsError,
    WsMergeTable,
    WsOrderUpdate,
    WsResetTable,
} from "./types";
import { getWsUrl } from "@utils/getWsUrl";

interface UseTablesWSOptions {
    onConnectionEstablished?: (data: WsConnectionEstablished["data"]) => void;
    onMergeTable?: (data: WsMergeTable["data"]) => void;
    onResetTable?: (data: WsResetTable["data"]) => void;
    onEnterTable?: (data: WsEnterTable["data"]) => void;
    onOrderUpdate?: (data: WsOrderUpdate["data"]) => void;
    onError?: (data: WsError["data"]) => void;
}

export const useTablesWS = (options: UseTablesWSOptions = {}) => {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const reconnectAttemptRef = useRef(0);
    const isUnmountedRef = useRef(false);
    const callbacksRef = useRef(options);

    // 콜백 최신 참조 유지 (stale closure 방지)
    callbacksRef.current = options;

    useEffect(() => {
        isUnmountedRef.current = false;
        const MAX_RECONNECT_ATTEMPTS = 5;
        const RECONNECT_DELAY_MS = 3000;

        const clearReconnectTimer = () => {
        if (reconnectTimeoutRef.current !== null) {
            window.clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        };

        const connect = () => {
        if (isUnmountedRef.current) return;

        clearReconnectTimer();

        const wsUrl = getWsUrl("/ws/django/booth/tables/");
        if (!wsUrl) {
            /* console.error("[WS:Tables] 🚨 WS URL이 비어 있어 연결을 시작할 수 없습니다."); */
            return;
        }

        /* console.log(`[WS:Tables] 🔄 연결 시도 중... URL: ${wsUrl}`); */

        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
            reconnectAttemptRef.current = 0;
            /* console.log(`[WS:Tables] 🟢 연결 성공! (readyState: ${socket.readyState})`); */
        };

        socket.onmessage = (event) => {
            if (isUnmountedRef.current) return;

            try {
            const payload: TableWSPayload = JSON.parse(event.data);
            /* console.debug("[WS:Tables] 📩 메시지 수신:", payload); */

            switch (payload.type) {
                        case "connection_established":
                            /* console.log("[WS] connection_established"); */
                            callbacksRef.current.onConnectionEstablished?.(payload.data);
                            break;
                        case "merge_table":
                            /* console.log("[WS] merge_table"); */
                            callbacksRef.current.onMergeTable?.(payload.data);
                            break;
                        case "reset_table":
                            /* console.log("[WS] reset_table"); */
                            callbacksRef.current.onResetTable?.(payload.data);
                            break;
                        case "enter_table":
                            /* console.log("[WS] enter_table"); */
                            callbacksRef.current.onEnterTable?.(payload.data);
                            break;
                        case "order_update":
                            /* console.log("[WS] order_update"); */
                            callbacksRef.current.onOrderUpdate?.(payload.data);
                            break;
                        case "ERROR":
                            /* console.error("[WS:Tables] ❌ 서버 응답 에러:", payload.data); */
                            callbacksRef.current.onError?.(payload.data);
                break;
                default:
                /* console.warn("[WS:Tables] ⚠️ 알 수 없는 타입 수신:", payload); */
            }
            } catch (error) {
            /* console.error("[WS:Tables] 💥 메시지 파싱 에러 (JSON 형식이 아님):", error, event.data); */
            }
        };

        socket.onerror = (_error) => {
            /* console.error("[WS:Tables] 🔴 소켓 에러 발생:", error); */
        };

        socket.onclose = (event) => {
            if (wsRef.current === socket) {
            wsRef.current = null;
            }

            /*
             * console.log(
             *             `[WS:Tables] ⚪ 연결 종료. Code: ${event.code}, Reason: '${event.reason || "없음"}', Clean: ${event.wasClean}`
             *             );
             */

            if (isUnmountedRef.current) return;

            // 인증 실패(4001)는 재연결 금지
            if (event.code === 4001) {
            /* console.error("[WS:Tables] 🚨 인증 실패(4001)로 인해 재연결을 시도하지 않습니다."); */
            return;
            }

            // 정상 종료는 재연결하지 않음
            if (event.code === 1000) {
            return;
            }

            if (reconnectAttemptRef.current >= MAX_RECONNECT_ATTEMPTS) {
            /*
             * console.error(
             *                 `[WS:Tables] 🚨 재연결 최대 횟수(${MAX_RECONNECT_ATTEMPTS})를 초과하여 재연결을 중단합니다.`
             *             );
             */
            return;
            }

            reconnectAttemptRef.current += 1;
            /*
             * console.log(
             *             `[WS:Tables] ⏳ ${RECONNECT_DELAY_MS / 1000}초 후 재연결을 시도합니다... (${reconnectAttemptRef.current}/${MAX_RECONNECT_ATTEMPTS})`
             *             );
             */
            reconnectTimeoutRef.current = window.setTimeout(connect, RECONNECT_DELAY_MS);
        };
        };

        connect();

        return () => {
        isUnmountedRef.current = true;
        clearReconnectTimer();

        if (wsRef.current) {
            /* console.log("[WS:Tables] 🧹 컴포넌트 언마운트 - 소켓 연결을 정리합니다."); */
            wsRef.current.close(1000, "component_unmount");
            wsRef.current = null;
        }
        };
    }, []);

    return { socket: wsRef.current };
};
