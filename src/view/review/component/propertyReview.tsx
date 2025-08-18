// "use client"; // Important for client-side interactivity in App Router

// import React, { useState, useMemo } from 'react';
// import { getPublicReviews } from '@/service/reviewService'; 
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button'; 
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Separator } from '@/components/ui/separator'; 
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label'; 
// import { Input } from '@/components/ui/input'; 
// import { Checkbox } from '@/components/ui/checkbox';
// import { FaRegStar, FaThumbsUp, FaExclamationTriangle } from 'react-icons/fa';

// import { Review } from '@/interface/reviewInterface';
// import AddReviewForm from './addReviewForm';

// interface PropertyReviewsProps {
//   propertyId: string;
// }

// const PropertyReviews: React.FC<PropertyReviewsProps> = ({ propertyId }) => {
//   const [sortBy, setSortBy] = useState<'createdAt' | 'rating'>('createdAt');
//   const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
//   const [filterRating, setFilterRating] = useState<number | 'all'>('all');
//   const [isAddReviewOpen, setIsAddReviewOpen] = useState(false); // State for Add Review Dialog

//   // Fetch public reviews using TanStack Query hook
//   // Assume getPublicReviews hook is configured in reviewService
//   const { data: reviewsData, isLoading, isError, error } = usePublicReviews({
//     propertyId,
//     sortBy,
//     sortOrder,
//     // Add page/limit if implementing pagination here
//   });

//   // Calculate average rating (simplified)
//   const averageRating = useMemo(() => {
//     if (!reviewsData?.reviews || reviewsData.reviews.length === 0) return 0;
//     const total = reviewsData.reviews.reduce((sum, review) => sum + review.rating, 0);
//     return total / reviewsData.reviews.length;
//   }, [reviewsData?.reviews]);

//   // Filter reviews by rating if needed
//   const filteredReviews = useMemo(() => {
//     if (!reviewsData?.reviews) return [];
//     if (filterRating === 'all') return reviewsData.reviews;
//     return reviewsData.reviews.filter(review => review.rating === filterRating);
//   }, [reviewsData?.reviews, filterRating]);

//   const handleSortChange = (value: string) => {
//     const [newSortBy, newSortOrder] = value.split('-') as ['createdAt' | 'rating', 'desc' | 'asc'];
//     setSortBy(newSortBy);
//     setSortOrder(newSortOrder);
//   };

//   const handleFilterChange = (value: string) => {
//     setFilterRating(value === 'all' ? 'all' : Number(value));
//   };

//   if (isLoading) return <div className="text-center py-10">Loading reviews...</div>;
//   if (isError) return <div className="text-center py-10 text-red-500">Error loading reviews: {error?.message}</div>;
//   if (!reviewsData || filteredReviews.length === 0) return <div className="text-center py-10">No reviews yet. Be the first to review!</div>;

//   return (
//     <section className="bg-white dark:bg-gray-900 py-8 antialiased md:py-16">
//       <div className="mx-auto max-w-screen-lg px-4 2xl:px-0">
//         {/* Header with Average Rating */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//           <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Customer Reviews</h2>
//           <div className="mt-4 sm:mt-0 flex items-center">
//             <div className="flex items-center">
//               {[...Array(5)].map((_, i) => (
//                 <StarIcon key={i} className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`} />
//               ))}
//             </div>
//             <p className="ms-2 text-sm font-medium text-gray-900 dark:text-white">{averageRating.toFixed(1)}</p>
//             <p className="ms-2 text-sm font-medium text-gray-500 dark:text-gray-400">({reviewsData.total} reviews)</p>
//           </div>
//           <Dialog open={isAddReviewOpen} onOpenChange={setIsAddReviewOpen}>
//             <DialogTrigger asChild>
//               <Button className="mt-4 sm:mt-0 ms-0 sm:ms-4">Write a review</Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//               <DialogHeader>
//                 <DialogTitle>Add a Review</DialogTitle>
//                 <DialogDescription>
//                   Share your experience with this property.
//                 </DialogDescription>
//               </DialogHeader>
//               {/* Add Review Form inside Dialog */}
//               <AddReviewForm propertyId={propertyId} onClose={() => setIsAddReviewOpen(false)} />
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Sorting and Filtering Controls */}
//         <div className="mt-6 flex flex-wrap items-center gap-4 py-3 border-y border-gray-200 dark:border-gray-700">
//           <div className="flex items-center">
//             <Label htmlFor="sort-select" className="mr-2 text-sm font-medium text-gray-900 dark:text-white">Sort by:</Label>
//             <Select onValueChange={handleSortChange} defaultValue={`${sortBy}-${sortOrder}`}>
//               <SelectTrigger className="w-[180px]" id="sort-select">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="createdAt-desc">Newest</SelectItem>
//                 <SelectItem value="createdAt-asc">Oldest</SelectItem>
//                 <SelectItem value="rating-desc">Highest Rating</SelectItem>
//                 <SelectItem value="rating-asc">Lowest Rating</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex items-center">
//             <Label htmlFor="filter-select" className="mr-2 text-sm font-medium text-gray-900 dark:text-white">Filter:</Label>
//             <Select onValueChange={handleFilterChange} defaultValue="all">
//               <SelectTrigger className="w-[120px]" id="filter-select">
//                 <SelectValue placeholder="Filter" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Stars</SelectItem>
//                 <SelectItem value="5">5 Stars</SelectItem>
//                 <SelectItem value="4">4 Stars</SelectItem>
//                 <SelectItem value="3">3 Stars</SelectItem>
//                 <SelectItem value="2">2 Stars</SelectItem>
//                 <SelectItem value="1">1 Star</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Placeholder for "Showing X of Y" - adapt if using pagination */}
//           <div className="text-sm text-gray-700 dark:text-gray-400 ms-auto">
//             Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredReviews.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{reviewsData.total}</span> Reviews
//           </div>
//         </div>

