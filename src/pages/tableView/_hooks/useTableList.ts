// tableView/_hooks/useTableList.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { getTableList, type TableItem } from "../_apis/getTableList";

export type UseTableListState = {
  loading: boolean;
  error: string | null;
  tables: TableItem[];
  refetch: () => Promise<void>;
  activateCount: number; // 컴포넌트 호환성을 위해 이름 유지 (의미는 사용 중인 테이블 수)
  totalRevenue: number;
};

export function useTableList(): UseTableListState {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<TableItem[]>([]);

  const fetchOnce = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTableList();
      setTables(result.data);
      /* console.info("[useTableList] tables fetch success"); */
    } catch (e: any) {
      const msg = e?.message ?? "요청 실패";
      setError(msg);
      /* console.error("[useTableList] fetch error:", msg); */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOnce();
  }, [fetchOnce]);

  const refetch = fetchOnce;

  // "activate" 대신 새로운 명세인 "IN_USE"로 상태 체크
  const activateCount = useMemo(
    () => tables.filter((t) => t.status === "IN_USE").length,
    [tables]
  );
  
  const totalRevenue = useMemo(
    () => tables.reduce((sum, t) => sum + (t.amount ?? 0), 0),
    [tables]
  );

  return { loading, error, tables, refetch, activateCount, totalRevenue };
}