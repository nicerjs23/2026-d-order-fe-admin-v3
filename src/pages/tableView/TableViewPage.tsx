// tableView/TableViewPage.tsx
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TableViewGrid from "./_components/tableGrid";
import * as S from "./TableViewPage.styled";
import { useTableList } from "./_hooks/useTableList";
import { TableItem } from "./_apis/getTableList";
import { buildTableDetailPath } from "@constants/routeConstants";
import { LoadingSpinner } from "./_apis/loadingSpinner";
import Toast from "@components/ToastMessage/Toast"; 

// 🌟 웹소켓 훅 임포트
import { useTablesWS } from "./_ws/useTablesWS";

const TableViewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // 🌟 refetch 함수를 꺼내어 사용합니다.
    const { tables: tableList, loading, error, refetch } = useTableList();
    
    // 통합 토스트 메시지 상태
    const [toastMsg, setToastMsg] = useState<string>("");
    const [toastVariant, setToastVariant] = useState<'default' | 'error'>('default');

    const handleSelectTable = (table: TableItem) => {
        navigate(buildTableDetailPath(table.tableNum));
    };

    const handleShowToast = useCallback((message: string, variant: 'default' | 'error' = 'default') => {
        setToastMsg(message);
        setToastVariant(variant);
    }, []);

    const handleCloseToast = useCallback(() => {
        setToastMsg("");
    }, []);

    // 🌟 대시보드 웹소켓 연결 및 이벤트 매핑
    useTablesWS({
        onConnectionEstablished: (_data) => { /* console.log("[WS 대시보드] 연결 완료:", data) */ },
        onMergeTable: () => refetch(),
        onResetTable: () => refetch(),
        onOrderUpdate: () => refetch(),
        onEnterTable: (data) => {
            refetch(); // 화면 갱신
            if (data?.table_num) {
                handleShowToast(`🔔 ${data.table_num}번 테이블에 손님이 입장했습니다!`);
            }
        },
        onError: (_err) => { /* console.error("[WS 대시보드] 에러:", err) */ },
    });

    useEffect(() => {
        // 상세 페이지에서 넘어온 초기화/병합 등 라우팅 토스트 처리
        if (location.state?.resetToastMessage) {
            handleShowToast(location.state.resetToastMessage);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate, handleShowToast]);

    if (loading && tableList.length === 0) { // 최초 로딩 시에만 스피너
        return (
            <S.PageWrapper aria-busy="true" aria-live="polite" role="status">
                <LoadingSpinner />
            </S.PageWrapper>
        );
    }

    if (error) {
        return (
            <S.PageWrapper>
                <div style={{ padding: 24 }}>에러 발생: {error}</div>
            </S.PageWrapper>
        );
    }

    return (
        <S.PageWrapper>
            <TableViewGrid
                tableList={tableList}
                onSelectTable={handleSelectTable}
                onShowToast={handleShowToast}
            />
            <Toast 
                message={toastMsg} 
                isVisible={!!toastMsg} 
                onClose={handleCloseToast}
                variant={toastVariant}
            />
        </S.PageWrapper>
    );
};

export default TableViewPage;
