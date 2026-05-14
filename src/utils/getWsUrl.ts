export function getWsUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const wsBaseUrl = (import.meta.env.VITE_WS_URL ?? '').toString().trim().replace(/\/+$/, '');

  if (wsBaseUrl) {
    return `${wsBaseUrl}${normalizedPath}`;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}${normalizedPath}`;
}
