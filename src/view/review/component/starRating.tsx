// components/StarRating.tsx
import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number | null;
  onRatingChange: (rating: number) => void;
}

export const StarRating = ({ rating, onRatingChange }: StarRatingProps) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer transition-colors ${
            rating && star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
          onClick={() => onRatingChange(star)}
        />
      ))}
    </div>
  );
};
