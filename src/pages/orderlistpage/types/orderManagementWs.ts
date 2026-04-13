/**
 * Order 관리 WebSocket (실시간 주문 화면)
 * WS URL: /ws/django/booth/orders/management/
 * (REST 문서 경로 /api/v3/django/booth/order/management/ 와 별개)
 *
 * Event Types: ADMIN_ORDER_SNAPSHOT, ADMIN_NEW_ORDER, ADMIN_ORDER_UPDATE,
 * ORDER_COMPLETED | ADMIN_ORDER_COMPLETED, ADMIN_ORDER_CANCELLED,
 * MENU_AGGREGATION (또는 ADMIN_MENU_AGGREGATION), ERROR
 *
 * Django `receive_json` 거절: type `error`(소문자), 최상위 `message`, `data` null 가능
 *
 * 아이템 status: 서버에서 COOKING 등 대문자로 올 수 있음 → 클라이언트에서 소문자로 매핑
 */

export const ADMIN_ORDER_SNAPSHOT = 'ADMIN_ORDER_SNAPSHOT';
export const WS_ERROR = 'ERROR';
/** AsyncJsonWebsocketConsumer.receive_json 등에서 보내는 소문자 타입 */
export const WS_ERROR_LOWERCASE = 'error';
export const ADMIN_NEW_ORDER = 'ADMIN_NEW_ORDER';
export const ADMIN_ORDER_UPDATE = 'ADMIN_ORDER_UPDATE';
export const ADMIN_ORDER_COMPLETED = 'ADMIN_ORDER_COMPLETED';
export const ADMIN_ORDER_CANCELLED = 'ADMIN_ORDER_CANCELLED';
export const ADMIN_MENU_AGGREGATION = 'ADMIN_MENU_AGGREGATION';

/** 레거시: 한 줄에 테이블·메뉴가 함께 오는 평면 스냅샷 (하위 호환) */
export interface AdminOrderSnapshotItem {
  order_menu_id?: number;
  order_id?: number;
  menu_name: string;
  menu_image?: string | null;
  quantity: number;
  status: string; // e.g. pending | cooked | served 또는 한글
  table_num: number;
  from_set?: boolean;
  set_id?: number | null;
  set_name?: string | null;
  created_at?: string;
}

/** 스냅샷 한 줄 아이템 (ADMIN_ORDER_SNAPSHOT 내 order.items, ADMIN_NEW_ORDER와 동형) */
export interface AdminOrderSnapshotLineItem {
  order_item_id?: number;
  menu_name: string;
  image?: string | null;
  quantity: number;
  fixed_price?: number;
  item_total_price?: number;
  status: string;
  is_set?: boolean;
  /** 세트 자식 행 (백엔드 직렬화) */
  set_menu_name?: string;
  parent_order_item_id?: number;
}

/** 스냅샷 주문 한 건 (연결 직후 전체 PAID 대기 목록) */
export interface AdminOrderSnapshotOrderRow {
  order_id: number;
  table_num: number;
  table_usage_id?: number;
  order_status?: string;
  time_ago?: string;
  has_coupon?: boolean;
  items: AdminOrderSnapshotLineItem[];
}

export interface AdminOrderSnapshotMessage {
  type: typeof ADMIN_ORDER_SNAPSHOT;
  data: {
    orders: AdminOrderSnapshotOrderRow[] | AdminOrderSnapshotItem[];
  };
}

function isNestedSnapshotOrderRow(row: unknown): row is AdminOrderSnapshotOrderRow {
  if (typeof row !== 'object' || row === null) return false;
  const r = row as AdminOrderSnapshotOrderRow;
  return Array.isArray(r.items) && typeof r.table_num !== 'undefined';
}

export function isAdminOrderSnapshotMessage(
  msg: unknown
): msg is AdminOrderSnapshotMessage {
  if (typeof msg !== 'object' || msg === null) return false;
  const m = msg as AdminOrderSnapshotMessage;
  if (m.type !== ADMIN_ORDER_SNAPSHOT || !Array.isArray(m.data?.orders)) return false;
  const { orders } = m.data;
  if (orders.length === 0) return true;
  const first = orders[0];
  return isNestedSnapshotOrderRow(first) || (typeof (first as AdminOrderSnapshotItem).menu_name === 'string');
}

/** 서버 ERROR 페이로드 (code: 문자열 코드 또는 HTTP 유사 숫자) */
export interface AdminWsErrorMessage {
  type: typeof WS_ERROR;
  data: {
    code: number | string;
    message: string;
  };
}

export function isAdminWsErrorMessage(msg: unknown): msg is AdminWsErrorMessage {
  const m = msg as AdminWsErrorMessage;
  return (
    typeof msg === 'object' &&
    msg !== null &&
    m.type === WS_ERROR &&
    m.data != null &&
    (typeof m.data.code === 'number' || typeof m.data.code === 'string') &&
    typeof m.data.message === 'string'
  );
}

/** Channels consumer `type: "error"`, `message` 루트, `data` optional */
export function isChannelsJsonErrorMessage(msg: unknown): msg is {
  type: typeof WS_ERROR_LOWERCASE;
  message: string;
  timestamp?: string;
  data?: unknown;
} {
  const m = msg as { type?: string; message?: unknown };
  return (
    typeof msg === 'object' &&
    msg !== null &&
    m.type === WS_ERROR_LOWERCASE &&
    typeof m.message === 'string'
  );
}

/** ERROR / error 중 하나면 로깅용 메시지 추출 */
export function getOrderWsErrorInfo(msg: unknown): { message: string; code?: number | string } | null {
  if (isAdminWsErrorMessage(msg)) {
    return { message: msg.data.message, code: msg.data.code };
  }
  if (isChannelsJsonErrorMessage(msg)) {
    return { message: msg.message };
  }
  return null;
}

