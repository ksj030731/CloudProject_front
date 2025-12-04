import React, { useState, useEffect } from 'react';
// 1. (수정) 님의 구조에 맞는 올바른 경로입니다. (components/ui/...)
import { Button } from './ui/button'; 
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

/**
 * 소셜 로그인 신규 유저가 추가 정보를 입력하는 페이지 컴포넌트
 * * 1. 페이지 로드 시 URL에서 '임시 토큰(GUEST 토큰)'을 가져옵니다.
 * 2. 닉네임, 지역 등을 입력받는 폼을 보여줍니다.
 * 3. '가입 완료' 버튼을 누르면, 폼 데이터와 임시 토큰을 함께 Spring Boot API로 전송합니다.
 * 4. 서버가 "가입 완료(ROLE_USER)" 처리 후, '정식 토큰(USER 토큰)'을 반환합니다.
 * 5. 정식 토큰을 localStorage에 저장하고 메인 페이지로 이동합니다.
 */
export function RegisterSocial() {
  const [token, setToken] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [region, setRegion] = useState('');

  const regions = [
    '중구', '서구', '동구', '영도구', '부산진구', '동래구',
    '남구', '북구', '해운대구', '사하구', '금정구', '강서구',
    '연제구', '수영구', '사상구', '기장군'
  ];

  // useEffect: 컴포넌트가 처음 렌더링될 때 "단 한 번" 실행
  useEffect(() => {
    // 브라우저 URL의 쿼리 파라미터( ?token=... )를 파싱
    const tokenFromUrl = new URLSearchParams(window.location.search).get('token');

    if (tokenFromUrl) {
      setToken(tokenFromUrl); // GUEST 토큰을 상태에 저장
    } else {
      toast.error('잘못된 접근입니다. 다시 로그인해주세요.');
      setTimeout(() => { window.location.href = '/'; }, 1000);
    }
  }, []); // 1회만 실행

  
  // '가입 완료' 폼 제출(submit) 시 실행될 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 새로고침 방지

    if (!nickname || !region) {
      toast.error('모든 필드를 입력해주세요.');
      return;
    }

    if (!token) {
      toast.error('인증 토큰이 없습니다. 다시 시도해주세요.');
      return;
    }

    try {
      // Spring Boot API (e.g., /api/auth/register-social)로 폼 데이터를 전송
      const response = await fetch('/api/auth/register-social', {
        method: 'POST',
        // credentials: 'include', // 같은 도메인 취급이라 생략해도 되지만, 명시적으로 남겨두는 것도 좋습니다.
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': ... (세션 방식이라 필요 없음)
        },
        body: JSON.stringify({ nickname, region }) 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }

      // 서버가 성공적으로 응답한 경우 (e.g., 새 USER 토큰을 반환)
      const data = await response.json(); 
      const finalUserToken = data.token; // (서버가 "token"이라는 키로 반환한다고 가정)
      
      localStorage.setItem('authToken', finalUserToken); // "정식 토큰" 저장
      
      toast.success('회원가입이 완료되었습니다! 환영합니다!');

      // 1초 후에 React 앱의 메인 페이지(/)로 이동 (새로고침)
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  // 화면에 보여줄 UI (JSX)
  return (
    <div className="container mx-auto max-w-md p-8 min-h-screen flex items-center">
      <div className="w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <h1 className="text-center text-3xl font-bold">추가 정보 입력</h1>
          <p className="text-center text-gray-600 mt-2">
            갈맷길 서비스를 이용하기 위해 닉네임과 지역을 입력해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-base font-medium">닉네임</Label>
            <Input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="사용하실 닉네임을 입력하세요"
              required
              className="text-base p-4 h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region" className="text-base font-medium">거주 지역</Label>
            <Select value={region} onValueChange={setRegion} required>
              <SelectTrigger className="text-base h-12 p-4">
                <SelectValue placeholder="거주 지역을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(regionName => (
                  <SelectItem key={regionName} value={regionName} className="text-base">
                    {regionName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full text-lg p-6 h-14">
            가입 완료
          </Button>
        </form>
      </div>
    </div>
  );
}