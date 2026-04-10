import type { OrderStatus } from '../compoenents/orderboxitem/OrderBoxItem.styled';
import type { OrderItemTargetStatus } from './mapEditableStatusToApiStatus';

/**
 * 단일 클릭 시 다음 API target_status를 반환합니다.
 * 전진 불가능한 상태(서빙중/서빙완료/서빙수락)는 null을 반환합니다.
 *
 * - 조리중 → cooked (조리완료)
 * - 조리완료 → served (서빙완료)
 * - 서빙중 → null (서버가 서빙 중, 클릭 비활성)
 * - 서빙완료/서빙수락 → null (최종 상태)
 */
export function getNextStatus(
  current: OrderStatus,
): OrderItemTargetStatus | null {
  switch (current) {
    case '조리중':
      return 'cooked';
    case '조리완료':
      return 'served';
    case '서빙중':
    case '서빙완료':
    case '서빙수락':
      return null;
  }
}
