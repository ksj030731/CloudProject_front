import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Heart, MapPin, Share2, QrCode, MessageCircle, ThumbsUp, CheckCircle, Car, Camera, Route, Star 
} from 'lucide-react';
import { Course, Review, User } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface CourseDetailProps {
  course: Course;
  reviews: Review[];
  isFavorited: boolean;
  isCompleted: boolean;
  currentUser: User | null;
  onClose: () => void;
  onFavoriteClick: () => void;
  onReviewClick: () => void;
  onQRScanClick: () => void;
}

export function CourseDetail({
  course,
  reviews,
  isFavorited,
  isCompleted,
  currentUser,
  onClose,
  onFavoriteClick,
  onReviewClick,
  onQRScanClick
}: CourseDetailProps) {

  // ✨ [핵심 수정] DB 데이터와 Mock 데이터 구조 차이를 해결하는 로직
  // DB에는 'route' 객체가 없고 'sections' 배열이 있습니다.
  
  // 1. sections 데이터가 있는지 확인
  const hasSections = course.sections && course.sections.length > 0;
  
  // 2. 출발지/도착지 계산 (route가 있으면 쓰고, 없으면 sections의 처음과 끝을 사용)
  // @ts-ignore (타입 호환성 문제 방지)
  const startPoint = course.route?.start || (hasSections ? course.sections[0].startPoint : "출발지 정보 없음");
  // @ts-ignore
  const endPoint = course.route?.end || (hasSections ? course.sections[course.sections.length - 1].endPoint : "도착지 정보 없음");
  
  // 3. 경유지(Checkpoints) 계산
  // @ts-ignore
  const allCheckpoints = course.route?.checkpoints || 
    (hasSections ? course.sections.flatMap(s => s.checkpoints) : []);


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '하': return 'bg-green-100 text-green-700';
      case '중': return 'bg-yellow-100 text-yellow-700';
      case '상': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const handleShare = async () => {
     if (navigator.share) {
      try {
        await navigator.share({
          title: course.name,
          text: course.description,
          url: window.location.href
        });
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('링크가 복사되었습니다!');
      } catch (err) {
        toast.error('링크 복사 실패');
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{course.name} 상세정보</DialogTitle>
          <DialogDescription className="sr-only">상세 정보 확인</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 헤더 이미지 영역 */}
          <div className="relative rounded-lg overflow-hidden">
             <ImageWithFallback src={course.image} alt={course.name} className="w-full h-64 object-cover" />
             {isCompleted && (
              <div className="absolute top-4 left-4">
                <div className="bg-green-500 text-white rounded-full px-3 py-1.5 flex items-center space-x-1 shadow-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">완주</span>
                </div>
              </div>
            )}
             <div className="absolute top-4 right-4 flex space-x-2">
              <Button variant="secondary" size="sm" onClick={handleShare} className="bg-white/80 backdrop-blur-sm hover:bg-white">
                <Share2 className="w-4 h-4 mr-2" /> 공유
              </Button>
              {currentUser && (
                <Button variant="secondary" size="sm" onClick={onFavoriteClick} className="bg-white/80 backdrop-blur-sm hover:bg-white">
                  <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  {isFavorited ? '찜 해제' : '찜하기'}
                </Button>
              )}
            </div>
          </div>

          {/* 코스 기본 정보 */}
          <div className="space-y-4">
             <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{course.name}</h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{course.region}</span>
                </div>
              </div>
              {reviews.length > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="flex">{renderStars(Math.round(averageRating))}</div>
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-500">({reviews.length})</span>
                </div>
              )}
            </div>
             <p className="text-gray-700 leading-relaxed">{course.description}</p>
             
             {/* 통계 그리드 */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{course.distance}km</div>
                <div className="text-sm text-gray-600">거리</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{course.duration}</div>
                <div className="text-sm text-gray-600">소요시간</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Badge className={`text-sm ${getDifficultyColor(course.difficulty)}`}>{course.difficulty}</Badge>
                <div className="text-sm text-gray-600 mt-1">난이도</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{course.completedCount || 0}</div>
                <div className="text-sm text-gray-600">완주자</div>
              </div>
            </div>
          </div>

          {/* ✨ [수정됨] 구간별 정보 (핵심 수정 부분) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Route className="w-5 h-5 mr-2" />
                구간별 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasSections ? (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-auto mb-4" style={{gridTemplateColumns: `repeat(${course.sections.length + 1}, 1fr)`}}>
                    <TabsTrigger value="overview">전체</TabsTrigger>
                    {course.sections.map((section, idx) => (
                      <TabsTrigger key={idx} value={section.sectionCode || String(idx)}>
                        {section.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* 전체 탭 */}
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-1">출발지</h4>
                        <p className="text-gray-700">{startPoint}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-1">도착지</h4>
                        <p className="text-gray-700">{endPoint}</p>
                      </div>
                    </div>
                    
                    {allCheckpoints.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">주요 경유지</h4>
                        <div className="flex flex-wrap gap-2">
                          {/* 경유지가 많으면 앞 8개만 보여줌 */}
                          {allCheckpoints.slice(0, 8).map((checkpoint: string, index: number) => (
                            <Badge key={index} variant="outline">{checkpoint}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center"><Car className="w-4 h-4 mr-1" /> 교통편</h4>
                      <p className="text-gray-700">{course.transportation}</p>
                    </div>
                  </TabsContent>

                  {/* 개별 섹션 탭 */}
                  {course.sections.map((section, idx) => (
                    <TabsContent key={idx} value={section.sectionCode || String(idx)} className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{section.distance}km</div>
                          <div className="text-xs text-gray-600">거리</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{section.duration}</div>
                          <div className="text-xs text-gray-600">소요시간</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <Badge className={`text-xs ${getDifficultyColor(section.difficulty)}`}>{section.difficulty}</Badge>
                          <div className="text-xs text-gray-600 mt-1">난이도</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-green-600 mb-1">출발지</h4>
                          {/* DB 필드명: startPoint */}
                          <p className="text-gray-700">{section.startPoint}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-600 mb-1">도착지</h4>
                          {/* DB 필드명: endPoint */}
                          <p className="text-gray-700">{section.endPoint}</p>
                        </div>
                      </div>
                      
                      {section.checkpoints && (
                        <div>
                          <h4 className="font-medium mb-2">구간 경유지</h4>
                          <div className="flex flex-wrap gap-2">
                            {section.checkpoints.map((cp, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{cp}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t border-gray-100">
                        <Button onClick={onQRScanClick} className="w-full bg-blue-500 hover:bg-blue-600">
                          <QrCode className="w-4 h-4 mr-2" />
                          {section.name} QR 인증하기
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  구간 상세 정보가 아직 등록되지 않았습니다.
                </div>
              )}
            </CardContent>
          </Card>

          {/* ... 편의시설, 하이라이트, 리뷰 등 나머지 카드들은 course 객체의 1차원 데이터라 문제 없음 ... */}
          {/* (코드 생략 - 기존 파일 내용 유지) */}
          
        </div>
      </DialogContent>
    </Dialog>
  );
}