import Axios from '@/lib/axios'; // Adjust import path
import { z } from 'zod';
import {
   ReplyToReviewInput, // This type is for the body content only
   UpdateReviewVisibilityInput
} from '@/validation/reviewValidation'; // Adjust import path
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EligibleReservation } from '@/interface/reviewInterface';
import { createReview, getEligibleReservations, replyToReview, updateReviewVisibility } from './reviewService';

// service/review/useReviewService.ts
export const useCreateReview = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createReview,
      onSuccess: newReview => {
         // ✅ Invalidate relevant queries to refetch
         queryClient.invalidateQueries({ queryKey: [ 'reviews', 'public' ] });
         queryClient.invalidateQueries({ queryKey: [ 'reviews', 'eligible-reservations' ] });

         console.log('Review created:', newReview);
      },
      onError: error => {
         console.error('Error creating review:', error);
      }
   });
};

export const useReplyToReview = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ reviewId, input }: { reviewId: string; input: ReplyToReviewInput }) =>
         replyToReview(reviewId, input),
      onSuccess: () => {
         // Example: Invalidate review queries
         // queryClient.invalidateQueries({ queryKey: ['reviews'] });
         console.log('Reply added successfully. Consider invalidating relevant queries.');
      },
      onError: error => {
         console.error('Error replying to review:', error);
         // Handle error display in UI if needed
      }
   });
};

export const useUpdateReviewVisibility = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ reviewId, input }: { reviewId: string; input: UpdateReviewVisibilityInput }) =>
         updateReviewVisibility(reviewId, input),
      onSuccess: updatedReview => {
         // Example: Invalidate review queries
         // queryClient.invalidateQueries({ queryKey: ['reviews'] });
         console.log('Review visibility updated successfully. Consider invalidating relevant queries.');
      },
      onError: error => {
         console.error('Error updating review visibility:', error);
      }
   });
};

export const useEligibleReservations = (
   propertyId: string,
   options?: {
      enabled?: boolean;
   }
) => {
   return useQuery<EligibleReservation[], Error>({
      queryKey: [ 'reviews', 'eligible-reservations', propertyId ],
      queryFn: () => getEligibleReservations(propertyId, { _skipAuthRedirect: true }),
      enabled: !!propertyId && (options?.enabled ?? true),
      retry: 1,
      staleTime: 1000 * 60 * 5
   });
};
