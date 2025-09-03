// components/PublicReviewsList.tsx
import React from "react";
import { getPublicReviews } from "@/service/review/reviewService"; // This returns `useQuery`
import { ReviewList } from "../propertyReviewComponent/reviewList"; // Reusable component
import {
  ReviewSkeleton,
  ErrorState,
  EmptyFilteredState,
} from "../propertyReviewComponent/reviewInitialState";

interface PublicReviewsListProps {
  propertyId: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const PublicReviewsList: React.FC<PublicReviewsListProps> = ({
  propertyId,
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  // ✅ Use TanStack Query (already defined in reviewService)
  const { data, isLoading, isError, error } = getPublicReviews({
    propertyId,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const reviews = data?.reviews;
  const total = data?.total || 0;

  // ✅ Show loading, error, empty, or list
  if (isLoading && !data) {
    return <ReviewSkeleton />;
  }

  if (isError) {
    return <ErrorState error={error} />;
  }

  if (!reviews || reviews.length === 0) {
    return <EmptyFilteredState />;
  }

  return <ReviewList reviews={reviews} />;
};

export default PublicReviewsList;
