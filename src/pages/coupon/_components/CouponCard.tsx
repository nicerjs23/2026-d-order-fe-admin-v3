import * as S from './Coupon.styled';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';
import { Coupon } from '@services/CouponService';

interface SetCouponCardProps {
  coupondata: Coupon;
  onDetail: () => void;
}
export const CouponCard = ({ coupondata, onDetail }: SetCouponCardProps) => {
  return (
    <>
      <S.MenuCardWrapper>
        {coupondata.remaining_count === 0 && (
          <S.SoldOutOverlay>
            <S.SoldOutText>SOLD OUT</S.SoldOutText>
          </S.SoldOutOverlay>
        )}
        <S.CardContents>
          <S.CardImg>
            <img
              src={
                coupondata.discount_type === 'AMOUNT'
                  ? IMAGE_CONSTANTS.COUPON_PRICE
                  : IMAGE_CONSTANTS.COUPON_RATE
              }
            />
          </S.CardImg>
          <S.CardInfo>
            <S.MenuEditBtn onClick={onDetail}>
              <img src={IMAGE_CONSTANTS.MENUEDIT} alt='수정아이콘' />
              쿠폰 상세
            </S.MenuEditBtn>
            <S.CardTextInner>
              <S.CardText
                className={`bold name ${
                  coupondata.name.length >= 8 ? 'wrap' : ''
                }`}
              >
                {coupondata.name}
              </S.CardText>
              <S.CardText className='price'>
                {coupondata.discount_type === 'RATE'
                  ? Math.round(coupondata.discount_value * 100)
                  : coupondata.discount_value}
                {coupondata.discount_type === 'AMOUNT' ? (
                  <span>원</span>
                ) : (
                  <span>%</span>
                )}
              </S.CardText>
            </S.CardTextInner>
          </S.CardInfo>
        </S.CardContents>
      </S.MenuCardWrapper>
    </>
  );
};
