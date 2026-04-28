// tableView/_ws/types.ts
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

export type WsConnectionEstablished = BaseWSPayload<
    "connection_established",
    {
        booth_id: number;
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

// 백엔드 상세 스펙 확정 전까지 unknown으로 안전하게 유지
export type WsOrderUpdate = BaseWSPayload<"order_update", unknown>;

export type WsError = BaseWSPayload<
    "ERROR",
    {
        code: string;
        message: string;
    }
>;

export type TableWSPayload =
    | WsConnectionEstablished
    | WsMergeTable
    | WsResetTable
    | WsEnterTable
    | WsOrderUpdate
    | WsError;