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
import { Button } from "@/components/ui/button";
import { useEligibleReservations } from "@/service/review/useReviewService";
import { ReviewContentProps } from "@/interface/reviewInterface";

interface PropertyReviewsProps {
  propertyId: string;
}
type FilterRating = "all" | "5" | "4" | "3" | "2" | "1";

const PropertyReviews: React.FC<PropertyReviewsProps> = ({ propertyId }) => {
  const [sortBy, setSortBy] = useState<"createdAt" | "rating">("createdAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [filterRating, setFilterRating] = useState<FilterRating>("all");
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

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
    filterRating === "all" ? filterRating : parseInt(filterRating, 10)
  );

  const { refetch: refetchEligibility } = useEligibleReservations(propertyId, {
    enabled: false,
  });

  const handleWriteReviewClick = async () => {
    const { data, error: eligibilityError } = await refetchEligibility();

    if (data?.length) {
      setSelectedReservationId(data[0].id);
      setIsAddReviewOpen(true);
    } else if (eligibilityError) {
      if (eligibilityError.message === "UNAUTHENTICATED") {
        setShowLoginPrompt(true);
      } else {
        alert("You have no eligible stays to review.");
      }
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-lg px-4 2xl:px-0">
        <ReviewHeader
          averageRating={averageRating}
          totalReviews={reviewsData?.total || 0}
          canWriteReview={true}
          onWriteReview={handleWriteReviewClick}
        />

        {(reviewsData || isLoading || isError) && (
          <ReviewControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            filterRating={filterRating}
            totalFiltered={filteredReviews.length}
            total={reviewsData?.total || 0}
            isLoading={isLoading}
            onSortChange={handleSortChange(setSortBy, setSortOrder)}
            onFilterChange={setFilterRating}
          />
        )}

        <ReviewContent
          isLoading={isLoading}
          isError={isError}
          error={error}
          reviews={filteredReviews}
          hasData={!!reviewsData}
        />

        <AddReviewDialog
          isOpen={isAddReviewOpen}
          onClose={() => {
            setIsAddReviewOpen(false);
            setSelectedReservationId(null);
          }}
          reservationId={selectedReservationId}
        />

        <LoginPromptDialog
          isOpen={showLoginPrompt}
          onConfirm={() => (window.location.href = "/login")}
          onCancel={() => setShowLoginPrompt(false)}
        />
      </div>
    </section>
  );
};

// --- Subcomponents ---
const handleSortChange =
  (
    setSortBy: (value: "createdAt" | "rating") => void,
    setSortOrder: (value: "desc" | "asc") => void
  ) =>
  (value: string) => {
    const [by, order] = value.split("-") as [
      "createdAt" | "rating",
      "desc" | "asc"
    ];
    setSortBy(by);
    setSortOrder(order);
  };

const AddReviewDialog = ({
  isOpen,
  onClose,
  reservationId,
}: {
  isOpen: boolean;
  onClose: () => void;
  reservationId: string | null;
}) => {
  if (!reservationId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Review</DialogTitle>
          <DialogDescription>
            Share your experience with this property.
          </DialogDescription>
        </DialogHeader>
        <AddReviewForm reservationId={reservationId} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

const LoginPromptDialog = ({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <Dialog open={isOpen} onOpenChange={onCancel}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Log In Required</DialogTitle>
        <DialogDescription>
          You need to be logged in to write a review. Would you like to go to
          the login page?
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-3 mt-4">
        <Button variant="outline" onClick={onCancel} className="cursor-pointer">
          Cancel
        </Button>
        <Button onClick={onConfirm} className="cursor-pointer">
          Go to Login
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

const ReviewContent = ({
  isLoading,
  isError,
  error,
  reviews,
  hasData,
}: ReviewContentProps) => {
  if (isLoading && !hasData) return <ReviewSkeleton />;
  if (isError) return <ErrorState error={error} />;
  if (reviews?.length === 0 && hasData) return <EmptyFilteredState />;
  if (!hasData) return <InitialEmptyState />;
  return <ReviewList reviews={reviews || []} />;
};

export default PropertyReviews;
