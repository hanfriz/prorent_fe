import Axios from '@/lib/axios'; // Adjust import path
import { z } from 'zod';
import {
   ReplyToReviewInput, // This type is for the body content only
   UpdateReviewVisibilityInput
} from '@/validation/reviewValidation'; // Adjust import path
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EligibleReservation } from '@/interface/reviewInterface';
import { createReview, replyToReview, updateReviewVisibility } from './reviewService';

export const useCreateReview = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createReview,
      onSuccess: () => {
         // Example: Invalidate public and owner review queries for properties
         // You might need to refine the query key invalidation based on your specific needs
         // queryClient.invalidateQueries({ queryKey: ['reviews'] });
         console.log('Review created successfully. Consider invalidating relevant queries.');
      },
      onError: error => {
         console.error('Error creating review:', error);
         // Handle error display in UI if needed
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

export function useEligibleReservations (propertyId: string) {
   return useQuery<EligibleReservation[], Error>({
      queryKey: [ 'reviews', 'eligible-reservations', propertyId ],
      queryFn: async () => {
         try {
            const url = `/review/property/${propertyId}/eligible-reservations`;
            const response = await Axios.get<EligibleReservation[]>(url);
            return response.data;
         } catch (error: any) {
            console.error('Error fetching eligible reservations:', error);
            if (error.response?.status === 404) {
               throw new Error('No eligible reservations found for this property.');
            } else if (error.response) {
               throw new Error(
                  `Failed to fetch eligible reservations: ${error.response.data?.message || error.message}`
               );
            } else if (error.request) {
               throw new Error('Network error. Please check your connection.');
            } else {
               // Something else happened
               throw new Error(`Error: ${error.message}`);
            }
         }
      },

      enabled: !!propertyId
   });
}
