// review/ReviewList.tsx
import React from "react";
import { ReviewItem } from "./reviewItem";

interface ReviewListProps {
  reviews: any[];
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
  return (
    <div className="mt-6 space-y-8">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};
