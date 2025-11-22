import React from 'react';
import { Button } from './ui/button';
import { User, Menu, X } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  currentUser: UserType | null;
  currentPage: string;
  onPageChange: (page: 'home' | 'courses' | 'map' | 'about' | 'community' | 'mypage' | 'admin') => void;
  onAuthClick: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
}

export function Header({ currentUser, currentPage, onPageChange, onAuthClick, onLogout }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: '홈', show: true },
    { id: 'courses', label: '코스', show: true },
    { id: 'map', label: '지도', show: true },
    { id: 'about', label: '갈맷길 소개', show: true },
    { id: 'community', label: '커뮤니티', show: true },
    { id: 'mypage', label: '마이페이지', show: !!currentUser },
    { id: 'admin', label: '관리자', show: currentUser?.email === 'admin@galmaetgil.com' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onPageChange('home')}
          >
            <span className="font-bold text-xl" style={{ color: '#E6007E' }}>부산</span>
            <span className="text-xl font-bold text-gray-900">갈맷길</span>
          </div>

          {/* 데스크톱 내비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.filter(item => item.show).map(item => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id as any)}
                className={`${
                  currentPage === item.id
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-700 hover:text-blue-600'
                } transition-colors`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* 사용자 영역 */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{currentUser.nickname}님</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                >
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAuthClick('login')}
                >
                  로그인
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAuthClick('signup')}
                >
                  회원가입
                </Button>
              </div>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              {navItems.filter(item => item.show).map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 ${
                    currentPage === item.id
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-3 border-t border-gray-200">
                {currentUser ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{currentUser.nickname}님</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="justify-start w-full"
                    >
                      로그아웃
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onAuthClick('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="justify-start w-full"
                    >
                      로그인
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        onAuthClick('signup');
                        setIsMobileMenuOpen(false);
                      }}
                      className="justify-start w-full"
                    >
                      회원가입
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}