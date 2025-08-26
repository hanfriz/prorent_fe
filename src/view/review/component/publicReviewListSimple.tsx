// components/PublicReviewsList.tsx (example)
import React, { useEffect } from 'react';
import { useReviewStore } from '@/lib/stores/reviewStore'; // Adjust path
import { getPublicReviews } from '@/service/review/reviewService'; // Adjust path

interface PublicReviewsListProps {
  propertyId: string;
  page: number;
  limit: number;
}

const PublicReviewsList: React.FC<PublicReviewsListProps> = ({ propertyId }) => {
  const { data, isLoading, error } = useReviewStore((state) => state.publicReviews);
  // Or use individual selectors for better performance if needed:
  // const publicReviewsData = useReviewStore((state) => state.publicReviews.data);
  // const isLoading = useReviewStore((state) => state.publicReviews.isLoading);
  // const error = useReviewStore((state) => state.publicReviews.error);

  const fetchPublicReviewsStart = useReviewStore((state) => state.fetchPublicReviewsStart);
  const fetchPublicReviewsSuccess = useReviewStore((state) => state.fetchPublicReviewsSuccess);
  const fetchPublicReviewsFailure = useReviewStore((state) => state.fetchPublicReviewsFailure);

  useEffect(() => {
  const fetchReviews = async () => {
    if (!propertyId) return; // Don't fetch without propertyId

    fetchPublicReviewsStart();
    try {
      // Call your service function (could also use TanStack Query here)
      // Make sure getPublicReviews accepts the right params
      const result = await getPublicReviews({ propertyId, page: 1, limit: 10 }); // Example params
      if (result && result.data) {
        fetchPublicReviewsSuccess(result.data);
      } else {
        // Handle the case where result is undefined or result.data is undefined
        // For example, you could call fetchPublicReviewsFailure with an error message
        fetchPublicReviewsFailure('Failed to fetch public reviews');
      }
    } catch (err: any) {
      // Handle error from service (e.g., extract message)
      const errorMessage = err.message || 'Failed to fetch public reviews';
      fetchPublicReviewsFailure(errorMessage);
    }
  };

  fetchReviews();
}, [propertyId, fetchPublicReviewsStart, fetchPublicReviewsSuccess, fetchPublicReviewsFailure]);

  if (isLoading) return <div>Loading reviews...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data || data.reviews.length === 0) return <div>No reviews found.</div>;

  return (
    <div>
      <h3>Public Reviews</h3>
      <ul>
        {data.reviews.map((review) => (
          <li key={review.id}>
            {/* Render review details */}
            <p>{review.content}</p>
            <p>Rating: {review.rating}</p>
            {/* ... */}
          </li>
        ))}
      </ul>
      {/* Pagination controls could go here using data.page, data.totalPages etc. */}
    </div>
  );
};

export default PublicReviewsList;