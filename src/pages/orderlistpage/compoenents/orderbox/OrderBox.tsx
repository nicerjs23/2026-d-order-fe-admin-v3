import * as S from './OrderBox.styled';
import OrderBoxItem from '../orderboxitem/OrderBoxItem';
import type { OrderStatus } from '../orderboxitem/OrderBoxItem.styled';
import type { EditableStatus } from '../orderboxitem/OrderBoxItem';

export type OpenTarget = { tableIndex: number; itemIndex: number } | null;

export type OrderItem = {
  id?: number; // order_menu_id (ADMIN_ORDER_UPDATE 매칭용)
  imageUrl?: string;
  set_menu: boolean;
  menuName: string;
  quantity: number;
  status: OrderStatus;
};

export type OrderBoxData = {
  /** WS 주문 ID — 스냅샷·완료 이벤트와 매칭 (동일 테이블 다주문 구분) */
  orderId?: number;
  tableNumber: number | string;
  tableTime?: string;
  items: OrderItem[];
};

export type OrderBoxProps = OrderBoxData & {
  tableIndex: number;
  openTarget: OpenTarget;
  onOrderItemClick: (tableIndex: number, itemIndex: number) => void;
  onOrderItemLongPress: (tableIndex: number, itemIndex: number) => void;
  onStatusSelect: (newStatus: EditableStatus) => void;
  onModalClose: () => void;
};

export default function OrderBox({
  tableNumber,
  tableTime = '00분전',
  items,
  tableIndex,
  openTarget,
  onOrderItemClick,
  onOrderItemLongPress,
  onStatusSelect,
  onModalClose,
}: OrderBoxProps) {
  return (
    <S.OrderBoxWrapper>
      <S.OrderBoxHeader>
        <S.OrderBoxTableNumber>T {tableNumber}</S.OrderBoxTableNumber>
        <S.OrderBoxTableTime>{tableTime}</S.OrderBoxTableTime>
      </S.OrderBoxHeader>
      <S.OrderBoxTableContent>
        {items.map((item, itemIndex) => (
          <OrderBoxItem
            key={item.id ?? itemIndex}
            imageUrl={item.imageUrl}
            set_menu={item.set_menu}
            menuName={item.menuName}
            quantity={item.quantity}
            status={item.status}
            onClick={() => onOrderItemClick(tableIndex, itemIndex)}
            onLongPress={() => onOrderItemLongPress(tableIndex, itemIndex)}
            isModalOpen={
              openTarget !== null &&
              openTarget.tableIndex === tableIndex &&
              openTarget.itemIndex === itemIndex
            }
            isAnyModalOpen={openTarget !== null}
            onStatusSelect={onStatusSelect}
            onModalClose={onModalClose}
          />
        ))}
      </S.OrderBoxTableContent>
    </S.OrderBoxWrapper>
  );
}
