// hooks/review/useAverageRating.ts
import { Review } from '@/interface/reviewInterface';

export const useAverageRating = (reviews: Review[] | undefined): number => {
   if (!reviews?.length) {return 0;}
   const total = reviews.reduce((sum, r) => sum + r.rating, 0);
   return total / reviews.length;
};
