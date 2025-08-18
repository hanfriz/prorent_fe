// stores/reviewStore.ts
import { create } from 'zustand';
import { ReviewStoreState, SingleReviewState, ReviewsListState } from '@/interface/reviewStoreTypes';
import { Review, GetReviewsResult } from '@/interface/reviewInterface';

const initialSingleReviewState: SingleReviewState = {
   review: null,
   isLoading: false,
   error: null
};

const initialReviewsListState: ReviewsListState = {
   data: null,
   isLoading: false,
   error: null
};

// Create the Zustand store
export const useReviewStore = create<ReviewStoreState>()(set => ({
   // --- Single Review State ---
   currentReview: initialSingleReviewState,
   setCurrentReview: review => set({ currentReview: { ...initialSingleReviewState, review } }),
   fetchReviewStart: () =>
      set(state => ({
         currentReview: { ...state.currentReview, isLoading: true, error: null }
      })),
   fetchReviewSuccess: review =>
      set({
         currentReview: { review, isLoading: false, error: null }
      }),
   fetchReviewFailure: error =>
      set(state => ({
         currentReview: { ...state.currentReview, isLoading: false, error }
      })),

   // --- Public Reviews List State ---
   publicReviews: initialReviewsListState,
   setPublicReviews: data => set({ publicReviews: { ...initialReviewsListState, data } }),
   fetchPublicReviewsStart: () =>
      set(state => ({
         publicReviews: { ...state.publicReviews, isLoading: true, error: null }
      })),
   fetchPublicReviewsSuccess: data =>
      set({
         publicReviews: { data, isLoading: false, error: null }
      }),
   fetchPublicReviewsFailure: error =>
      set(state => ({
         publicReviews: { ...state.publicReviews, isLoading: false, error }
      })),
   clearPublicReviews: () => set({ publicReviews: initialReviewsListState }),

   // --- Owner Reviews List State ---
   ownerReviews: initialReviewsListState,
   setOwnerReviews: data => set({ ownerReviews: { ...initialReviewsListState, data } }),
   fetchOwnerReviewsStart: () =>
      set(state => ({
         ownerReviews: { ...state.ownerReviews, isLoading: true, error: null }
      })),
   fetchOwnerReviewsSuccess: data =>
      set({
         ownerReviews: { data, isLoading: false, error: null }
      }),
   fetchOwnerReviewsFailure: error =>
      set(state => ({
         ownerReviews: { ...state.ownerReviews, isLoading: false, error }
      })),
   clearOwnerReviews: () => set({ ownerReviews: initialReviewsListState }),

   // --- Mutation States (Optional) ---
   createReviewLoading: false,
   createReviewError: null,
   setCreateReviewLoading: loading => set({ createReviewLoading: loading }),
   setCreateReviewError: error => set({ createReviewError: error })
   // Add similar states/actions for reply/update visibility if needed
}));
