import { useRef } from 'react';
import { createPortal } from 'react-dom';
import * as S from './OrderBoxItem.styled';
import type { OrderStatus } from './OrderBoxItem.styled';
import { useLongPress } from './useLongPress';
import { useStatusModalAnchor } from './useStatusModalAnchor';
import StatusChangeModal from '../StatusChangeModal/StatusChangeModal';
import type { EditableStatus } from '../StatusChangeModal/StatusChangeModal.types';
import * as MS from '../StatusChangeModal/StatusChangeModal.styled';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';

export type { EditableStatus } from '../StatusChangeModal/StatusChangeModal.types';

/* 조리중 1, 서빙중 2, 서빙완료 3, 서빙수락 4 — src/assets/icons/buttonIcon/ 에 1.svg, 2.svg, 3.svg, 4.svg 넣기 */
import statusIcon1 from '@assets/icons/buttonIcon/Button1.png';
import statusIcon2 from '@assets/icons/buttonIcon/Button2.png';
import statusIcon3 from '@assets/icons/buttonIcon/Button3.png';
import statusIcon4 from '@assets/icons/buttonIcon/Button4.png';
import statusIcon5 from '@assets/icons/buttonIcon/Button5.svg';

const STATUS_ICONS: Record<OrderStatus, string> = {
  조리중: statusIcon1,
  서빙중: statusIcon2,
  서빙완료: statusIcon3,
  서빙수락: statusIcon4,
  조리완료: statusIcon5,
};

export type OrderBoxItemProps = {
  imageUrl?: string;
  set_menu: boolean;
  menuName: string;
  quantity: number;
  status: OrderStatus;
  /** 단일 클릭 시 호출 (상태 전진). 서빙중/서빙완료/서빙수락일 땐 동작하지 않음 */
  onClick?: () => void;
  /** 500ms 길게 누르면 호출 (되돌리기 모달). 서빙중일 땐 동작하지 않음 */
  onLongPress?: () => void;
  /** 이 항목의 상태 변경 모달이 열려 있는지 */
  isModalOpen?: boolean;
  /** 다른 항목의 모달이 열려 있을 때 true (이때 비선택 항목 long-press 비활성) */
  isAnyModalOpen?: boolean;
  onStatusSelect?: (newStatus: EditableStatus) => void;
  onModalClose?: () => void;
};

const STATUS_ICON_SIZE = 16;

function StatusIcon({ status }: { status: OrderStatus }) {
  const src = STATUS_ICONS[status];
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      width={STATUS_ICON_SIZE}
      height={STATUS_ICON_SIZE}
      style={{ display: 'block', flexShrink: 0 }}
    />
  );
}

export default function OrderBoxItem({
  imageUrl,
  set_menu,
  menuName,
  quantity,
  status,
  onClick,
  onLongPress,
  isModalOpen,
  isAnyModalOpen,
  onStatusSelect,
  onModalClose,
}: OrderBoxItemProps) {
  /* 클릭 비활성: 서빙중/서빙완료/서빙수락이거나 모달이 열려 있을 때 */
  const isClickDisabled =
    status === '서빙중' ||
    status === '서빙완료' ||
    status === '서빙수락' ||
    !onClick ||
    !!isAnyModalOpen;

  const longPress = useLongPress(onLongPress ?? (() => {}), {
    delay: 500,
    disabled:
      status === '서빙중' || !onLongPress || (!!isAnyModalOpen && !isModalOpen),
    onClick,
    clickDisabled: isClickDisabled,
  });

  const statusButtonRef = useRef<HTMLDivElement>(null);
  const { anchorRect, placement } = useStatusModalAnchor(
    statusButtonRef,
    !!isModalOpen,
  );

  return (
    <S.OrderBoxItemWrapper {...longPress} $isModalOpen={isModalOpen}>
      <S.ModalWrapper $isModalOpen={isModalOpen} />
      <S.ItemInfoHalf>
        <S.ItemInfo>
          <S.ItemImage>
            {imageUrl ? (
              <img src={imageUrl} alt="" />
            ) : (
              <img
                src={IMAGE_CONSTANTS.LOGOIMAGE}
                alt="기본 아코 이미지"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            )}
          </S.ItemImage>
          <S.ItemInfoName>
            {set_menu && <S.SetPill $status={status}>세트</S.SetPill>}
            <S.MenuName $status={status}>{menuName}</S.MenuName>
          </S.ItemInfoName>
        </S.ItemInfo>
      </S.ItemInfoHalf>
      <S.ItemInfoHalf2>
        <S.Quantity $status={status}>{quantity}</S.Quantity>
        <S.StatusBadgeWrap ref={statusButtonRef}>
          <S.StatusBadge $status={status}>
            <StatusIcon status={status} />
            {status}
          </S.StatusBadge>
        </S.StatusBadgeWrap>
      </S.ItemInfoHalf2>
      {isModalOpen &&
        onStatusSelect &&
        onModalClose &&
        createPortal(
          <MS.BlurBackdrop $forPortal onClick={onModalClose} aria-hidden />,
          document.body,
        )}
      {isModalOpen && onStatusSelect && onModalClose && (
        <StatusChangeModal
          skipBackdrop
          anchorRect={anchorRect}
          placement={placement}
          onSelect={onStatusSelect}
          onClose={onModalClose}
        />
      )}
    </S.OrderBoxItemWrapper>
  );
}
