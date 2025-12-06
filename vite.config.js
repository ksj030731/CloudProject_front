// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        // ⭐️ 포트 8080으로 프록시 설정
        proxy: {
            // '/api'로 시작하는 요청을 8080 포트의 백엔드로 전달
            '/api': {
                target: `http://localhost:8080`,
                changeOrigin: true, // CORS 문제 방지
            }
        }
    }
});