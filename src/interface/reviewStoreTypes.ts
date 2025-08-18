// stores/reviewStoreTypes.ts
import { Review, GetReviewsResult } from './reviewInterface'; // Adjust path

// State for a single review (e.g., review being viewed/replied to)
export interface SingleReviewState {
   review: Review | null;
   isLoading: boolean;
   error: string | null;
}

// State for a list of reviews (e.g., public or owner reviews for a property)
export interface ReviewsListState {
   data: GetReviewsResult | null;
   isLoading: boolean;
   error: string | null;
}

// Overall Zustand store state
export interface ReviewStoreState {
   // --- Single Review State ---
   currentReview: SingleReviewState;
   setCurrentReview: (review: Review | null) => void;
   fetchReviewStart: () => void;
   fetchReviewSuccess: (review: Review) => void;
   fetchReviewFailure: (error: string) => void;

   // --- Public Reviews List State ---
   publicReviews: ReviewsListState;
   setPublicReviews: (data: GetReviewsResult | null) => void;
   fetchPublicReviewsStart: () => void;
   fetchPublicReviewsSuccess: (data: GetReviewsResult) => void;
   fetchPublicReviewsFailure: (error: string) => void;
   clearPublicReviews: () => void; // Useful for cleanup

   // --- Owner Reviews List State ---
   ownerReviews: ReviewsListState;
   setOwnerReviews: (data: GetReviewsResult | null) => void;
   fetchOwnerReviewsStart: () => void;
   fetchOwnerReviewsSuccess: (data: GetReviewsResult) => void;
   fetchOwnerReviewsFailure: (error: string) => void;
   clearOwnerReviews: () => void; // Useful for cleanup

   // --- Actions for Mutations (Optional, often handled by TanStack Query) ---
   // If you want to manage mutation loading/errors in Zustand too:
   createReviewLoading: boolean;
   createReviewError: string | null;
   setCreateReviewLoading: (loading: boolean) => void;
   setCreateReviewError: (error: string | null) => void;
   // Similar patterns for replyToReview, updateVisibility if needed in store
}
