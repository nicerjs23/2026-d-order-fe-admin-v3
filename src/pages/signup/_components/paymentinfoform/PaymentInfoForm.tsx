import * as S from './PaymentInfoForm.styled';
import { useState, useCallback, useMemo } from 'react';
import Toast from '@components/ToastMessage/Toast';
import { IMAGE_CONSTANTS } from '@constants/imageConstants';
import CommonInput from '../inputs/CommonInput';
import NextButton from '../buttons/NextButton';
import SignupComplete from '../modals/signupcomplete/SignupComplete';
import CommonDropdown from '../inputs/dropdown/CommonDropdown';

const SIGNUP_FAILURE_TOAST_MESSAGE =
  '회원가입 처리 중 문제가 생겼어요. 다시 시도해 주세요.';

type Props = {
  formData: {
    accountHolder: string;
    bank: string;
    accountNumber: string;
  };
  onChange: (key: keyof Props['formData'], value: string) => void;
  onSubmit: () => Promise<boolean>;
};

const BANK_OPTIONS = [
  'KB국민은행',
  '신한은행',
  '우리은행',
  '하나은행',
  'NH농협은행',
  'IBK기업은행',
  'SC제일은행',
  '한국씨티은행',
  '카카오뱅크',
  '케이뱅크',
  '토스뱅크',
  '부산은행',
  '경남은행',
  '대구은행',
  '광주은행',
  '전북은행',
  '제주은행',
  '수협은행',
  '산업은행',
];

const isValidAccountNumber = (value: string) => /^\d{8,14}$/.test(value);

const PaymentInfoForm = ({ formData, onChange, onSubmit }: Props) => {
  const [showComplete, setShowComplete] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const { accountHolder, bank, accountNumber } = formData;

  const [accountNumberError, setAccountNumberError] = useState<string | null>(
    null,
  );
  const [accountNumberSuccess, setAccountNumberSuccess] = useState<
    string | null
  >(null);

  const isAccountHolderValid = useMemo(
    () => accountHolder.trim().length > 0,
    [accountHolder],
  );
  const isBankValid = useMemo(() => bank.trim().length > 0, [bank]);
  const isAccountNumberValid = useMemo(
    () => isValidAccountNumber(accountNumber),
    [accountNumber],
  );

  const isFormValid =
    isAccountHolderValid && isBankValid && isAccountNumberValid;

  const handleComplete = useCallback(async () => {
    const success = await onSubmit();
    if (success) setShowComplete(true);
    else setToastMsg(SIGNUP_FAILURE_TOAST_MESSAGE);
  }, [onSubmit]);

  return (
    <>
      <S.Wrapper>
        <CommonInput
          label="예금주"
          placeholder="예) 이멋사"
          value={accountHolder}
          onChange={(e) => onChange('accountHolder', e.target.value)}
          success={isAccountHolderValid ? '사용 가능해요!' : undefined}
          onClear={() => onChange('accountHolder', '')}
        />

        <CommonDropdown
          label="은행"
          placeholder="은행 선택"
          value={bank}
          onChange={(e) => onChange('bank', e.target.value)}
          options={BANK_OPTIONS}
        />

        <CommonInput
          label="계좌번호"
          placeholder="예) 12341234"
          value={accountNumber}
          onChange={(e) => {
            const onlyDigits = e.target.value.replace(/[^\d]/g, '');
            onChange('accountNumber', onlyDigits);

            if (!onlyDigits) {
              setAccountNumberError(null);
              setAccountNumberSuccess(null);
            } else if (isValidAccountNumber(onlyDigits)) {
              setAccountNumberError(null);
              setAccountNumberSuccess('사용 가능한 계좌번호예요!');
            } else {
              setAccountNumberError('-를 제외한 숫자 8~14자만 입력해 주세요.');
              setAccountNumberSuccess(null);
            }
          }}
          error={accountNumberError ?? undefined}
          success={accountNumberSuccess ?? undefined}
          helperText="-를 제외한 숫자만 입력해 주세요."
          onClear={() => {
            onChange('accountNumber', '');
            setAccountNumberError(null);
            setAccountNumberSuccess(null);
          }}
        />

        <NextButton onClick={handleComplete} disabled={!isFormValid}>
          회원가입
        </NextButton>

        {showComplete && <SignupComplete />}
      </S.Wrapper>
      <Toast
        message={toastMsg}
        isVisible={!!toastMsg}
        onClose={() => setToastMsg('')}
        icon={IMAGE_CONSTANTS.TOAST_ERROR}
        variant="error"
      />
    </>
  );
};

export default PaymentInfoForm;
