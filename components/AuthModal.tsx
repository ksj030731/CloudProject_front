import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

// 이렇게 수정하세요!
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
  onLoginSuccess: () => void; // 로그인 성공 시 호출할 부모 함수
  onModeChange: (mode: 'login' | 'signup') => void;
}

export function AuthModal({ 
  isOpen, 
  mode, 
  onClose, 
  onLoginSuccess, 
  onModeChange 
}: AuthModalProps) {
  // 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [region, setRegion] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const regions = [
    '중구', '서구', '동구', '영도구', '부산진구', '동래구',
    '남구', '북구', '해운대구', '사하구', '금정구', '강서구',
    '연제구', '수영구', '사상구', '기장군'
  ];

  // 폼 초기화
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNickname('');
    setRegion('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // --- [핵심] 1. 로그인 처리 함수 ---
  const handleLogin = async () => {
    setIsLoading(true);
    try {
       const response = await fetch('/api/auth/login', {
        method: 'POST',
        
        // 👇 [중요] 이 줄을 추가해야 브라우저가 세션 쿠키를 저장합니다!
        credentials: 'include', 
        
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: email, 
          password: password 
        }),
      });

      if (response.ok) {
        const token = await response.text(); 
        localStorage.setItem('authToken', token);
        toast.success('로그인되었습니다!');
        onLoginSuccess(); // 부모 컴포넌트에 성공 알림 (유저 정보 갱신 등)
        handleClose();    // 모달 닫기
      } else {
        // 실패 시 메시지 출력
        const message = await response.text(); // 백엔드에서 보낸 에러 메시지
        toast.error(`로그인 실패: ${message}`);
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- [핵심] 2. 회원가입 처리 함수 ---
  const handleSignup = async () => {
    // 유효성 검사
    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!nickname || !region) {
      toast.error('닉네임과 지역을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: password,
          email: email,
          nickname: nickname,
          region: region
        }),
      });

      if (response.ok) {
        toast.success('회원가입 성공! 이제 로그인해주세요.');
        onModeChange('login'); // 로그인 탭으로 자동 이동
        resetForm(); // 입력창 비우기
      } else {
        const message = await response.text();
        toast.error(`회원가입 실패: ${message}`);
      }
    } catch (error) {
      console.error('Signup Error:', error);
      toast.error('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    onModeChange(value as 'login' | 'signup');
  };

  // 소셜 로그인 버튼 (재사용)
  const SocialLoginButtons = () => (
    <div className="space-y-2">
      {/* 카카오 */}
      <Button asChild variant="outline" className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black border-none h-10">
        <a href={`${BASE_URL}/oauth2/authorization/kakao`} className="flex items-center justify-center w-full">
          <span className="mr-2 text-lg">💬</span> 카카오로 시작하기
        </a>
      </Button>
      {/* 네이버 */}
      <Button asChild variant="outline" className="w-full bg-[#03C75A] hover:bg-[#03C75A]/90 text-white border-none h-10">
        <a href={`${BASE_URL}/oauth2/authorization/naver`} className="flex items-center justify-center w-full">
          <span className="mr-2 font-bold text-lg">N</span> 네이버로 시작하기
        </a>
      </Button>
      {/* 구글 */}
      <Button asChild variant="outline" className="w-full bg-white hover:bg-gray-50 text-black border border-gray-300 h-10">
        <a href={`${BASE_URL}/oauth2/authorization/google`} className="flex items-center justify-center w-full">
          <span className="mr-2 font-bold text-lg">G</span> 구글로 시작하기
        </a>
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {mode === 'login' ? '로그인' : '회원가입'}
          </DialogTitle>
          <DialogDescription className="text-center">
            부산 갈맷길 커뮤니티에 오신 것을 환영합니다.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">로그인</TabsTrigger>
            <TabsTrigger value="signup">회원가입</TabsTrigger>
          </TabsList>

          {/* --- 로그인 탭 --- */}
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">이메일</Label>
                <Input 
                  id="login-email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">비밀번호</Label>
                <div className="relative">
                  <Input 
                    id="login-password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-10" disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  또는 소셜 로그인
                </span>
              </div>
            </div>

            <SocialLoginButtons />
          </TabsContent>

          {/* --- 회원가입 탭 --- */}
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">이메일</Label>
                <Input 
                  id="signup-email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input 
                  id="nickname" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">거주 지역</Label>
                <Select onValueChange={setRegion} value={region}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="지역 선택" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {regions.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">비밀번호</Label>
                <div className="relative">
                  <Input 
                    id="signup-password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">비밀번호 확인</Label>
                <div className="relative">
                  <Input 
                    id="confirm-password" 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                   <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-10" disabled={isLoading}>
                {isLoading ? '가입 처리 중...' : '회원가입'}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  소셜 계정으로 가입
                </span>
              </div>
            </div>

            <SocialLoginButtons />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}