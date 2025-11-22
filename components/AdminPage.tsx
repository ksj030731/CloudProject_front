import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Settings,
  Users,
  MapPin,
  Calendar,
  AlertCircle,
  BarChart3,
  FileText
} from 'lucide-react';
import { Course, Announcement } from '../types';
import { mockAnnouncements } from '../data/mockData';
import { toast } from 'sonner';

interface AdminPageProps {
  courses: Course[];
  onCoursesUpdate: (courses: Course[]) => void;
}

export function AdminPage({ courses, onCoursesUpdate }: AdminPageProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: '',
    description: '',
    distance: 0,
    duration: '',
    difficulty: '중', // [수정 1/3] '보통' -> '중' (Course 타입과 일치)
    region: '',
    image: '',
    route: { start: '', end: '', checkpoints: [] },
    facilities: { restroom: false, drinkingWater: false, viewpoint: false, parking: false },
    transportation: '',
    highlights: [],
    coordinates: { lat: 0, lng: 0 }
  });

  const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    category: 'notice'
  });

  const statistics = {
    totalCourses: courses.length,
    totalUsers: 1247,
    todayVisitors: 523,
    monthlyCompletions: 89,
    averageRating: 4.6,
    totalReviews: 234
  };

  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.description) {
      toast.error('필수 정보를 입력해주세요.');
      return;
    }

