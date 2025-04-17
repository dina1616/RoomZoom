'use client';

import React, { useState, useEffect } from 'react';
import ReviewForm from '@/components/ReviewForm'; // Assuming ReviewForm exists

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
  user: { id: string; name: string | null };
}

interface ReviewSectionProps {
  id: string;
  initialReviews: Review[]; // Accept initial reviews fetched by server component
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ id, initialReviews }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [hoveredRating, setHoveredRating] = useState(0);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Function to fetch reviews (e.g., for refreshing or loading more)
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch reviews from the GET endpoint
      const res = await fetch(`/api/properties/${id}/reviews`); // Use id
      if (!res.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await res.json();
      setReviews(data.reviews); // Assuming API returns { reviews: [...] }
      // TODO: Update pagination state if applicable
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    // Refetch reviews after successful submission
    fetchReviews(); 
    // Or, could optimistically add the new review to the state
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your review submission logic here
  };

  return (
    <section className="mt-8 pt-6 border-t" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-2xl font-semibold mb-4">Reviews</h2>
      
      {/* Review Submission Form */}
      <ReviewForm id={id} onSubmitSuccess={handleReviewSubmitted} />

      {/* Display Existing Reviews */}
      <div className="mt-6 space-y-4">
        {loading && <p role="status">Loading reviews...</p>}
        {error && <p className="text-red-500" role="alert">Error loading reviews: {error}</p>}
        {!loading && reviews.length === 0 && (
          <p className="text-gray-600">No reviews yet. Be the first to leave one!</p>
        )}
        {!loading && reviews.length > 0 && (
          <ul className="space-y-4">
            {reviews.map(review => (
              <li key={review.id} className="p-4 border rounded bg-white shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{review.user.name || 'Anonymous'}</span>
                  <time dateTime={new Date(review.createdAt).toISOString()} className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <div className="flex items-center mb-2" aria-label={`Rating: ${review.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={`mr-0.5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      aria-hidden="true"
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
        {/* TODO: Add Load More button if implementing pagination */} 
      </div>
    </section>
  );
};

export default ReviewSection;
