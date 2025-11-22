import React from 'react';

/**
 * OAuth2 로그인 성공 후 리디렉션되는 콜백 페이지 컴포넌트 (기존 유저용)
 * * 이 컴포넌트의 유일한 역할은 사용자에게 "로그인 중"이라는 것을 알려주는 것입니다.
 * * 실제 토큰 추출 및 사용자 정보 로드 로직은
 * 이 컴포넌트를 호출한 부모 컴포넌트(App.tsx)의 useEffect에서 처리됩니다.
 */
export function AuthCallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">로그인 중입니다...</h1>
        <p className="text-gray-600 mt-2">잠시만 기다려주세요. 환영합니다!</p>
        <div className="mt-6 w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}