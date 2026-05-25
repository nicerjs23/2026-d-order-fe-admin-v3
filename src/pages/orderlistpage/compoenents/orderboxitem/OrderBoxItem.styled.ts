import theme from '@styles/theme';
import styled, { css } from 'styled-components';

export type OrderStatus =
  | '조리중'
  | '서빙중'
  | '서빙완료'
  | '서빙수락'
  | '조리완료';

const statusStyles: Record<OrderStatus, { bg: string; text: string }> = {
  조리중: {
    bg: '#FFE2D9',
    text: '#FF6E3F',
  },
  서빙중: {
    bg: '#FE7B52',
    text: '#FFFFFF',
  },
  서빙완료: {
    bg: '#B4B4B4',
    text: '#F2F2F2',
  },
  서빙수락: {
    bg: '#FFE484',
    text: '#BE5D3A',
  },
  조리완료: {
    bg: '#FFE484',
    text: '#BE5D3A',
  },
};

/** 조작 가능한 상태(조리중/조리완료/서빙완료)만 hover·active 적용 */
const statusInteractiveStyles: Partial<
  Record<OrderStatus, { hover: string; active: string }>
> = {
  조리중: { hover: '#FFD3C5', active: '#FFC0AC' },
  조리완료: { hover: '#F8CE70', active: '#F2C060' },
  서빙완료: { hover: '#949494', active: '#7A7A7A' },
};

export const OrderBoxItemWrapper = styled.div<{ $isModalOpen?: boolean }>`
  position: relative;
  background-color: ${({ theme }) => theme.colors.Gray01};
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-between;
  z-index: ${({ $isModalOpen }) => ($isModalOpen ? 10000 : 'auto')};
`;

export const ModalWrapper = styled.div<{ $isModalOpen?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.5rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.Gray01};
  border-radius: 1rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  z-index: -1;
`;

export const ItemInfoHalf = styled.div`
  display: flex;
  width: 50%;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ItemInfoHalf2 = styled.div`
  display: flex;
  width: 40%;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ItemInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.25rem;
  min-width: 0;
  flex: 1;
`;

export const ItemImage = styled.div`
  width: 3.125rem; // 50px
  height: 3.125rem; // 50px
  background-color: ${({ theme }) => theme.colors.Gray01};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ItemInfoName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
  flex: 1;
`;

export const SetPill = styled.span<{ $status: OrderStatus }>`
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  background-color: ${({ theme, $status }) =>
    $status === '조리중' ? theme.colors.Orange01 : theme.colors.Focused};
  color: ${({ theme }) => theme.colors.White};
  ${({ theme }) => theme.fonts.SemiBold10};
`;

/** 조리중·서빙수락: SemiBold15 / 서빙중·서빙완료: Medium16. 색상: 서빙중·서빙수락 #888888, 서빙완료 #C0C0C0, 조리중 Black01 */
const menuQuantityStyles: Record<
  OrderStatus,
  { font: 'SemiBold16' | 'Medium16'; color: string }
> = {
  조리중: { font: 'SemiBold16', color: theme.colors.Black01 },
  서빙중: { font: 'Medium16', color: theme.colors.Gray03 },
  서빙완료: { font: 'Medium16', color: theme.colors.Focused },
  서빙수락: { font: 'SemiBold16', color: theme.colors.Gray03 },
  조리완료: { font: 'SemiBold16', color: theme.colors.Gray03 },
};

export const MenuName = styled.span<{ $status: OrderStatus }>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ theme, $status }) => theme.fonts[menuQuantityStyles[$status].font]};
  color: ${({ $status }) => menuQuantityStyles[$status].color};
`;

export const Quantity = styled.span<{ $status: OrderStatus }>`
  ${({ theme, $status }) => theme.fonts[menuQuantityStyles[$status].font]};
  color: ${({ $status }) => menuQuantityStyles[$status].color};
`;

/** 모달 위치 기준·상태 전진 클릭 영역 (배지 전체) */
export const StatusBadgeWrap = styled.div<{ $interactive?: boolean }>`
  display: inline-flex;
  ${({ $interactive }) =>
    $interactive &&
    css`
      cursor: pointer;
    `}
`;

export const StatusBadge = styled.span<{ $status: OrderStatus }>`
  width: 90px;
  height: 32px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem;
  border-radius: 9999px;
  transition: background-color 0.12s ease;
  ${({ $status }) => {
    const s = statusStyles[$status];
    const interactive = statusInteractiveStyles[$status];
    return css`
      background-color: ${s.bg};
      color: ${s.text};
      ${interactive &&
      css`
        cursor: pointer;
        &:hover {
          background-color: ${interactive.hover};
        }
        &:active {
          background-color: ${interactive.active};
        }
      `}
    `;
  }}
  ${({ theme }) => theme.fonts.SemiBold14};
`;
