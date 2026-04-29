export type TableWSEventType =
    | "connection_established"
    | "merge_table"
    | "reset_table"
    | "enter_table"
    | "order_update"
    | "ERROR";

export interface BaseWSPayload<TType extends TableWSEventType, TData> {
    type: TType;
    timestamp: string;
    message?: string;
    data: TData;
}

export type ConnectionEstablishedEvent = BaseWSPayload<
    "connection_established",
    {
        booth_id?: number;
        table_num?: number;
        [key: string]: unknown;
    }
>;

export type WsMergeTable = BaseWSPayload<
    "merge_table",
    {
        table_nums: number[];
        representative_table: number;
        count: number;
    }
>;

export type WsResetTable = BaseWSPayload<
    "reset_table",
    {
        table_nums: number[];
        count: number;
    }
>;

export type WsEnterTable = BaseWSPayload<
    "enter_table",
    {
        table_num: number;
        started_at: string;
    }
>;

export type OrderUpdateEvent = BaseWSPayload<"order_update", unknown>;

export type WsErrorEvent = BaseWSPayload<
    "ERROR",
    {
        code: "AUTH_ERROR" | "PERMISSION_DENIED" | "INVALID_MESSAGE" | "SERVER_ERROR" | string;
        message: string;
    }
>;

export type TableDetailWSPayload =
    | ConnectionEstablishedEvent
    | OrderUpdateEvent
    | WsErrorEvent;

export type TableWSPayload =
    | ConnectionEstablishedEvent
    | WsMergeTable
    | WsResetTable
    | WsEnterTable
    | OrderUpdateEvent
    | WsErrorEvent;

export type WsConnectionEstablished = ConnectionEstablishedEvent;
export type WsOrderUpdate = OrderUpdateEvent;
export type WsError = WsErrorEvent;