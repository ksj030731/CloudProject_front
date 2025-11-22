import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, MapPin, Clock, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import busanImage from '../img/background.png';

interface HeroProps {
  onAuthClick: (mode: 'login' | 'signup') => void;
}

export function Hero({ onAuthClick }: HeroProps) {
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
          {/* 왼쪽 콘텐츠 */}
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
                <div className="text-2xl font-bold text-white drop-shadow-md">10만+</div>
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
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80 block">오늘의 걷기</span>
                  <span className="font-bold text-white text-lg drop-shadow-md">1,247명</span>
                </div>
                <div className="p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80 block">인기 코스</span>
                  <span className="font-bold text-white text-lg drop-shadow-md">1코스</span>
                </div>
                <div className="p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80 block">날씨</span>
                  <span className="font-bold text-white text-lg drop-shadow-md">맑음 18°C</span>
                </div>
                <div className="p-3 bg-white/10 rounded-lg">
                  <span className="text-white/80 block">추천도</span>
                  <span className="font-bold text-white text-lg drop-shadow-md">⭐ 4.8/5.0</span>
                </div>
              </div>
              
              {/* 추가 정보 */}
              <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-sm">현재 해운대 날씨</span>
                  <span className="text-white font-medium">🌤️ 구름 조금</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white/90 text-sm">바람</span>
                  <span className="text-white font-medium">남서풍 2m/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}