import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import UserService from './UserService';
import { redirectToLoginPage } from '@utils/redirectToLoginPage';

// V3 인스턴스: VITE_BASE_URL 설정 시 직접 CORS 요청, 미설정 시 vite proxy(로컬) / netlify redirect(배포) 경유
export const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '/',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// V3 이미지 업로드 인스턴스
export const instatnceWithImg: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '/',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 10000,
});

const isCsrfTokenEndpoint = (url?: string) =>
  url?.includes('/api/v3/django/auth/csrf-token/');

const isDjangoAuthEndpoint = (url?: string) =>
  url?.includes('/api/v3/django/auth/');

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

let inflightCsrfFetch: Promise<string | null> | null = null;

const fetchCsrfToken = (): Promise<string | null> => {
  if (inflightCsrfFetch) return inflightCsrfFetch;
  inflightCsrfFetch = instance
    .get('/api/v3/django/auth/csrf-token/')
    .then((res) => {
      const token = res.data?.csrfToken;
      return typeof token === 'string' ? token : null;
    })
    .finally(() => {
      inflightCsrfFetch = null;
    });
  return inflightCsrfFetch;
};

// ============================================
// [V3] 공통 요청 인터셉터 (instance, instatnceWithImg)
// ============================================
const v3RequestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const isV3Request = config.url?.includes('/api/v3/');

  // V3 unsafe 메서드일 때 CSRF 토큰 주입
  if (isV3Request && isUnsafeMethod(config.method) && !isCsrfTokenEndpoint(config.url) && !isDjangoAuthEndpoint(config.url)) {
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
    originalRequest.url?.includes('/api/v3/django/auth/refresh/') &&
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
          resolve: (_token: string | null) => {
            resolve(client(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await UserService.refreshTokenV3();
      processQueue(null, null);
      return client(originalRequest);
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
