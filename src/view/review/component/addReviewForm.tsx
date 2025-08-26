// components/AddReviewForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useCreateReview, useEligibleReservations } from '@/service/review/useReviewService'; // Import the new hook
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
// Import Select components from Shadcn
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale'; // Adjust locale as needed

interface AddReviewFormProps {
  propertyId?: string;
  reservationId?: string;
  onClose: () => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ propertyId,reservationId: initialReservationId, onClose }) => {
  // State for form fields
  const [selectedReservationId, setSelectedReservationId] = useState<string>(initialReservationId || '');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Use the new hook to fetch eligible reservations
   const shouldFetchEligible = !initialReservationId && propertyId;
  const {
    data: eligibleReservations,
    isLoading: isReservationsLoading,
    isError: isReservationsError,
    error: reservationsError
  } = useEligibleReservations(propertyId ?? '');

  const isDirectMode = !!initialReservationId;
  
  const { mutate: createReview, isPending: isCreatePending, isError: isCreateError, error: createError } = useCreateReview();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
const finalReservationId = isDirectMode ? initialReservationId : selectedReservationId;

    if (!finalReservationId) {
      alert(isDirectMode ? 'Reservation ID is missing.' : 'Please select a reservation to review.');
      return;
    }
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions.');
      return;
    }

    const reviewData = {
      reservationId: selectedReservationId, // Use the selected reservation ID
      content,
      rating,
    };

    createReview(reviewData, {
      onSuccess: (newReview) => {
        console.log('Review created:', newReview);
        // Reset form fields
        setSelectedReservationId('');
        setContent('');
        setRating(5);
        setAgreedToTerms(false);
        onClose(); // Close the dialog
        alert('Review submitted successfully!');
        // TanStack Query should automatically refetch related data if configured correctly
      },
      onError: (error) => {
        console.error('Error creating review:', error);
        alert(`Error submitting review: ${error.message || 'Unknown error'}`);
      }
    });
  };

  // Simple star rating selector (you can improve this UI)
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
              className="bg-transparent border-0 p-0 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-sm"
              aria-label={`Rate ${star} stars`}
            >
              <span className={`text-xl ${star <= rating ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-500'}`}>
                &#9733; {/* Unicode star */}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // --- Render Loading State for Reservations or Submission ---
  if (isReservationsLoading || isCreatePending) {
    return (
      <div className="space-y-4">
        {/* Reservation Select Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Select Trigger */}
          <Skeleton className="h-3 w-2/3" /> {/* Helper text */}
        </div>

        {/* Star Rating Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" /> {/* Label */}
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

  // --- Render Error State for Reservations ---
  if (isReservationsError) {
    return (
      <div className="text-center py-4 text-red-500">
        Error loading eligible reservations: {reservationsError?.message || 'Unknown error'}
        <div className="mt-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    );
  }

  // --- Render Form (Non-Loading UI) ---
  return (
    <form onSubmit={handleSubmit}>
      {/* Reservation Selection - Using Select Component */}
      {!isDirectMode && (
        <div className="mb-4">
          <Label htmlFor="reservation-select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Select Reservation to Review
          </Label>
          <Select
            value={selectedReservationId}
            onValueChange={setSelectedReservationId}
            disabled={isReservationsLoading || !eligibleReservations || eligibleReservations.length === 0}
          >
            <SelectTrigger className="w-full" id="reservation-select">
              <SelectValue placeholder={
                eligibleReservations && eligibleReservations.length === 0
                  ? "No eligible reservations"
                  : "Choose a reservation..."
              } />
            </SelectTrigger>
            <SelectContent>
              {eligibleReservations && eligibleReservations.length > 0 ? (
                eligibleReservations.map((reservation) => (
                  <SelectItem key={reservation.id} value={reservation.id}>
                    {reservation.propertyName} ({format(new Date(reservation.startDate), 'dd/MM/yy', { locale: localeId })} - {format(new Date(reservation.endDate), 'dd/MM/yy', { locale: localeId })})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  No eligible reservations found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {eligibleReservations && eligibleReservations.length > 0
              ? "Select the confirmed reservation you want to review. Only reservations that have ended are eligible."
              : "You don't have any confirmed reservations that have ended and haven't been reviewed yet."}
          </p>
        </div>
      )}

      {/* Star Rating */}
      {renderStarRating()}

      {/* Review Content */}
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

      {/* Terms Agreement */}
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

      {/* Display Create Review Error */}
      {isCreateError && (
        <div className="mb-4 text-sm text-red-500">
          Error: {createError?.message || 'Failed to submit review.'}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          disabled={isCreatePending || !selectedReservationId || !agreedToTerms}
        >
          {isCreatePending ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
};

export default AddReviewForm;