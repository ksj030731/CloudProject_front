import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Star, Camera, X, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewModalProps {
  isOpen: boolean;
  courseName: string;
  onClose: () => void;
  onSubmit: (rating: number, content: string, photos: File[]) => void;
}

export function ReviewModal({ isOpen, courseName, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

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
    // 미리보기 URL 정리
    URL.revokeObjectURL(previewUrls[index]);
    
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('별점을 선택해주세요.');
      return;
    }

    if (!content.trim()) {
      toast.error('리뷰 내용을 입력해주세요.');
      return;
    }

    onSubmit(rating, content, photos);
    
    // 상태 초기화
    setRating(0);
    setHoverRating(0);
    setContent('');
    setPhotos([]);
    // 미리보기 URL 정리
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  const handleClose = () => {
    // 미리보기 URL 정리
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setPhotos([]);
    setRating(0);
    setHoverRating(0);
    setContent('');
    onClose();
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return '별로예요';
      case 2: return '그저 그래요';
      case 3: return '보통이에요';
      case 4: return '좋아요';
      case 5: return '최고예요';
      default: return '별점을 선택해주세요';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>리뷰 작성</DialogTitle>
          <DialogDescription>{courseName}에 대한 리뷰를 작성해주세요</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 별점 선택 */}
          <div className="text-center space-y-3">
            <Label className="text-base font-medium">이 코스는 어떠셨나요?</Label>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRatingClick(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-lg font-medium text-gray-700">
              {getRatingText(hoverRating || rating)}
            </p>
          </div>

          {/* 리뷰 내용 */}
          <div className="space-y-2">
            <Label htmlFor="review-content">리뷰를 작성해주세요</Label>
            <Textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="코스에 대한 솔직한 후기를 들려주세요. 어떤 점이 좋았나요? 다른 분들에게 추천하고 싶은 이유가 있나요?"
              rows={4}
              className="resize-none"
            />
            <div className="text-right text-sm text-gray-500">
              {content.length}/500
            </div>
          </div>

          {/* 사진 업로드 */}
          <div className="space-y-3">
            <Label>사진 추가 (선택사항)</Label>
            
            {/* 업로드된 사진 미리보기 */}
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
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 업로드 버튼 */}
            {photos.length < 5 && (
              <div>
                <input
                  type="file"
                  id="photo-upload"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="photo-upload"
                  className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="text-center">
                    <Camera className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                    <span className="text-sm text-gray-600">사진 추가</span>
                    <span className="text-xs text-gray-500 block">최대 5장</span>
                  </div>
                </Label>
              </div>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={rating === 0 || !content.trim()}
            >
              리뷰 등록
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
            >
              취소
            </Button>
          </div>

          {/* 안내 텍스트 */}
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>• 다른 사용자에게 도움이 되는 솔직한 리뷰를 작성해주세요</p>
            <p>• 부적절한 내용은 관리자에 의해 삭제될 수 있습니다</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}