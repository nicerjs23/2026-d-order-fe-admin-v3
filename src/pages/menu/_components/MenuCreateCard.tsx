import styled from 'styled-components';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';
import { SetStateAction, useState } from 'react';
import MenuModal from '../../modal_test_view/_components/MenuModal';
import { BoothMenuData } from '../Type/Menu_type';

interface MenuCreateCardProps {
  bootMenuData: BoothMenuData | undefined;
  onSuccess: React.Dispatch<SetStateAction<boolean>>;
}

const MenuCreateCard = ({ bootMenuData, onSuccess }: MenuCreateCardProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleCreateClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    onSuccess((prev) => !prev);
  };

  return (
    <>
      <MenuCreateCardWrapper onClick={handleCreateClick}>
        <MenuCreateContents>
          <img src={IMAGE_CONSTANTS.MENUPLUS} alt='메뉴 생성 버튼' />
          <BtnText>{`메뉴\n등록하기`}</BtnText>
        </MenuCreateContents>
      </MenuCreateCardWrapper>

      {showModal && (
        <ModalWrapper onClick={handleCloseModal}>
          <div onClick={(e) => e.stopPropagation()}>
            <MenuModal
              handleCloseModal={handleCloseModal}
              boothMenuData={bootMenuData}
            />
          </div>
        </ModalWrapper>
      )}
    </>
  );
};

export default MenuCreateCard;

const MenuCreateCardWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 200px;
  height: 300px;

  border: 2px dashed ${({ theme }) => theme.colors.Black02};
  border-radius: 10px;
  cursor: pointer;
`;

const MenuCreateContents = styled.div`
  display: flex;

  flex-direction: column;
  align-items: center;
  gap: 15px;

  & img {
    width: 35px;
    height: 35px;
  }
`;

const BtnText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.fonts.Bold14}
  color: ${({ theme }) => theme.colors.Focused};
  white-space: pre-wrap;
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
`;
