import preUploadImg from '@assets/images/preUploadImg.png';
import * as S from './styled';
import { useState, useEffect, useRef } from 'react';
import MenuService from '@services/MenuService';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';
import MenuDropdown from '@pages/menu/_components/MenuDropdown';
import MenuServiceWithImg from '@services/MenuServiceWithImg';
import { HandleNumberInput } from '../_utils/HandleNumberInput';
import { compressImage } from '../_utils/ImageCompress';
import { BoothMenuData } from '@pages/menu/Type/Menu_type';

interface MenuModalProps {
  handleCloseModal: () => void;
  boothMenuData: BoothMenuData | undefined;
  defaultValues?: {
    menu_id: number;
    menu_name: string;
    menu_description: string;
    menu_category: string;
    menu_price: number;
    menu_amount?: number;
    menu_image?: File | string | null; // URL
  };
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 업로드 이미지 크기 제한 10MB
const MIN_FILE_SIZE = 2.5 * 1024 * 1024;

type SetItem = {
  menuId: number | null;
  menuName: string;
  amount: number;
  isOpen: boolean;
};

const MenuModal = ({ handleCloseModal, boothMenuData }: MenuModalProps) => {
  const [UploadImg, setUploadImg] = useState<string | null>(null);
  const [buttonDisable, setButtonDisable] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [category, setCategory] = useState<string>('메뉴');
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 세트 구성 항목 상태
  const [setItems, setSetItems] = useState<SetItem[]>([]);
  const getSelectedMenuIds = () => {
    return setItems
      .map((item) => item.menuId)
      .filter((id): id is number => id !== null);
  };
  const handleAddSetItem = () => {
    setSetItems((prev) => [
      ...prev,
      { menuId: null, menuName: '', amount: 1, isOpen: false },
    ]);
  };

  const handleChangeSelected = (idx: number, id: number, menuName: string) => {
    setSetItems((prev) =>
      prev.map((it, i) =>
        i === idx ? { ...it, menuId: id, menuName, isOpen: false } : it,
      ),
    );
  };

  const handleChangeAmount = (idx: number, value: number) => {
    setSetItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, amount: value } : it)),
    );
  };

  const handleToggleOpen = (idx: number) => {
    setSetItems((prev) =>
      prev.map((it, i) => ({
        ...it,
        isOpen: i === idx ? !it.isOpen : false,
      })),
    );
  };

  const handleRemoveItem = (idx: number) => {
    setSetItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (UploadImg) {
      URL.revokeObjectURL(UploadImg);
    }

    const imgUrl = URL.createObjectURL(file);
    setUploadImg(imgUrl);
    setImage(file); // 선택한 파일 상태에 저장
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value || '';
    const digitsOnly = raw.replace(/\D/g, '');
    if (!digitsOnly) {
      setPrice('');
      return;
    }
    const num = Number(digitsOnly);
    const clamped = Math.min(num, 100000);
    setPrice(String(clamped));
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value || '';
    const digitsOnly = raw.replace(/\D/g, '');
    if (!digitsOnly) {
      setStock('');
      return;
    }
    const num = Number(digitsOnly);
    const clamped = Math.min(num, 9999);
    setStock(String(clamped));
  };

  const handleRemoveImage = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (UploadImg) {
      URL.revokeObjectURL(UploadImg);
    }
    setUploadImg(null);
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  useEffect(() => {
    if (
      name &&
      price &&
      (category === '세트' ? setItems.length > 0 : stock) &&
      category
    ) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [name, price, stock, category, setItems]);

  // 제출 이벤트
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (
      !category ||
      !name ||
      !price ||
      (category === '세트' ? setItems.length === 0 : !stock)
    ) {
      alert('모든 필수 항목을 채워주세요.');
      return;
    }

    if (image && image.size > MAX_FILE_SIZE) {
      alert('이미지 용량이 10mb 를 초과하였습니다!');
      return;
    }

    setIsSubmitting(true);

    try {
      if (category === '세트') {
        const menu_items = setItems
          .filter((it) => it.menuId !== null)
          .map((it) => ({ menu_id: it.menuId as number, quantity: it.amount }));

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', desc || '');
        formData.append('price', String(Number(price)));
        formData.append('set_items', JSON.stringify(menu_items));

        if (image) {
          const fileToUpload =
            image.size <= MIN_FILE_SIZE ? image : await compressImage(image);
          formData.append('image', fileToUpload);
        }

        await MenuServiceWithImg.createSetMenu(formData);
      } else {
        const categoryMap: Record<string, string> = { '메뉴': 'MENU', '음료': 'DRINK' };
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', desc || '');
        formData.append('category', categoryMap[category] ?? category);
        formData.append('price', price);
        formData.append('stock', stock);

        if (image) {
          const fileToUpload =
            image.size <= MIN_FILE_SIZE ? image : await compressImage(image);
          formData.append('image', fileToUpload);
          await MenuServiceWithImg.createMenu(formData);
        } else {
          await MenuService.createMenu(formData);
        }
      }
      handleCloseModal();
    } catch (e) {
      console.log(e);
      setIsSubmitting(false);
    }
  };
  return (
    <S.Wrapper onSubmit={handleSubmit}>
      <S.ModalBody>
        <S.ModalHeader>
          메뉴 등록
          <button type="button" onClick={handleCloseModal}>
            <img src={IMAGE_CONSTANTS.CLOSE} alt="닫기" />
          </button>
        </S.ModalHeader>
        <S.FormContentWrapper>
          <S.ele>
            <S.SubTitle>
              메뉴 카테고리<span>*</span>
            </S.SubTitle>
            <div>
              <label className="custom-label">
                <input
                  type="radio"
                  name="category"
                  value="메뉴"
                  onChange={() => setCategory('메뉴')}
                  checked={category === '메뉴'}
                />
                메뉴
              </label>
              <label className="custom-label">
                <input
                  type="radio"
                  name="category"
                  value="음료"
                  onChange={() => setCategory('음료')}
                  checked={category === '음료'}
                />
                음료
              </label>
              <label className="custom-label">
                <input
                  type="radio"
                  name="category"
                  value="세트"
                  onChange={() => setCategory('세트')}
                  checked={category === '세트'}
                />
                세트
              </label>
            </div>
          </S.ele>
          <S.ele>
            <S.SubTitle>
              메뉴명<span>*</span>
            </S.SubTitle>
            <S.inputText
              type="text"
              placeholder="예) 피자"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
            />
          </S.ele>
          <S.ele>
            <S.SubTitle>메뉴 설명</S.SubTitle>
            <S.inputText
              type="text"
              placeholder="예) 이탈리아의 풍미를 잔뜩 느낄 수 있는 피자에요."
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
          {category === '세트' && (
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
          )}
          {category !== '세트' && (
            <S.ele>
              <S.SubTitle>
                재고수량<span>*</span>
              </S.SubTitle>
              <S.inputText
                type="number"
                placeholder="예) 100"
                value={stock}
                onChange={handleStockChange}
                onInput={HandleNumberInput}
              />
            </S.ele>
          )}
          <S.ele>
            <S.SubTitle>메뉴 이미지</S.SubTitle>
            <S.OtherText>이미지 파일 (JPG,PNG)을 첨부해 주세요</S.OtherText>
            <label htmlFor="file-upload">
              <S.inputImg
                id="file-upload"
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={handleFileChange}
                multiple={false}
                ref={fileInputRef}
              />
              {UploadImg ? (
                <S.ImgContainer>
                  <S.Img src={UploadImg} alt="첨부한 이미지" />
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={handleRemoveImage}
                  >
                    <img src={IMAGE_CONSTANTS.CLOSE2} alt="" />
                  </button>
                </S.ImgContainer>
              ) : (
                <S.UploadImgBox>
                  <img src={preUploadImg} alt="기본 이미지" />
                </S.UploadImgBox>
              )}
            </label>
          </S.ele>
        </S.FormContentWrapper>
      </S.ModalBody>
      <S.ModalConfirmContainer>
        <button type="button" onClick={handleCloseModal}>
          취소
        </button>
        <button type="submit" disabled={buttonDisable || isSubmitting}>
          메뉴 등록
        </button>
      </S.ModalConfirmContainer>
    </S.Wrapper>
  );
};

export default MenuModal;
