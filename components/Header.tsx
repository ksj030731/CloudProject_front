import React from 'react';
import { Button } from './ui/button';
import { User, Menu, X, LogOut } from 'lucide-react'; // LogOut 아이콘 추가
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
    // 마이페이지는 로그인했을 때만 메뉴에 표시
    { id: 'mypage', label: '마이페이지', show: !!currentUser },
    // 관리자 메뉴는 특정 이메일일 때만 표시
    { id: 'admin', label: '관리자', show: currentUser?.email === 'admin@galmaetgil.com' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onPageChange('home')}
          >
            <span className="font-bold text-2xl" style={{ color: '#E6007E' }}>부산</span>
            <span className="text-2xl font-bold text-gray-900">갈맷길</span>
          </div>

          {/* 데스크톱 내비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.filter(item => item.show).map(item => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id as any)}
                className={`${
                  currentPage === item.id
                    ? 'text-[#0067a3] font-bold border-b-2 border-[#0067a3]'
                    : 'text-gray-600 hover:text-[#0067a3] font-medium'
                } transition-all px-1 py-4 h-16 flex items-center`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* 사용자 영역 (로그인 상태에 따라 다르게 보임) */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              // ✨ [로그인 상태] 환영 메시지와 로그아웃 버튼
              <div className="flex items-center space-x-4 animate-in fade-in duration-300">
                <div 
                  className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onPageChange('mypage')} // 클릭 시 마이페이지로 이동
                >
                  <div className="w-8 h-8 bg-[#0067a3] rounded-full flex items-center justify-center text-white font-bold">
                    {currentUser.picture ? (
                       <img src={currentUser.picture} alt="profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                       <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-gray-700 font-medium">
                    <span className="text-[#0067a3] font-bold">{currentUser.nickname}</span>님 환영합니다!
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            ) : (
              // ✨ [비로그인 상태] 로그인/회원가입 버튼
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAuthClick('login')}
                  className="text-gray-600 hover:text-[#0067a3]"
                >
                  로그인
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAuthClick('signup')}
                  className="bg-[#0067a3] hover:bg-[#00558a]"
                >
                  회원가입
                </Button>
              </div>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* 모바일 메뉴 (드롭다운) */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top-5 duration-200">
            {currentUser && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#0067a3] rounded-full flex items-center justify-center text-white font-bold">
                  {currentUser.nickname.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{currentUser.nickname}님</p>
                  <p className="text-xs text-gray-500">오늘도 즐거운 갈맷길 되세요!</p>
                </div>
              </div>
            )}

            <nav className="flex flex-col space-y-1">
              {navItems.filter(item => item.show).map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-[#0067a3] font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 mt-2 border-t border-gray-100 px-4">
                {currentUser ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50"
                  >
                    로그아웃
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        onAuthClick('login');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      로그인
                    </Button>
                    <Button
                      className="bg-[#0067a3]"
                      onClick={() => {
                        onAuthClick('signup');
                        setIsMobileMenuOpen(false);
                      }}
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