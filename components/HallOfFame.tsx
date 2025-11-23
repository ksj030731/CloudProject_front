import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Trophy, Crown, Medal, MapPin, Calendar, Users } from 'lucide-react';
import { Course, CourseRanking, GlobalRanking, User } from '../types';
import distanceIcon from '../img/map.png';
// Avatar 컴포넌트가 없다면 일반 img 태그나 div로 대체해야 함 (일단 있다고 가정)
import { Avatar, AvatarFallback } from './ui/avatar'; 

interface HallOfFameProps {
  courses: Course[];
  courseRankings: CourseRanking[];
  globalRanking: GlobalRanking;
  currentUser: User | null;
  onCourseClick: (course: Course) => void;
}

export function HallOfFame({ 
  courses, 
  courseRankings, 
  globalRanking, 
  onCourseClick 
}: HallOfFameProps) {
  const [selectedTab, setSelectedTab] = useState('course-rankings');
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [selectedCourseId, setSelectedCourseId] = useState<string>("1");

  // 선택된 코스 찾기 (없으면 첫 번째 코스 또는 null)
  const selectedCourseData = courses.find(c => c.id === parseInt(selectedCourseId)) || courses[0];
  
  // 랭킹 데이터 찾기 (없으면 undefined)
  const selectedCourseRanking = courseRankings.find(cr => cr.courseId === parseInt(selectedCourseId));

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">{rank}</span>;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
  };

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="course-rankings" className="gap-2"><MapPin className="w-4 h-4"/> 코스별 랭킹</TabsTrigger>
          <TabsTrigger value="hall-of-fame" className="gap-2"><Crown className="w-4 h-4"/> 통합 랭킹</TabsTrigger>
        </TabsList>

        {/* 1. 코스별 랭킹 */}
        <TabsContent value="course-rankings" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2">
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger className="w-48"><SelectValue placeholder="코스 선택" /></SelectTrigger>
                <SelectContent>
                  {courses.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">전체 기간</SelectItem>
                  <SelectItem value="weekly">이번 주</SelectItem>
                  <SelectItem value="monthly">이번 달</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-4 h-4" /> 업데이트: {formatDate(selectedCourseRanking?.lastUpdated || globalRanking?.lastUpdated)}
            </div>
          </div>

          {selectedCourseData ? (
            <div className="space-y-4">
              {/* 코스 정보 카드 */}
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white"><Trophy className="w-5 h-5" /></div>
                    <div>
                      <h3 className="font-bold text-lg">{selectedCourseData.name} 랭킹</h3>
                      <p className="text-sm text-gray-600">{selectedCourseData.distance}km · {selectedCourseData.duration}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onCourseClick(selectedCourseData)}>상세보기</Button>
                </CardContent>
              </Card>

              {/* 랭킹 리스트 */}
              <div className="space-y-2">
                {(!selectedCourseRanking || !selectedCourseRanking.rankings || selectedCourseRanking.rankings.length === 0) ? (
                  <div className="text-center py-8 text-gray-500">아직 랭킹 데이터가 없습니다.</div>
                ) : (
                  selectedCourseRanking.rankings.map((user, idx) => (
                    <Card key={user.userId} className={idx < 3 ? 'border-yellow-200 bg-yellow-50/50' : ''}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 w-16">
                            {getRankIcon(user.rank || idx + 1)}
                            <Avatar className="w-8 h-8"><AvatarFallback>{user.userName.charAt(0)}</AvatarFallback></Avatar>
                          </div>
                          <div>
                            <div className="font-bold">{user.userName}</div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Users className="w-3 h-3" /> {user.completionCount || 0}회 완주
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm font-bold">
                          {user.bestTime || '-'}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">코스를 선택해주세요.</div>
          )}
        </TabsContent>

        {/* 2. 통합 랭킹 */}
        <TabsContent value="hall-of-fame" className="space-y-6">
          {/* 통합 랭킹 리스트 (위와 유사한 구조) */}
          <div className="space-y-2">
            {(!globalRanking || !globalRanking.rankings || globalRanking.rankings.length === 0) ? (
              <div className="text-center py-8 text-gray-500">랭킹 데이터가 없습니다.</div>
            ) : (
              globalRanking.rankings.map((user, idx) => (
                <Card key={user.userId} className={idx < 3 ? 'border-yellow-200 bg-yellow-50/50' : ''}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 w-16">
                        {getRankIcon(user.rank || idx + 1)}
                        <Avatar className="w-8 h-8"><AvatarFallback>{user.userName.charAt(0)}</AvatarFallback></Avatar>
                      </div>
                      <div>
                        <div className="font-bold">{user.userName}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Trophy className="w-3 h-3" /> 총 {user.totalCompletions || 0}회 완주
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold flex items-center justify-end gap-1">
                        <img src={distanceIcon} alt="km" className="w-4 h-4" />
                        {(user.totalDistance || 0).toFixed(1)}km
                      </div>
                      {/* 뱃지 표시 */}
                      {user.specialBadges && user.specialBadges.length > 0 && (
                        <div className="flex gap-1 justify-end mt-1">
                          {user.specialBadges.slice(0, 3).map((badge, i) => (
                            <span key={i} title={badge.name}>{badge.icon || '🏅'}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}