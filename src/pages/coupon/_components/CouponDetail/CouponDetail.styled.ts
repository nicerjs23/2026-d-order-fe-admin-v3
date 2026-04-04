import styled from 'styled-components';

export const DetailBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  gap: 2rem;
`;
export const DetailContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 2rem;
  width: 550px;
  margin-top: 2rem;
`;

export const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

export const BackImg = styled.img`
  width: 10px;
  cursor: pointer;
`;
export const CouponDetailTitle = styled.div`
  ${({ theme }) => theme.fonts.Bold20}
  color: ${({ theme }) => theme.colors.Black01};
`;

export const DataContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  border-radius: 0.5rem;

  border: 1px solid rgba(192, 192, 192, 0.5);
`;
export const DataBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  ${({ theme }) => theme.fonts.SemiBold12}
  padding: 1rem;
  border-bottom: 1px solid rgba(192, 192, 192, 0.5);
  &:last-child {
    border-bottom: none;
  }
`;
export const DataTitle = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.Focused};
  width: 20%;
  ${({ theme }) => theme.fonts.SemiBold12};
`;

export const DataContent = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.Black01};
  width: 80%;
  ${({ theme }) => theme.fonts.SemiBold12};
`;

//mypage에서 가져옴

export const BottomContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  gap: 0.375rem;
  cursor: pointer;

  span {
    color: ${({ theme }) => theme.colors.Focused};
    ${({ theme }) => theme.fonts.SemiBold10};
  }
`;

export const QrContainer = styled.div`
  display: flex;
  gap: 0.375rem;
`;

export const QrImg = styled.img`
  width: 0.8rem;
  aspect-ratio: 1/1;
`;

//
export const DeleteBtn = styled.div`
  display: flex;
  width: 70px;
  height: 30px;
  padding: 0.2rem;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.White};
  background-color: ${({ theme }) => theme.colors.Orange01};

  ${({ theme }) => theme.fonts.SemiBold14};
  border-radius: 1.5rem;
  cursor: pointer;
`;

export const CouponList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 10px;
  overflow-y: auto;
  margin-top: 2rem;
`;

export const Coupon = styled.div<{ isUsed?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${({ theme }) => theme.fonts.SemiBold16};
  min-width: 270px;
  border: 1px solid ${({ theme }) => theme.colors.Black02};
  border-radius: 20px;
  padding: 15px 17px;
`;

export const CouponCode = styled.span<{ $isUsed?: boolean }>`
  display: flex;
  color: ${({ $isUsed, theme }) =>
    $isUsed ? theme.colors.Black02 : theme.colors.Black01};
`;
