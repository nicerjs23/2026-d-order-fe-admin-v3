import * as S from './CouponDetail.styled';

export const CouponItem = ({
  code,
  isUsed,
}: {
  code: string;
  isUsed: boolean;
}) => {
  return (
    <S.Coupon>
      <S.CouponCode $isUsed={isUsed}>{code}</S.CouponCode>
      {isUsed ? <span>사용됨</span> : <></>}
    </S.Coupon>
  );
};
