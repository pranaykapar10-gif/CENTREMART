'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import ReviewModal, { ReviewSubmission } from './ReviewModal';
import { apiGet, apiPost } from '@/lib/api';

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  helpful_count: number;
  unhelpful_count: number;
  is_verified_purchase: boolean;
}

interface ReviewsSectionProps {
  productId: string;
  productName: string;
  initialAverageRating: number;
  initialTotalReviews: number;
}

export default function ReviewsSection({
  productId,
  productName,
  initialAverageRating,
  initialTotalReviews,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'rating-high' | 'rating-low'>('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const response = await apiGet<Review[]>(`/api/reviews/product/${productId}`);
      if (response.success && response.data) {
        setReviews(response.data);
      }
      setLoading(false);
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleReviewSubmit = async (review: ReviewSubmission) => {
    const response = await apiPost<Review>('/api/reviews', {
      productId,
      rating: review.rating,
      title: review.title,
      comment: review.text,
    });

    if (response.success && response.data) {
      setReviews([response.data, ...reviews]);
    } else {
      alert(response.error || 'Failed to submit review');
    }
  };

  const handleVote = async (reviewId: string, type: 'helpful' | 'unhelpful') => {
    const response = await apiPost(`/api/reviews/${reviewId}/vote`, { type });
    if (response.success) {
      setReviews(reviews.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            helpful_count: type === 'helpful' ? r.helpful_count + 1 : r.helpful_count,
            unhelpful_count: type === 'unhelpful' ? r.unhelpful_count + 1 : r.unhelpful_count,
          };
        }
        return r;
      }));
    }
  };

  let filteredReviews = reviews;
  if (filterRating) {
    filteredReviews = reviews.filter((r) => r.rating === filterRating);
  }

  if (sortBy === 'newest') {
    filteredReviews = [...filteredReviews].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sortBy === 'helpful') {
    filteredReviews = [...filteredReviews].sort((a, b) => b.helpful_count - a.helpful_count);
  } else if (sortBy === 'rating-high') {
    filteredReviews = [...filteredReviews].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'rating-low') {
    filteredReviews = [...filteredReviews].sort((a, b) => a.rating - b.rating);
  }

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100 : 0,
  }));

  if (loading) return <div className="py-12 text-center">Loading reviews...</div>;

  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-3xl font-black text-gray-900 mb-8">Customer Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Rating Summary */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="text-center mb-6">
              <div className="text-5xl font-black text-gray-900 mb-2">{initialAverageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i <= Math.round(initialAverageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">Based on {reviews.length} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg transition ${
                    filterRating === rating ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-sm font-semibold text-gray-700 w-12">{rating}★</span>
                  <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2">
          {/* Sort and Filter */}
          <div className="flex items-center justify-between mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'helpful' | 'rating-high' | 'rating-low')}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-semibold text-gray-900 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
            </select>
            {filterRating && (
              <button
                onClick={() => setFilterRating(null)}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {filteredReviews.length === 0 ? (
              <p className="text-gray-600 py-8">No reviews yet for this filter.</p>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-gray-900">{review.author}</p>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{review.date}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-600 transition">
                      <Flag size={18} />
                    </button>
                  </div>

                  {/* Review Content */}
                  <h3 className="font-bold text-gray-900 mb-2">{review.title}</h3>
                  <p className="text-gray-700 mb-4">{review.text}</p>

                  {/* Helpful Buttons */}
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold text-sm transition">
                      <ThumbsUp size={16} />
                      Helpful ({review.helpful})
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold text-sm transition">
                      <ThumbsDown size={16} />
                      Not Helpful ({review.notHelpful})
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={productName}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
