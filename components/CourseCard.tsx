import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Heart, MapPin, Clock, Users, CheckCircle, Share2 } from 'lucide-react';
import { Course, User } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface CourseCardProps {
  course: Course;
  isFavorited: boolean;
  isCompleted: boolean;
  onClick: () => void;
  onFavoriteClick: () => void;
  currentUser: User | null;
}

export function CourseCard({ 
  course, 
  isFavorited, 
  isCompleted, 
  onClick, 
  onFavoriteClick,
  currentUser 
}: CourseCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '하': return 'bg-green-100 text-green-700';
      case '중': return 'bg-yellow-100 text-yellow-700';
      case '상': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.name,
          text: course.description,
          url: window.location.href
        });
      } catch (err) {
        // 사용자가 공유를 취소했을 때는 에러 처리하지 않음
      }
    } else {
      // Web Share API를 지원하지 않는 브라우저에서는 클립보드에 복사
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('링크가 클립보드에 복사되었습니다!');
      } catch (err) {
        toast.error('링크 복사에 실패했습니다.');
      }
    }
  };

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
      {/* 완주 뱃지 */}
      {isCompleted && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-green-500 text-white rounded-full p-1.5 shadow-lg">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* 찜하기 버튼 */}
      <div className="absolute top-3 right-3 z-10 flex space-x-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleShare}
          className="bg-white/80 backdrop-blur-sm hover:bg-white p-2 h-auto"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        {currentUser && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onFavoriteClick();
            }}
            className="bg-white/80 backdrop-blur-sm hover:bg-white p-2 h-auto"
          >
            <Heart 
              className={`w-4 h-4 ${
                isFavorited 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600'
              }`} 
            />
          </Button>
        )}
      </div>

      <div onClick={onClick}>
        {/* 이미지 */}
        <div className="relative overflow-hidden">
          <ImageWithFallback
            src={course.image}
            alt={course.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* 제목과 기본 정보 */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-xl leading-tight group-hover:text-blue-600 transition-colors mb-2">
                {course.name}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium">{course.distance}km</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{course.duration}</span>
                </div>
                <Badge className={`text-xs ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span>{course.completedCount || 124}명</span>
                <Users className="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>

          {/* 지역 */}
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{course.region}</span>
          </div>

          {/* 설명 */}
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4">
            {course.description}
          </p>

          {/* 하이라이트 */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            {course.highlights.slice(0, 2).map((highlight, index) => (
              <span 
                key={index}
                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
              >
                {highlight}
              </span>
            ))}
            {course.highlights.length > 2 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                +{course.highlights.length - 2}개
              </span>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}