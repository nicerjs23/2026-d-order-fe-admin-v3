import * as S from './CouponDetail.styled';
import { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { isAxiosError } from 'axios';
import { DetailData } from './DetailData';
import { CouponItem } from './CouponItem';
import Qr from '@assets/icons/qr.svg';
import { DeleteModal } from '@components/DeleteModal/DeleteModal';
import { useCouponDetail } from '@pages/coupon/hooks/useCouponDetail';
import { CouponService } from '@services/CouponService';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';
import Toast from '@components/ToastMessage/Toast';

interface Props {
  couponId: number;
  setSelectedCouponId: Dispatch<SetStateAction<number | null>>;
}
export const CouponDetail = ({ couponId, setSelectedCouponId }: Props) => {
  const [showDelete, setShowDelete] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const { detail: detailData, codes } = useCouponDetail(couponId);
  const handleCancel = () => {
    setShowDelete(false);
  };
  const handleDownExcel = async () => {
    try {
      await CouponService.getDownCouponExcel(couponId);
    } catch (err) {
      /* console.error('쿠폰 엑셀 다운 실패:', err); */
    }
  };
  const handleDelete = async () => {
    try {
      await CouponService.deleteCoupon(couponId);
      setShowDelete(false);
      setSelectedCouponId(null);
    } catch (err) {
      setShowDelete(false);
      if (isAxiosError(err) && err.response?.status === 409) {
        setToastMsg('이미 사용된 쿠폰은 삭제가 불가능합니다.');
      } else {
        /* console.error('쿠폰 삭제 실패:', err); */
      }
    }
  };
  return (
    <S.DetailBox>
      <S.DetailContainer>
        <S.DetailWrapper>
          <S.TitleWrapper>
            <S.BackImg
              src={IMAGE_CONSTANTS.BACKWARD_BLACK}
              onClick={() => setSelectedCouponId(null)}
            />
            <S.CouponDetailTitle>쿠폰 정보</S.CouponDetailTitle>
          </S.TitleWrapper>
          <div>
            <S.DataContainer>
              <DetailData DataTitle='쿠폰명' DataContent={detailData?.name} />
              <DetailData
                DataTitle='쿠폰 상세'
                DataContent={detailData?.description ?? undefined}
              />
              <DetailData
                DataTitle='할인 유형'
                DataContent={
                  detailData?.discount_type === 'AMOUNT' ? '가격' : '할인율(%)'
                }
              />
              <DetailData
                DataTitle='할인율'
                DataContent={
                  detailData?.discount_type === 'RATE'
                    ? `${detailData?.display_discount_value}%`
                    : `${detailData?.display_discount_value}원`
                }
              />
              <DetailData
                DataTitle='수량'
                DataContent={`${detailData?.unused_count}/${detailData?.quantity}`}
              />
            </S.DataContainer>
            <S.BottomContainer>
              <S.QrContainer>
                <S.QrImg src={Qr} />
                <span onClick={handleDownExcel}>
                  쿠폰 번호 엑셀 파일 다운로드
                </span>
              </S.QrContainer>
            </S.BottomContainer>
          </div>
        </S.DetailWrapper>
        <S.DeleteBtn onClick={() => setShowDelete(true)}>쿠폰 삭제</S.DeleteBtn>
      </S.DetailContainer>
      <S.CouponList>
        {codes.map((c) => {
          return (
            <CouponItem
              key={c.coupon_code_id}
              code={c.code}
              isUsed={c.is_used}
            />
          );
        })}
      </S.CouponList>
      {showDelete && (
        <DeleteModal
          onCancel={handleCancel}
          onDelete={handleDelete}
          Title='정말 할인 쿠폰을 삭제하시겠어요?'
          SubText1='할인 쿠폰을 삭제하면,'
          SubText2='사용되지 않은 쿠폰은 사라져요!'
          BtnName='쿠폰 삭제'
        />
      )}
      <Toast
        message={toastMsg}
        isVisible={!!toastMsg}
        onClose={() => setToastMsg('')}
        icon={IMAGE_CONSTANTS.TOAST_ERROR}
        variant='error'
      />
    </S.DetailBox>
  );
};
