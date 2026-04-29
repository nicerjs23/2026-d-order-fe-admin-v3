// tableView/_hooks/useTableDetail.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getTableDetail,
  type TableDetailData,
} from "../_apis/getTableDetail";
import { cancelOrderItem } from "../_apis/cancelOrderItem"; // 변경된 API import

type Status = "idle" | "loading" | "success" | "error";

export const useTableDetail = (tableNum: number) => {
  const [detail, setDetail] = useState<TableDetailData | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!tableNum) return;
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await getTableDetail(tableNum);
      if (!res || !res.data) {
        throw new Error("테이블 상세 데이터가 비어 있습니다.");
      }
      console.log("[TableDetail] fetched normalized data:", res.data);
      setDetail(res.data);
      setStatus("success");
    } catch (e: any) {
      setErrorMsg(e?.message ?? "테이블 상세 조회 중 오류가 발생했습니다.");
      setStatus("error");
    }
  }, [tableNum]);

  useEffect(() => {
    if (Number.isFinite(tableNum)) fetchDetail();
  }, [fetchDetail, tableNum]);

  // 새로운 취소 로직
  const handleCancelItem = useCallback(
    async (orderItemId: number, cancelQuantity: number) => {
      try {
        const res = await cancelOrderItem(orderItemId, cancelQuantity);
        
        // 취소 성공 후 서버에서 최신 상세 데이터를 다시 불러와 동기화
        await fetchDetail(); 
        return res;
      } catch (error) {
        console.error("주문 취소 실패:", error);
        throw error; // UI(모달 등)에서 에러 처리를 할 수 있도록 던짐
      }
    },
    [fetchDetail]
  );

  const hasOrders = useMemo(() => (detail?.orders?.length ?? 0) > 0, [detail]);

  return {
    detail,
    loading: status === "loading",
    errorMsg,
    hasOrders,
    refetch: fetchDetail,
    cancelItem: handleCancelItem, // 이름 변경 (cancelItems -> cancelItem)
  };
};