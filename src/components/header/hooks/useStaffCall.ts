import { useState, useEffect, useRef } from "react";
import { getWsUrl } from "@utils/getWsUrl";
import { BellPlayer } from "../BellPlayer";
import { Notification, NotificationType } from "../dummy/dummyNotifications";
import { useAuthStore } from "../../../stores/authStore";

const PING_INTERVAL_MS = 30_000;
const PONG_DEADLINE_MS = 3_000;
const RECONNECT_DELAY_MS = 1_500;
const LIST_LIMIT = 50;

interface StaffCallWsItem {
  staff_call_id: number;
  table_id?: number;
  table_num?: number;
  cart_id?: number;
  call_type: string;
  category?: string;
  status: string;
  created_at?: string;
  accepted_at?: string;
  accepted_by?: string;
  completed_at?: string;
}

interface StaffCallWsMessage {
  type: string;
  data?: StaffCallWsItem[];
  total?: number;
  has_more?: boolean;
  message?: string;
}

const mapCallType = (callType: string): NotificationType => {
  if ((callType ?? "").toUpperCase() === "PAYMENT_CONFIRM") return "송금 확인 요청";
  return "직원 호출";
};

const mapToNotification = (item: StaffCallWsItem): Notification => {
  const s = (item.status ?? "").toUpperCase();
  return {
    id: item.staff_call_id,
    tableNumber: `T ${item.table_num ?? item.table_id ?? "?"}`,
    type: mapCallType(item.call_type),
    createdAt: item.created_at ? new Date(item.created_at) : new Date(),
    isProcessed: s === "ACCEPTED" || s === "COMPLETED",
  };
};

export const useStaffCall = () => {
  const { booth_id: storeBoothId } = useAuthStore();
  const localBoothId = Number(localStorage.getItem("Booth-ID") || "0") || null;
  const booth_id = storeBoothId ?? localBoothId;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [liveNotice, setLiveNotice] = useState<string | null>(null);
  const [showLiveNotice, setShowLiveNotice] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const knownIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!booth_id) {
      console.warn("[staffcall ws] skip — booth_id not ready");
      return;
    }

    BellPlayer.ensureUnlocked();

    let cancelled = false;
    let ws: WebSocket | null = null;
    let pingTimerId: ReturnType<typeof setTimeout> | null = null;
    let pongDeadlineId: ReturnType<typeof setTimeout> | null = null;
    let reconnectTimerId: ReturnType<typeof setTimeout> | null = null;

    const clearTimer = (id: ReturnType<typeof setTimeout> | null) => {
      if (id !== null) clearTimeout(id);
    };
    const clearAllTimers = () => {
      clearTimer(pingTimerId);
      pingTimerId = null;
      clearTimer(pongDeadlineId);
      pongDeadlineId = null;
      clearTimer(reconnectTimerId);
      reconnectTimerId = null;
    };

    const armPongDeadline = () => {
      clearTimer(pongDeadlineId);
      pongDeadlineId = setTimeout(() => {
        if (cancelled) return;
        console.warn("[staffcall ws] pong timeout → force close");
        try {
          ws?.close();
        } catch {
          /* noop */
        }
      }, PONG_DEADLINE_MS);
    };

    const schedulePing = () => {
      clearTimer(pingTimerId);
      pingTimerId = setTimeout(() => {
        if (cancelled || !ws || ws.readyState !== WebSocket.OPEN) return;
        try {
          ws.send(JSON.stringify({ type: "PING" }));
          armPongDeadline();
        } catch (err) {
          console.error("[staffcall ws] ping send failed", err);
        }
      }, PING_INTERVAL_MS);
    };

    const handleSnapshot = (items: StaffCallWsItem[]) => {
      const mapped = items
        .map(mapToNotification)
        .filter((n) => typeof n.id === "number" && Number.isFinite(n.id));

      const newPending = mapped.filter(
        (n) => !n.isProcessed && !knownIdsRef.current.has(n.id),
      );
      mapped.forEach((n) => knownIdsRef.current.add(n.id));

      console.log(
        `[staffcall ws] snapshot count=${mapped.length} newPending=${newPending.length}`,
      );

      if (newPending.length > 0) {
        BellPlayer.play();
        const first = newPending[0];
        console.log(
          `[staffcall ws] alert tableNumber=${first.tableNumber} type=${first.type}`,
        );
        setLiveNotice(`${first.tableNumber} ${first.type}`);
        setShowLiveNotice(true);
        setTimeout(() => setShowLiveNotice(false), 4000);
        setHasUnread(true);
      }

      setNotifications(mapped);
    };

    const connect = () => {
      if (cancelled) return;
      const url = getWsUrl(`/ws/server/staffcall`);
      console.log(`[staffcall ws] connect url=${url}`);

      ws = new WebSocket(url);

      ws.onopen = () => {
        if (cancelled) {
          ws?.close();
          return;
        }
        console.log("[staffcall ws] open");
        try {
          ws?.send(JSON.stringify({ type: "LIST", limit: LIST_LIMIT, offset: 0 }));
        } catch (err) {
          console.error("[staffcall ws] LIST send failed", err);
        }
        schedulePing();
      };

      ws.onmessage = (event) => {
        if (cancelled) return;
        let msg: StaffCallWsMessage;
        try {
          msg = JSON.parse(event.data);
        } catch (err) {
          console.error("[staffcall ws] parse error", err);
          return;
        }

        if (msg.type === "PONG") {
          clearTimer(pongDeadlineId);
          pongDeadlineId = null;
          schedulePing();
          return;
        }

        if (msg.type === "LIST_RESULT" || msg.type === "STAFF_CALL_SNAPSHOT") {
          handleSnapshot(msg.data ?? []);
          return;
        }
      };

      ws.onerror = () => {
        console.error("[staffcall ws] error");
      };

      ws.onclose = (e) => {
        clearTimer(pingTimerId);
        pingTimerId = null;
        clearTimer(pongDeadlineId);
        pongDeadlineId = null;

        const willReconnect = !cancelled;
        console.log(
          `[staffcall ws] close code=${e.code} reason=${e.reason || ""} willReconnect=${willReconnect}`,
        );

        if (willReconnect) {
          console.log(`[staffcall ws] reconnect in ${RECONNECT_DELAY_MS}ms`);
          reconnectTimerId = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };
    };

    connect();

    return () => {
      cancelled = true;
      clearAllTimers();
      try {
        ws?.close();
      } catch {
        /* noop */
      }
    };
  }, [booth_id]);

  const markAsRead = () => setHasUnread(false);
  const activeCount = notifications.filter((n) => !n.isProcessed).length;

  return { liveNotice, showLiveNotice, notifications, hasUnread, markAsRead, activeCount };
};
