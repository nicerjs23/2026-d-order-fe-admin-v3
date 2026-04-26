import styled from 'styled-components';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';
import BellModal from './BellModal';
import { Notification } from '../dummy/dummyNotifications';

interface BellProps {
  active: boolean;
  onClick: () => void;
  modalOpen: boolean;
  onCloseModal: () => void;
  notifications: Notification[];
  activeCount: number;
}

const Bell = ({ onClick, modalOpen, onCloseModal, notifications, activeCount }: BellProps) => {
  return (
    <BellWrapper onClick={onClick}>
      <img src={IMAGE_CONSTANTS.BELL} alt='알림 종 아이콘' />
      {activeCount > 0 && <Badge>{activeCount}</Badge>}
      <BellModal $active={modalOpen} onClose={onCloseModal} notifications={notifications} />
    </BellWrapper>
  );
};

export default Bell;

const BellWrapper = styled.button`
  display: flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
`;

const Badge = styled.div`
  position: absolute;
  top: -2px;
  right: -1px;
  min-width: 12px;
  height: 12px;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.colors.Point};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 1;
  box-sizing: border-box;

  ${({ theme }) => theme.fonts.SemiBold10}
  color: ${({ theme }) => theme.colors.Black01};
`;
