import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  MessageCircle, Trophy, ThumbsUp, MapPin, MessageSquare, PenSquare, Star, Megaphone, Camera, X
} from 'lucide-react';
import { Course, Review, User, Badge as BadgeType, Announcement, CourseRanking, GlobalRanking } from '../types';
import { HallOfFame } from './HallOfFame';
import { ReviewItem } from './ReviewItem';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import axios from 'axios';
import { toast } from 'sonner';

interface CommunityProps {
  courses: Course[];
  reviews: Review[];
  currentUser: User | null;
  badges: BadgeType[];
  completedCourses: number[];
  onCourseClick: (course: Course) => void;

  announcements: Announcement[];
  courseRankings: CourseRanking[];
  globalRanking: GlobalRanking;
  onUserRefresh: () => Promise<void>; // ✨ [추가]
}

export function Community({
  courses,
  reviews,
  currentUser,
  onCourseClick,
  announcements,
  courseRankings,
  globalRanking,
  onUserRefresh // ✨ [추가]
}: CommunityProps) {

  const [selectedTab, setSelectedTab] = useState('reviews');

  // ReviewItem이 내부적으로 상태를 관리하므로, 여기서는 기본 Review 배열만 관리하면 됨
  const [communityReviews, setCommunityReviews] = useState<Review[]>(reviews);

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    courseId: 0,
    rating: 5,
    content: ''
  });

  // ✨ [추가] 사진 업로드 상태
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photos.length > 5) {
      toast.error('최대 5장까지 업로드할 수 있습니다.');
      return;
    }

    setPhotos(prev => [...prev, ...files]);
    // 미리보기 URL 생성
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // ✨ [추가] 리뷰 삭제 핸들러
  const handleDeleteReview = (reviewId: number) => {
    setCommunityReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  // 리뷰 작성 및 DB 저장 함수
  const handleSubmitReview = async () => {
    // 1. 유효성 검사
    if (!currentUser) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!newReview.courseId) {
      toast.error("코스를 선택해주세요.");
      return;
    }
    if (!newReview.content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    try {
      // 2. 백엔드로 보낼 데이터 준비
      const requestData = {
        courseId: newReview.courseId,
        userId: currentUser.id,
        userName: currentUser.nickname,
        rating: newReview.rating,
        content: newReview.content.trim()
      };

      // 3. 백엔드 API 호출 (POST /api/reviews)
      // 3. 백엔드 API 호출 (POST /api/reviews) - FormData 사용
      const formData = new FormData();
      formData.append('reviewData', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));

      photos.forEach(photo => {
        formData.append('images', photo);
      });

      const response = await axios.post('/api/reviews', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // 4. 성공 시 처리
      if (response.status === 201 || response.status === 200) {
        const savedReview = response.data; // DB에 저장된 실제 리뷰 데이터

        // 5. 화면 목록 업데이트
        setCommunityReviews(prev => [savedReview, ...prev]); // ✨ [수정] 새 리뷰를 맨 앞에 추가 (최신순 유지)

        // 6. 모달 닫기 및 초기화
        setIsWriteModalOpen(false);
        setIsWriteModalOpen(false);
        setNewReview({ courseId: 0, rating: 5, content: '' });
        setPhotos([]);
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls([]);
        toast.success("리뷰가 등록되었습니다!");

        // ✨ [추가] 리뷰 작성 후 뱃지/도전과제 갱신
        await onUserRefresh();
      }
    } catch (error) {
      console.error("리뷰 저장 실패:", error);
      toast.error("리뷰 등록 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getCourseById = (courseId: number) => courses.find(c => c.id === courseId);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">
            {selectedTab === 'hall-of-fame' ? '갈맷길 명예의 전당' : '갈맷길 커뮤니티'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            함께 걷는 즐거움을 나누고, 새로운 기록에 도전해보세요.
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="reviews" className="gap-2"><MessageCircle className="w-4 h-4" /> 리뷰 & 후기</TabsTrigger>
            <TabsTrigger value="hall-of-fame" className="gap-2"><Trophy className="w-4 h-4" /> 명예의 전당</TabsTrigger>
            <TabsTrigger value="notices" className="gap-2"><Megaphone className="w-4 h-4" /> 공지사항</TabsTrigger>
          </TabsList>

          {/* 1. 리뷰 탭 */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-end">
              {currentUser ? (
                <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2"><PenSquare className="w-4 h-4" /> 리뷰 작성하기</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>리뷰 작성하기</DialogTitle>
                      <DialogDescription>갈맷길 코스 경험을 공유해주세요.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>코스 선택</Label>
                        <Select
                          value={newReview.courseId.toString()}
                          onValueChange={(val) => setNewReview(prev => ({ ...prev, courseId: parseInt(val) }))}
                        >
                          <SelectTrigger><SelectValue placeholder="코스를 선택하세요" /></SelectTrigger>
                          <SelectContent>
                            {courses.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>별점</Label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((r) => (
                            <Star key={r} className={`w-8 h-8 cursor-pointer ${r <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} onClick={() => setNewReview(prev => ({ ...prev, rating: r }))} />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>내용</Label>
                        <Textarea
                          placeholder="후기를 작성해주세요."
                          value={newReview.content}
                          onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                          rows={5}
                        />
                      </div>

                      {/* 사진 업로드 UI 추가 */}
                      <div className="space-y-3">
                        <Label>사진 추가 (선택사항)</Label>

                        {previewUrls.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {previewUrls.map((url, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-20 object-cover rounded-lg border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePhoto(index)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {photos.length < 5 && (
                          <div>
                            <input
                              type="file"
                              id="community-photo-upload"
                              multiple
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                            <Label
                              htmlFor="community-photo-upload"
                              className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                            >
                              <div className="text-center">
                                <Camera className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                                <span className="text-sm text-gray-600">사진 추가</span>
                              </div>
                            </Label>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsWriteModalOpen(false)}>취소</Button>
                        <Button onClick={handleSubmitReview} disabled={!newReview.courseId || !newReview.content.trim()}>작성 완료</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button disabled className="gap-2"><PenSquare className="w-4 h-4" /> 로그인 후 작성 가능</Button>
              )}
            </div>

            <div className="grid gap-6">
              {communityReviews.length === 0 ? (
                <Card><CardContent className="py-12 text-center text-gray-500">아직 리뷰가 없습니다.</CardContent></Card>
              ) : (
                communityReviews.map((review) => {
                  const course = getCourseById(review.courseId);
                  return (
                    <ReviewItem
                      key={review.id}
                      review={review}
                      currentUser={currentUser}
                      courseName={course?.name}
                      onCourseClick={() => course && onCourseClick(course)}
                      onDelete={handleDeleteReview}
                      onUserRefresh={onUserRefresh} // ✨ [추가]
                    />);
                })
              )}
            </div>
          </TabsContent>

          {/* 2. 명예의 전당 탭 */}
          <TabsContent value="hall-of-fame">
            <HallOfFame
              courses={courses}
              courseRankings={courseRankings}
              globalRanking={globalRanking}
              currentUser={currentUser}
              onCourseClick={onCourseClick}
            />
          </TabsContent>

          {/* 3. 공지사항 탭 */}
          <TabsContent value="notices">
            <div className="grid gap-4">
              {announcements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">등록된 공지사항이 없습니다.</div>
              ) : (
                announcements.map((notice) => (
                  <Card key={notice.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-full text-blue-600 flex-shrink-0">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            {notice.category === 'event' ? '이벤트' : notice.category === 'maintenance' ? '공사' : '공지'}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(notice.date)}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{notice.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{notice.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}