import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import UserService from './UserService';
import { redirectToLoginPage } from '@utils/redirectToLoginPage';

// V3 인스턴스: 상대경로 baseURL → vite proxy(로컬) / netlify redirect(배포) 경유
export const instance: AxiosInstance = axios.create({
  baseURL: '/',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// V2 인스턴스: 절대경로 baseURL로 직접 요청 (v3 전환 완료 시 제거 예정)
export const instanceV2: AxiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_BASE_URL ?? '').replace(/\/+$/, ''),
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// V3 이미지 업로드 인스턴스
export const instatnceWithImg: AxiosInstance = axios.create({
  baseURL: '/',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 10000,
});

const isAuthEndpoint = (url?: string) =>
  url?.includes('/api/v2/manager/auth/') ||
  url?.includes('/api/v3/django/auth/');

const isCsrfTokenEndpoint = (url?: string) =>
  url?.includes('/api/v3/django/auth/csrf-token/');

/**
 * 로그인·회원가입 등 아직 로그인되지 않은 상태의 auth 요청.
 * 이 경로에서 오는 401은 "비밀번호 틀림" 등이므로 refresh/location.href 로그인 이동을 하면 안 됨.
 */
const isV3UnauthenticatedAuthRequest = (url?: string): boolean => {
  if (!url?.includes('/api/v3/django/auth/')) return false;
  if (url.includes('/refresh/')) return false;
  if (url.includes('/csrf-token')) return false;
  const path = url.split('?')[0].replace(/\/+$/, '');
  return path.endsWith('/django/auth') || path.endsWith('/signup');
};

const isUnsafeMethod = (method?: string) => {
  const m = (method || 'GET').toUpperCase();
  return !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(m);
};

const fetchCsrfToken = async (): Promise<string | null> => {
  const res = await instance.get('/api/v3/django/auth/csrf-token/');
  const token = res.data?.csrfToken;
  return typeof token === 'string' ? token : null;
};

// ============================================
// [V2] 요청 / 응답 인터셉터
// ============================================
instanceV2.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const isV2AuthEndpoint =
    config.url?.includes('/api/v2/manager/auth/') ||
    config.url?.includes('/api/v2/manager/signup/');
  if (token && !isV2AuthEndpoint) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

instanceV2.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      redirectToLoginPage();
    }
    return Promise.reject(error);
  }
);

// ============================================
// [V3] 공통 요청 인터셉터 (instance, instatnceWithImg)
// ============================================
const v3RequestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  const isV3Request = config.url?.includes('/api/v3/');

  // 🚨 [핵심 수정]: V3 API는 쿠키 기반이므로 Authorization 헤더를 절대 주입하지 않음!
  // (V2와 V3가 섞여 있으면, 헤더에 Bearer 토큰 주입)
  if (token && !isAuthEndpoint(config.url) && !isV3Request) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // V3 unsafe 메서드일 때 CSRF 토큰 주입
  if (isV3Request && isUnsafeMethod(config.method) && !isCsrfTokenEndpoint(config.url)) {
    let csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='))
      ?.split('=')[1];

    if (!csrfToken) {
      try {
        csrfToken = (await fetchCsrfToken()) ?? undefined;
      } catch (e) {
        console.error('CSRF 토큰 사전 발급 실패', e);
      }
    }

    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }

  return config;
};

instance.interceptors.request.use(v3RequestInterceptor, (error) => Promise.reject(error));
instatnceWithImg.interceptors.request.use(v3RequestInterceptor, (error) => Promise.reject(error));

// ============================================
// [V3] 공통 401, 403 에러 처리 로직
// ============================================
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string | null) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (token: string | null, error: AxiosError | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

const clearTokens = () => {
  localStorage.removeItem('accessToken');
};

const redirectToLogin = () => {
  redirectToLoginPage();
};

function shouldAttemptV3RefreshRetry(originalRequest: any): boolean {
  const url = originalRequest?.url as string | undefined;
  if (!url?.includes('/api/v3/')) return false;
  if (url.includes('/api/v3/django/auth/refresh/')) return false;
  if (isCsrfTokenEndpoint(url)) return false;
  if (originalRequest.__v3RefreshFallback) return false;
  return true;
}

async function v3RefreshFallbackRetry(
  error: AxiosError,
  originalRequest: any,
  client: AxiosInstance,
): Promise<AxiosResponse | false> {
  if (!shouldAttemptV3RefreshRetry(originalRequest)) return false;

  originalRequest.__v3RefreshFallback = true;

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: (_token: string | null) => {
          client(originalRequest)
            .then((res) => resolve(res))
            .catch(() => resolve(false));
        },
        reject,
      });
    });
  }

  isRefreshing = true;
  try {
    await UserService.refreshTokenV3();
    processQueue(null, null);
    return await client(originalRequest);
  } catch {
    processQueue(null, error as AxiosError);
    return false;
  } finally {
    isRefreshing = false;
  }
}

const v3ResponseErrorInterceptor = async (error: AxiosError, client: AxiosInstance) => {
  const originalRequest: any = error.config;

  if (
    (originalRequest.url?.includes('/api/v2/manager/auth/') ||
      originalRequest.url?.includes('/api/v3/django/auth/refresh/')) &&
    error.response?.status === 401
  ) {
    clearTokens();
    redirectToLogin();
    return Promise.reject(
      new Error('세션/토큰이 만료되었습니다. 다시 로그인해주세요.')
    );
  }

  if (
    error.response?.status === 401 &&
    isV3UnauthenticatedAuthRequest(originalRequest.url)
  ) {
    return Promise.reject(error);
  }

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string | null) => {
            // V3 API가 아니면 헤더에 토큰 다시 세팅
            if (token && !originalRequest.url?.includes('/api/v3/')) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            resolve(client(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const isV3Request = originalRequest.url?.includes('/api/v3/');

    try {
      if (isV3Request) {
        await UserService.refreshTokenV3();
        processQueue(null, null);
        return client(originalRequest);
      } else {
        const res = await instanceV2.get('/api/v2/manager/auth/');
        const newAccessToken = res.data?.data?.access;
        if (!newAccessToken) throw new Error('토큰이 응답에 없습니다.');

        localStorage.setItem('accessToken', newAccessToken);
        processQueue(newAccessToken, null);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return client(originalRequest);
      }
    } catch (err) {
      processQueue(null, err as AxiosError);
      clearTokens();
      redirectToLogin();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }

  if (
    error.response?.status === 403 &&
    !originalRequest._csrfRetry &&
    originalRequest.url?.includes('/api/v3/') &&
    !isCsrfTokenEndpoint(originalRequest.url)
  ) {
    originalRequest._csrfRetry = true;
    try {
      const csrfToken = await fetchCsrfToken();
      if (csrfToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers['X-CSRFToken'] = csrfToken;
      }
      return client(originalRequest);
    } catch {
      return Promise.reject(error);
    }
  }

  const v3Retried = await v3RefreshFallbackRetry(error, originalRequest, client);
  if (v3Retried !== false) return v3Retried;

  if (error.code === 'ECONNABORTED') {
    window.location.href = '/error';
  }

  return Promise.reject(error);
};

instance.interceptors.response.use((res) => res, (err) => v3ResponseErrorInterceptor(err, instance));
instatnceWithImg.interceptors.response.use((res) => res, (err) => v3ResponseErrorInterceptor(err, instatnceWithImg));