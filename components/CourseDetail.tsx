import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Heart, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Share2, 
  QrCode,
  MessageCircle,
  ThumbsUp,
  CheckCircle,
  Car,
  Camera,
  Navigation,
  Route
} from 'lucide-react';
import { Course, Review, User, CourseSection } from '../types';
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
      } catch (err) {
        // 사용자가 공유를 취소했을 때는 에러 처리하지 않음
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('링크가 클립보드에 복사되었습니다!');
      } catch (err) {
        toast.error('링크 복사에 실패했습니다.');
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{course.name} 상세정보</DialogTitle>
          <DialogDescription className="sr-only">
            {course.name}의 상세 정보, 경로, 편의시설 및 리뷰를 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 헤더 이미지 */}
          <div className="relative rounded-lg overflow-hidden">
            <ImageWithFallback
              src={course.image}
              alt={course.name}
              className="w-full h-64 object-cover"
            />
            {isCompleted && (
              <div className="absolute top-4 left-4">
                <div className="bg-green-500 text-white rounded-full px-3 py-1.5 flex items-center space-x-1 shadow-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">완주</span>
                </div>
              </div>
            )}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShare}
                className="bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
              {currentUser && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onFavoriteClick}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <Heart 
                    className={`w-4 h-4 mr-2 ${
                      isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`} 
                  />
                  {isFavorited ? '찜 해제' : '찜하기'}
                </Button>
              )}
            </div>
          </div>

          {/* 코스 정보 */}
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

            {/* 기본 정보 */}
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
                <Badge className={`text-sm ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </Badge>
                <div className="text-sm text-gray-600 mt-1">난이도</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">124</div>
                <div className="text-sm text-gray-600">완주자</div>
              </div>
            </div>
          </div>

          {/* 구간별 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Route className="w-5 h-5 mr-2" />
                구간별 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-auto mb-4" style={{gridTemplateColumns: `repeat(${course.sections.length + 1}, 1fr)`}}>
                  <TabsTrigger value="overview">전체</TabsTrigger>
                  {course.sections.map((section) => (
                    <TabsTrigger key={section.id} value={section.id}>
                      {section.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* 전체 코스 정보 */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-600 mb-1">출발지</h4>
                      <p className="text-gray-700">{course.route.start}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-600 mb-1">도착지</h4>
                      <p className="text-gray-700">{course.route.end}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">주요 경유지</h4>
                    <div className="flex flex-wrap gap-2">
                      {course.route.checkpoints.map((checkpoint, index) => (
                        <Badge key={index} variant="outline">
                          {checkpoint}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Car className="w-4 h-4 mr-1" />
                      교통편
                    </h4>
                    <p className="text-gray-700">{course.transportation}</p>
                  </div>
                </TabsContent>

                {/* 각 구간별 정보 */}
                {course.sections.map((section) => (
                  <TabsContent key={section.id} value={section.id} className="space-y-4">
                    {/* 구간 기본 정보 */}
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
                        <Badge className={`text-xs ${getDifficultyColor(section.difficulty)}`}>
                          {section.difficulty}
                        </Badge>
                        <div className="text-xs text-gray-600 mt-1">난이도</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{Math.floor(Math.random() * 50) + 20}</div>
                        <div className="text-xs text-gray-600">완주자</div>
                      </div>
                    </div>

                    {/* 구간 경로 정보 */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-1">출발지</h4>
                        <p className="text-gray-700">{section.start}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-1">도착지</h4>
                        <p className="text-gray-700">{section.end}</p>
                      </div>
                    </div>
                    
                    {section.checkpoints.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">주요 경유지</h4>
                        <div className="flex flex-wrap gap-2">
                          {section.checkpoints.map((checkpoint, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {checkpoint}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 구간별 QR 인증 버튼 */}
                    <div className="pt-2 border-t border-gray-100">
                      <Button 
                        onClick={onQRScanClick}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        {section.name} QR 인증하기
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* 편의시설 */}
          <Card>
            <CardHeader>
              <CardTitle>편의시설</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`flex items-center space-x-2 ${course.facilities.restroom ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>🚻</span>
                  <span>화장실</span>
                </div>
                <div className={`flex items-center space-x-2 ${course.facilities.drinkingWater ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>🚰</span>
                  <span>식수대</span>
                </div>
                <div className={`flex items-center space-x-2 ${course.facilities.viewpoint ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>📸</span>
                  <span>전망대</span>
                </div>
                <div className={`flex items-center space-x-2 ${course.facilities.parking ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>🅿️</span>
                  <span>주차장</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 하이라이트 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                주요 볼거리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {course.highlights.map((highlight, index) => (
                  <div key={index} className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-center">
                    {highlight}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 액션 버튼들 */}
          {currentUser && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={onQRScanClick} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <QrCode className="w-4 h-4 mr-2" />
                전체 코스 완주 인증
              </Button>
              <Button variant="outline" onClick={onReviewClick} className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                리뷰 작성
              </Button>
            </div>
          )}

          {/* 리뷰 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>리뷰 ({reviews.length})</span>
                {currentUser && (
                  <Button variant="outline" size="sm" onClick={onReviewClick}>
                    리뷰 작성
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>아직 작성된 리뷰가 없습니다.</p>
                  <p>첫 번째 리뷰를 작성해보세요!</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">
                            {review.userName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{review.userName}</div>
                          <div className="flex items-center space-x-1">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {review.likes}
                      </Button>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{review.content}</p>
                    
                    {review.photos.length > 0 && (
                      <div className="flex gap-2">
                        {review.photos.slice(0, 3).map((photo, index) => (
                          <div key={index} className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Camera className="w-6 h-6 text-gray-400" />
                          </div>
                        ))}
                        {review.photos.length > 3 && (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                            +{review.photos.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}