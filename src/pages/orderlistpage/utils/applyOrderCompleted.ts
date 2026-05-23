import type { OrderBoxData } from '../compoenents/orderbox/OrderBox';
import type { OrderCompletedPayload } from '../types/orderManagementWs';

/**
 * ADMIN_ORDER_COMPLETED / ORDER_COMPLETED 수신 시: 해당 주문 빌지를 목록에서 제거.
 * (오더 내 아이템 전부 서빙 완료 시 서버가 전송 — `order_id` 기준)
 */
export function applyOrderCompleted(
  prev: OrderBoxData[],
  data: OrderCompletedPayload
): OrderBoxData[] {
  const completedId = Number(data.order_id);
  return prev.filter((box) => {
    if (box.orderId != null) return Number(box.orderId) !== completedId;
    // 레거시(평면 스냅샷 등 orderId 없음): 테이블 단위로만 구분
    return Number(box.tableNumber) !== Number(data.table_num);
  });
}
