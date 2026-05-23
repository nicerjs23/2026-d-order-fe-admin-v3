import type { OrderBoxData, OrderItem } from '../compoenents/orderbox/OrderBox';
import type { AdminOrderUpdateMessage } from '../types/orderManagementWs';
import { mapStatus } from './mapSnapshotToOrderBoxData';

function patchItemId(row: { id?: number; order_item_id?: number }): number | undefined {
  if (typeof row.id === 'number') return row.id;
  if (typeof row.order_item_id === 'number') return row.order_item_id;
  return undefined;
}

function collectPatches(data: AdminOrderUpdateMessage['data']): Map<number, string> {
  const map = new Map<number, string>();
  if (Array.isArray(data.items)) {
    for (const row of data.items) {
      if (!row || typeof row.status !== 'string') continue;
      const pid = patchItemId(row);
      if (pid != null) map.set(pid, row.status);
    }
  }
  if (map.size === 0 && data.item && typeof data.item.id === 'number') {
    map.set(data.item.id, data.item.status);
  }
  return map;
}

/**
 * ADMIN_ORDER_UPDATE 수신 시 반영.
 * - Django: `order_id` + `items[{ id, status }, ...]`
 * - 동일 `order_id` 카드만 갱신 (`orderId` 없는 레거시 박스는 전체에서 id 매칭)
 * - cancelled → 해당 줄 제거
 */
export function applyOrderUpdate(
  prev: OrderBoxData[],
  data: AdminOrderUpdateMessage['data']
): OrderBoxData[] {
  const patchMap = collectPatches(data);
  if (patchMap.size === 0) return prev;

  const targetOrderId =
    data.order_id != null ? Number(data.order_id) : undefined;

  return prev
    .map((table) => {
      if (
        table.orderId != null &&
        targetOrderId != null &&
        Number(table.orderId) !== targetOrderId
      ) {
        return table;
      }

      const items = table.items
        .map((item) => {
          if (item.id == null || !patchMap.has(item.id)) return item;
          const apiStatus = patchMap.get(item.id)!;
          const isCancelled = String(apiStatus).toLowerCase() === 'cancelled';
          if (isCancelled) return null;
          return { ...item, status: mapStatus(apiStatus) };
        })
        .filter((item): item is OrderItem => item != null);
      return { ...table, items };
    })
    .filter((table) => table.items.length > 0);
}
