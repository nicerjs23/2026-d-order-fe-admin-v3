import { useState, useCallback, useRef } from 'react';
import { isAxiosError } from 'axios';
import * as S from './OrderListPage.styled';

import OrderList from './compoenents/OrderList/OrderList';
import AmountBox from './compoenents/amountBox/AmountBox';
import type { AmountItem } from './compoenents/amountBox/AmountBox';
import type { OrderBoxData } from './compoenents/orderbox/OrderBox';
import type { OrderStatus } from './compoenents/orderboxitem/OrderBoxItem.styled';
import type { EditableStatus } from './compoenents/orderboxitem/OrderBoxItem';
import { useOrderManagementWebSocket } from './hooks/useOrderManagementWebSocket';
import { updateOrderItemStatus } from './apis/updateOrderItemStatus';
import type { OrderItemTargetStatus } from './utils/mapEditableStatusToApiStatus';
import { mapEditableStatusToApiStatus } from './utils/mapEditableStatusToApiStatus';
import { mapStatus } from './utils/mapSnapshotToOrderBoxData';
import { getNextStatus } from './utils/getNextStatus';

export default function OrderListPage() {
  const [orders, setOrders] = useState<OrderBoxData[]>([]);
  const [foodItems, setFoodItems] = useState<AmountItem[]>([]);
  const [drinkItems, setDrinkItems] = useState<AmountItem[]>([]);

  useOrderManagementWebSocket(setOrders, (food, beverage) => {
    setFoodItems(food);
    setDrinkItems(beverage);
  });

  const [openTarget, setOpenTarget] = useState<{
    tableIndex: number;
    itemIndex: number;
  } | null>(null);
  const statusSubmittingRef = useRef(false);

  /**
   * 공통 상태 변경 로직: API 호출 → 낙관적 UI 업데이트
   * handleOrderItemClick과 handleStatusSelect에서 공유
   */
  const executeStatusChange = useCallback(
    async (
      tableIndex: number,
      itemIndex: number,
      targetStatus: OrderItemTargetStatus,
    ) => {
      const orderItemId = orders[tableIndex]?.items[itemIndex]?.id;

      if (orderItemId == null) {
        alert('order_item_id가 없어 상태를 변경할 수 없습니다.');
        return;
      }

      if (statusSubmittingRef.current) return;
      statusSubmittingRef.current = true;

      try {
        console.log('[OrderList] PATCH /api/v3/django/order/status/', {
          order_item_id: orderItemId,
          target_status: targetStatus,
        });

        const res = await updateOrderItemStatus({
          order_item_id: orderItemId,
          target_status: targetStatus,
        });

        const d = res.data;
        const nextUiStatus: OrderStatus = d?.status
          ? mapStatus(d.status)
          : (mapStatus(targetStatus) as OrderStatus);

        console.log('[OrderList] 상태 변경 응답', res);

        if (d?.all_items_served) {
          setOrders((prev) => {
            const oid = prev[tableIndex]?.orderId;
            if (oid != null) {
              return prev.filter((box) => box.orderId !== oid);
            }
            return prev.filter((_, i) => i !== tableIndex);
          });
        } else {
          setOrders((prev) =>
            prev.map((tableRow, ti) =>
              ti !== tableIndex
                ? tableRow
                : {
                    ...tableRow,
                    items: tableRow.items.map((rowItem, ii) =>
                      ii !== itemIndex
                        ? rowItem
                        : { ...rowItem, status: nextUiStatus },
                    ),
                  },
            ),
          );
        }
      } catch (err) {
        let message = '상태 변경에 실패했습니다.';
        if (isAxiosError(err)) {
          const data = err.response?.data as
            | { message?: string; detail?: string }
            | undefined;
          if (typeof data?.message === 'string') message = data.message;
          else if (typeof data?.detail === 'string') message = data.detail;
        }
        alert(message);
      } finally {
        statusSubmittingRef.current = false;
      }
    },
    [orders],
  );

  /** 단일 클릭: 상태 자동 전진 (조리중→조리완료, 조리완료→서빙완료) */
  const handleOrderItemClick = useCallback(
    async (tableIndex: number, itemIndex: number) => {
      const item = orders[tableIndex]?.items[itemIndex];
      if (!item) return;

      const nextApiStatus = getNextStatus(item.status);
      if (nextApiStatus == null) return; // 서빙중/서빙완료 등 전진 불가

      await executeStatusChange(tableIndex, itemIndex, nextApiStatus);
    },
    [orders, executeStatusChange],
  );

  /** 롱프레스 → 모달 열기 */
  const handleOrderItemLongPress = useCallback(
    (tableIndex: number, itemIndex: number) => {
      setOpenTarget({ tableIndex, itemIndex });
    },
    [],
  );

  /** 모달에서 상태 선택 (되돌리기용) */
  const handleStatusSelect = useCallback(
    async (newStatus: EditableStatus) => {
      if (openTarget == null) return;

      const { tableIndex, itemIndex } = openTarget;
      const targetStatus = mapEditableStatusToApiStatus(newStatus);

      setOpenTarget(null);
      await executeStatusChange(tableIndex, itemIndex, targetStatus);
    },
    [openTarget, executeStatusChange],
  );

  const handleModalClose = useCallback(() => {
    setOpenTarget(null);
  }, []);

  return (
    <S.Wrapper>
      <S.LeftSide>
        <OrderList
          orders={orders}
          openTarget={openTarget}
          onOrderItemClick={handleOrderItemClick}
          onOrderItemLongPress={handleOrderItemLongPress}
          onStatusSelect={handleStatusSelect}
          onModalClose={handleModalClose}
        />
      </S.LeftSide>
      <S.RightSide>
        <S.AmountSection $heightRatio={60}>
          <AmountBox
            title="음식 집계"
            items={foodItems}
            emptyText="요청한 음식이 없어요"
          />
        </S.AmountSection>
        <S.AmountSection $heightRatio={40}>
          <AmountBox
            title="음료 집계"
            items={drinkItems}
            emptyText="요청한 음료가 없어요"
          />
        </S.AmountSection>
      </S.RightSide>
    </S.Wrapper>
  );
}
