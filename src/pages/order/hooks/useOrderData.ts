import { useState, useEffect, useCallback, useMemo } from 'react';
import OrderService from '../api/OrderService';
import { Order, OrderItem, OrderStatus } from '../types/orderTypes';

const convertApiToUi = (apiData: Order[]): OrderItem[] => {
  return apiData.map((item) => ({
    id: item.id,
    time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    table: `테이블 ${item.table_num}`,
    menu: item.menu_name,
    quantity: item.menu_num,
    status: item.order_status,
    imageUrl: item.menu_image,
  }));
};

export const useOrdersData = () => {
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [fadingTables, setFadingTables] = useState<Set<string>>(new Set());

  const fetchOrders = useCallback(async () => {
    // isLoading을 true로 설정하여 로딩 중임을 표시
    setIsLoading(true);
    try {
      const response = await OrderService.getOrders();
      setAllOrders(convertApiToUi(response.data.orders));
      setLastUpdated(new Date());
    } catch (e) {
      /* console.error(e); */
    } finally {
      // 로딩이 끝나면 false로 변경
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // 30초마다 자동 새로고침
    return () => clearInterval(interval);
  }, [fetchOrders]);
  
  const updateOrderState = useCallback((orderId: number, newStatus: OrderStatus) => {
    setAllOrders(prevOrders => {
        const updatedOrders = prevOrders.map(o =>
            o.id === orderId ? { ...o, status: newStatus } : o
        );

        const targetOrder = updatedOrders.find(o => o.id === orderId);
        if (!targetOrder) return updatedOrders;

        const tableOrders = updatedOrders.filter(o => o.table === targetOrder.table);
        const allServed = tableOrders.every(o => o.status === 'served');

        if (allServed) {
            setFadingTables(prev => new Set(prev).add(targetOrder.table));
            setTimeout(() => {
                setAllOrders(prev => prev.filter(o => o.table !== targetOrder.table));
                setFadingTables(prev => {
                    const next = new Set(prev);
                    next.delete(targetOrder.table);
                    return next;
                });
            }, 2000);
        }
        return updatedOrders;
    });
  }, []);

  const handleCookOrder = useCallback(async (orderId: number) => {
    await OrderService.updateOrderStatus(orderId, 'cooked');
    updateOrderState(orderId, 'cooked');
  }, [updateOrderState]);

  const handleServeOrder = useCallback(async (orderId: number) => {
    await OrderService.updateOrderStatus(orderId, 'served');
    updateOrderState(orderId, 'served');
  }, [updateOrderState]);
  
  const handleRevertOrder = useCallback(async (orderId: number) => {
    await OrderService.updateOrderStatus(orderId, 'cooked');
    updateOrderState(orderId, 'cooked');
  }, [updateOrderState]);

  const sortedOrdersForMenuList = useMemo(() => {
    return [...allOrders].sort((a, b) => {
      if (a.status === 'served' && b.status !== 'served') return 1;
      if (a.status !== 'served' && b.status === 'served') return -1;
      
      // 수정 이유: "HH:MM" 형식의 시간 문자열은 new Date()로 직접 비교할 수 없습니다.
      // 임의의 날짜와 결합하여 유효한 Date 객체를 만들어 비교해야 합니다.
      const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
      const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
      return timeB - timeA; // 최신 주문이 위로 오도록 정렬
    });
  }, [allOrders]);

  const tableOrdersForTableList = useMemo(() => {
    const grouped: Record<string, OrderItem[]> = {};
    allOrders.forEach((o) => {
      if (!grouped[o.table]) grouped[o.table] = [];
      grouped[o.table].push(o);
    });
    return grouped;
  }, [allOrders]);

  const getEarliestOrderTime = useCallback((orders: OrderItem[]) => {
    if (!orders || orders.length === 0) return '';
    
    // 수정 이유: reduce 로직 또한 시간 문자열 비교 오류가 있으므로 수정합니다.
    return orders.reduce((earliest, current) => {
        const earliestTime = new Date(`1970/01/01 ${earliest.time}`).getTime();
        const currentTime = new Date(`1970/01/01 ${current.time}`).getTime();
        return earliestTime < currentTime ? earliest : current;
    }).time;
  }, []);

  return {
    orders: sortedOrdersForMenuList,
    tableOrders: tableOrdersForTableList,
    isLoading,
    lastUpdated: lastUpdated.toLocaleTimeString(),
    fetchOrders,
    handleCookOrder,
    handleServeOrder,
    handleRevertOrder,
    getFadingTableBillStatus: (table: string) => fadingTables.has(table),
    getEarliestOrderTime,
  };
};