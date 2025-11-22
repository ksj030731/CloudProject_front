import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge as BadgeComponent } from './ui/badge';
import { Trophy, X, Sparkles } from 'lucide-react';
import { Badge } from '../types';

interface BadgeModalProps {
  isOpen: boolean;
  badge: Badge | null;
  onClose: () => void;
}

export function BadgeModal({ isOpen, badge, onClose }: BadgeModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlashEffect, setShowFlashEffect] = useState(false);

  useEffect(() => {
    if (isOpen && badge) {
      setShowConfetti(true);
      setShowFlashEffect(true);
      
      const confettiTimer = setTimeout(() => setShowConfetti(false), 3000);
      const flashTimer = setTimeout(() => setShowFlashEffect(false), 2000); // 2초 후 깜빡임 효과 제거
      
      return () => {
        clearTimeout(confettiTimer);
        clearTimeout(flashTimer);
      };
    }
  }, [isOpen, badge]);

  if (!badge) return null;

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getBadgeRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const getBadgeRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return '일반';
      case 'rare': return '희귀';
      case 'epic': return '영웅';
      case 'legendary': return '전설';
      default: return '일반';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>뱃지 획득</DialogTitle>
          <DialogDescription>새로운 뱃지를 획득했습니다</DialogDescription>
        </DialogHeader>
        {/* 배경 그라데이션 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getBadgeRarityColor(badge.rarity)} opacity-10`}></div>
        
        {/* 콘페티 효과 */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
            ))}
          </div>
        )}

        <div className="relative p-8 text-center space-y-6">
          {/* 닫기 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 p-2"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* 축하 메시지 */}
          <div className="space-y-2">
            <div className="flex justify-center">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">축하합니다!</h2>
            <p className="text-gray-600">새로운 뱃지를 획득했습니다</p>
          </div>

          {/* 뱃지 */}
          <div className={`relative mx-auto w-32 h-32 bg-white rounded-full border-4 ${getBadgeRarityBorder(badge.rarity)} shadow-lg flex items-center justify-center`}>
            {/* Ripple 효과 (2번) */}
            {showFlashEffect && (
              <div className={`absolute inset-0 rounded-full border-4 ${getBadgeRarityBorder(badge.rarity)} animate-ripple-twice`}></div>
            )}
            
            {/* 뱃지 아이콘 */}
            <span className="text-6xl relative z-10">{badge.icon}</span>
            
            {/* 등급 표시 */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <BadgeComponent 
                className={`${
                  badge.rarity === 'common' ? 'bg-gray-100 text-gray-700' :
                  badge.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                  badge.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                  'bg-yellow-100 text-yellow-700'
                } border-2 ${getBadgeRarityBorder(badge.rarity)}`}
              >
                {getBadgeRarityText(badge.rarity)}
              </BadgeComponent>
            </div>
          </div>

          {/* 뱃지 정보 */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">{badge.name}</h3>
            <p className="text-gray-600">{badge.description}</p>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-1">달성 조건</h4>
              <p className="text-sm text-gray-600">{badge.condition}</p>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="space-y-3">
            <Button onClick={onClose} className="w-full">
              확인
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                // 소셜 공유 기능 (데모용)
                if (navigator.share) {
                  navigator.share({
                    title: '갈맷길 뱃지 획득!',
                    text: `${badge.name} 뱃지를 획득했습니다! ${badge.description}`,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(`${badge.name} 뱃지를 획득했습니다! ${badge.description}`);
                }
              }}
            >
              친구들에게 자랑하기
            </Button>
          </div>

          {/* 뱃지 컬렉션 진행 상황 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">뱃지 컬렉션</span>
              <span className="text-sm text-blue-600">3/10</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              더 많은 갈맷길을 완주하고 뱃지를 수집하세요!
            </p>
          </div>
        </div>


      </DialogContent>
    </Dialog>
  );
}