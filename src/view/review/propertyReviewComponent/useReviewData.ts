// hooks/review/useReviewData.ts
import { getPublicReviews } from '@/service/review/reviewService';
import { useEligibleReservations } from '@/service/review/useReviewService';

export const useReviewData = (propertyId: string, sortBy: string, sortOrder: string) => {
   const reviewsQuery = getPublicReviews({ propertyId, sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
   const eligibleQuery = useEligibleReservations(propertyId);

   return {
      reviewsData: reviewsQuery.data,
      isLoading: reviewsQuery.isLoading,
      isError: reviewsQuery.isError,
      error: reviewsQuery.error,
      eligibleReservations: eligibleQuery.data,
      isEligibleLoading: eligibleQuery.isLoading,
      isEligibleError: eligibleQuery.isError
   };
};
