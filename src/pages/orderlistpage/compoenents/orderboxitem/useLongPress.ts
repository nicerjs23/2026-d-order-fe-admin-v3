import { useCallback, useRef } from 'react';

const DEFAULT_DELAY = 500;

/**
 * 클릭(단일 탭)과 롱프레스를 구분하는 훅.
 *
 * - pointerDown → 타이머 시작
 * - pointerUp이 타이머보다 먼저 → onClick 호출 (단일 클릭)
 * - 타이머가 먼저 만료 → onLongPress 호출 (롱프레스)
 * - pointerLeave → 취소 (클릭/롱프레스 모두 발동하지 않음)
 */
export function useLongPress(
  onLongPress: () => void,
  options: {
    delay?: number;
    disabled?: boolean;
    onClick?: () => void;
    clickDisabled?: boolean;
  } = {},
) {
  const {
    delay = DEFAULT_DELAY,
    disabled = false,
    onClick,
    clickDisabled = false,
  } = options;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firedRef = useRef(false);
  const savedOnLongPress = useRef(onLongPress);
  savedOnLongPress.current = onLongPress;
  const savedOnClick = useRef(onClick);
  savedOnClick.current = onClick;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    firedRef.current = false;
    if (disabled) return;
    clearTimer();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      firedRef.current = true;
      savedOnLongPress.current();
    }, delay);
  }, [disabled, delay, clearTimer]);

  const end = useCallback(() => {
    clearTimer();
    // 롱프레스가 발동하지 않았으면 → 단일 클릭으로 처리
    if (!firedRef.current && !clickDisabled && savedOnClick.current) {
      savedOnClick.current();
    }
    firedRef.current = false;
  }, [clearTimer, clickDisabled]);

  const cancel = useCallback(() => {
    // pointerLeave: 드래그로 벗어남 → 클릭/롱프레스 모두 취소
    clearTimer();
    firedRef.current = false;
  }, [clearTimer]);

  return {
    onPointerDown: start,
    onPointerUp: end,
    onPointerLeave: cancel,
  };
}
