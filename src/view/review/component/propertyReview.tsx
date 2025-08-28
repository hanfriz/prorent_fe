// PropertyReviews.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AddReviewForm from "./addReviewForm";
import { useReviewData } from "../propertyReviewComponent/useReviewData";
import { useAverageRating } from "../propertyReviewComponent/useAverageRating";
import { useFilteredReviews } from "../propertyReviewComponent/useFilterReview";
import { ReviewHeader } from "../propertyReviewComponent/reviewHeader";
import { ReviewControls } from "../propertyReviewComponent/reviewController";
import { ReviewList } from "../propertyReviewComponent/reviewList";
import {
  ReviewSkeleton,
  ErrorState,
  EmptyFilteredState,
  InitialEmptyState,
} from "../propertyReviewComponent/reviewInitialState";
import { getPublicReviews } from "@/service/review/reviewService";

interface PropertyReviewsProps {
  propertyId: string;
}

const PropertyReviews: React.FC<PropertyReviewsProps> = ({ propertyId }) => {
  const [sortBy, setSortBy] = useState<"createdAt" | "rating">("createdAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

  // Only fetch public reviews (no auth needed)
  const {
    data: reviewsData,
    isLoading,
    isError,
    error,
  } = getPublicReviews({
    propertyId,
    sortBy,
    sortOrder,
  });

  const averageRating = useAverageRating(reviewsData?.reviews);
  const filteredReviews = useFilteredReviews(
    reviewsData?.reviews,
    filterRating
  );
  const handleOpenReviewModal = async () => {
    try {
      const res = await fetch(
        `/api/review/property/${propertyId}/eligible-reservations`
      );
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) throw new Error("Failed or not eligible");

      const data = await res.json();
      if (data?.reservations?.length > 0) {
        setIsAddReviewOpen(true);
      } else {
        alert("You have no eligible stay to review.");
      }
    } catch (err) {
      console.error("Eligibility check failed:", err);
      window.location.href = "/login";
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-lg px-4 2xl:px-0">
        <ReviewHeader
          averageRating={averageRating}
          totalReviews={reviewsData?.total || 0}
          canWriteReview={true}
          onWriteReview={handleOpenReviewModal}
        />

        {(reviewsData || isLoading || isError) && (
          <ReviewControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            filterRating={filterRating}
            totalFiltered={filteredReviews.length}
            total={reviewsData?.total || 0}
            isLoading={isLoading}
            onSortChange={(value) => {
              const [by, order] = value.split("-") as [
                "createdAt" | "rating",
                "desc" | "asc"
              ];
              setSortBy(by);
              setSortOrder(order);
            }}
            onFilterChange={(v) =>
              setFilterRating(v === "all" ? "all" : Number(v))
            }
          />
        )}

        <ReviewContent
          isLoading={isLoading}
          isError={isError}
          error={error}
          reviews={filteredReviews}
          hasData={!!reviewsData}
        />

        <Dialog open={isAddReviewOpen} onOpenChange={setIsAddReviewOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a Review</DialogTitle>
              <DialogDescription>
                Share your experience with this property.
              </DialogDescription>
            </DialogHeader>
            <AddReviewForm
              propertyId={propertyId}
              onClose={() => setIsAddReviewOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

const ReviewContent = ({
  isLoading,
  isError,
  error,
  reviews,
  hasData,
}: any) => {
  if (isLoading && !hasData) return <ReviewSkeleton />;
  if (isError) return <ErrorState error={error} />;
  if (reviews.length === 0 && hasData) return <EmptyFilteredState />;
  if (!hasData) return <InitialEmptyState />;
  return <ReviewList reviews={reviews} />;
};

export default PropertyReviews;
