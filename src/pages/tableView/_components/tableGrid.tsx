// tableView/_components/tableGrid.tsx
import { useMemo, useState, useEffect, useCallback } from "react";
import * as S from "./tableComponents.styled";
import { useSwipeable } from "react-swipeable";
import TableCard from "./tableCard";
import { TableItem } from "../_apis/getTableList";
import { getBoothMyPage } from "../_apis/getBoothMyPage"; // 🌟 새 API 임포트

interface Props {
  tableList: TableItem[];
  onSelectTable: (table: TableItem) => void;
  onShowToast?: (message: string, variant?: 'default' | 'error') => void;
}

// 🌟 CardData에서 isOverdue를 제거하고 startedAt을 추가 (오버듀 계산은 Card 내부에서 실시간으로 처리)
export interface TableOrder {
  tableNumber: number;
  totalAmount: number;
  orders: { menu: string; quantity: number }[];
  startedAt: string | null; 
  group: { representativeTable: number } | null;
}

const chunk = <T,>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const ITEMS_PER_PAGE = 15;

const TableViewGrid: React.FC<Props> = ({ tableList, onSelectTable, onShowToast }) => {
  // 부스의 이용 시간 제한 (시간 단위, ex: 2.00 -> 2)
  const [limitHours, setLimitHours] = useState<number | null>(null);
  // 하이라이트 효과를 줄 대표 테이블 번호 상태
  const [highlightedTable, setHighlightedTable] = useState<number | null>(null);

  useEffect(() => {
    const fetchBoothInfo = async () => {
      try {
        const data = await getBoothMyPage();
        if (data.table_limit_hours) {
          setLimitHours(parseFloat(data.table_limit_hours));
        }
      } catch (e) {
        console.error("부스 정보 조회 실패:", e);
      }
    };
    fetchBoothInfo();
  }, []);

  const mapped = useMemo(
    () =>
      tableList.map((item) => {
        const viewData: TableOrder = {
          tableNumber: item.tableNum,
          totalAmount: item.amount,
          orders: (item.latestOrders ?? []).map((o) => ({
            menu: o.name,
            quantity: o.qty,
          })),
          startedAt: item.startedAt, 
          group: item.group,
        };
        return { original: item, viewData };
      }),
    [tableList]
  );

  const pages = useMemo(() => chunk(mapped, ITEMS_PER_PAGE), [mapped]);
  const pageCount = Math.max(1, pages.length);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage((prev) => {
      const next = prev >= pageCount ? pageCount - 1 : prev;
      return next;
    });
  }, [pageCount]);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setPage((p) => (p === 0 ? pageCount - 1 : p - 1));
      if (e.key === "ArrowRight") setPage((p) => (p === pageCount - 1 ? 0 : p + 1));
    },
    [pageCount]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  const gotoPrev = () => setPage((p) => (p === 0 ? pageCount - 1 : p - 1));
  const gotoNext = () => setPage((p) => (p === pageCount - 1 ? 0 : p + 1));

  const handlers = useSwipeable({
    onSwipedLeft: gotoNext,
    onSwipedRight: gotoPrev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // 자식(병합된) 테이블 클릭 시 대표 테이블로 이동하는 함수
  const handleGoToRepresentative = (repTableNum: number) => {
    // 대표 테이블이 속한 페이지 인덱스 찾기
    const tableIndex = mapped.findIndex((item) => item.original.tableNum === repTableNum);
    if (tableIndex !== -1) {
      const targetPage = Math.floor(tableIndex / ITEMS_PER_PAGE);
      setPage(targetPage); // 해당 캐러셀 페이지로 이동
      
      // 하이라이트 효과 On (2초 뒤 Off)
      setHighlightedTable(repTableNum);
      setTimeout(() => setHighlightedTable(null), 2000);
    }
  };

  return (
    <S.GridWrapper {...handlers}>
      <S.GridViewport>
        <S.PagesTrack $pageCount={pageCount} $currentPage={page}>
          {pages.map((items, idx) => (
            <S.PageGrid key={idx} $pageCount={pageCount}>
              {items.map(({ original, viewData }) => (
                <div key={original.tableNum}>
                  <TableCard 
                    data={viewData} 
                    limitHours={limitHours} 
                    isHighlighted={highlightedTable === original.tableNum} 
                    onGoToRepresentative={handleGoToRepresentative}
                    onSelect={() => onSelectTable(original)} 
                    onShowToast={onShowToast}
                  />
                </div>
              ))}
            </S.PageGrid>
          ))}
        </S.PagesTrack>
      </S.GridViewport>

      <S.PageIndicatorWrapper>
        {Array.from({ length: pageCount }).map((_, i) => (
          <S.Dot key={i} $active={page === i} onClick={() => setPage(i)} />
        ))}
      </S.PageIndicatorWrapper>
    </S.GridWrapper>
  );
};

export default TableViewGrid;
