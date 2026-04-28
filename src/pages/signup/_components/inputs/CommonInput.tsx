import * as S from './CommonInput.styled';

import { useState, useEffect, useRef, useCallback } from 'react';

import { SIGNUP_CONSTANTS } from '@pages/signup/_constants/signupConstants';

type InputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  success?: string;
  disabled?: boolean;
  helperText?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  isVisible?: boolean;
  forceShowPasswordWhenSuccess?: boolean;
};

const CommonInput = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  success,
  helperText,
  disabled = false,
  onKeyDown,
  onClear,
  isVisible = true,
  forceShowPasswordWhenSuccess = false,
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  const hasValue = value.length > 0;

  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === 'password';
  const effectiveType = isPasswordType && showPassword ? 'text' : type;

  const isValidated = hasError || hasSuccess;
  const showClear = !isValidated && focused && hasValue;
  /** 포커스+미검증일 때는 클리어만; 그 외 비밀번호는 값이 있으면 항상 토글(성공·오류 아이콘과 동시 표시) */
  const showPasswordToggle =
    isPasswordType && hasValue && !(focused && !isValidated);
  const wideTrailingPadding = showPasswordToggle && (hasError || hasSuccess);

  useEffect(() => {
    if (hasSuccess && forceShowPasswordWhenSuccess) {
      setShowPassword(true);
    }
  }, [hasSuccess, forceShowPasswordWhenSuccess]);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);
  const handleBlur = useCallback(() => setFocused(false), []);
  const togglePassword = useCallback(
    () => setShowPassword((prev) => !prev),
    [],
  );
  const handleClearMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onClear?.();
    },
    [onClear],
  );

  return (
    <S.Wrapper $visible={isVisible}>
      {label && (
        <S.Label $error={hasError} $success={hasSuccess}>
          {label}
        </S.Label>
      )}
      <S.InputWrapper>
        <S.StyledInput
          ref={inputRef}
          placeholder={placeholder}
          type={effectiveType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          $error={hasError}
          $success={hasSuccess}
          $wideTrailing={wideTrailingPadding}
          onKeyDown={onKeyDown}
          enterKeyHint="next"
        />
        {showClear && (
          <S.Icon
            src={SIGNUP_CONSTANTS.INPUT_IMAGE.VECTOR}
            alt="Clear"
            onMouseDown={handleClearMouseDown}
            $cursor="pointer"
          />
        )}
        {hasError && (
          <S.Icon
            src={SIGNUP_CONSTANTS.INPUT_IMAGE.ERROR}
            alt="Error"
            $right={showPasswordToggle ? '12px' : undefined}
          />
        )}
        {hasSuccess && (
          <S.Icon
            src={SIGNUP_CONSTANTS.INPUT_IMAGE.CHECK}
            alt="Success"
            $right={showPasswordToggle ? '12px' : undefined}
          />
        )}
        {showPasswordToggle && (
          <S.Icon
            src={
              showPassword
                ? SIGNUP_CONSTANTS.INPUT_IMAGE.EYESON
                : SIGNUP_CONSTANTS.INPUT_IMAGE.EYESOFF
            }
            alt="Toggle visibility"
            onClick={togglePassword}
            /* 유효성 아이콘과 함께 있을 때만 안쪽(48px). 로그인처럼 눈만 있을 때는 기본 12px */
            $right={wideTrailingPadding ? '48px' : undefined}
            $cursor="pointer"
          />
        )}
      </S.InputWrapper>

      {helperText && !(error || success) && <S.Helper>{helperText}</S.Helper>}
      {(error || success) && (
        <S.Message $error={hasError}>{error || success}</S.Message>
      )}
    </S.Wrapper>
  );
};

export default CommonInput;
