// src/components/Header/hooks/useBoothRevenue.ts

import { useState, useEffect, useRef, useCallback } from 'react';
import BoothService from '@services/BoothService';
import { getWsUrl } from '@utils/getWsUrl';

const WS_PATH = '/ws/django/booth/sales/';

function getSalesWsUrl(): string {
  return getWsUrl(WS_PATH);
}

// close code 정의 (명세 기준)
const CLOSE_CODE_AUTH_ERROR = 4001; // 인증 실패 — 재연결 불가
const CLOSE_CODE_PERMISSION_DENIED = 4003; // 부스 없는 계정 — 재연결 불가

const useBoothRevenue = () => {
  const [boothName, setBoothName] = useState<string>('부스 로딩 중...');
  const [totalRevenues, setTotalRevenues] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<number | null>(null);

  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const shouldReconnect = () =>
    document.visibilityState === 'visible' && navigator.onLine;

  const closeSocket = useCallback(() => {
    clearRetryTimer();
    const ws = wsRef.current;
    if (
      ws &&
      (ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING)
    ) {
      try {
        ws.close();
      } catch {}
    }
    wsRef.current = null;
  }, []);

  const connect = useCallback(() => {
    // V3: 쿠키 기반 인증 — accessToken 불필요
    const wsUrl = getSalesWsUrl();
    if (!wsUrl) {
      setError(
        'WebSocket URL을 구성할 수 없습니다. VITE_BASE_URL을 확인해주세요.',
      );
      return;
    }
    if (!shouldReconnect()) return;

    const curr = wsRef.current;
    if (
      curr &&
      (curr.readyState === WebSocket.OPEN ||
        curr.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    // 브라우저가 same-site 쿠키를 자동으로 포함해 전송함
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setError(null);
      /* console.info('[총매출 WS] 웹소켓 연결 성공:', wsUrl); */
      retryCountRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        /* console.log(' [총매출 WS] 메시지 전체 수신:', message); */
        // V3 이벤트 타입: TOTAL_SALES_SNAPSHOT(연결 직후 스냅샷), TOTAL_SALES_UPDATE(이후 갱신)
        if (
          message?.type === 'TOTAL_SALES_SNAPSHOT' ||
          message?.type === 'TOTAL_SALES_UPDATE'
        ) {
          // V3 payload 구조: { type, timestamp, data: { today_revenue } }
          const next = Number(message.data?.today_revenue) || 0;
          /* console.log(`[총매출 WS] 매출 업데이트: ${next.toLocaleString()}원`); */
          setTotalRevenues(next);
        }

        if (message?.type === 'error') {
          /* console.error('🔴 [SALES WS] 서버 에러:', message.message); */
        }
      } catch (e) {
        /* console.error('🔴 [SALES WS] 메시지 파싱 오류:', e); */
      }
    };

    ws.onerror = () => {
      setError('매출 실시간 업데이트 중 오류가 발생했습니다.');
    };

    ws.onclose = (event) => {
      // 4001: 인증 실패 — 쿠키 만료 등. 재연결해도 의미 없음
      if (event.code === CLOSE_CODE_AUTH_ERROR) {
        setError('인증이 만료되었습니다. 다시 로그인해주세요.');
        return;
      }
      // 4003: 부스 없는 계정 — 권한 문제. 재연결 불가
      if (event.code === CLOSE_CODE_PERMISSION_DENIED) {
        setError('부스 정보가 없는 계정입니다.');
        return;
      }
      // 그 외(SERVER_ERROR 등): 지수 백오프 재연결 (1s → 15s)
      if (shouldReconnect()) {
        const delay = Math.min(1000 * 2 ** retryCountRef.current, 15000);
        retryCountRef.current += 1;
        clearRetryTimer();
        retryTimerRef.current = window.setTimeout(() => {
          connect();
        }, delay) as unknown as number;
      }
    };
  }, []);

  // 부스명 조회 (기존 유지 — BoothService 변경 없음)
  useEffect(() => {
    let aborted = false;

    const fetchBoothName = async () => {
      try {
        const response = await BoothService.getBoothName();
        if (aborted) return;
        if (response?.data?.booth_name) {
          setError(null);
          setBoothName(response.data.booth_name);
        } else {
          setError(response?.message ?? '부스 정보를 가져오지 못했습니다.');
        }
      } catch {
        if (!aborted) setError('부스 정보를 가져오지 못했습니다.');
      }
    };

    fetchBoothName();

    const handleVisible = () => {
      if (document.visibilityState === 'visible') {
        fetchBoothName();
      }
    };
    document.addEventListener('visibilitychange', handleVisible);

    return () => {
      aborted = true;
      document.removeEventListener('visibilitychange', handleVisible);
    };
  }, []);

  // WebSocket 연결 및 네트워크/탭 전환 처리
  useEffect(() => {
    connect();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        connect();
      } else {
        closeSocket();
      }
    };
    const handleOnline = () => connect();
    const handleOffline = () => closeSocket();

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearRetryTimer();
      closeSocket();
    };
  }, [connect, closeSocket]);

  return { boothName, totalRevenues, error };
};

export default useBoothRevenue;
