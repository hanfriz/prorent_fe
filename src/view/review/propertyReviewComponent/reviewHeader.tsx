// review/ReviewHeader.tsx
import React from "react";
import { Button } from "@/components/ui/button";

interface ReviewHeaderProps {
  averageRating: number;
  totalReviews: number;
  canWriteReview: boolean;
  onWriteReview: () => void; // Just a click handler now
}

export const ReviewHeader = ({
  averageRating,
  totalReviews,
  canWriteReview,
  onWriteReview,
}: ReviewHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Customer Reviews
      </h2>
      <div className="mt-4 sm:mt-0 flex items-center">
        <StarRating rating={averageRating} />
        <p className="ms-2 text-sm font-medium text-gray-900 dark:text-white">
          {averageRating.toFixed(1)}
        </p>
        <p className="ms-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          ({totalReviews} reviews)
        </p>

        {/* ✅ Just a Button — no DialogTrigger */}
        <Button
          className="mt-4 sm:mt-0 ms-4"
          onClick={onWriteReview}
          disabled={!canWriteReview}
        >
          Write a review
        </Button>
      </div>
    </div>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-lg ${
            i < Math.floor(rating)
              ? "text-yellow-400"
              : "text-gray-300 dark:text-gray-500"
          }`}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};

export default ReviewHeader;
