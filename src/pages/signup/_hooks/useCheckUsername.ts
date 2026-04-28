import { useState, useEffect, useCallback, useRef } from 'react';
import { checkUsername } from '@pages/signup/_services/checkUsername';

const isValidIdFormat = (id: string) => /^[a-z0-9]{6,12}$/.test(id);

const DUPLICATE_DEBOUNCE_MS = 400;

/** Storybook용: API 대신 해당 결과로 중복 확인 */
export type MockDuplicateCheck = 'success' | 'duplicate' | 'error';

const ID_FORMAT_ERROR = '6~12자 이내의 영문 소문자, 숫자를 입력해 주세요.';
const ID_AVAILABLE = '사용 가능한 아이디예요.';
const ID_DUPLICATE = '이미 존재하는 아이디예요.';
const ID_CHECK_ERROR = '중복 확인 중 오류가 발생했습니다.';

/**
 * 아이디 형식 검사는 매 입력마다 즉시, 중복 확인 API만 디바운스.
 * 반환값으로 입력 필드에 쓸 error/success 메시지와 리셋 함수 제공.
 */
export function useCheckUsername(
  userId: string,
  mockDuplicateCheck?: MockDuplicateCheck,
) {
  const [idError, setIdError] = useState<string | null>(null);
  const [idSuccess, setIdSuccess] = useState<string | null>(null);
  const latestUserIdRef = useRef(userId);
  latestUserIdRef.current = userId;

  useEffect(() => {
    if (!userId) {
      setIdError(null);
      setIdSuccess(null);
      return;
    }

    if (!isValidIdFormat(userId)) {
      setIdError(ID_FORMAT_ERROR);
      setIdSuccess(null);
      return;
    }

    setIdError(null);
    setIdSuccess(null);

    const checkedId = userId;

    const timer = setTimeout(async () => {
      if (latestUserIdRef.current !== checkedId) return;

      if (mockDuplicateCheck !== undefined) {
        if (mockDuplicateCheck === 'success') setIdSuccess(ID_AVAILABLE);
        else if (mockDuplicateCheck === 'duplicate') setIdError(ID_DUPLICATE);
        else setIdError(ID_CHECK_ERROR);
        return;
      }
      try {
        const available = await checkUsername(checkedId);
        if (latestUserIdRef.current !== checkedId) return;
        if (available) setIdSuccess(ID_AVAILABLE);
        else setIdError(ID_DUPLICATE);
      } catch {
        if (latestUserIdRef.current !== checkedId) return;
        setIdError(ID_CHECK_ERROR);
      }
    }, DUPLICATE_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [userId, mockDuplicateCheck]);

  const resetIdCheck = useCallback(() => {
    setIdError(null);
    setIdSuccess(null);
  }, []);

  return { idError, idSuccess, resetIdCheck };
}
