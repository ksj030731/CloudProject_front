import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 프록시 설정: 프론트엔드(5173) -> 백엔드(8080) 연결 통로
    proxy: {
      // 1. 일반 API 요청
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // 2. 소셜 로그인 요청 (OAuth2)
      '/oauth2': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // 로그인/로그아웃 관련 요청
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    },
  },
})