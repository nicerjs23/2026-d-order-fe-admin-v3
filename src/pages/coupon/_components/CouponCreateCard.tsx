import { IMAGE_CONSTANTS } from '@constants/imageConstants';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CouponRegisterModal } from './CouponRegisterModal';
import { CouponCard } from './CouponCard';
import { CouponDetail } from './CouponDetail/CouponDetail';
import { useCouponList } from '../hooks/useCouponList';
const CouponCreateCard = () => {
  const [registerModal, setRegisterModal] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);

  const { coupons, refetch } = useCouponList();

  const handleCreateClick = () => {
    setRegisterModal(true);
  };
  const handleCloseModal = () => {
    setRegisterModal(false);
    refetch();
  };

  useEffect(() => {
    if (selectedCouponId === null) {
      refetch();
    }
  }, [selectedCouponId]);

  return (
    <>
      {selectedCouponId ? (
        <CouponDetail
          couponId={selectedCouponId}
          setSelectedCouponId={setSelectedCouponId}
        />
      ) : (
        <>
          <CouponCreateCardWrapper onClick={handleCreateClick}>
            <CouponCreateContents>
              <img src={IMAGE_CONSTANTS.MENUPLUS} alt='쿠폰 생성 아이콘' />
              <CouponCreateText>{`쿠폰 \n등록하기`}</CouponCreateText>
            </CouponCreateContents>
          </CouponCreateCardWrapper>

          {registerModal && (
            <ModalWrapper onClick={handleCloseModal}>
              <div onClick={(e) => e.stopPropagation()}>
                <CouponRegisterModal onClose={handleCloseModal} />
              </div>
            </ModalWrapper>
          )}

          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.coupon_id}
              coupondata={coupon}
              onDetail={() => setSelectedCouponId(coupon.coupon_id)}
            />
          ))}
        </>
      )}
    </>
  );
};

export default CouponCreateCard;

const CouponCreateCardWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 190px;
  height: 273px;

  border: 2px dashed ${({ theme }) => theme.colors.Black02};
  border-radius: 10px;
  cursor: pointer;
`;

const CouponCreateContents = styled.div`
  display: flex;

  flex-direction: column;
  align-items: center;
  gap: 15px;

  & img {
    width: 35px;
    height: 35px;
  }
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
`;

const CouponCreateText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.fonts.Bold14}
  color: ${({ theme }) => theme.colors.Focused};
  white-space: pre-wrap;
`;
