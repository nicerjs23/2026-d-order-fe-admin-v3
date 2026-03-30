import { ROUTE_PATHS } from '@constants/routeConstants';

/**
 * 로그인 페이지로 이동. 이미 `/login`에 있으면 리로드/이동하지 않음.
 */
export function redirectToLoginPage(): void {
  const raw = window.location.pathname || '/';
  const path = raw.replace(/\/+$/, '') || '/';
  const login = ROUTE_PATHS.LOGIN;
  if (path === login || path.endsWith(login)) {
    return;
  }
  window.location.href = login;
}
