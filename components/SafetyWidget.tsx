import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  AlertTriangle, Phone, Volume2, VolumeX, X, MessageCircle, CheckCircle, Car 
} from 'lucide-react';
import { toast } from 'sonner';

interface SafetyWidgetProps {
  guardianPhone?: string; // 보호자 전화번호 (없으면 119로 설정 가능)
  currentLocation?: { lat: number; lng: number }; // 현재 위치 (App.tsx에서 넘겨줌)
}

export function SafetyWidget({ guardianPhone = "119", currentLocation }: SafetyWidgetProps) {
  const [isOpen, setIsOpen] = useState(false); // 위젯 펼침 여부
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false); // 메시지 템플릿 모달
  
  // 1. 사이렌 소리 설정 (public/siren.mp3 파일이 필요합니다!)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/siren.mp3'); // mp3 파일 경로 확인 필요
    audioRef.current.loop = true; // 반복 재생
  }, []);

  const toggleSiren = () => {
    if (!audioRef.current) return;
    
    if (isSirenPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current.play().catch(e => console.error("오디오 재생 실패:", e));
    }
    setIsSirenPlaying(!isSirenPlaying);
  };

  // 2. 위치 링크 생성
  const getLocationLink = () => {
    // 위치 정보가 없으면 기본값 혹은 텍스트만 전송
    if (!currentLocation) return "위치 정보 없음";
    return `https://map.kakao.com/link/map/${currentLocation.lat},${currentLocation.lng}`;
  };

  // 3. 문자 전송 함수 (SMS Scheme)
  const sendSMS = (message: string) => {
    if (!guardianPhone) {
      toast.error("보호자 번호가 설정되지 않았습니다.");
      return;
    }
    const fullMessage = `${message} \n위치: ${getLocationLink()}`;
    // 모바일 기본 문자 앱 실행
    window.location.href = `sms:${guardianPhone}${navigator.userAgent.includes('iPhone') ? '&' : '?'}body=${encodeURIComponent(fullMessage)}`;
  };

  // 4. '3초 누르기' 로직
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const startPress = () => {
    setIsPressing(true);
    timerRef.current = setTimeout(() => {
      // 3초 후 실행될 동작 -> 긴급 메시지 바로 전송
      sendSMS("[SOS] 긴급 상황입니다! 도와주세요!");
      setIsPressing(false); // 초기화
    }, 3000);
  };

  const cancelPress = () => {
    setIsPressing(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3">
      
      {/* 펼쳐진 메뉴들 */}
      {isOpen && (
        <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-5 duration-200">
          
          {/* A. 사이렌 버튼 */}
          <Button 
            onClick={toggleSiren}
            className={`rounded-full w-12 h-12 shadow-lg ${isSirenPlaying ? 'bg-red-600 animate-pulse' : 'bg-gray-700'}`}
            title="사이렌"
          >
            {isSirenPlaying ? <VolumeX className="text-white" /> : <Volume2 className="text-white" />}
          </Button>

          {/* B. 안심 문자 (템플릿 선택) 버튼 */}
          <div className="relative">
            <Button 
              onClick={() => setShowTemplates(!showTemplates)}
              className="rounded-full w-12 h-12 bg-green-600 hover:bg-green-700 shadow-lg"
              title="안심 문자"
            >
              <MessageCircle className="text-white" />
            </Button>

            {/* 템플릿 선택 팝업 (왼쪽에 뜸) */}
            {showTemplates && (
              <div className="absolute right-14 top-0 bg-white rounded-lg shadow-xl p-2 w-48 border border-gray-200 flex flex-col gap-1">
                 <button 
                  onClick={() => sendSMS("나 걷기 끝났어. 데리러 와줘!")}
                  className="text-left px-3 py-2 hover:bg-yellow-50 rounded text-sm flex items-center gap-2"
                >
                  <Car className="w-4 h-4 text-yellow-600"/> 픽업 요청
                </button>
                <button 
                  onClick={() => sendSMS("나 여기 잘 도착했어. 걱정 마!")}
                  className="text-left px-3 py-2 hover:bg-green-50 rounded text-sm flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-600"/> 안심 알림
                </button>
              </div>
            )}
          </div>

          {/* C. 3초 누르기 SOS 버튼 (핵심) */}
          <div className="relative">
            <button
              className="relative w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg active:scale-95 transition-transform overflow-hidden"
              onMouseDown={startPress}
              onMouseUp={cancelPress}
              onMouseLeave={cancelPress}
              onTouchStart={startPress}
              onTouchEnd={cancelPress}
            >
              <AlertTriangle className="w-8 h-8 text-white z-10" />
              
              {/* 원형 게이지 애니메이션 (SVG) */}
              {isPressing && (
                <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                  <circle
                    cx="32" cy="32" r="30"
                    fill="none"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="60" 
                    strokeDasharray="188.4" /* 2 * pi * r (r=30) ≈ 188.4 */
                    strokeDashoffset="188.4"
                    className="animate-sos-circle" 
                    /* globals.css에 애니메이션 정의 필요 */
                    style={{ animation: 'sos-progress 3s linear forwards' }}
                  />
                </svg>
              )}
            </button>
             {isPressing && <span className="absolute right-18 top-4 text-red-600 font-bold whitespace-nowrap bg-white px-2 py-1 rounded shadow">3초간 누르세요!</span>}
          </div>
        </div>
      )}

      {/* 메인 토글 버튼 (플러스/X 버튼) */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-xl transition-all duration-300 ${isOpen ? 'bg-gray-500 rotate-45' : 'bg-red-500 hover:bg-red-600'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
      </Button>
    </div>
  );
}