const course: Course = {
      id: Date.now(),
      name: newCourse.name!,
      description: newCourse.description!,
      distance: newCourse.distance!,
      duration: newCourse.duration!,
      difficulty: newCourse.difficulty as '하' | '중' | '상', 
      region: newCourse.region!,
      image: newCourse.image || 'https://images.unsplash.com/photo-1698484657816-b44063f94b86',
      route: newCourse.route!,
      facilities: newCourse.facilities!,
      transportation: newCourse.transportation!,
      highlights: newCourse.highlights!,
      coordinates: newCourse.coordinates!,
      
      sections: newCourse.sections || [],
      completedCount: newCourse.completedCount || 0 
    };

    onCoursesUpdate([...courses, course]);
    setNewCourse({
      name: '',
      description: '',
      distance: 0,
      duration: '',
      difficulty: '중', // [수정 3/3] '보통' -> '중'
      region: '',
      image: '',
      route: { start: '', end: '', checkpoints: [] },
      facilities: { restroom: false, drinkingWater: false, viewpoint: false, parking: false },
      transportation: '',
      highlights: [],
      coordinates: { lat: 0, lng: 0 }
    });
    setIsAddingCourse(false);
    toast.success('새 코스가 추가되었습니다!');
  };

  const handleUpdateCourse = () => {
    if (!editingCourse) return;

    const updatedCourses = courses.map(course =>
      course.id === editingCourse.id ? editingCourse : course
    );
    onCoursesUpdate(updatedCourses);
    setEditingCourse(null);
    toast.success('코스가 업데이트되었습니다!');
  };

  const handleDeleteCourse = (courseId: number) => {
    const updatedCourses = courses.filter(course => course.id !== courseId);
    onCoursesUpdate(updatedCourses);
    toast.success('코스가 삭제되었습니다.');
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast.error('제목과 내용을 입력해주세요.');
      return;
    }

    const announcement: Announcement = {
      id: Date.now(),
      title: newAnnouncement.title!,
      content: newAnnouncement.content!,
      category: newAnnouncement.category as 'notice' | 'event' | 'maintenance',
      date: new Date().toISOString(),
      author: '관리자'
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({ title: '', content: '', category: 'notice' });
    setIsAddingAnnouncement(false);
    toast.success('공지사항이 등록되었습니다!');
  };

  const handleUpdateAnnouncement = () => {
    if (!editingAnnouncement) return;

    const updatedAnnouncements = announcements.map(announcement =>
      announcement.id === editingAnnouncement.id ? editingAnnouncement : announcement
    );
    setAnnouncements(updatedAnnouncements);
    setEditingAnnouncement(null);
    toast.success('공지사항이 업데이트되었습니다!');
  };

  const handleDeleteAnnouncement = (announcementId: number) => {
    const updatedAnnouncements = announcements.filter(announcement => announcement.id !== announcementId);
    setAnnouncements(updatedAnnouncements);
    toast.success('공지사항이 삭제되었습니다.');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'notice': return 'bg-blue-100 text-blue-700';
      case 'event': return 'bg-green-100 text-green-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'notice': return '공지';
      case 'event': return '행사';
      case 'maintenance': return '정비';
      default: return '일반';
    }
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="flex items-center mb-4">
            <Settings className="w-8 h-8 mr-3" />
            관리자 페이지
          </h1>
          <p className="text-gray-600">갈맷길 웹사이트 관리 및 운영</p>
        </div>

        {/* 대시보드 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{statistics.totalCourses}</div>
              <div className="text-sm text-gray-600">전체 코스</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{statistics.totalUsers}</div>
              <div className="text-sm text-gray-600">가입자 수</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{statistics.todayVisitors}</div>
              <div className="text-sm text-gray-600">오늘 방문자</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{statistics.monthlyCompletions}</div>
              <div className="text-sm text-gray-600">이달 완주</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">⭐ {statistics.averageRating}</div>
              <div className="text-sm text-gray-600">평균 평점</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="w-6 h-6 mx-auto mb-2 text-pink-600" />
              <div className="text-2xl font-bold text-pink-600">{statistics.totalReviews}</div>
              <div className="text-sm text-gray-600">전체 리뷰</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="courses">코스 관리</TabsTrigger>
            <TabsTrigger value="announcements">공지사항</TabsTrigger>
            <TabsTrigger value="users">사용자 관리</TabsTrigger>
          </TabsList>

          {/* 코스 관리 */}
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>코스 관리</CardTitle>
                  <Button onClick={() => setIsAddingCourse(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    새 코스 추가
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* 새 코스 추가 폼 */}
                {isAddingCourse && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold mb-4">새 코스 추가</h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="course-name">코스명</Label>
                        <Input
                          id="course-name"
                          value={newCourse.name}
                          onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                          placeholder="예: 7코스 새별오름길"
                        />
                      </div>
                      <div>
                        <Label htmlFor="course-region">지역</Label>
                        <Input
                          id="course-region"
                          value={newCourse.region}
                          onChange={(e) => setNewCourse({ ...newCourse, region: e.target.value })}
                          placeholder="예: 부산진구"
                        />
                      </div>
                      <div>
                        <Label htmlFor="course-distance">거리 (km)</Label>
                        <Input
                          id="course-distance"
                          type="number"
                          value={newCourse.distance}
                          onChange={(e) => setNewCourse({ ...newCourse, distance: parseFloat(e.target.value) })}
                          placeholder="예: 15.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="course-duration">소요시간</Label>
                        <Input
                          id="course-duration"
                          value={newCourse.duration}
                          onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                          placeholder="예: 4-5시간"
                        />
                      </div>
                      <div>
                        <Label htmlFor="course-difficulty">난이도</Label>
                        <Select
                          value={newCourse.difficulty}
                          onValueChange={(value: '하' | '중' | '상') => setNewCourse({ ...newCourse, difficulty: value })} // [수정 4] value 타입 명시
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="하">쉬움</SelectItem> {/* [수정] value 변경 */}
                            <SelectItem value="중">보통</SelectItem> {/* [수정] value 변경 */}
                            <SelectItem value="상">어려움</SelectItem> {/* [수정] value 변경 */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="course-transportation">교통편</Label>
                        <Input
                          id="course-transportation"
                          value={newCourse.transportation}
                          onChange={(e) => setNewCourse({ ...newCourse, transportation: e.target.value })}
                          placeholder="예: 시내버스 202번 이용 가능"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="course-description">설명</Label>
                      <Textarea
                        id="course-description"
                        value={newCourse.description}
                        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                        placeholder="코스에 대한 자세한 설명을 입력하세요"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddCourse}>
                        <Save className="w-4 h-4 mr-2" />
                        저장
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingCourse(false)}>
                        <X className="w-4 h-4 mr-2" />
                        취소
                      </Button>
                    </div>
                  </div>
                )}

                {/* 코스 목록 */}
                <div className="space-y-4">
                  {courses.map(course => (
                    <div key={course.id} className="border rounded-lg p-4">
                      {editingCourse?.id === course.id ? (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>코스명</Label>
                              <Input
                                value={editingCourse.name}
                                onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>지역</Label>
                              <Input
                                value={editingCourse.region}
                                onChange={(e) => setEditingCourse({ ...editingCourse, region: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>거리 (km)</Label>
                              <Input
                                type="number"
                                value={editingCourse.distance}
                                onChange={(e) => setEditingCourse({ ...editingCourse, distance: parseFloat(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label>소요시간</Label>
                              <Input
                                value={editingCourse.duration}
                                onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>설명</Label>
                            <Textarea
                              value={editingCourse.description}
                              onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                              rows={3}
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={handleUpdateCourse} size="sm">
                              <Save className="w-4 h-4 mr-2" />
                              저장
                            </Button>
                            <Button variant="outline" onClick={() => setEditingCourse(null)} size="sm">
                              <X className="w-4 h-4 mr-2" />
                              취소
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold">{course.name}</h4>
                              <Badge variant="outline">{course.difficulty}</Badge>
                              <span className="text-sm text-gray-500">{course.distance}km</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                            <div className="text-xs text-gray-500">
                              {course.region} · {course.duration}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingCourse(course)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCourse(course.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 공지사항 관리 */}
          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>공지사항 관리</CardTitle>
                  <Button onClick={() => setIsAddingAnnouncement(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    새 공지사항 작성
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* 새 공지사항 추가 폼 */}
                {isAddingAnnouncement && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold mb-4">새 공지사항 작성</h4>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="announcement-title">제목</Label>
                          <Input
                            id="announcement-title"
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                            placeholder="공지사항 제목을 입력하세요"
                          />
                        </div>
                        <div>
                          <Label htmlFor="announcement-category">카테고리</Label>
                          <Select
                            value={newAnnouncement.category}
                            onValueChange={(value: 'notice' | 'event' | 'maintenance') => setNewAnnouncement({ ...newAnnouncement, category: value })} // [수정 5] value 타입 명시
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="notice">공지</SelectItem>
                              <SelectItem value="event">행사</SelectItem>
                              <SelectItem value="maintenance">정비</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="announcement-content">내용</Label>
                        <Textarea
                          id="announcement-content"
                          value={newAnnouncement.content}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                          placeholder="공지사항 내용을 입력하세요"
                          rows={4}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleAddAnnouncement}>
                          <Save className="w-4 h-4 mr-2" />
                          등록
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddingAnnouncement(false)}>
                          <X className="w-4 h-4 mr-2" />
                          취소
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 공지사항 목록 */}
                <div className="space-y-4">
                  {announcements.map(announcement => (
                    <div key={announcement.id} className="border rounded-lg p-4">
                      {editingAnnouncement?.id === announcement.id ? (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>제목</Label>
                              <Input
                                value={editingAnnouncement.title}
                                onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>카테고리</Label>
                              <Select
                                value={editingAnnouncement.category}
                                onValueChange={(value: 'notice' | 'event' | 'maintenance') => setEditingAnnouncement({ ...editingAnnouncement!, category: value })} // [수정 6] value 타입 명시 및 'as any' 제거
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="notice">공지</SelectItem>
                                  <SelectItem value="event">행사</SelectItem>
                                  <SelectItem value="maintenance">정비</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label>내용</Label>
                            <Textarea
                              value={editingAnnouncement.content}
                              onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                              rows={4}
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={handleUpdateAnnouncement} size="sm">
                              <Save className="w-4 h-4 mr-2" />
                              저장
                            </Button>
                            <Button variant="outline" onClick={() => setEditingAnnouncement(null)} size="sm">
                              <X className="w-4 h-4 mr-2" />
                              취소
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold">{announcement.title}</h4>
                              <Badge className={getCategoryColor(announcement.category)}>
                                {getCategoryLabel(announcement.category)}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{announcement.content}</p>
                            <div className="text-xs text-gray-500">
                              {new Date(announcement.date).toLocaleDateString()} · {announcement.author}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingAnnouncement(announcement)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 사용자 관리 */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>사용자 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">사용자 관리 기능</p>
                  <p>실제 구현에서는 사용자 목록, 권한 관리, 통계 등이 표시됩니다.</p>
                  <div className="mt-6 grid md:grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">1,247</div>
                      <div className="text-sm text-gray-600">총 회원수</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">89</div>
                      <div className="text-sm text-gray-600">활성 사용자</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">23</div>
                      <div className="text-sm text-gray-600">신규 가입</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}