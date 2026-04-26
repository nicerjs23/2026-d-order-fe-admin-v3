import { useState, useEffect, useRef } from "react";
import { getWsUrl } from "@utils/getWsUrl";
import { BellPlayer } from "../BellPlayer";
import { Notification, NotificationType } from "../dummy/dummyNotifications";
import { useAuthStore } from "../../../stores/authStore";

interface StaffCallWsItem {
  id: number;
  call_type: string;
  table_num?: number;
  table_id?: number;
  created_at?: string;
  status?: string;
}

interface StaffCallWsMessage {
  type: string;
  data?: StaffCallWsItem[];
}

const mapCallType = (callType: string): NotificationType => {
  if ((callType ?? "").toUpperCase() === "PAYMENT_CONFIRM") return "송금 확인 요청";
  return "직원 호출";
};

const mapToNotification = (item: StaffCallWsItem): Notification => {
  const s = (item.status ?? "").toUpperCase();
  return {
    id: item.id,
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
    console.log("[StaffCall WS] booth_id:", booth_id);
    if (!booth_id) {
      console.warn("[StaffCall WS] booth_id 없음 → 연결 안함");
      return;
    }

    BellPlayer.ensureUnlocked();

    const url = getWsUrl(`/ws/server/staffcall`);
    console.log("[StaffCall WS] 연결 시도:", url);

    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("[StaffCall WS] 연결 성공 ✅");
      const payload = { type: "LIST", limit: 50, offset: 0 };
      console.log("[StaffCall WS] LIST 요청 전송:", payload);
      ws.send(JSON.stringify(payload));
    };

    ws.onmessage = (event) => {
      console.log("[StaffCall WS] 메시지 수신 (raw):", event.data);
      try {
        const msg: StaffCallWsMessage = JSON.parse(event.data);
        console.log("[StaffCall WS] 파싱된 메시지:", msg);

        if (msg.type === "LIST_RESULT" || msg.type === "STAFF_CALL_SNAPSHOT") {
          const mapped = (msg.data ?? []).map(mapToNotification);
          console.log("[StaffCall WS] 매핑된 notifications:", mapped);

          const newPending = mapped.filter(
            (n) => !n.isProcessed && !knownIdsRef.current.has(n.id)
          );
          console.log("[StaffCall WS] 신규 미처리 항목:", newPending);
          mapped.forEach((n) => knownIdsRef.current.add(n.id));

          if (newPending.length > 0) {
            BellPlayer.play();
            const first = newPending[0];
            setLiveNotice(`${first.tableNumber} ${first.type}`);
            setShowLiveNotice(true);
            setTimeout(() => setShowLiveNotice(false), 4000);
            setHasUnread(true);
          }

          setNotifications(mapped);
        } else {
          console.warn("[StaffCall WS] 미처리 메시지 타입:", msg.type);
        }
      } catch (err) {
        console.error("[StaffCall WS] 메시지 파싱 오류:", err);
      }
    };

    ws.onerror = (e) => console.error("[StaffCall WS] 에러 ❌:", e);
    ws.onclose = (e) => console.log("[StaffCall WS] 연결 종료:", e.code, e.reason);

    return () => {
      console.log("[StaffCall WS] cleanup → ws.close()");
      ws.close();
    };
  }, [booth_id]);

  const markAsRead = () => setHasUnread(false);
  const activeCount = notifications.filter((n) => !n.isProcessed).length;

  return { liveNotice, showLiveNotice, notifications, hasUnread, markAsRead, activeCount };
};
