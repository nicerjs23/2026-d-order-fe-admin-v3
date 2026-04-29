import * as S from './SignupComplete.styled';

import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@constants/routeConstants';
import { SIGNUP_CONSTANTS } from '@pages/signup/_constants/signupConstants';
import fireWork from '@assets/lottie/fireworks.json';
import Lottie from 'lottie-react';

const SignupComplete = () => {
  const navigate = useNavigate();
  return (
    <S.Wrapper>
      <S.Back />
      <S.ModalWrap>
        <S.ModalTop>
          <S.Title>회원가입이 완료되었어요!</S.Title>
          <S.LogoWrapper>
            <S.LottieWrapper>
              <Lottie animationData={fireWork} loop={true} />
            </S.LottieWrapper>
            <S.Image src={SIGNUP_CONSTANTS.IMAGES.CHARACTER} />
          </S.LogoWrapper>
        </S.ModalTop>
        <S.ToLogin onClick={() => navigate(ROUTE_PATHS.LOGIN)}>
          로그인하러 가기
        </S.ToLogin>
      </S.ModalWrap>
    </S.Wrapper>
  );
};

export default SignupComplete;
