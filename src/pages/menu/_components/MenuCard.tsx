import * as S from "./MenuCard.styled";
import { IMAGE_CONSTANTS } from "@constants/imageConstants";
import React, { SetStateAction, useState } from "react";
import MenuDeleteModal from "../../modal_test_view/_components/MenuDeleteModal";
import { BoothMenuData, Menu } from "../Type/Menu_type";
import MenuService from "../../../services/MenuService";
import EditMenuModal from "@pages/modal_test_view/_components/EditMenuModal";
import { isAxiosError } from "axios";
import Toast from "@components/ToastMessage/Toast";

interface MenuCardProps {
  menu: Menu;
  onSuccess: React.Dispatch<SetStateAction<boolean>>;
  boothMenuData: BoothMenuData | undefined;
}

const MenuCard = ({ menu, onSuccess, boothMenuData }: MenuCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const isSoldOut = menu.is_sold_out;

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    onSuccess((prev) => !prev);
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await MenuService.deleteMenu(menu.menu_id);
      setShowDeleteModal(false);
      onSuccess((prev) => !prev);
    } catch (error) {
      setShowDeleteModal(false);
      if (isAxiosError(error) && error.response?.status === 400) {
        setToastMsg("주문이 들어가 있는 메뉴는 삭제가 불가능합니다!");
      } else {
        setToastMsg("메뉴 삭제에 실패했습니다!");
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
            {menu.menu_image ? (
              <img src={menu.menu_image} alt={menu.menu_name} />
            ) : (
              <S.DefaultCardImg>
                <img src={IMAGE_CONSTANTS.CHARACTER} alt={menu.menu_name} />
              </S.DefaultCardImg>
            )}
            <S.DeleteBtn onClick={handleDeleteClick}>
              <img src={IMAGE_CONSTANTS.VECTOR} alt="삭제" />
            </S.DeleteBtn>
          </S.CardImg>
          <S.CardInfo>
            <S.MenuEditBtn onClick={handleEditClick}>
              <img src={IMAGE_CONSTANTS.MENUEDIT} alt="수정아이콘" />
              메뉴 수정
            </S.MenuEditBtn>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <S.CardTextInner>
                <S.CardText className="bold">{menu.menu_name}</S.CardText>
                <S.CardText>{menu.menu_price.toLocaleString()}원</S.CardText>
              </S.CardTextInner>
              <S.CardTextInner>
                <S.CardText>재고수량</S.CardText>
                <S.CardText>
                  {menu.menu_amount !== undefined
                    ? `${menu.menu_amount}개`
                    : "-"}
                </S.CardText>
              </S.CardTextInner>
            </div>
          </S.CardInfo>
        </S.CardContents>
      </S.MenuCardWrapper>

      {showModal && (
        <S.ModalWrapper onClick={handleCloseModal}>
          <div onClick={(e) => e.stopPropagation()}>
            <EditMenuModal
              handleCloseModal={handleCloseModal}
              onSuccess={onSuccess}
              boothMenuData={boothMenuData}
              defaultValues={{
                menu_id: menu.menu_id,
                menu_name: menu.menu_name,
                menu_description: menu.menu_description,
                menu_category: menu.menu_category,
                menu_price: menu.menu_price,
                menu_amount: menu.menu_amount,
                menu_image: menu.menu_image,
              }}
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
        onClose={() => setToastMsg("")}
        icon={IMAGE_CONSTANTS.TOAST_ERROR}
        variant="error"
      />
    </>
  );
};

export default MenuCard;
