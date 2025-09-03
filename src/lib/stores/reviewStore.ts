// stores/reviewStore.ts
import { create } from 'zustand';

interface ReviewUiState {
   // ✅ UI State (not from API)
   isReviewModalOpen: boolean;
   setIsReviewModalOpen: (open: boolean) => void;

   draftReview: {
      content: string;
      rating: number | null;
   };
   setDraftReview: (draft: Partial<ReviewUiState['draftReview']>) => void;
   clearDraftReview: () => void;

   lastSubmittedReviewPropertyId: string | null;
   setLastSubmitted: (id: string) => void;

   // Optional: Toast or feedback
   showReviewSuccessToast: boolean;
   setShowReviewSuccessToast: (show: boolean) => void;
}

export const useReviewStore = create<ReviewUiState>(set => ({
   isReviewModalOpen: false,
   setIsReviewModalOpen: open => set({ isReviewModalOpen: open }),

   draftReview: { content: '', rating: null },
   setDraftReview: draft =>
      set(state => ({
         draftReview: { ...state.draftReview, ...draft }
      })),
   clearDraftReview: () => set({ draftReview: { content: '', rating: null } }),

   lastSubmittedReviewPropertyId: null,
   setLastSubmitted: id => set({ lastSubmittedReviewPropertyId: id }),

   showReviewSuccessToast: false,
   setShowReviewSuccessToast: show => set({ showReviewSuccessToast: show })
}));
