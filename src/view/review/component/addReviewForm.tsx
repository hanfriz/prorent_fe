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
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

interface AddReviewFormProps {
  propertyId: string;
  onClose: () => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ propertyId, onClose }) => {
  const [reservationId, setReservationId] = useState<string>('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { mutate: createReview, isPending, isError, error } = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationId || !agreedToTerms) {
      // Consider using a toast notification instead of alert
      alert('Please provide a reservation ID and agree to the terms.');
      return;
    }

    const reviewData = {
      reservationId,
      content,
      rating,
    };

    createReview(reviewData, {
      onSuccess: (newReview) => {
        console.log('Review created:', newReview);
        setContent('');
        setRating(5);
        setAgreedToTerms(false);
        onClose();
        // Consider using a toast notification for success
        alert('Review submitted successfully!');
      },
      onError: (error) => {
        console.error('Error creating review:', error);
        // Consider using a toast notification for errors
        alert(`Error submitting review: ${error.message || 'Unknown error'}`);
      }
    });
  };

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
              className="bg-transparent border-0 p-0 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-sm" // Improved focus
              aria-label={`Rate ${star} stars`}
            >
              <FaRegStar className={`w-6 h-6 ${star <= rating ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-500'}`} />
            </button>
          ))}
        </div>
      </div>
    );
  };

  // --- Render Skeleton Loading State ---
  // Show skeleton UI when isPending is true
  if (isPending) {
    return (
      <div className="space-y-4">
        {/* Reservation ID Input Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
          <Skeleton className="h-3 w-2/3" /> {/* Helper text */}
        </div>

        {/* Star Rating Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" /> 
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-6 h-6 rounded-full" /> 
            ))}
          </div>
        </div>

        {/* Review Textarea Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" /> {/* Label */}
          <Skeleton className="h-24 w-full" /> {/* Textarea */}
        </div>

        {/* Terms Checkbox Skeleton */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5 rounded" /> {/* Checkbox */}
          <Skeleton className="h-4 w-3/4" /> {/* Label text */}
        </div>

        {/* Button Skeletons */}
        <div className="flex justify-end space-x-2 pt-2">
          <Skeleton className="h-10 w-20" /> {/* Cancel Button */}
          <Skeleton className="h-10 w-28" /> {/* Submit Button */}
        </div>
      </div>
    );
  }

  // --- Render Form (Non-Loading UI) ---
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="reservationId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Reservation ID (for {propertyId})
        </Label>
        <Input
          type="text"
          id="reservationId"
          value={reservationId}
          onChange={(e) => setReservationId(e.target.value)}
          placeholder="Enter your Reservation ID"
          required
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Enter the ID of the reservation you want to review.
        </p>
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