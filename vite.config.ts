import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 프록시 설정
    proxy: {
      // 1. 일반 API 요청 (기존 설정 유지)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // 2. 소셜 로그인 요청 (OAuth2) (기존 설정 유지)
      '/oauth2': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // 3. 로그인/로그아웃 관련 요청 (기존 설정 유지)
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    },
  },
})