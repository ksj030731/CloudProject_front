import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, Avatar as AvatarFallback } from './ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Star, 
  Trophy,
  ThumbsUp,
  Crown,
  MapPin,
  Calendar,
  User,
  MessageSquare,
  PenSquare,
  X
} from 'lucide-react';
import { Course, User as UserType, Review, Badge as BadgeType, CourseRanking, GlobalRanking } from '../types';
import { HallOfFame } from './HallOfFame';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface CommunityProps {
  courses: Course[];
  reviews: Review[];
  currentUser: UserType | null;
  badges: BadgeType[];
  completedCourses: number[];
  courseRankings: CourseRanking[];
  globalRanking: GlobalRanking;
  onCourseClick: (course: Course) => void;
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
  badges,
  completedCourses,
  courseRankings,
  globalRanking,
  onCourseClick 
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
          ? { 
              ...review, 
              liked: !review.liked,
              likes: review.liked ? review.likes - 1 : review.likes + 1
            }
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
        review.id === reviewId
          ? { ...review, comments: [...review.comments, newComment] }
          : review
      )
    );
  };

  const handleSubmitReview = () => {
    if (!currentUser || !newReview.courseId || !newReview.content.trim()) {
      return;
    }

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
    setNewReview({
      courseId: 0,
      rating: 5,
      content: ''
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getCourseById = (courseId: number) => {
    return courses.find(c => c.id === courseId);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <h1 className="mb-2 text-center text-4xl font-bold">
            {selectedTab === 'hall-of-fame' ? '갈맷길 명예의 전당' : '갈맷길 커뮤니티'}
          </h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            {selectedTab === 'hall-of-fame' 
              ? '갈맷길을 정복한 최고의 도전자들을 만나보세요. 각 코스별 최다 완주 횟수 기준 랭킹을 확인할 수 있습니다.'
              : '갈맷길을 함께 걷는 사람들과 소통하고, 도전과제를 달성하며, 코스별 기록을 확인해보세요.'
            }
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              리뷰 & 후기
            </TabsTrigger>
            <TabsTrigger value="hall-of-fame" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              명예의 전당
            </TabsTrigger>
          </TabsList>

          {/* 리뷰 & 후기 탭 */}
          <TabsContent value="reviews" className="space-y-6">
            {/* 글쓰기 버튼 */}
            <div className="flex justify-end">
              {currentUser ? (
                <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <PenSquare className="w-4 h-4" />
                      리뷰 작성하기
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>리뷰 작성하기</DialogTitle>
                      <DialogDescription>
                        갈맷길 코스를 선택하고 경험을 공유해주세요.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {/* 코스 선택 */}
                      <div className="space-y-2">
                        <Label htmlFor="course">코스 선택</Label>
                        <Select 
                          value={newReview.courseId.toString()} 
                          onValueChange={(value) => setNewReview(prev => ({ ...prev, courseId: parseInt(value) }))}
                        >
                          <SelectTrigger id="course">
                            <SelectValue placeholder="코스를 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id.toString()}>
                                {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 별점 */}
                      <div className="space-y-2">
                        <Label>별점</Label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Star
                              key={rating}
                              className={`w-8 h-8 cursor-pointer transition-colors ${
                                rating <= newReview.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                              onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {newReview.rating}점
                          </span>
                        </div>
                      </div>

                      {/* 내용 */}
                      <div className="space-y-2">
                        <Label htmlFor="content">리뷰 내용</Label>
                        <Textarea
                          id="content"
                          placeholder="갈맷길을 걸으며 느낀 점, 추천하고 싶은 점 등을 자유롭게 작성해주세요."
                          value={newReview.content}
                          onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                          rows={8}
                          className="resize-none"
                        />
                        <p className="text-xs text-gray-500">
                          {newReview.content.length} / 1000자
                        </p>
                      </div>

                      {/* 버튼 */}
                      <div className="flex justify-end gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsWriteModalOpen(false)}
                        >
                          취소
                        </Button>
                        <Button 
                          onClick={handleSubmitReview}
                          disabled={!newReview.courseId || !newReview.content.trim()}
                        >
                          작성 완료
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button disabled className="flex items-center gap-2">
                  <PenSquare className="w-4 h-4" />
                  로그인 후 이용 가능
                </Button>
              )}
            </div>

            <div className="grid gap-6">
              {communityReviews.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">아직 작성된 리뷰가 없습니다.</p>
                    <p className="text-gray-400 text-sm mt-2">
                      첫 번째 리뷰를 작성해보세요!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                communityReviews.map((review) => {
                  const course = getCourseById(review.courseId);
                  return (
                    <Card key={review.id} className="overflow-hidden">
                      <CardHeader className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {review.userName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.userName}</p>
                              <p className="text-sm text-gray-500">
                                {formatDate(review.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {course && (
                          <div 
                            className="flex items-center gap-2 text-blue-600 cursor-pointer hover:text-blue-700"
                            onClick={() => onCourseClick(course)}
                          >
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm font-medium">{course.name}</span>
                          </div>
                        )}
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-gray-700">{review.content}</p>
                        
                        {review.photos && review.photos.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {review.photos.map((photo, index) => (
                              <div
                                key={index}
                                className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                              >
                                <span className="text-gray-400 text-xs">
                                  사진 {index + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <Button
                            variant={review.liked ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleLike(review.id)}
                            className="flex items-center gap-2"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            좋아요 {review.likes}
                          </Button>
                          
                          <div className="flex items-center gap-2 text-gray-500">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm">댓글 {review.comments.length}</span>
                          </div>
                        </div>
                        
                        {/* 댓글 섹션 */}
                        {review.comments.length > 0 && (
                          <div className="space-y-3 pt-4 border-t">
                            {review.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                    {comment.userName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{comment.userName}</span>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(comment.date)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* 댓글 작성 */}
                        {currentUser && (
                          <div className="flex gap-2 pt-2">
                            <input
                              type="text"
                              placeholder="댓글을 작성해보세요..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleComment(review.id, e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>



          {/* 명예의 전당 탭 */}
          <TabsContent value="hall-of-fame">
            <HallOfFame
              courses={courses}
              courseRankings={courseRankings}
              globalRanking={globalRanking}
              currentUser={currentUser}
              onCourseClick={onCourseClick}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}