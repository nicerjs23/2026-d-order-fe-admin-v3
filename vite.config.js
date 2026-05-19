import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl';
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // .env에서 VITE_BASE_URL을 읽어 로컬 개발용 proxy target으로 사용
    const env = loadEnv(mode, process.cwd(), '');
    const apiTarget = env.VITE_BASE_URL?.replace(/\/+$/, '') || 'https://prod.dorder-api.shop';
    return {
        plugins: [react(), basicSsl()],
        server: {
            port: 5173,
            proxy: {
                // 로컬에서 /api/v3/* 요청을 .env의 VITE_BASE_URL로 포워딩
                '/api/v3': {
                    target: apiTarget,
                    changeOrigin: true,
                    // 백엔드가 Set-Cookie: Domain=.dorder-api.shop으로 내려주는데
                    // localhost는 해당 도메인이 아니라 브라우저가 쿠키를 거부함.
                    // cookieDomainRewrite로 localhost가 쿠키를 수락하도록 도메인 재작성.
                    cookieDomainRewrite: { '.dorder-api.shop': 'localhost' },
                    // prod Django의 CSRF_TRUSTED_ORIGINS에 localhost가 없으므로
                    // Referer/Origin을 prod 도메인으로 덮어써서 403 방지
                    headers: { Referer: apiTarget, Origin: apiTarget },
                },
                // WebSocket proxy: wss://localhost:5173/ws/... → wss://prod.dorder-api.shop/ws/...
                // localhost 쿠키를 백엔드에 그대로 전달하기 위해 vite proxy 경유 필수
                '/ws': {
                    target: apiTarget,
                    changeOrigin: true,
                    ws: true,
                    cookieDomainRewrite: { '.dorder-api.shop': 'localhost' },
                    headers: { Referer: apiTarget, Origin: apiTarget },
                },
            },
        },
        resolve: {
            alias: {
                '@components': path.resolve(__dirname, 'src/components'),
                '@pages': path.resolve(__dirname, 'src/pages'),
                '@routes': path.resolve(__dirname, 'src/routes'),
                '@styles': path.resolve(__dirname, 'src/styles'),
                '@hooks': path.resolve(__dirname, 'src/hooks'),
                '@constants': path.resolve(__dirname, 'src/constants'),
                '@assets': path.resolve(__dirname, 'src/assets'),
                '@services': path.resolve(__dirname, 'src/services'),
                '@utils': path.resolve(__dirname, 'src/utils'),
            },
        },
    };
});
