import * as S from './CouponDetail.styled';

export const CouponItem = ({
  code,
  isUsed,
}: {
  code: string;
  isUsed: boolean;
}) => {
  return (
    <S.Coupon $isUsed={isUsed}>
      <S.CouponCode $isUsed={isUsed}>{code}</S.CouponCode>
      {isUsed && <S.UsedBadge>사용됨</S.UsedBadge>}
    </S.Coupon>
  );
};
