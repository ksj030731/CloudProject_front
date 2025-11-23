import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  MessageCircle, Trophy, ThumbsUp, MapPin, MessageSquare, PenSquare, Star, Megaphone
} from 'lucide-react';
// ✨ [수정] Badge 이름 충돌 해결 (Badge as BadgeType)
import { Course, Review, User, Badge as BadgeType, Announcement, CourseRanking, GlobalRanking } from '../types';
import { HallOfFame } from './HallOfFame';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

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
}

interface CommunityReview extends Review {
  comments: Comment[];
  liked: boolean;
}

interface Comment {
  id: number;
  userId: number;
  userName: string;
  content: string;
  date: string;
}

export function Community({ 
  courses, 
  reviews, 
  currentUser, 
  onCourseClick,
  announcements,
  courseRankings,
  globalRanking
}: CommunityProps) {
  
  const [selectedTab, setSelectedTab] = useState('reviews');
  
  const [communityReviews, setCommunityReviews] = useState<CommunityReview[]>(
    reviews.map(review => ({
      ...review,
      comments: [],
      liked: false
    }))
  );

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    courseId: 0,
    rating: 5,
    content: ''
  });

  const handleLike = (reviewId: number) => {
    setCommunityReviews(prev => 
      prev.map(review => 
        review.id === reviewId 
          ? { ...review, liked: !review.liked, likes: review.liked ? review.likes - 1 : review.likes + 1 }
          : review
      )
    );
  };

  const handleComment = (reviewId: number, content: string) => {
    if (!currentUser || !content.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.nickname,
      content: content.trim(),
      date: new Date().toISOString()
    };
    setCommunityReviews(prev =>
      prev.map(review =>
        review.id === reviewId ? { ...review, comments: [...review.comments, newComment] } : review
      )
    );
  };

  const handleSubmitReview = () => {
    if (!currentUser || !newReview.courseId || !newReview.content.trim()) return;
    const review: CommunityReview = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.nickname,
      courseId: newReview.courseId,
      rating: newReview.rating,
      content: newReview.content.trim(),
      date: new Date().toISOString(),
      likes: 0,
      comments: [],
      liked: false,
      photos: []
    };
    setCommunityReviews(prev => [review, ...prev]);
    setIsWriteModalOpen(false);
    setNewReview({ courseId: 0, rating: 5, content: '' });
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
            <TabsTrigger value="reviews" className="gap-2"><MessageCircle className="w-4 h-4"/> 리뷰 & 후기</TabsTrigger>
            <TabsTrigger value="hall-of-fame" className="gap-2"><Trophy className="w-4 h-4"/> 명예의 전당</TabsTrigger>
            <TabsTrigger value="notices" className="gap-2"><Megaphone className="w-4 h-4"/> 공지사항</TabsTrigger>
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
                    <Card key={review.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar><AvatarFallback>{review.userName.charAt(0)}</AvatarFallback></Avatar>
                            <div>
                              <p className="font-medium">{review.userName}</p>
                              <p className="text-xs text-gray-500">{formatDate(review.date)}</p>
                            </div>
                          </div>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />)}
                          </div>
                        </div>
                        {course && (
                          <div className="mt-2 flex items-center gap-1 text-sm text-blue-600 cursor-pointer" onClick={() => onCourseClick(course)}>
                            <MapPin className="w-3 h-3" /> {course.name}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-700 whitespace-pre-line">{review.content}</p>
                        <div className="flex justify-between items-center pt-4 border-t">
                          <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleLike(review.id)}>
                            <ThumbsUp className={`w-4 h-4 ${review.liked ? 'fill-blue-500 text-blue-500' : ''}`} /> {review.likes}
                          </Button>
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <MessageSquare className="w-4 h-4" /> {review.comments.length}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* 2. 명예의 전당 탭 */}
          <TabsContent value="hall-of-fame">
            {/* ✨ [수정] 중복 속성 없이 깔끔하게 전달 */}
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