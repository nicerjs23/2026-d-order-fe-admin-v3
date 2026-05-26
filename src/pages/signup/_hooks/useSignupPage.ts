import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '@services/UserService';
import { ROUTE_PATHS } from '@constants/routeConstants';
import { useCheckUsername } from './useCheckUsername';

export enum Step {
  USER = 1,
  PUB = 2,
  PAYMENT = 3,
  COMPLETE = 4,
}

/** Storybook용: 아이디 중복 확인 결과 목업 */
export type MockDuplicateCheck = 'success' | 'duplicate' | 'error';

/** Storybook용: 회원가입 제출 결과 목업 */
export type MockSignupSubmit = 'success' | 'fail';

/** Storybook용: 초기 단계 지정 (1=회원정보, 2=주점정보, 3=결제정보) */
export const useSignupPage = (
  initialStep?: Step,
  mockDuplicateCheck?: MockDuplicateCheck,
  mockSignupSubmit?: MockSignupSubmit,
) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(initialStep ?? Step.USER);
  const [userStage, setUserStage] = useState(1);
  const [pubStage, setPubStage] = useState(1);

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    pubName: '',
    tableCount: '',
    tableFee: '',
    tableFeePolicy: 'PP',
    maxTime: '',
    accountHolder: '',
    bank: '',
    accountNumber: '',
  });

  const { idError, idSuccess, resetIdCheck } = useCheckUsername(
    formData.userId,
    mockDuplicateCheck,
  );

  const handleChange = useCallback((key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    if (mockSignupSubmit !== undefined) {
      return mockSignupSubmit === 'success';
    }
    try {
      const seatType = formData.tableFeePolicy as 'PT' | 'PP' | 'NO';
      await UserService.postSignupV3({
        username: formData.userId,
        password: formData.password,
        booth_data: {
          name: formData.pubName,
          table_max_cnt: Number(formData.tableCount),
          account: Number(formData.accountNumber),
          depositor: formData.accountHolder,
          bank: formData.bank,
          seat_type: seatType,
          seat_fee_person: seatType === 'PP' ? Number(formData.tableFee) : 0,
          seat_fee_table: seatType === 'PT' ? Number(formData.tableFee) : 0,
          table_limit_hours: Number(formData.maxTime) / 60,
        },
      });
      // 회원가입 성공 시: 추가 호출(자동 로그인)이나 로컬 저장 없이 완료 모달만 노출
      return true;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const ax = err as {
          response?: {
            data?: { message?: string; data?: Record<string, unknown> };
          };
        };
        const msg = ax.response?.data?.message;
        const data = ax.response?.data?.data;
        if (msg) {
          const parts: string[] = [msg];
          if (data?.username && Array.isArray(data.username)) {
            parts.push(data.username[0]);
          }
          if (data?.booth_data && typeof data.booth_data === 'object') {
            const bd = data.booth_data as Record<string, string[]>;
            const first = Object.values(bd).find(Array.isArray);
            if (Array.isArray(first) && first[0]) parts.push(first[0]);
          }
          /* console.warn('[Signup]', parts.join(' ')); */
        }
      }
      return false;
    }
  }, [formData, mockSignupSubmit]);

  const goNext = useCallback(() => {
    setStep((prev) => (prev < Step.COMPLETE ? ((prev + 1) as Step) : prev));
  }, []);

  const goBack = useCallback(() => {
    if (step === Step.PUB && pubStage > 1) {
      setPubStage((prev) => prev - 1);
    } else if (step === Step.USER && userStage > 1) {
      if (userStage === 3) {
        setFormData((prev) => ({ ...prev, confirmPassword: '' }));
      }
      setUserStage((prev) => prev - 1);
    } else if (step > Step.USER) {
      setStep((prev) => (prev - 1) as Step);
    } else {
      navigate(ROUTE_PATHS.INIT);
    }
  }, [step, userStage, pubStage, navigate]);

  const stepProps = useMemo(
    () => ({
      formData,
      onChange: handleChange,
      onNext: goNext,
      onSubmit: handleSubmit,
      pubStage,
      setPubStage,
      userStage,
      setUserStage,
      mockDuplicateCheck,
      idError,
      idSuccess,
      resetIdCheck,
    }),
    [
      formData,
      handleChange,
      goNext,
      handleSubmit,
      pubStage,
      setPubStage,
      userStage,
      setUserStage,
      mockDuplicateCheck,
      idError,
      idSuccess,
      resetIdCheck,
    ],
  );

  return {
    step,
    goBack,
    stepProps,
  };
};
