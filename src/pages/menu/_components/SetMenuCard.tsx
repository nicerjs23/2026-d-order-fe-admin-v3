import * as S from './MenuCard.styled';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';
import { useState } from 'react';
import EditSetMenuModal from '../../modal_test_view/_components/EditSetMenuModal';
import MenuDeleteModal from '../../modal_test_view/_components/MenuDeleteModal';
import { BoothMenuData, SetMenu } from '../Type/Menu_type';
import MenuService from '@services/MenuService';
import { isAxiosError } from 'axios';
import Toast from '@components/ToastMessage/Toast';

interface SetMenuCardProps {
  menu: SetMenu;
  onMenuChange: () => void;
  boothMenuData: BoothMenuData | undefined;
}

const SetMenuCard = ({
  menu,
  onMenuChange,
  boothMenuData,
}: SetMenuCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const isSoldOut = menu.is_sold_out;

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await MenuService.deleteSetMenu(menu.set_menu_id);
      setShowDeleteModal(false);
      onMenuChange();
    } catch (error) {
      setShowDeleteModal(false);
      if (isAxiosError(error) && error.response?.status === 400) {
        setToastMsg('주문이 들어가 있는 메뉴는 삭제가 불가능합니다!');
      } else {
        setToastMsg('메뉴 삭제에 실패했습니다!');
      }
    }
  };

  return (
    <>
      <S.MenuCardWrapper>
        {isSoldOut && (
          <S.SoldOutOverlay>
            <S.SoldOutText>SOLD OUT</S.SoldOutText>
          </S.SoldOutOverlay>
        )}
        <S.CardContents>
          <S.CardImg>
            {menu.set_image ? (
              <img src={menu.set_image} alt={menu.set_name} />
            ) : (
              <S.DefaultCardImg>
                <img src={IMAGE_CONSTANTS.NOMALCHARACTER} alt={menu.set_name} />
              </S.DefaultCardImg>
            )}
            <S.DeleteBtn onClick={handleDeleteClick}>
              <img src={IMAGE_CONSTANTS.VECTOR} alt='삭제' />
            </S.DeleteBtn>
          </S.CardImg>
          <S.CardInfo>
            <S.MenuEditBtn onClick={handleEditClick}>
              <img src={IMAGE_CONSTANTS.MENUEDIT} alt='수정아이콘' />
              메뉴 수정
            </S.MenuEditBtn>
            <S.CardTextInner>
              <S.CardText className='bold'>{menu.set_name}</S.CardText>
              <S.CardText>{menu.set_price.toLocaleString()}원</S.CardText>
            </S.CardTextInner>
          </S.CardInfo>
        </S.CardContents>
      </S.MenuCardWrapper>

      {showModal && (
        <S.ModalWrapper onClick={handleCloseModal}>
          <div onClick={(e) => e.stopPropagation()}>
            <EditSetMenuModal
              handleCloseModal={handleCloseModal}
              boothMenuData={boothMenuData}
              setMenu={menu}
              onSuccess={onMenuChange}
            />
          </div>
        </S.ModalWrapper>
      )}

      {showDeleteModal && (
        <MenuDeleteModal
          onCancel={handleCancelDelete}
          onDelete={handleConfirmDelete}
        />
      )}

      <Toast
        message={toastMsg}
        isVisible={!!toastMsg}
        onClose={() => setToastMsg('')}
        icon={IMAGE_CONSTANTS.TOAST_ERROR}
        variant='error'
      />
    </>
  );
};

export default SetMenuCard;
