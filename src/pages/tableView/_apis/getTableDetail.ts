import { instance } from "@services/instance";

export interface RawOrderItem {
  id?: number;
  menu_id?: number;
  name?: string;
  image?: string | null;
  quantity?: number;
  fixed_price?: number;
  item_total_price?: number;
  from_set?: boolean;
  status?: string;
  created_at?: string;
}

export interface RawOrder {
  order_id?: number;
  order_number?: number;
  order_status?: string;
  created_at?: string;
  has_coupon?: boolean;
  coupon_name?: string | null;
  table_coupon_id?: number | null;
  order_discount_price?: number;
  order_fixed_price?: number;
  order_items?: RawOrderItem[];
}

export interface RawTableDetail {
  table_usage_id?: number | null;
  table_number?: string | number;
  table_total_price?: number;
  total_original_price?: number;
  total_discount_price?: number;
  order_list?: RawOrder[];
  order_items?: RawOrderItem[];
}

export interface RawResponse {
  message: string;
  data: RawTableDetail;
}

export interface TableDetailOrderItem {
  id: number;
  menu_id: number | null;
  menu_name: string;
  menu_image: string | null;
  quantity: number;
  price: number;
  item_total_price: number;
  from_set?: boolean;
  status?: string;
  created_at?: string;
  order_id?: number;
  order_number?: number;
  order_status?: string;
  has_coupon?: boolean;
  coupon_name?: string | null;
  table_coupon_id?: number | null;
  order_discount_price?: number;
  order_fixed_price?: number;
}

export type OrderDetail = TableDetailOrderItem;

export interface TableDetailData {
  table_usage_id: number | null;
  table_num: number;
  table_amount: number;
  total_original_price: number;
  total_discount_price: number;
  orders: TableDetailOrderItem[];
}

export type TableDetailResponse = {
  message: string;
  data: TableDetailData;
};

const toNumber = (value: unknown, fallback = 0): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const mapItem = (
  item: RawOrderItem,
  parentOrder?: RawOrder,
  fallbackIndex = 0
): TableDetailOrderItem => {
  const quantity = toNumber(item.quantity, 0);
  const price = toNumber(item.fixed_price, 0);

  return {
    id: toNumber(item.id, fallbackIndex + 1),
    menu_id: item.menu_id ?? null,
    menu_name: item.name ?? "",
    menu_image: item.image ?? null,
    quantity,
    price,
    item_total_price: toNumber(item.item_total_price, price * quantity),
    from_set: item.from_set,
    status: item.status,
    created_at: item.created_at ?? parentOrder?.created_at,
    order_id: parentOrder?.order_id,
    order_number: parentOrder?.order_number,
    order_status: parentOrder?.order_status,
    has_coupon: parentOrder?.has_coupon,
    coupon_name: parentOrder?.coupon_name ?? null,
    table_coupon_id: parentOrder?.table_coupon_id ?? null,
    order_discount_price: parentOrder?.order_discount_price,
    order_fixed_price: parentOrder?.order_fixed_price,
  };
};

const normalize = (raw: RawTableDetail): TableDetailData => {
  const table_amount = toNumber(raw.table_total_price, 0);

  const normalizedOrders: TableDetailOrderItem[] = Array.isArray(raw.order_list)
    ? raw.order_list.flatMap((order) =>
        Array.isArray(order.order_items)
          ? order.order_items.map((item, idx) => mapItem(item, order, idx))
          : []
      )
    : Array.isArray(raw.order_items)
    ? raw.order_items.map((item, idx) => mapItem(item, undefined, idx))
    : [];

  return {
    table_usage_id:
      raw.table_usage_id === null || raw.table_usage_id === undefined
        ? null
        : toNumber(raw.table_usage_id, 0),
    table_num: toNumber(raw.table_number, 0),
    table_amount,
    total_original_price: toNumber(raw.total_original_price, table_amount),
    total_discount_price: toNumber(raw.total_discount_price, 0),
    orders: normalizedOrders,
  };
};

export const getTableDetail = async (tableNum: number): Promise<TableDetailResponse> => {
  try {
    const res = await instance.get<RawResponse>(`/api/v3/django/booth/tables/${tableNum}`);
    const body = res.data;

    if (!body || !body.data) {
      throw new Error(body?.message ?? "데이터가 비어 있습니다.");
    }

    const data = normalize(body.data);

    return {
      message: body.message ?? "테이블 상세 조회 성공",
      data,
    };
  } catch (e: any) {
    const serverMsg =
      e?.response?.data?.message ??
      e?.message ??
      "테이블 상세 조회 실패";
    throw new Error(serverMsg);
  }
};