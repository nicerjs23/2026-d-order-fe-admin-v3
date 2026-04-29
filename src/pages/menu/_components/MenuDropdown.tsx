import * as S from './MenuDropdown.styled';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';
import { BoothMenuData } from '../Type/Menu_type';

interface MenuDropDownProps {
  isOpen: boolean;
  setIsOpen: () => void;
  boothMenuData: BoothMenuData | undefined;
  selectedId: number | null;
  selectedName: string;
  onChangeSelected: (id: number, name: string) => void;
  amount: number;
  onChangeAmount: (value: number) => void;
  onRemove: () => void;
  selectedMenuIds: number[];
}

const MenuDropdown = ({
  isOpen,
  setIsOpen,
  boothMenuData,
  selectedId,
  selectedName,
  onChangeSelected,
  amount,
  onChangeAmount,
  onRemove,
  selectedMenuIds,
}: MenuDropDownProps) => {
  const mainMenus =
    boothMenuData?.menus.filter((menu) => menu.menu_category === '메뉴') ?? [];

  const drinksMenus =
    boothMenuData?.menus.filter((menu) => menu.menu_category === '음료') ?? [];

  const handleToggle = () => {
    if (selectedId !== null) return;
    setIsOpen();
  };

  const isMenuDisabled = (menuId: number) => {
    return selectedMenuIds.includes(menuId);
  };

  const handleMenuSelect = (menuId: number, menuName: string) => {
    if (isMenuDisabled(menuId)) return;
    onChangeSelected(menuId, menuName);
  };

  return (
    <S.Wrapper>
      {selectedId === null ? (
        <S.SelectBox onClick={handleToggle} $isOpen={isOpen}>
          <span>{'메뉴 선택'}</span>
          <S.ArrowIcon src={IMAGE_CONSTANTS.UP} $isOpen={isOpen} alt='arrow' />
        </S.SelectBox>
      ) : (
        <S.SelectBox $isOpen={false} onClick={() => {}}>
          <span>{selectedName}</span>
          <button type='button' onClick={onRemove}>
            <img src={IMAGE_CONSTANTS.CLOSE} alt='remove' />
          </button>
        </S.SelectBox>
      )}
      {isOpen && selectedId === null && (
        <S.OptionBox>
          <S.Option className='disabled'>{`> 메뉴`}</S.Option>
          {mainMenus.map((menu) => (
            <S.Option
              key={menu.menu_id}
              className={isMenuDisabled(menu.menu_id) ? 'disabled' : ''}
              onClick={() => {
                handleMenuSelect(menu.menu_id, menu.menu_name);
              }}
            >
              {menu.menu_name}
            </S.Option>
          ))}
          <S.Option className='disabled'>{`> 음료`}</S.Option>
          {drinksMenus.map((menu) => (
            <S.Option
              key={menu.menu_id}
              className={isMenuDisabled(menu.menu_id) ? 'disabled' : ''}
              onClick={() => {
                handleMenuSelect(menu.menu_id, menu.menu_name);
              }}
            >
              {menu.menu_name}
            </S.Option>
          ))}
        </S.OptionBox>
      )}
      {selectedId !== null && (
        <S.AmountWrapper>
          수량
          <button
            type='button'
            onClick={() => onChangeAmount(Math.max(1, amount - 1))}
          >
            <img
              src={
                amount >= 2
                  ? IMAGE_CONSTANTS.minusActive
                  : IMAGE_CONSTANTS.Minus
              }
              alt='minus'
            />
          </button>
          {amount}
          <button type='button' onClick={() => onChangeAmount(amount + 1)}>
            <img src={IMAGE_CONSTANTS.Add} alt='add' />
          </button>
        </S.AmountWrapper>
      )}
    </S.Wrapper>
  );
};

export default MenuDropdown;
