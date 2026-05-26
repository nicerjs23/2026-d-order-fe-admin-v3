// tableView/TableDetailPage.tsx
import { useEffect, useRef, useState } from "react";
import * as S from "./TableDetailPage.styled";
import TableDetail from "./_components/detailPage/tableDetail";
import { useParams, useNavigate } from "react-router-dom";
import { useTableDetail } from "./_hooks/useTableDetail";
import { LoadingSpinner } from "./_apis/loadingSpinner";
import Toast from "@components/ToastMessage/Toast";

// 🌟 상세 전용 웹소켓 훅 임포트
import { useTableDetailWS } from "./_ws/useTableDetailWS";

const shouldNavigateOnReset = (data: unknown, currentTableNum: number) => {
  if (!data || typeof data !== "object") return true;

  const record = data as Record<string, unknown>;
  const resetTableNum =
    record.table_num ??
    record.tableNum ??
    record.table_number ??
    record.tableNumber;

  if (resetTableNum != null) {
    return Number(resetTableNum) === currentTableNum;
  }

  const resetTableNums = record.table_nums;
  if (Array.isArray(resetTableNums)) {
    return resetTableNums.some(
      (tableNum) => Number(tableNum) === currentTableNum
    );
  }

  return true;
};

const TableDetailPage = () => {
  const { tableNum } = useParams();
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState<string>("");
  const suppressNextOrderUpdateToastRef = useRef(false);
  const suppressNextOrderUpdateToastTimerRef = useRef<number | null>(null);

  const parsedNum = Number(tableNum);

  const clearOrderUpdateToastSuppression = () => {
    suppressNextOrderUpdateToastRef.current = false;
    if (suppressNextOrderUpdateToastTimerRef.current) {
      window.clearTimeout(suppressNextOrderUpdateToastTimerRef.current);
      suppressNextOrderUpdateToastTimerRef.current = null;
    }
  };

  useEffect(() => clearOrderUpdateToastSuppression, []);
  
  // 🌟 refetch를 가져옵니다.
  const {
    detail: tableDetail,
    loading,
    errorMsg: error,
    refetch, 
  } = useTableDetail(Number.isFinite(parsedNum) ? parsedNum : -1);

  // 🌟 특정 테이블 번호 구독 웹소켓 연결
  useTableDetailWS({
    tableNum: parsedNum,
    onConnectionEstablished: (_data) =>
      { /* console.log(`[WS 상세-${parsedNum}] 연결 완료`, data) */ },
    onOrderUpdate: () => {
      // 새로운 주문이 들어오면 내역을 갱신하고 알림을 띄웁니다.
      /* console.log("[TableDetail WS] order_update received → refetch"); */
      refetch();
      if (suppressNextOrderUpdateToastRef.current) {
        clearOrderUpdateToastSuppression();
        return;
      }
      setToastMsg("🔔 새로운 주문이 추가되었습니다!");
    },
    onResetTable: (data) => {
      if (!shouldNavigateOnReset(data, parsedNum)) return;

      navigate("/table-view", {
        replace: true,
        state: {
          resetToastMessage: "해당 테이블은 초기화되었습니다.",
        },
      });
    },
    onError: (_error) => {
      /* console.error(`[WS 상세-${parsedNum}] 서버 에러 이벤트`, error); */
    },
  });

  if (!Number.isFinite(parsedNum)) {
    return <div>잘못된 테이블 번호입니다.</div>;
  }

  // 최초 로딩 시에만 스피너 (데이터 갱신 중에는 기존 UI 유지)
  if (loading && !tableDetail) return <LoadingSpinner />;
  if (error || !tableDetail) return <div>에러 발생 또는 데이터 없음</div>;

  return (
    <S.PageWrapper>
      <TableDetail
        key={tableDetail.table_num}
        data={tableDetail}
        onBack={() => navigate("/table-view")}
        onOrderItemCancelSuccess={() => {
          if (suppressNextOrderUpdateToastTimerRef.current) {
            window.clearTimeout(suppressNextOrderUpdateToastTimerRef.current);
          }
          suppressNextOrderUpdateToastRef.current = true;
          suppressNextOrderUpdateToastTimerRef.current = window.setTimeout(
            clearOrderUpdateToastSuppression,
            3000
          );
          setToastMsg("");
        }}
      />
      
      {/* 상세 페이지 전용 토스트 (주문 업데이트 등) */}
      <Toast 
        message={toastMsg} 
        isVisible={!!toastMsg} 
        onClose={() => setToastMsg("")} 
      />
    </S.PageWrapper>
  );
};

export default TableDetailPage;
