// components/AddReviewForm.tsx
"use client";

import React, { useState } from 'react';
import { useCreateReview } from '@/service/reviewService'; // Adjust path
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { FaRegStar } from "react-icons/fa";


interface AddReviewFormProps {
  propertyId: string; // Or get reservationId if that's the direct link
  // onClose function passed from parent (Dialog) to close it after submission
  onClose: () => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ propertyId, onClose }) => {
  // Assuming you have a way to get the reservationId associated with this property & user
  // This might come from props, context, or a separate query to find the user's reservation
  const [reservationId, setReservationId] = useState<string>(''); // Needs to be set correctly
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { mutate: createReview, isPending, isError, error } = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationId || !agreedToTerms) {
      alert('Please select a reservation and agree to the terms.');
      return;
    }

    // Find the reservation ID related to this property and the current user
    // This is a simplification - you'd likely fetch this or have it passed in
    // For now, assuming reservationId is provided correctly
    const reviewData = {
      reservationId, // Must be a valid reservation ID for the user and this property
      content,
      rating,
    };

    createReview(reviewData, {
      onSuccess: (newReview) => {
        console.log('Review created:', newReview);
        // Reset form
        setContent('');
        setRating(5);
        setAgreedToTerms(false);
        // Close the dialog
        onClose();
        // Optionally, show a success message (e.g., using toast)
        alert('Review submitted successfully!');
        // TanStack Query's usePublicReviews should automatically refetch due to mutation invalidation (if configured)
      },
      onError: (error) => {
        console.error('Error creating review:', error);
        // Display error to user
        alert(`Error submitting review: ${error.message || 'Unknown error'}`);
      }
    });
  };

  // Simple star rating selector
  const renderStarRating = () => {
    return (
      <div className="flex items-center mb-4">
        <Label className="mr-2 text-sm font-medium text-gray-900 dark:text-white">Your rating</Label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="bg-transparent border-0 p-0"
              aria-label={`Rate ${star} stars`}
            >
              <FaRegStar className={`w-6 h-6 ${star <= rating ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-500'}`} />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Reservation Selection - Simplified, needs real logic */}
      <div className="mb-4">
        <Label htmlFor="reservationId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Select Reservation (for {propertyId})
        </Label>
        <Input
          type="text"
          id="reservationId"
          value={reservationId}
          onChange={(e) => setReservationId(e.target.value)}
          placeholder="Enter Reservation ID"
          required
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Select the reservation you want to review.</p>
      </div>

      {renderStarRating()}

      <div className="mb-4">
        <Label htmlFor="review-content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Your review
        </Label>
        <Textarea
          id="review-content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review here..."
          required
        />
      </div>

      <div className="flex items-center mb-4">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
          required
        />
        <Label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          I agree with the <a href="#" className="text-primary-600 hover:underline dark:text-primary-500">terms and conditions</a>.
        </Label>
      </div>

      {isError && (
        <div className="mb-4 text-sm text-red-500">
          Error: {error?.message || 'Failed to submit review.'}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
};

export default AddReviewForm;