/** 새 오더 전송: 새 오더 생성 시 (data.orders: 주문 배열, 각 주문에 table_num, time_ago, items) */
export type AdminNewOrderItem = AdminOrderSnapshotLineItem;

export interface AdminNewOrderMessage {
  type: typeof ADMIN_NEW_ORDER;
  data: {
    total_sales?: number;
    orders: {
      order_id: number;
      table_num: number;
      table_usage_id?: number;
      order_status?: string;
      time_ago?: string;
      has_coupon?: boolean;
      items: AdminNewOrderItem[];
    }[];
  };
}

export function isAdminNewOrderMessage(msg: unknown): msg is AdminNewOrderMessage {
  const m = msg as AdminNewOrderMessage;
  return (
    typeof msg === 'object' &&
    msg !== null &&
    m.type === ADMIN_NEW_ORDER &&
    Array.isArray(m.data?.orders)
  );
}

/**
 * 오더 업데이트 (Django: `data.order_id` + `data.items[]`).
 * 구 문서 단일 `item` 페이로드는 하위 호환용으로 유지.
 */
export interface AdminOrderUpdatePatch {
  id?: number;
  order_item_id?: number;
  status: string;
}

export interface AdminOrderUpdateMessage {
  type: typeof ADMIN_ORDER_UPDATE;
  data: {
    order_id: number;
    items?: AdminOrderUpdatePatch[];
    item?: {
      id: number;
      status: string;
      is_all_served?: boolean;
    };
  };
}

export function isAdminOrderUpdateMessage(
  msg: unknown
): msg is AdminOrderUpdateMessage {
  const m = msg as AdminOrderUpdateMessage;
  if (typeof msg !== 'object' || msg === null || m.type !== ADMIN_ORDER_UPDATE) return false;
  if (typeof m.data?.order_id !== 'number') return false;
  if (Array.isArray(m.data.items)) return true;
  if (
    m.data.item != null &&
    typeof m.data.item.id === 'number' &&
    typeof m.data.item.status === 'string'
  ) {
    return true;
  }
  return false;
}

/** 오더 서빙 전부 완료: 오더 내 아이템 전부 서빙 완료 시 → 목록에서 빌지 제거 */
export interface AdminOrderCompletedMessage {
  type: typeof ADMIN_ORDER_COMPLETED;
  data: {
    order_id: number;
    table_num: number;
    table_usage_id?: number;
    order_status: string; // e.g. "COMPLETED"
    updated_at?: string;
  };
}

/** 서버가 ORDER_COMPLETED 로 보낼 수도 있음 */
export const ORDER_COMPLETED = 'ORDER_COMPLETED';

export type OrderCompletedPayload = AdminOrderCompletedMessage['data'];

export function isAdminOrderCompletedMessage(
  msg: unknown
): msg is { type: string; data: OrderCompletedPayload } {
  const m = msg as { type?: string; data?: { order_id?: number; table_num?: number } };
  return (
    typeof msg === 'object' &&
    msg !== null &&
    (m.type === ADMIN_ORDER_COMPLETED || m.type === ORDER_COMPLETED) &&
    typeof m.data?.order_id === 'number' &&
    typeof m.data?.table_num === 'number'
  );
}

/** 오더 취소: 취소된 아이템을 목록에서 제거 */
export interface AdminOrderCancelledMessage {
  type: typeof ADMIN_ORDER_CANCELLED;
  data: {
    order_id: number;
    item_id: number; // 취소된 아이템
    refund_amount?: number;
    new_total_sales?: number;
  };
}

export function isAdminOrderCancelledMessage(
  msg: unknown
): msg is AdminOrderCancelledMessage {
  const m = msg as AdminOrderCancelledMessage;
  return (
    typeof msg === 'object' &&
    msg !== null &&
    m.type === ADMIN_ORDER_CANCELLED &&
    typeof m.data?.order_id === 'number' &&
    typeof m.data?.item_id === 'number'
  );
}

/** 테이블 초기화: 초기화된 테이블 번호 목록 + 남은 주문 전체 목록 */
export const ADMIN_TABLE_RESET = 'ADMIN_TABLE_RESET';

export interface AdminTableResetMessage {
  type: typeof ADMIN_TABLE_RESET;
  data: {
    table_nums: number[];
    count: number;
    total_sales?: number;
    orders: AdminOrderSnapshotOrderRow[];
  };
}

export function isAdminTableResetMessage(msg: unknown): msg is AdminTableResetMessage {
  const m = msg as AdminTableResetMessage;
  return (
    typeof msg === 'object' &&
    msg !== null &&
    m.type === ADMIN_TABLE_RESET &&
    Array.isArray(m.data?.table_nums)
  );
}

/** 메뉴별 집계: 음식/음료 수량 집계 (서버가 ADMIN_MENU_AGGREGATION 또는 MENU_AGGREGATION 로 전송) */
export const MENU_AGGREGATION = 'MENU_AGGREGATION';

export interface MenuAggregationMessage {
  type: typeof ADMIN_MENU_AGGREGATION | typeof MENU_AGGREGATION;
  data: {
    food_summary: { menu_name: string; total_quantity: number }[];
    beverage_summary: { menu_name: string; total_quantity: number }[];
  };
}

export function isMenuAggregationMessage(
  msg: unknown
): msg is MenuAggregationMessage {
  const m = msg as MenuAggregationMessage;
  return (
    typeof msg === 'object' &&
    msg !== null &&
    (m.type === ADMIN_MENU_AGGREGATION || m.type === MENU_AGGREGATION) &&
    Array.isArray(m.data?.food_summary) &&
    Array.isArray(m.data?.beverage_summary)
  );
}
