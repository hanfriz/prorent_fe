// components/CreateReviewForm.tsx (example)
import React, { useState } from 'react';
import { useReviewStore } from '@/lib/stores/reviewStore'; // Adjust path
import { useCreateReview } from '@/service/reviewService'; // Adjust path - using TanStack Query mutation

const CreateReviewForm = ({ reservationId }: { reservationId: string }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  // Use TanStack Query mutation hook for actual API call and state management
  const { mutate: createReviewMutation, isPending, isError, error } = useCreateReview();

  const isCreateLoading = useReviewStore((state) => state.createReviewLoading);
  const createError = useReviewStore((state) => state.createReviewError);
  const setCreateReviewLoading = useReviewStore((state) => state.setCreateReviewLoading);
  const setCreateReviewError = useReviewStore((state) => state.setCreateReviewError);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationId) return;

    // Prepare data matching your Zod schema/frontend interface
    const reviewData = {
      reservationId,
      content,
      rating,
    };

    // Trigger the TanStack Query mutation
    createReviewMutation(reviewData, {
      onSuccess: (newReview) => {
        console.log("Review created successfully:", newReview);
        // Update Zustand state if needed (e.g., add to a local list)
        // Or rely on TanStack Query's onSuccess/invalidateQueries
        // Reset form
        setContent('');
        setRating(5);
        // Maybe show success message
      },
      onError: (error) => {
        console.error("Error creating review:", error);
        // Handle error display (e.g., show error message)
        // Maybe update Zustand error state if using it for this
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="content">Review:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="rating">Rating (1-5):</label>
        <input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        />
      </div>
      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit Review'}
      </button>
      {isError && <p>Error: {error?.message || 'Failed to create review'}</p>}
    </form>
  );
};

export default CreateReviewForm;