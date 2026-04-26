import * as S from './BellModal.styled';
import { createPortal } from 'react-dom';
import { Notification } from '../dummy/dummyNotifications';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';

interface BellModalProps {
  $active: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const getTimeAgo = (date: Date): string => {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}초 전`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  return `${hours}시간 전`;
};

// 정렬: 미처리(오래된 순) → 처리중
const getSorted = (list: Notification[]) =>
  [...list].sort((a, b) => {
    if (a.isProcessed !== b.isProcessed) return a.isProcessed ? 1 : -1;
    if (!a.isProcessed && !b.isProcessed)
      return a.createdAt.getTime() - b.createdAt.getTime();
    return 0;
  });

const BellModal = ({ $active, onClose, notifications }: BellModalProps) => {
  const sorted = getSorted(notifications);

  return createPortal(
    <>
      <S.Overlay $active={$active} onClick={(e) => { e.stopPropagation(); onClose(); }} />
      <S.BellModalWrapper $active={$active} onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <S.ModalTitle>테이블 요청 현황</S.ModalTitle>
          <S.CloseButton onClick={onClose}>
            <img src={IMAGE_CONSTANTS.ModalXIcon} alt="닫기" width={16} height={16} />
          </S.CloseButton>
        </S.ModalHeader>

        {sorted.length === 0 ? (
          <S.EmptyText>알림이 없습니다.</S.EmptyText>
        ) : (
          sorted.map((n) => (
            <S.NotificationItem key={n.id}>
              <S.TopRow>
                <S.TableNumber $isProcessed={n.isProcessed}>
                  {n.tableNumber}
                </S.TableNumber>
                <S.ItemTime>
                  <img src={IMAGE_CONSTANTS.TimeIcon} alt="시간" width={16} height={16} />
                  {getTimeAgo(n.createdAt)}
                </S.ItemTime>
              </S.TopRow>
              <S.ItemTypeRow>
                {n.type}
                {n.isProcessed && <S.ProcessedBadge>처리중</S.ProcessedBadge>}
              </S.ItemTypeRow>
            </S.NotificationItem>
          ))
        )}
      </S.BellModalWrapper>
    </>,
    document.body,
  );
};

export default BellModal;
