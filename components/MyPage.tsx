import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Heart, 
  Trophy, 
  Camera, 
  MapPin,
  Calendar,
  Star,
  CheckCircle,
  Target,
  Award,
  TrendingUp,
  Medal
} from 'lucide-react';
import { User as UserType, Course, Review, Badge as BadgeType } from '../types';
import { CourseCard } from './CourseCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface Challenge {
  id: number;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: string;
  category: 'distance' | 'courses' | 'reviews' | 'social';
  completed: boolean;
}

interface MyPageProps {
  user: UserType;
  courses: Course[];
  reviews: Review[];
  badges: BadgeType[];
  favorites: number[];
  completedCourses: number[];
  onCourseClick: (course: Course) => void;
  onUserUpdate: (user: UserType) => void;
}

export function MyPage({ 
  user, 
  courses, 
  reviews, 
  badges, 
  favorites, 
  completedCourses, 
  onCourseClick,
  onUserUpdate 
}: MyPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const favoriteCourses = courses.filter(course => favorites.includes(course.id));
  const userReviews = reviews.filter(review => review.userId === user.id);
  const completedCoursesData = courses.filter(course => completedCourses.includes(course.id));
  
  const completionRate = (completedCourses.length / courses.length) * 100;
  const nextMilestone = completedCourses.length < 5 ? 5 : completedCourses.length < 10 ? 10 : 26;

  // 도전과제 목록
  const challenges: Challenge[] = [
    {
      id: 1,
      title: '첫 발걸음',
      description: '첫 번째 코스를 완주하세요',
      target: 1,
      current: completedCourses.length >= 1 ? 1 : 0,
      reward: '새싹 탐험가 뱃지',
      category: 'courses',
      completed: completedCourses.length >= 1
    },
    {
      id: 2,
      title: '꾸준한 탐험가',
      description: '5개 코스를 완주하세요',
      target: 5,
      current: Math.min(completedCourses.length, 5),
      reward: '코스 마스터 뱃지',
      category: 'courses',
      completed: completedCourses.length >= 5
    },
    {
      id: 3,
      title: '장거리 워커',
      description: '총 50km를 걸어보세요',
      target: 50,
      current: user?.totalDistance || 0,
      reward: '워킹 챔피언 뱃지',
      category: 'distance',
      completed: (user?.totalDistance || 0) >= 50
    },
    {
      id: 4,
      title: '리뷰어',
      description: '첫 번째 리뷰를 작성하세요',
      target: 1,
      current: userReviews.length >= 1 ? 1 : 0,
      reward: '리뷰 마스터 뱃지',
      category: 'reviews',
      completed: userReviews.length >= 1
    },
    {
      id: 5,
      title: '사교적인 탐험가',
      description: '다른 사용자의 리뷰에 5번 좋아요를 누르세요',
      target: 5,
      current: 0,
      reward: '소셜 뱃지',
      category: 'social',
      completed: false
    }
  ];

  const handleSave = () => {
    onUserUpdate(editedUser);
    setIsEditing(false);
    toast.success('프로필이 업데이트되었습니다!');
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
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

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* 프로필 헤더 */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* 프로필 이미지 */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* 프로필 정보 */}
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nickname">닉네임</Label>
                        <Input
                          id="nickname"
                          value={editedUser.nickname}
                          onChange={(e) => setEditedUser({ ...editedUser, nickname: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="region">거주 지역</Label>
                        <Input
                          id="region"
                          value={editedUser.region}
                          onChange={(e) => setEditedUser({ ...editedUser, region: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        저장
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-2" />
                        취소
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-bold">{user.nickname}</h1>
                      <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Edit3 className="w-4 h-4 mr-2" />
                        편집
                      </Button>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{user.region}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>가입일: {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 활동 통계 */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{completedCourses.length}</div>
                  <div className="text-sm text-gray-600">완주 코스</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{user.totalDistance.toFixed(1)}km</div>
                  <div className="text-sm text-gray-600">총 거리</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{userReviews.length}</div>
                  <div className="text-sm text-gray-600">작성 리뷰</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{badges.length}</div>
                  <div className="text-sm text-gray-600">획득 뱃지</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 진행 상황 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              나의 갈맷길 여정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 완주율 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">전체 코스 완주율</span>
                <span className="text-lg font-bold text-blue-600">{completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={completionRate} className="h-3" />
              <p className="text-sm text-gray-600 mt-1">
                {completedCourses.length}/{courses.length} 코스 완주
              </p>
            </div>

            {/* 다음 목표 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                다음 목표
              </h4>
              <p className="text-gray-700">
                {nextMilestone}개 코스 완주까지 {nextMilestone - completedCourses.length}개 남았어요!
              </p>
              <div className="mt-2">
                <Progress 
                  value={(completedCourses.length / nextMilestone) * 100} 
                  className="h-2" 
                />
              </div>
            </div>

            {/* AI 추천 */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                AI 추천 코스
              </h4>
              <p className="text-gray-700 mb-3">
                회원님의 완주 기록을 바탕으로 추천드려요!
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {courses.filter(course => !completedCourses.includes(course.id)).slice(0, 2).map(course => (
                  <div key={course.id} className="bg-white p-3 rounded-lg border">
                    <h5 className="font-medium text-sm mb-1">{course.name}</h5>
                    <p className="text-xs text-gray-600 mb-2">{course.distance}km · {course.difficulty}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onCourseClick(course)}
                      className="w-full"
                    >
                      자세히 보기
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 탭 컨텐츠 */}
        <Tabs defaultValue="completed" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="completed">완주 코스</TabsTrigger>
            <TabsTrigger value="favorites">찜한 코스</TabsTrigger>
            <TabsTrigger value="reviews">내 리뷰</TabsTrigger>
            <TabsTrigger value="challenges">도전과제</TabsTrigger>
            <TabsTrigger value="badges">뱃지</TabsTrigger>
            <TabsTrigger value="collection">컬렉션</TabsTrigger>
          </TabsList>

          {/* 완주한 코스 */}
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  완주한 코스 ({completedCourses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedCoursesData.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">아직 완주한 코스가 없습니다</p>
                    <p>첫 번째 갈맷길 완주에 도전해보세요!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* 완주 지도 */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        나만의 완주 지도
                      </h4>
                      <div className="bg-white rounded-lg p-4 border-2 border-dashed border-green-300">
                        <div className="text-center text-gray-600">
                          <MapPin className="w-12 h-12 mx-auto mb-2 text-green-500" />
                          <p>완주한 코스들이 지도에 표시됩니다</p>
                          <p className="text-sm mt-1">실제 구현에서는 지도 API를 사용합니다</p>
                        </div>
                      </div>
                    </div>

                    {/* 완주 코스 목록 */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {completedCoursesData.map(course => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          isFavorited={favorites.includes(course.id)}
                          isCompleted={true}
                          onClick={() => onCourseClick(course)}
                          onFavoriteClick={() => {}}
                          currentUser={user}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 찜한 코스 */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  찜한 코스 ({favoriteCourses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteCourses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">찜한 코스가 없습니다</p>
                    <p>마음에 드는 코스를 찜해보세요!</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteCourses.map(course => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        isFavorited={true}
                        isCompleted={completedCourses.includes(course.id)}
                        onClick={() => onCourseClick(course)}
                        onFavoriteClick={() => {}}
                        currentUser={user}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 내 리뷰 */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  내가 작성한 리뷰 ({userReviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userReviews.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">작성한 리뷰가 없습니다</p>
                    <p>완주한 코스에 대한 후기를 남겨보세요!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* 나의 사진첩 */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Camera className="w-4 h-4 mr-2" />
                        나의 갈맷길 사진첩
                      </h4>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {userReviews.flatMap(review => review.photos).slice(0, 12).map((photo, index) => (
                          <div key={index} className="aspect-square bg-white rounded-lg border-2 border-dashed border-purple-300 flex items-center justify-center">
                            <Camera className="w-6 h-6 text-purple-400" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 리뷰 목록 */}
                    <div className="space-y-4">
                      {userReviews.map(review => {
                        const course = courses.find(c => c.id === review.courseId);
                        return (
                          <div key={review.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium">{course?.name}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="flex">{renderStars(review.rating)}</div>
                                  <span className="text-sm text-gray-500">
                                    {new Date(review.date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => course && onCourseClick(course)}
                              >
                                코스 보기
                              </Button>
                            </div>
                            <p className="text-gray-700 mb-3">{review.content}</p>
                            {review.photos.length > 0 && (
                              <div className="flex space-x-2">
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
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 도전과제 */}
          <TabsContent value="challenges">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  나의 도전과제
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {challenges.map((challenge) => (
                    <Card key={challenge.id} className={challenge.completed ? 'border-green-200 bg-green-50' : ''}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Target className={`w-5 h-5 ${challenge.completed ? 'text-green-600' : 'text-blue-600'}`} />
                            {challenge.title}
                            {challenge.completed && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                완료
                              </Badge>
                            )}
                          </CardTitle>
                        </div>
                        <p className="text-gray-600">{challenge.description}</p>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>진행률</span>
                            <span>
                              {challenge.current}/{challenge.target}
                              {challenge.category === 'distance' && 'km'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                challenge.completed ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${getProgressPercentage(challenge.current, challenge.target)}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Award className="w-4 h-4" />
                          <span>보상: {challenge.reward}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 뱃지 */}
          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  획득한 뱃지 ({badges.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">획득한 뱃지가 없습니다</p>
                    <p>갈맷길을 완주하고 뱃지를 획득해보세요!</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {badges.map(badge => (
                      <Card key={badge.id} className={`border-2 ${getBadgeRarityColor(badge.rarity)}`}>
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl mb-3">{badge.icon}</div>
                          <h4 className="font-bold mb-2">{badge.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                          <Badge className={getBadgeRarityColor(badge.rarity)}>
                            {badge.rarity}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-2">{badge.condition}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 뱃지 컬렉션 */}
          <TabsContent value="collection">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Medal className="w-5 h-5 mr-2" />
                  뱃지 컬렉션
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Medal className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">아직 획득한 뱃지가 없습니다</p>
                    <p className="text-sm mt-2">
                      도전과제를 완료하여 뱃지를 획득해보세요!
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {badges.map((badge) => (
                      <Card key={badge.id} className="text-center">
                        <CardContent className="p-6">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Medal className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-medium mb-2">{badge.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                          <Badge variant="secondary" className="text-xs">
                            {formatDate((badge as any).earnedDate || new Date().toISOString())}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}