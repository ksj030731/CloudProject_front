/// <reference types="vite/client" />
/// <reference types="navermaps" />

export {};

declare global {
  interface Window {
    Kakao: any; // ✨ 카카오 객체 인식용
  }
}