//         {/* Reviews List */}
//         <div className="mt-6 space-y-8">
//           {filteredReviews.map((review) => (
//             <ReviewItem key={review.id} review={review} />
//           ))}
//         </div>

//         {/* Pagination Placeholder - Implement if needed using TanStack Query's hasNextPage, etc. */}
//         {/* <div className="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
//           <span className="text-sm text-gray-700 dark:text-gray-400">
//             Showing <span className="font-semibold text-gray-900 dark:text-white">1</span> to <span className="font-semibold text-gray-900 dark:text-white">5</span> of <span className="font-semibold text-gray-900 dark:text-white">{reviewsData.total}</span> Reviews
//           </span>
//           <div className="xs:mt-0 inline-flex">
//             <Button variant="outline" size="sm" className="rounded-e-0 border-e-0">Prev</Button>
//             <Button variant="outline" size="sm" className="rounded-s">Next</Button>
//           </div>
//         </div> */}
//       </div>
//     </section>
//   );
// };

// // --- Sub-component for Individual Review Item ---
// interface ReviewItemProps {
//   review: Review;
// }

// const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
//   const reviewerName = `${review.reviewer?.profile?.firstName || ''} ${review.reviewer?.profile?.lastName || ''}`.trim() || 'Anonymous';
//   const reviewerInitials = reviewerName.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';
//   // Format date - you might want to use a library like date-fns or moment
//   const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });

//   return (
//     <article className="py-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
//       <div className="mb-3 flex items-center">
//         <Avatar className="mr-4 h-10 w-10">
//           {/* Replace with actual avatar URL if available */}
//           <AvatarImage src={review.reviewer?.profile?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName)}&background=random`} alt={reviewerName} />
//           <AvatarFallback>{reviewerInitials}</AvatarFallback>
//         </Avatar>
//         <div className="font-medium dark:text-white">
//           <p>{reviewerName}</p>
//           {/* <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Total Reviews: <span className="font-medium text-gray-900 dark:text-white">??</span></p> */}
//         </div>
//       </div>
//       <div className="mb-3 flex items-center">
//         {[...Array(5)].map((_, i) => (
//           <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-500'}`} />
//         ))}
//         <p className="ms-2 text-sm font-medium text-gray-900 dark:text-white">{review.rating}.0</p>
//       </div>
//       <h3 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">{review.reservation?.Property?.name || 'Review'}</h3> {/* Consider if review has a title field */}
//       <p className="mb-3 text-base font-normal text-gray-500 dark:text-gray-400">{review.content}</p>
//       <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>
//       <aside className="mt-4">
//         <div className="flex items-center">
//           {/* Helpful Button - Placeholder functionality */}
//           <Button variant="outline" size="sm" className="px-2 py-1.5 text-xs">
//             Helpful ({Math.floor(Math.random() * 10)}) {/* Placeholder count */}
//           </Button>
//           {/* Report Button - Placeholder functionality */}
//           <Button variant="ghost" size="sm" className="ms-4 text-sm font-medium text-gray-900 hover:underline dark:text-white">
//             <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
//             Report
//           </Button>
//         </div>
//       </aside>
//     </article>
//   );
// };

// export default PropertyReviews;