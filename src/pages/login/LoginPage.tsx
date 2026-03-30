import * as S from './LoginPage.styled';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LOGIN_CONSTANTS } from './_constants/LoginConstants';
import { ROUTE_PATHS } from '@constants/routeConstants';

import CommonInput from './_components/inputs/CommonInput';
import NextButton from './_components/buttons/NextButton';
import LoginImages from './LoginImages';

import UserService from '@services/UserService';

/** Storybook/테스트용: 설정 시 실제 API 대신 해당 결과 분기만 보여줌 */
export type LoginPageProps = {
  mockLogin?: 'success' | 'error';
};

const DEFAULT_LOGIN_ERROR = '아이디 혹은 비밀번호가 일치하지 않아요.';

const LoginPage = ({ mockLogin }: LoginPageProps = {}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoginError(null);
    try {
      let response: {
        message?: string;
        data: { username: string; booth_id: number };
        token?: { access: string; refresh?: string };
      };

      if (mockLogin !== undefined) {
        if (mockLogin === 'success') {
          response = {
            message: '로그인 성공',
            data: { username: formData.username || 'mock-user', booth_id: 1 },
            token: { access: 'mock-token' },
          };
        } else {
          throw new Error('로그인 실패했습니다. 다시 시도해 주세요.');
        }
      } else {
        response = await UserService.loginV3(formData);
      }

      const data =
        response.data ?? (response as { username?: string; booth_id?: number });
      const username = data.username ?? '';
      const booth_id = data.booth_id ?? 0;

      if (!username && booth_id === 0) {
        setLoginError('로그인 응답이 올바르지 않습니다.');
        return;
      }

      localStorage.setItem('Booth-ID', String(booth_id));
      navigate(ROUTE_PATHS.HOME);
    } catch (err) {
      const msg = DEFAULT_LOGIN_ERROR;
      setLoginError(msg);
    }
  };

  return (
    <S.Wrapper>
      <S.BackIMG
        src={LOGIN_CONSTANTS.IMAGES.BACKWARD}
        onClick={() => navigate(ROUTE_PATHS.INIT)}
      />
      <LoginImages />
      <S.Container2>
        <S.TitleBox>
          <S.Title>로그인하기</S.Title>
        </S.TitleBox>
        <CommonInput
          label="아이디"
          placeholder="아이디를 입력하세요"
          onValueSubmit={(val) => {
            setLoginError(null);
            setFormData((prev) => ({ ...prev, username: val }));
          }}
        />
        <CommonInput
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          onValueSubmit={(val) => {
            setLoginError(null);
            setFormData((prev) => ({ ...prev, password: val }));
          }}
        />
        {loginError ? (
          <S.ErrorMessage role="alert">{loginError}</S.ErrorMessage>
        ) : null}
        <S.Cover>
          <NextButton
            onClick={handleLogin}
            disabled={!formData.username || !formData.password}
          >
            로그인
          </NextButton>
        </S.Cover>
      </S.Container2>
    </S.Wrapper>
  );
};

export default LoginPage;
