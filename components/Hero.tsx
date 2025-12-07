// src/components/Hero.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowRight, MapPin, Clock, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
const busanImage = '/img/background.png';
import WeatherDisplay, { WeatherDetails } from './WeatherDisplay';

interface HeroProps {
  onAuthClick: (mode: 'login' | 'signup') => void;
}

export function Hero({ onAuthClick }: HeroProps) {
  // 1. WeatherDisplay로부터 받을 데이터를 저장할 State 정의
  const [weatherData, setWeatherData] = useState<{
    data: WeatherDetails | null,
    loading: boolean,
    error: string | null
  }>({
    data: null,
    loading: true,
    error: null,
  });

  // ✨ [추가] 방문자 수 State
  const [visitorCount, setVisitorCount] = useState<number>(0);

  // ✨ [추가] 방문자 수 가져오기
  useEffect(() => {
    // API 호출이 없으므로 axios import 필요하지만, Hero.tsx에는 axios가 없음.
    // fetch나 axios를 써야함. 상단에 import axios from 'axios'; 추가 필요.
    // 하지만 replace_file_content는 부분 수정임. 
    // 일단 fetch로 구현하거나, Hero.tsx 상단에 import를 추가해야 함.
    // 여기서는 fetch 사용 (dependency 최소화)
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('/api/visit/today');
        if (response.ok) {
          const count = await response.json();
          setVisitorCount(count);
        }
      } catch (error) {
        console.error("방문자 수 로딩 실패", error);
      }
    };
    fetchVisitorCount();
  }, []);

  // 2. 콜백 함수를 useCallback으로 감싸서 메모이제이션 (무한 루프 방지 핵심!)
  const handleWeatherUpdate = useCallback((data: WeatherDetails | null, loading: boolean, error: string | null) => {
    setWeatherData({ data, loading, error });
  }, []);

  // 3. 요약 칸에 표시될 텍스트 결정 (로딩/에러 상태 반영)
  const weatherSummaryText = weatherData.loading
    ? "날씨 로딩 중..."
    : weatherData.error
      ? "정보 오류 😥"
      : weatherData.data?.SUMMARY_TEXT || "정보 없음";


  return (
    <section className="relative py-20 min-h-[80vh] flex items-center">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${busanImage})` }}
      >
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 왼쪽 콘텐츠 (통계 및 CTA 버튼 영역) */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                부산 갈맷길과 함께하는
                <span className="text-blue-300 block">특별한 여행</span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed drop-shadow-md">
                부산의 아름다운 바다와 산, 문화를 걸으며 만나보세요.
                갈맷길의 다양한 코스가 여러분을 기다리고 있습니다.
              </p>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-white drop-shadow-md">9</div>
                <div className="text-sm text-white/80">개 코스</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white drop-shadow-md">278.8km</div>
                <div className="text-sm text-white/80">총 거리</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div className="2xl font-bold text-white drop-shadow-md">10만+</div>
                <div className="text-sm text-white/80">참여자</div>
              </div>
            </div>

            {/* CTA 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                갈맷길 시작하기
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onAuthClick('signup')}
              >
                회원가입하고 기록 남기기
              </Button>
            </div>
          </div>

          {/* 오른쪽 정보 카드 */}
          <div className="relative lg:flex lg:justify-end">
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="font-bold text-white mb-4 text-xl drop-shadow-md">실시간 갈맷길 현황</h3>

              {/* 🌟 4개의 요약 칸 (원본 레이아웃 유지) */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80 block">오늘의 걷기</span>
                  <span className="font-bold text-white text-lg drop-shadow-md">
                    {visitorCount.toLocaleString()}명
                  </span>
                </div>
                <div className="p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80 block">인기 코스</span>
                  <span className="font-bold text-white text-lg drop-shadow-md">1코스</span>
                </div>

                {/* 🌟 날씨 요약 칸: API 데이터 연동 */}
                <div className="p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80 block">날씨</span>
                  <span className="font-bold text-white text-lg drop-shadow-md">{weatherSummaryText}</span>
                </div>

                <div className="p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80 block">추천도</span>
                  <span className="font-bold text-white text-lg drop-shadow-md">⭐ 4.8/5.0</span>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* 🌟 WeatherDisplay (세부 정보 영역)에 콜백 함수 전달 */}
              <WeatherDisplay onDataFetched={handleWeatherUpdate} />
              {/* ---------------------------------------------------- */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}