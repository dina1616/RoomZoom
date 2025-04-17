'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // To check if user is logged in

interface ReviewFormProps {
  id: string; // Changed prop name from propertyId to id
  onSubmitSuccess: () => void; // Callback after successful submission
}

const ReviewForm: React.FC<ReviewFormProps> = ({ id, onSubmitSuccess }) => { // Use id directly
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated) {
    // Optionally, show a message prompting login
    // return <p>Please <Link href="/login">log in</Link> to leave a review.</p>;
    return null; // Or return null if form should be hidden
  }

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      // TODO: Implement this API endpoint using id
      const res = await fetch(`/api/properties/${id}/reviews`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      // Clear form and call success callback
      setRating(0);
      setComment('');
      onSubmitSuccess(); 

    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 border rounded bg-gray-50" aria-labelledby="review-form-heading">
      <h3 id="review-form-heading" className="text-lg font-semibold mb-3">Leave a Review</h3>
      {error && <p className="text-red-500 text-sm mb-3" role="alert">{error}</p>}
      
      {/* Star Rating using radio buttons for better accessibility */}
      <fieldset className="mb-3">
        <legend className="block text-sm font-medium text-gray-700 mb-1">Your Rating</legend>
        {/* Visually hidden instructions for screen readers */}
        <p id="rating-instructions" className="sr-only">Please select a rating from 1 to 5 stars.</p>
        <div className="flex items-center" role="radiogroup" aria-labelledby="rating-instructions">
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="cursor-pointer">
              {/* Hide actual radio button, style the star based on checked state */}
              <input 
                type="radio" 
                name="rating" 
                value={star} 
                checked={rating === star}
                onChange={() => handleRating(star)}
                className="sr-only" // Hide the radio button itself
                aria-label={`${star} out of 5 stars`} // Label for screen reader
              />
              <span 
                 className={`text-2xl mr-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                 aria-hidden="true" // Hide visual star from screen reader as radio is labelled
               >
                 ★
               </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Comment Textarea */}
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Comment</label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Share your thoughts about the property..."
          required // Add required attribute if comment is mandatory
          aria-required="true"
        />
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm; 