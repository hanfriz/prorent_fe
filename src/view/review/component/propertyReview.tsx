// components/PropertyReviews.tsx
"use client";

import React, { useState, useMemo } from 'react';
// import { FaRegStar, FaThumbsUp, FaExclamationTriangle } from 'react-icons/fa'; // Optional: Keep for non-loading UI
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getPublicReviews } from '@/service/review/reviewService'; // Import query function
import { Review } from '@/interface/reviewInterface'; // Import types
import AddReviewForm from './addReviewForm';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { useEligibleReservations } from '@/service/review/useReviewService';

interface PropertyReviewsProps {
  propertyId: string;
}

const PropertyReviews: React.FC<PropertyReviewsProps> = ({ propertyId }) => {
  const [sortBy, setSortBy] = useState<'createdAt' | 'rating'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

  const {
    data: reviewsData,
    isLoading,
    isError,
    error
  } = getPublicReviews({
    propertyId,
    sortBy,
    sortOrder,
  });

  const {
     data: eligibleReservations,
    isLoading: isEligibleLoading,
    isError: isEligibleError,
    error: eligibleError
  } = useEligibleReservations(propertyId);

  const averageRating = useMemo(() => {
    if (!reviewsData?.reviews || reviewsData.reviews.length === 0) return 0;
    const total = reviewsData.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviewsData.reviews.length;
  }, [reviewsData?.reviews]);

  const filteredReviews = useMemo(() => {
    if (!reviewsData?.reviews) return [];
    if (filterRating === 'all') return reviewsData.reviews;
    return reviewsData.reviews.filter(review => review.rating === filterRating);
  }, [reviewsData?.reviews, filterRating]);

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('-') as ['createdAt' | 'rating', 'desc' | 'asc'];
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleFilterChange = (value: string) => {
    setFilterRating(value === 'all' ? 'all' : Number(value));
  };

  // --- Determine if we should show the main content area (reviews list or empty state) ---
  const showContent = !isLoading && !isError && reviewsData;

  return (
    <section className="bg-white dark:bg-gray-900 py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-lg px-4 2xl:px-0">
        {/* Header with Average Rating and Add Review Button */}
        {/* This header is shown in almost all states except pure loading skeleton */}
        {!(isLoading && !reviewsData) && ( // Show header unless initial loading without any data
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Customer Reviews</h2>
            <div className="mt-4 sm:mt-0 flex items-center">
              {/* Show average rating if we have data, otherwise skeleton or nothing */}
              {reviewsData ? (
                <>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`}>
                        &#9733;
                      </span>
                    ))}
                  </div>
                  <p className="ms-2 text-sm font-medium text-gray-900 dark:text-white">{averageRating.toFixed(1)}</p>
                  <p className="ms-2 text-sm font-medium text-gray-500 dark:text-gray-400">({reviewsData.total} reviews)</p>
                </>
              ) : isError ? null : ( // Don't show avg rating skeleton on error
                // Optionally show a skeleton for the average rating area if not loading initial data
                // This skeleton is less critical now as controls are separate
                <>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="w-5 h-5 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="ml-2 h-4 w-16" />
                </>
              )}
               {(!isEligibleLoading && !isEligibleError && eligibleReservations && eligibleReservations.length > 0) ? (
                <Dialog open={isAddReviewOpen} onOpenChange={setIsAddReviewOpen}>
                  <DialogTrigger asChild>
                    <Button className="mt-4 sm:mt-0 ms-4">Write a review</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add a Review</DialogTitle>
                      <DialogDescription>
                        Share your experience with this property.
                      </DialogDescription>
                    </DialogHeader>
                    {/* Pass propertyId and the close handler */}
                    <AddReviewForm propertyId={propertyId} onClose={() => setIsAddReviewOpen(false)} />
                  </DialogContent>
                </Dialog>
              ) : (                
                (!isEligibleLoading && !isEligibleError) && (
                   <Button className="mt-4 sm:mt-0 ms-4" disabled>
                     Write a review
                   </Button>
                )
              )}
            </div>
          </div>
        )}

        {/* Sorting and Filtering Controls - Always Visible */}
        {/* Show controls if we have data, are loading but had data before, or are in error state */}
        {(reviewsData || isLoading || isError) && (
          <div className="mt-6 flex flex-wrap items-center gap-4 py-3 border-y border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <label htmlFor="sort-select" className="mr-2 text-sm font-medium text-gray-900 dark:text-white">Sort by:</label>
              <Select onValueChange={handleSortChange} defaultValue={`${sortBy}-${sortOrder}`} disabled={isLoading}>
                <SelectTrigger className="w-[180px]" id="sort-select">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest</SelectItem>
                  <SelectItem value="rating-desc">Highest Rating</SelectItem>
                  <SelectItem value="rating-asc">Lowest Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center">
              <label htmlFor="filter-select" className="mr-2 text-sm font-medium text-gray-900 dark:text-white">Filter:</label>
              <Select onValueChange={handleFilterChange} defaultValue="all" disabled={isLoading}>
                <SelectTrigger className="w-[120px]" id="filter-select">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Showing X of Y - Update based on state */}
            <div className="text-sm text-gray-700 dark:text-gray-400 ms-auto">
              {isLoading ? (
                <Skeleton className="h-4 w-40 ml-auto" />
              ) : isError ? (
                "Error loading count"
              ) : reviewsData ? (
                <>Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredReviews.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{reviewsData.total}</span> Reviews</>
              ) : (
                "No data"
              )}
            </div>
          </div>
        )}

        {/* --- Conditional Rendering for Main Content Area --- */}
        {isLoading && !reviewsData && (
          // --- Initial Loading Skeleton (only if no data has been fetched yet) ---
          <div className="mt-6 space-y-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="py-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <Skeleton className="h-10 w-10 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="w-4 h-4 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="ml-2 h-4 w-8" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-1" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-5/6 mb-3" />
                <Skeleton className="h-3 w-24 mb-4" />
                <Separator className="my-4" />
                <div className="ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-20 mt-2" />
                </div>
                <div className="mt-4 flex items-center">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-20 ml-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          // --- Error State ---
          <div className="mt-6 text-center py-10 text-red-500">
            Error loading reviews: {error?.message || 'Unknown error'}
          </div>
        )}

        {!isLoading && !isError && showContent && filteredReviews.length === 0 && (
          // --- Empty State (Data fetched, but no reviews match filters) ---
          <div className="mt-6 text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No reviews found matching your criteria.</p>
          </div>
        )}

        {!isLoading && !isError && showContent && filteredReviews.length > 0 && (
          // --- Reviews List (Data fetched and reviews available) ---
          <div className="mt-6 space-y-8">
            {filteredReviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* --- Initial Empty State (No data ever fetched and not loading/error) --- */}
        {/* This is a bit tricky now, but essentially if we are not loading, not in error, and have no data */}
        {!isLoading && !isError && !reviewsData && (
           <div className="mt-6 text-center py-10">
             <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
           </div>
        )}
      </div>
    </section>
  );
};

// --- Sub-component for Individual Review Item (Non-Loading UI) ---
interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const reviewerName = `${review.reviewer?.profile?.firstName || ''} ${review.reviewer?.profile?.lastName || ''}`.trim() || 'Anonymous';
  const reviewerInitials = reviewerName.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';
  const formattedDate = format(new Date(review.createdAt), 'dd MMMM yyyy', { locale: localeId });

  return (
    <article className="py-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <div className="mb-3 flex items-center">
        <Avatar className="mr-4 h-10 w-10">
          <AvatarImage
            src={review.reviewer?.profile?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName)}&background=random`}
            alt={reviewerName}
          />
          <AvatarFallback>{reviewerInitials}</AvatarFallback>
        </Avatar>
        <div className="font-medium dark:text-white">
          <p>{reviewerName}</p>
        </div>
      </div>

      <div className="mb-3 flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-500'}`}>
            &#9733;
          </span>
        ))}
        <p className="ms-2 text-sm font-medium text-gray-900 dark:text-white">{review.rating}.0</p>
      </div>

      <h3 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">{review.reservation?.Property?.name || 'Review'}</h3>
      <p className="mb-3 text-base font-normal text-gray-500 dark:text-gray-400">{review.content}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>

      {review.OwnerReply && (
        <>
          <Separator className="my-4" />
          <div className="ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Response from Property Owner</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{review.OwnerReply.content}</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {format(new Date(review.OwnerReply.createdAt), 'dd MMMM yyyy', { locale: localeId })}
            </p>
          </div>
        </>
      )}

      <aside className="mt-4">
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="px-2 py-1.5 text-xs">
            👍
            Helpful ({Math.floor(Math.random() * 10)})
          </Button>
          <Button variant="ghost" size="sm" className="ms-4 text-sm font-medium text-gray-900 hover:underline dark:text-white">
            ⚠️
            Report
          </Button>
        </div>
      </aside>
    </article>
  );
};

export default PropertyReviews;