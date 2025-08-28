// hooks/review/useFilteredReviews.ts
import { Review } from '@/interface/reviewInterface';

export const useFilteredReviews = (reviews: Review[] | undefined, filterRating: number | 'all'): Review[] => {
   if (!reviews) {return [];}
   return filterRating === 'all' ? reviews : reviews.filter(r => r.rating === filterRating);
};
