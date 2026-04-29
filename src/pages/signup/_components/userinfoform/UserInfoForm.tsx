import * as S from './UserInfoForm.styled';
import { useState, useEffect, useCallback } from 'react';
import CommonInput from '../inputs/CommonInput';
import NextButton from '../buttons/NextButton';

const isValidPasswordFormat = (pw: string) =>
  /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]{4,20}$/.test(pw);

type Props = {
  formData: {
    userId: string;
    password: string;
    confirmPassword: string;
  };
  onChange: (key: keyof Props['formData'], value: string) => void;
  onNext: () => void;
  userStage: number;
  setUserStage: React.Dispatch<React.SetStateAction<number>>;
  idError: string | null;
  idSuccess: string | null;
  resetIdCheck: () => void;
};

const UserInfoForm = ({
  formData,
  onChange,
  onNext,
  userStage,
  setUserStage,
  idError,
  idSuccess,
  resetIdCheck,
}: Props) => {
  const { userId, password, confirmPassword } = formData;

  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  const [confirmPwError, setConfirmPwError] = useState<string | null>(null);
  const [confirmPwSuccess, setConfirmPwSuccess] = useState<string | null>(null);

  // --- 1) 비밀번호: 즉시 형식검사 ---
  useEffect(() => {
    setPwError(null);
    setPwSuccess(null);

    if (!password) return;
    if (!isValidPasswordFormat(password)) {
      setPwError('4~20자 이내의 영문, 숫자, 특수문자를 입력해 주세요.');
      return;
    }
    setPwSuccess('사용 가능한 비밀번호예요.');
  }, [password]);

  // --- 비밀번호 확인: 3단계일 때만 일치 검사 (userStage만의 별도 초기화 effect 없음 →
  //     2→3 진입·폼 재마운트 시 성공 메시지가 바로 지워지던 문제 방지)
  useEffect(() => {
    setConfirmPwError(null);
    setConfirmPwSuccess(null);

    if (userStage !== 3) return;
    if (!confirmPassword) return;
    if (password !== confirmPassword) {
      setConfirmPwError('비밀번호가 일치하지 않아요.');
      return;
    }
    setConfirmPwSuccess('비밀번호가 일치해요.');
  }, [password, confirmPassword, userStage]);

  // 현재 단계 유효 여부
  const isIdValid = !!idSuccess && !idError;
  const isPwValid = !!pwSuccess && !pwError;
  const isConfirmValid = !!confirmPwSuccess && !confirmPwError;

  const isValid =
    (userStage === 1 && isIdValid) ||
    (userStage === 2 && isPwValid) ||
    (userStage === 3 && isConfirmValid);

  const handleNextStep = useCallback(() => {
    if (userStage === 1) {
      if (!isIdValid) return;
      setUserStage(2);
    } else if (userStage === 2) {
      if (!isPwValid) return;
      setUserStage(3);
    } else if (userStage === 3) {
      if (!isConfirmValid) return;
      onNext();
    }
  }, [userStage, setUserStage, onNext, isIdValid, isPwValid, isConfirmValid]);

  return (
    <S.Wrapper>
      <CommonInput
        label="아이디"
        placeholder="예) dorder2025"
        value={userId}
        onChange={(e) => onChange('userId', e.target.value)}
        // onKeyDown 제거: 즉시검증으로 대체
        error={idError ?? undefined}
        success={idSuccess ?? undefined}
        helperText="6~12자 이내의 영문 소문자, 숫자를 입력해 주세요."
        onClear={() => {
          onChange('userId', '');
          resetIdCheck();
        }}
        isVisible={userStage >= 1}
        disabled={userStage !== 1}
      />

      <CommonInput
        label="비밀번호"
        placeholder="비밀번호"
        type="password"
        value={password}
        onChange={(e) => onChange('password', e.target.value)}
        error={pwError ?? undefined}
        success={pwSuccess ?? undefined}
        helperText="4~20자 이내의 영문, 숫자, 특수문자를 입력해 주세요."
        onClear={() => {
          onChange('password', '');
          setPwError(null);
          setPwSuccess(null);
        }}
        isVisible={userStage >= 2}
        disabled={userStage !== 2}
      />

      <CommonInput
        label="비밀번호 확인"
        placeholder="비밀번호 확인"
        type="password"
        value={confirmPassword}
        onChange={(e) => onChange('confirmPassword', e.target.value)}
        error={confirmPwError ?? undefined}
        success={confirmPwSuccess ?? undefined}
        helperText="비밀번호를 동일하게 입력해 주세요."
        onClear={() => {
          onChange('confirmPassword', '');
          setConfirmPwError(null);
          setConfirmPwSuccess(null);
        }}
        isVisible={userStage >= 3}
        disabled={userStage !== 3}
      />

      <NextButton onClick={handleNextStep} disabled={!isValid}>
        다음
      </NextButton>
    </S.Wrapper>
  );
};

export default UserInfoForm;
