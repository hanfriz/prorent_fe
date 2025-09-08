// components/addReviewForm.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "./starRating"; // We'll create this
import { useCreateReview } from "@/service/review/useReviewService";
import { useReviewStore } from "@/lib/stores/reviewStore"; // For draft only

interface AddReviewFormProps {
  reservationId: string | null;
  onClose: () => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({
  reservationId,
  onClose,
}) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(5);

  // ✅ Use TanStack Query mutation
  const { mutate: createReview, isPending, isError, error } = useCreateReview();

  // ✅ Optional: Save draft to Zustand (for persistence if user leaves)
  const { draftReview, setDraftReview, clearDraftReview } = useReviewStore();

  // Sync form with draft on mount (if needed)
  React.useEffect(() => {
    if (draftReview.content || draftReview.rating !== null) {
      setContent(draftReview.content);
      setRating(draftReview.rating);
    }
  }, []);

  if (!reservationId) {
    return <div>Invalid reservation</div>; // Should not happen
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !content.trim()) return;

    // ✅ Prepare input for mutation
    const reviewData = {
      reservationId,
      content,
      rating,
    };

    // ✅ Trigger mutation
    createReview(reviewData, {
      onSuccess: () => {
        // ✅ Clear draft
        clearDraftReview();
        // ✅ Close modal
        onClose();
      },
      onError: (err) => {
        console.error("Failed to submit review:", err);
        // Error is already captured in `isError` and `error`
      },
    });
  };

  const handleSaveDraft = () => {
    setDraftReview({ content, rating });
    onClose(); // or just minimize
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rating">Your Rating</Label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Review</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience..."
          className="min-h-24"
          required
        />
      </div>

      {isError && (
        <div className="text-sm text-red-500">
          {error?.message || "Failed to submit review. Please try again."}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isPending}
          className="cursor-pointer"
        >
          Save Draft
        </Button>
        <Button type="submit" disabled={isPending} className="cursor-pointer">
          {isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
};

export default AddReviewForm;
