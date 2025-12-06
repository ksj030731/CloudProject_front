import React, { useState } from 'react';
import { Review, ReviewComment, User } from '../types';
import { Star, ThumbsUp, MessageCircle, Send, Trash2, MapPin, ChevronRight, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import axios from 'axios';
import { toast } from 'sonner';

interface ReviewItemProps {
    review: Review;
    currentUser: User | null;
    onLikeToggle?: (reviewId: number, isLiked: boolean) => void;
    courseName?: string;
    onCourseClick?: () => void;
    onDelete?: (reviewId: number) => void;
    onUserRefresh?: () => Promise<void>; // ✨ [추가] 유저 정보 갱신 콜백
}

export function ReviewItem({ review, currentUser, onLikeToggle, courseName, onCourseClick, onDelete, onUserRefresh }: ReviewItemProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(review.likes);
    const [commentCount, setCommentCount] = useState(review.commentCount || 0);

    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [comments, setComments] = useState<ReviewComment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // 별점 렌더링
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        ));
    };

    // 좋아요 토글
    const handleLike = async () => {
        if (!currentUser) {
            toast.error('로그인이 필요합니다.');
            return;
        }

        const prevLiked = isLiked;
        const prevCount = likeCount;

        setIsLiked(!prevLiked);
        setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

        try {
            await axios.post(`/api/reviews/${review.id}/like`, { userId: currentUser.id });
            if (onLikeToggle) onLikeToggle(review.id, !prevLiked);

            // ✨ [추가] 좋아요 성공 시 유저 정보(뱃지 등) 갱신
            if (onUserRefresh) {
                await onUserRefresh();
            }
        } catch (error) {
            setIsLiked(prevLiked);
            setLikeCount(prevCount);
            toast.error('좋아요 처리에 실패했습니다.');
        }
    };

    // ✨ [추가] 리뷰 삭제 핸들러
    const handleDelete = async () => {
        if (!currentUser) return;
        if (!confirm('정말로 이 리뷰를 삭제하시겠습니까?')) return;

        try {
            await axios.delete(`/api/reviews/${review.id}`, {
                params: { userId: currentUser.id }
            });
            toast.success('리뷰가 삭제되었습니다.');
            if (onDelete) onDelete(review.id); // 부모 컴포넌트에 알림
        } catch (error) {
            console.error('리뷰 삭제 실패:', error);
            toast.error('리뷰 삭제에 실패했습니다.');
        }
    };

    // 댓글 목록 불러오기
    const loadComments = async () => {
        if (isCommentsOpen) {
            setIsCommentsOpen(false);
            return;
        }

        setIsLoadingComments(true);
        try {
            const response = await axios.get(`/api/reviews/${review.id}/comments`);
            setComments(response.data);
            setIsCommentsOpen(true);
        } catch (error) {
            toast.error('댓글을 불러오는데 실패했습니다.');
        } finally {
            setIsLoadingComments(false);
        }
    };

    // 댓글 작성
    const handleSubmitComment = async () => {
        if (!currentUser) {
            toast.error('로그인이 필요합니다.');
            return;
        }
        if (!newComment.trim()) return;

        setIsSubmittingComment(true);
        try {
            const response = await axios.post(`/api/reviews/${review.id}/comments`, {
                userId: currentUser.id,
                content: newComment
            });

            setComments(prev => [...prev, response.data]);
            setCommentCount(prev => prev + 1);
            setNewComment('');
            toast.success('댓글이 등록되었습니다.');
        } catch (error) {
            toast.error('댓글 등록에 실패했습니다.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return (
        <div className="bg-white rounded-lg border p-4 space-y-4">
            {/* 리뷰 헤더 */}
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userName}`} />
                        <AvatarFallback>{review.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{review.userName}</span>
                            <span className="text-xs text-gray-500">
                                {review.date ? formatDistanceToNow(new Date(review.date), { addSuffix: true, locale: ko }) : '날짜 없음'}
                            </span>
                        </div>
                        {courseName && (
                            <div
                                className="flex items-center gap-1 text-sm text-blue-600 cursor-pointer hover:underline mt-0.5"
                                onClick={onCourseClick}
                            >
                                <MapPin className="w-3 h-3" /> {courseName}
                                <ChevronRight className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>

                    {/* ✨ [추가] 삭제 버튼 (본인일 때만 표시) */}
                    {currentUser && currentUser.id === review.userId && (
                        <button
                            onClick={handleDelete}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-2"
                            title="리뷰 삭제"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* 리뷰 내용 */}
            <p className="text-gray-700 whitespace-pre-wrap">{review.content}</p>

            {/* 리뷰 사진 */}
            {review.photos && review.photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {review.photos.map((photo, idx) => (
                        <img key={idx} src={photo} alt={`Review ${idx}`} className="h-32 w-auto rounded-lg object-cover" />
                    ))}
                </div>
            )}

            {/* 액션 버튼 */}
            <div className="flex items-center space-x-4 pt-2 border-t">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`space-x-1 ${isLiked ? 'text-blue-600' : 'text-gray-600'}`}
                    onClick={handleLike}
                >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>좋아요 {likeCount}</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="space-x-1 text-gray-600"
                    onClick={loadComments}
                >
                    <MessageCircle className="w-4 h-4" />
                    <span>댓글 {commentCount}</span>
                </Button>
            </div>

            {/* 댓글 섹션 */}
            {isCommentsOpen && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 mt-2">
                    <div className="space-y-3">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex space-x-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userName}`} />
                                        <AvatarFallback>{comment.userName ? comment.userName[0] : '?'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 bg-white p-3 rounded-lg border text-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium">{comment.userName}</span>
                                            <span className="text-xs text-gray-400">
                                                {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ko }) : '방금 전'}
                                            </span>
                                        </div>
                                        <p className="text-gray-700">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 text-sm py-2">
                                아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요..."
                            className="min-h-[40px] resize-none text-sm"
                            rows={1}
                        />
                        <Button
                            size="icon"
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim() || isSubmittingComment}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
