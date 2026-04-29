import { IMAGE_CONSTANTS } from '@constants/imageConstants';
import { CouponInput } from './CouponInput';
import { useCouponForm } from '../hooks/useCouponForm';
import { useCreateCoupon } from '../hooks/useCreateCoupon';
import * as S from './Coupon.styled';

export const CouponRegisterModal = ({ onClose }: { onClose: () => void }) => {
  const { bind, radio, isReady } = useCouponForm();
  const { create } = useCreateCoupon();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      await create({
        name: bind.name.value.trim(),
        description: bind.detail.value?.trim() || '',
        discount_type: radio.discountType === 'percent' ? 'RATE' : 'AMOUNT',
        discount_value:
          radio.discountType === 'percent'
            ? Number(bind.rate.value)
            : Number(bind.amount.value),
        quantity: Number(bind.qty.value || 0),
      });
      onClose();
    } catch (err) {
      console.error('쿠폰 생성 실패:', err);
    }
  };

  return (
    <S.Wrapper>
      <S.ModalBody>
        <S.TopModalWrapper>
          쿠폰 등록
          <S.BtnClose type='button' onClick={onClose}>
            <img src={IMAGE_CONSTANTS.ModalXIcon} alt='닫기' />
          </S.BtnClose>
        </S.TopModalWrapper>
        <S.DividerLine />
        <S.FormContentWrapper>
          <CouponInput
            Title='쿠폰 명'
            placeholderText='예) 최초 1회 주문 시 5000원 할인'
            type='text'
            {...bind.name}
          />
          <CouponInput
            Title='쿠폰 상세'
            placeholderText='예) 첫 주문 금액에서 5000원이 차감됩니다.'
            type='text'
            isEssential={false}
            {...bind.detail}
          />

          <CouponInput
            Title='할인 유형'
            type='radio'
            name='discountType'
            options={[
              { label: '가격', value: 'amount' },
              { label: '할인율(%)', value: 'percent' },
            ]}
            value={radio.discountType}
            onChange={(v) => radio.set(v as 'amount' | 'percent')}
          />

          {radio.discountType === 'amount' && (
            <CouponInput
              Title='할인 가격'
              type='number'
              placeholderText='예) 5000'
              {...bind.amount}
            />
          )}
          {radio.discountType === 'percent' && (
            <CouponInput
              Title='할인율'
              type='number'
              placeholderText='예) 10'
              {...bind.rate}
              helperText='* 최대 할인율은 100% 입니다.'
              hasError={Number(bind.rate.value) > 100}
            />
          )}
          <CouponInput
            Title='수량'
            placeholderText='예) 30'
            type='number'
            {...bind.qty}
          />
        </S.FormContentWrapper>
      </S.ModalBody>
      <S.BottomBtnContainer>
        <S.BottomBtn type='button' onClick={onClose}>
          취소
        </S.BottomBtn>
        <S.BottomBtn type='submit' disabled={!isReady} onClick={handleSubmit}>
          쿠폰등록
        </S.BottomBtn>
      </S.BottomBtnContainer>
    </S.Wrapper>
  );
};
