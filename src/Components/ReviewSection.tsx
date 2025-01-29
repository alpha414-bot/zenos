import React, { useState } from 'react';
import Button from '@/Components/Button';
import { useAuthUser } from '@/Services/Hooks';
import { ReviewType, addReviewQuery } from '@/Services/Queries/ReviewsQuery';
import { useProductReviews } from '@/Services/Hooks/UseReviews';
import { notify } from '@/notify';

interface ReviewSectionProps {
  product_id: string | undefined;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ product_id }) => {
  const { data: authUser } = useAuthUser();
  const { data: reviews = [] } = useProductReviews(product_id);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  if (!product_id) return null;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser?.uid || !product_id) {
      notify.error({ text: 'Please sign in to leave a review' });
      return;
    }

    if (!comment.trim()) {
      notify.error({ text: 'Please write a review comment' });
      return;
    }

    try {
      setIsSubmitting(true);
      await addReviewQuery({
        product_id,
        user_id: authUser.uid,
        user_name: authUser.email?.split('@')[0] || 'Anonymous',
        rating,
        comment: comment.trim()
      });
      setComment('');
      setRating(5);
      notify.success({ text: 'Review submitted successfully!' });
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ value, onHover, onClick }: { 
    value: number; 
    onHover?: (rating: number) => void;
    onClick?: (rating: number) => void;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onClick?.(star)}
          onMouseEnter={() => onHover?.(star)}
          onMouseLeave={() => onHover?.(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <svg
            className={`w-6 h-6 ${
              star <= value ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'
            } transition-colors duration-200`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-8 px-4 sm:px-6">
      <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
      
      {authUser?.uid ? (
        <form onSubmit={handleSubmitReview} className="space-y-6 bg-gray-800/50 rounded-xl p-6">
          <div>
            <label className="block mb-2 font-medium text-gray-200">Rating</label>
            <StarRating 
              value={hoverRating || rating}
              onHover={setHoverRating}
              onClick={setRating}
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium text-gray-200">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg resize-none 
                focus:outline-none focus:ring-2 focus:ring-zenos-500 focus:border-transparent
                transition-all duration-200"
              rows={4}
              placeholder="Share your thoughts about this product..."
              required
            />
          </div>
          
          <Button
            text={isSubmitting ? 'Submitting...' : 'Submit Review'}
            className="w-full sm:w-auto px-6 py-2 transition-all duration-200 
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !comment.trim()}
            onClick={handleSubmitReview}
          />
        </form>
      ) : (
        <div className="p-6 bg-gray-800/50 rounded-xl text-center">
          <p className="text-gray-300">Please sign in to leave a review</p>
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 
              transition-all duration-200 hover:bg-gray-800/40"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium">
                    {review.user_name[0].toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-gray-200">{review.user_name}</span>
              </div>
              <StarRating value={review.rating} />
            </div>
            <p className="text-gray-300 mb-3 leading-relaxed">{review.comment}</p>
            <span className="text-sm text-gray-400">
              {formatDate(review.created_at.toDate())}
            </span>
          </div>
        ))}
        
        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No reviews yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;