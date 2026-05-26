import { useEffect, useRef, useState } from "react";
// compressImage, MenuServiceWithImg 제거 — V3 세트메뉴 수정은 이미지 업로드 미지원
import * as S from "./styled";
import preUploadImg from "@assets/images/preUploadImg.png";
import { IMAGE_CONSTANTS } from "@constants/imageConstants";
import { HandleNumberInput } from "../_utils/HandleNumberInput";
import MenuDropdown from "@pages/menu/_components/MenuDropdown";
import { BoothMenuData, SetMenu } from "@pages/menu/Type/Menu_type";
import MenuService from "@services/MenuService";

interface EditSetMenuModalProps {
  handleCloseModal: () => void;
  boothMenuData: BoothMenuData | undefined;
  setMenu: SetMenu;
  onSuccess: () => void;
}

type SetItem = {
  menuId: number | null;
  menuName: string;
  amount: number;
  isOpen: boolean;
};

const EditSetMenuModal = ({
  handleCloseModal,
  boothMenuData,
  setMenu,
  onSuccess,
}: EditSetMenuModalProps) => {
  const [buttonDisable, setButtonDisable] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [setItems, setSetItems] = useState<SetItem[]>([]);
  // V3 세트메뉴 수정 API는 이미지 업로드 미지원 (삭제만 가능)
  const [uploadImg, setUploadImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setName(setMenu.set_name);
    setDesc(setMenu.set_description);
    setPrice(String(setMenu.set_price));
    const idToName = (id: number) =>
      boothMenuData?.menus.find((m) => m.menu_id === id)?.menu_name || "";
    setSetItems(
      (setMenu.menu_items || []).map((mi) => ({
        menuId: mi.menu_id,
        menuName: idToName(mi.menu_id),
        amount: mi.quantity,
        isOpen: false,
      }))
    );
    setUploadImg(setMenu.set_image || null);
  }, [setMenu, boothMenuData]);

  // V3 menu-list API는 세트 구성 아이템을 내려주지 않아 setItems가 항상 빈 배열로 시작함
  // 수정 모달에서는 name, price만 있으면 버튼 활성화
  useEffect(() => {
    if (name && price) setButtonDisable(false);
    else setButtonDisable(true);
  }, [name, price]);

  const getSelectedMenuIds = () => {
    return setItems
      .map((item) => item.menuId)
      .filter((id): id is number => id !== null);
  };
  const handleAddSetItem = () => {
    setSetItems((prev) => [
      ...prev,
      { menuId: null, menuName: "", amount: 1, isOpen: true },
    ]);
  };
  const handleChangeSelected = (idx: number, id: number, menuName: string) => {
    setSetItems((prev) =>
      prev.map((it, i) =>
        i === idx ? { ...it, menuId: id, menuName, isOpen: false } : it
      )
    );
  };
  const handleChangeAmount = (idx: number, value: number) => {
    setSetItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, amount: value } : it))
    );
  };
  const handleToggleOpen = (idx: number) => {
    setSetItems((prev) =>
      prev.map((it, i) => ({
        ...it,
        isOpen: i === idx ? !it.isOpen : false,
      }))
    );
  };
  const handleRemoveItem = (idx: number) => {
    setSetItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value || "";
    const digitsOnly = raw.replace(/\D/g, "");
    if (!digitsOnly) {
      setPrice("");
      return;
    }
    const num = Number(digitsOnly);
    const clamped = Math.min(num, 100000);
    setPrice(String(clamped));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      alert("모든 필수 항목을 채워주세요.");
      return;
    }

    // V3: JSON body, 이미지 수정 불가 (삭제만 image_delete: true 로 가능)
    const payload: {
      name: string;
      description: string;
      price: number;
      set_items?: { menu_id: number; quantity: number }[];
      image_delete?: boolean;
    } = {
      name,
      description: desc || "",
      price: Number(price),
    };

    // set_items 미포함 시 기존 구성 유지, 포함 시 전체 대체 (한 개 이상 필수)
    const validItems = setItems
      .filter((i) => i.menuId !== null)
      .map((i) => ({ menu_id: i.menuId as number, quantity: i.amount }));
    if (validItems.length > 0) {
      payload.set_items = validItems;
    }

    // 이미지 삭제: uploadImg가 null이면 명시적으로 삭제한 것
    if (uploadImg === null) {
      payload.image_delete = true;
    }

    try {
      await MenuService.editSetMenu(setMenu.set_menu_id, payload);
      onSuccess();
    } catch (err) {
      /* console.log(err); */
    } finally {
      handleCloseModal();
    }
  };

  return (
    <S.Wrapper onSubmit={handleSubmit}>
      <S.ModalBody>
        <S.ModalHeader>
          메뉴 수정
          <button type="button" onClick={handleCloseModal}>
            <img src={IMAGE_CONSTANTS.CLOSE} alt="닫기" />
          </button>
        </S.ModalHeader>
        <S.FormContentWrapper>
          <S.ele>
            <S.SubTitle>
              메뉴명<span>*</span>
            </S.SubTitle>
            <S.inputText
              type="text"
              placeholder="예) 세트A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
            />
          </S.ele>
          <S.ele>
            <S.SubTitle>메뉴 설명</S.SubTitle>
            <S.inputText
              type="text"
              placeholder="예) 인기 메뉴 조합"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={30}
            />
          </S.ele>
          <S.ele>
            <S.SubTitle>
              메뉴 가격<span>*</span>
            </S.SubTitle>
            <S.inputText
              type="text"
              placeholder="예) 20000"
              value={price}
              onChange={handlePriceChange}
              onInput={HandleNumberInput}
            />
          </S.ele>
          <S.ele>
            <S.setComposition>
              <S.SubTitle>
                메뉴 구성<span>*</span>
              </S.SubTitle>
              <button type="button" onClick={handleAddSetItem}>
                + 추가
              </button>
            </S.setComposition>
            {setItems.map((it, idx) => (
              <MenuDropdown
                key={idx}
                isOpen={it.isOpen}
                setIsOpen={() => handleToggleOpen(idx)}
                boothMenuData={boothMenuData}
                selectedId={it.menuId}
                selectedName={it.menuName}
                onChangeSelected={(id, name) =>
                  handleChangeSelected(idx, id, name)
                }
                amount={it.amount}
                onChangeAmount={(val) => handleChangeAmount(idx, val)}
                onRemove={() => handleRemoveItem(idx)}
                selectedMenuIds={getSelectedMenuIds()}
              />
            ))}
          </S.ele>
          <S.ele>
            {/* V3 API 이미지 업로드 미지원 — 기존 이미지 삭제만 가능 */}
            <S.SubTitle>세트 이미지</S.SubTitle>
            <S.inputImg
              id="set-file-upload"
              type="file"
              accept=".jpg,.png,.jpeg"
              multiple={false}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            {uploadImg ? (
              <S.ImgContainer>
                <S.Img src={uploadImg} alt="첨부한 이미지" />
                {/* V3 이미지 삭제 비활성화 — 수정 시 이미지 변경/삭제 미지원 */}
                {/* <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={handleRemoveImage}
                >
                  <img src={IMAGE_CONSTANTS.CLOSE2} alt="" />
                </button> */}
              </S.ImgContainer>
            ) : (
              <img src={preUploadImg} alt="기존 이미지" />
            )}
          </S.ele>
        </S.FormContentWrapper>
      </S.ModalBody>
      <S.ModalConfirmContainer>
        <button type="button" onClick={handleCloseModal}>
          취소
        </button>
        <button type="submit" disabled={buttonDisable}>
          메뉴 수정
        </button>
      </S.ModalConfirmContainer>
    </S.Wrapper>
  );
};

export default EditSetMenuModal;
