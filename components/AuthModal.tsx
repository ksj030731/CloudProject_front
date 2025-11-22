import React, { useState } from 'react';
// 1. (수정) 님의 구조에 맞는 올바른 경로입니다. (components/ui/...)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

// 2. (수정) onSocialLogin 프롭을 "삭제"합니다. (오류 해결!)
interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
  onSubmit: (email: string, password: string, nickname?: string, region?: string) => void;
  // onSocialLogin: (provider: 'kakao' | 'naver') => void; // 👈 (삭제)
  onModeChange: (mode: 'login' | 'signup') => void;
}

export function AuthModal({ 
  isOpen, 
  mode, 
  onClose, 
  onSubmit, 
  // onSocialLogin, // 👈 (삭제)
  onModeChange 
}: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [region, setRegion] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const regions = [
    '중구', '서구', '동구', '영도구', '부산진구', '동래구',
    '남구', '북구', '해운대구', '사하구', '금정구', '강서구',
    '연제구', '수영구', '사상구', '기장군'
  ];

  // (수정 없음) resetForm, handleClose, handleSubmit, handleTabChange 함수는 그대로 둡니다.
  const resetForm = () => { /* ... (원본과 동일) ... */ };
  const handleClose = () => { /* ... (원본과 동일) ... */ };
  const handleSubmit = (e: React.FormEvent) => { /* ... (원본과 동일) ... */ };
  const handleTabChange = (value: string) => { /* ... (원본과 동일) ... */ };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* ... (수정 없음) ... */}
        </DialogHeader>

        <Tabs value={mode} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">로그인</TabsTrigger>
            <TabsTrigger value="signup">회원가입</TabsTrigger>
          </TabsList>

          {/* --- 로그인 탭 --- */}
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ... (이메일, 비밀번호 폼 - 수정 없음) ... */}
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>

            <div className="relative">
              {/* ... (또는 - 수정 없음) ... */}
            </div>

            {/* 3. (수정) 소셜 로그인: onClick 대신 <a> 태그 링크로 변경 */}
            <div className="space-y-2">
              <Button
                asChild // 👈 1. Button을 <a> 태그로 작동시킴
                variant="outline"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400"
                // onClick={() => onSocialLogin('kakao')} // 👈 2. onClick 삭제
              >
                {/* 3. Spring Boot 로그인 URL로 이동하는 <a> 태그 추가 */}
                {/* (주의!) <a> 태그에 w-full을 주어 버튼 전체가 클릭되도록 합니다. */}
                <a href="https://my-cloud-project2222.duckdns.org/oauth2/authorization/kakao" className="w-full flex items-center justify-center">
                  <span className="mr-2">💬</span>
                  카카오로 로그인
                </a>
              </Button>
              <Button
                asChild // 👈 1. Button을 <a> 태그로 작동시킴
                variant="outline"
                className="w-full bg-green-500 hover:bg-green-600 text-white border-green-500"
                // onClick={() => onSocialLogin('naver')} // 👈 2. onClick 삭제
            	>
               
                <a href="https://my-cloud-project2222.duckdns.org/oauth2/authorization/naver" className="w-full flex items-center justify-center">
                  <span className="mr-2">N</span>
                  네이버로 로그인
                </a>
              </Button>
            </div>
        	</TabsContent>


          {/* --- 회원가입 탭 --- */}
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ... (이메일, 닉네임, 지역, 비밀번호 폼 - 수정 없음) ... */}
              <Button type="submit" className="w-full">
                회원가입
              </Button>
            </form>

            <div className="relative">
           
            </div>

            {/* 4. (수정) 소셜 회원가입: onClick 대신 <a> 태그 링크로 변경 */}
            <div className="space-y-2">
              <Button
                asChild
                variant="outline"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400"
                // onClick={() => onSocialLogin('kakao')} // 👈 (삭제)
              >
                <a href="https://my-cloud-project2222.duckdns.org/oauth2/authorization/kakao" className="w-full flex items-center justify-center">
                  <span className="mr-2">💬</span>
                  카카오로 회원가입
                </a>
              </Button>
              <Button
                asChild
              	variant="outline"
                className="w-full bg-green-500 hover:bg-green-600 text-white border-green-500"
                // onClick={() => onSocialLogin('naver')} // 👈 (삭제)
              >
                <a href="https://my-cloud-project2222.duckdns.org/oauth2/authorization/naver" className="w-full flex items-center justify-center">
                  <span className="mr-2">N</span>
                  네이버로 회원가입
                </a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
  	</Dialog>
  );
}