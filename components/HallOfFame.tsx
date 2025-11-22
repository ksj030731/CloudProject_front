import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, Avatar as AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Trophy, 
  Crown, 
  Medal,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Award,
  Star,
  Target,
  Zap
} from 'lucide-react';
import { Course, CourseRanking, GlobalRanking, Badge as BadgeType } from '../types';
import distanceIcon from '../img/map.png';

interface HallOfFameProps {
  courses: Course[];
  courseRankings: CourseRanking[];
  globalRanking: GlobalRanking;
  currentUser: any;
  onCourseClick: (course: Course) => void;
}

export function HallOfFame({ 
  courses, 
  courseRankings, 
  globalRanking, 
  currentUser,
  onCourseClick 
}: HallOfFameProps) {
  const [selectedTab, setSelectedTab] = useState('course-rankings');
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'all-time'>('all-time');
  const [selectedCourse, setSelectedCourse] = useState<number>(1);

  const selectedCourseRanking = courseRankings.find(cr => cr.courseId === selectedCourse);
  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-500" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">{rank}</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
  };



  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="course-rankings" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            코스 랭킹
          </TabsTrigger>
          <TabsTrigger value="hall-of-fame" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            통합 랭킹
          </TabsTrigger>
        </TabsList>

        {/* 코스 랭킹 탭 */}
        <TabsContent value="course-rankings" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4">
              <Select value={selectedCourse.toString()} onValueChange={(value: string) => setSelectedCourse(parseInt(value))}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="코스 선택" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">주간</SelectItem>
                  <SelectItem value="monthly">월간</SelectItem>
                  <SelectItem value="all-time">전체</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              마지막 업데이트: {formatDate(selectedCourseRanking?.lastUpdated || globalRanking.lastUpdated)}
            </div>
          </div>

          {selectedCourseRanking && selectedCourseData && (
            <div className="space-y-4">
              {/* 코스 정보 카드 */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">{selectedCourseData.name} 랭킹</h3>
                        <p className="text-sm text-gray-600">
                          {selectedCourseData.distance}km · {selectedCourseData.duration}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCourseClick(selectedCourseData)}
                      className="text-sm"
                    >
                      코스 상세보기
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 랭킹 리스트 */}
              <div className="space-y-2">
                {selectedCourseRanking.rankings.map((user, index) => (
                  <Card key={user.userId} className={`overflow-hidden ${user.rank <= 3 ? 'bg-yellow-50 border-yellow-200' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            {getRankIcon(user.rank)}
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-gray-600">
                                {user.userName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold">{user.userName}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {user.completionCount}회 완주
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-black flex items-center gap-1">
                            <img src={distanceIcon} alt="거리" className="w-4 h-4" />
                            {user.totalDistance.toFixed(1)}km
                          </div>
                          {user.rank <= 3 && (
                            <div className="mt-1">
                              {user.rank === 1 && <span className="text-xs">👑</span>}
                              {user.rank === 2 && <span className="text-xs">🥈</span>}
                              {user.rank === 3 && <span className="text-xs">🥉</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* 명예의 전당 탭 */}
        <TabsContent value="hall-of-fame" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4">
              <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">주간</SelectItem>
                  <SelectItem value="monthly">월간</SelectItem>
                  <SelectItem value="all-time">전체</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              마지막 업데이트: {formatDate(globalRanking.lastUpdated)}
            </div>
          </div>

          <div className="space-y-2">
            {globalRanking.rankings.map((user, index) => (
              <Card key={user.userId} className={`overflow-hidden ${user.rank <= 3 ? 'bg-yellow-50 border-yellow-200' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        {getRankIcon(user.rank)}
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-600">
                            {user.userName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold">{user.userName}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            총 {user.totalCompletions}회 완주
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            선호 {user.favoriteCourseName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-black flex items-center gap-1">
                        <img src={distanceIcon} alt="거리" className="w-4 h-4" />
                        {user.totalDistance.toFixed(1)}km
                      </div>
                      <div className="text-xs text-gray-500">
                        마지막 활동: {formatDate(user.lastActivityDate)}
                      </div>
                      {user.specialBadges.length > 0 && (
                        <div className="mt-1 flex gap-1">
                          {user.specialBadges.slice(0, 3).map(badge => (
                            <span key={badge.id} className="text-xs">
                              {badge.icon}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}