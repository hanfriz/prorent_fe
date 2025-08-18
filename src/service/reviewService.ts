// src/services/reviewService.ts
import Axios from '@/lib/axios'; // Adjust import path
import { z } from 'zod';
import {
   createReviewSchema,
   replyToReviewSchema,
   updateReviewVisibilitySchema,
   CreateReviewInput,
   ReplyToReviewInput, // This type is for the body content only
   UpdateReviewVisibilityInput
} from '@/validation/reviewValidation'; // Adjust import path
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
   // You'll need to import or define these types based on your API responses
   // For example:
   Review, // Type for a single review object returned by your API
   GetReviewsResult, // Type for the result of getPublicReviews/getOwnerReviews
   OwnerReply // Type for an owner reply object
} from '@/interface/reviewInterface'; // Adjust import path

// --- Helper: Handle Axios Errors ---
function handleAxiosError (error: any): never {
   console.error('API Error:', error);
   if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
   }
   if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
   }
   if (error.message) {
      throw new Error(error.message);
   }
   throw new Error('An unexpected error occurred.');
}

// --- Mutation: Create Review ---
export const createReview = async (input: CreateReviewInput): Promise<Review> => {
   try {
      // 1. Validate input data using Zod schema
      const validatedData = createReviewSchema.parse(input);
      console.log('Validated Create Review Data:', validatedData);

      // 2. Send POST request to the backend
      const response = await Axios.post<Review>('/review/', validatedData); // Matches POST /api/reviews

      // 3. Return the created review data from the response
      return response.data;
   } catch (error: any) {
      // 4. Handle errors (Zod validation or Axios)
      if (error instanceof z.ZodError) {
         console.error('Frontend Validation Error (Create Review):', error.flatten());
         // Optionally, format Zod errors for user display
         throw new Error(`Validation failed: ${JSON.stringify(error.flatten())}`);
      }
      handleAxiosError(error); // Handle network or backend errors
   }
};

// --- Mutation: Reply to Review ---
// Note: reviewId comes from function argument (URL path), content from input (body)
export const replyToReview = async (reviewId: string, input: ReplyToReviewInput): Promise<OwnerReply> => {
   try {
      // 1. Validate the body input data using Zod schema
      const validatedBodyData = replyToReviewSchema.parse(input);
      console.log('Validated Reply Body Data:', validatedBodyData);

      // 2. Send POST request to the specific review's reply endpoint
      const response = await Axios.post<OwnerReply>(`/review/${reviewId}/reply`, validatedBodyData); // Matches POST /api/reviews/:reviewId/reply

      // 3. Return the created/updated owner reply data from the response
      return response.data;
   } catch (error: any) {
      // 4. Handle errors (Zod validation or Axios)
      if (error instanceof z.ZodError) {
         console.error('Frontend Validation Error (Reply to Review):', error.flatten());
         throw new Error(`Validation failed: ${JSON.stringify(error.flatten())}`);
      }
      handleAxiosError(error); // Handle network or backend errors
   }
};

// --- Query: Get Public Reviews for a Property ---
interface GetPublicReviewsParams {
   propertyId: string;
   page?: number;
   limit?: number;
   sortBy?: string;
   sortOrder?: 'asc' | 'desc';
   searchContent?: string;
   // Add other potential query params your backend accepts for public reviews
}

export function getPublicReviews (params: GetPublicReviewsParams) {
   const { propertyId, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', searchContent } = params;

   return useQuery<GetReviewsResult, Error>({
      queryKey: [ 'reviews', 'public', propertyId, page, limit, sortBy, sortOrder, searchContent ],
      queryFn: async () => {
         try {
            const response = await Axios.get<GetReviewsResult>(`/review/property/${propertyId}`, {
               params: {
                  page,
                  limit,
                  sortBy,
                  sortOrder,
                  searchContent
                  // Pass other params if needed by backend
               }
            });
            return response.data;
         } catch (error: any) {
            handleAxiosError(error); // Handle network or backend errors for queries
         }
      }
      // Consider adding staleTime, cacheTime, or placeholderData based on your needs
   });
}

// --- Query: Get Owner Reviews for a Property ---
interface GetOwnerReviewsParams {
   propertyId: string;
   page?: number;
   limit?: number;
   sortBy?: string;
   sortOrder?: 'asc' | 'desc';
   searchContent?: string;
   includeInvisible?: boolean;
   // Add other potential query params your backend accepts for owner reviews
}

export function getOwnerReviews (params: GetOwnerReviewsParams) {
   const {
      propertyId,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      searchContent,
      includeInvisible
   } = params;

   return useQuery<GetReviewsResult, Error>({
      queryKey: [ 'reviews', 'owner', propertyId, page, limit, sortBy, sortOrder, searchContent, includeInvisible ],
      queryFn: async () => {
         try {
            // Assumes the backend endpoint is /review/owner/property/:propertyId
            const response = await Axios.get<GetReviewsResult>(`/review/owner/property/${propertyId}`, {
               params: {
                  page,
                  limit,
                  sortBy,
                  sortOrder,
                  searchContent,
                  includeInvisible
                  // Pass other params if needed by backend
               }
            });
            return response.data;
         } catch (error: any) {
            handleAxiosError(error); // Handle network or backend errors for queries
         }
      }
      // Add appropriate query options like enabled if needed
   });
}

// --- Mutation: Update Review Visibility ---
export const updateReviewVisibility = async (reviewId: string, input: UpdateReviewVisibilityInput): Promise<Review> => {
   try {
      // 1. Validate the input data using Zod schema
      const validatedData = updateReviewVisibilitySchema.parse(input);
      console.log('Validated Visibility Update Data:', validatedData);

      // 2. Send PATCH request to update visibility
      // Assumes the backend endpoint is /review/:reviewId/visibility
      const response = await Axios.patch<Review>(`/review/${reviewId}/visibility`, validatedData);

      // 3. Return the updated review data from the response
      return response.data;
   } catch (error: any) {
      // 4. Handle errors (Zod validation or Axios)
      if (error instanceof z.ZodError) {
         console.error('Frontend Validation Error (Update Visibility):', error.flatten());
         throw new Error(`Validation failed: ${JSON.stringify(error.flatten())}`);
      }
      handleAxiosError(error); // Handle network or backend errors
   }
};

// --- TanStack Query Mutations Hooks (Optional but Recommended) ---
// These hooks integrate with TanStack Query's mutation system and can automatically
// invalidate/re-fetch related queries upon successful mutation.

export const useCreateReview = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createReview,
      onSuccess: () => {
         // Example: Invalidate public and owner review queries for properties
         // You might need to refine the query key invalidation based on your specific needs
         // queryClient.invalidateQueries({ queryKey: ['reviews'] });
         console.log('Review created successfully. Consider invalidating relevant queries.');
      },
      onError: error => {
         console.error('Error creating review:', error);
         // Handle error display in UI if needed
      }
   });
};

export const useReplyToReview = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ reviewId, input }: { reviewId: string; input: ReplyToReviewInput }) =>
         replyToReview(reviewId, input),
      onSuccess: () => {
         // Example: Invalidate review queries
         // queryClient.invalidateQueries({ queryKey: ['reviews'] });
         console.log('Reply added successfully. Consider invalidating relevant queries.');
      },
      onError: error => {
         console.error('Error replying to review:', error);
         // Handle error display in UI if needed
      }
   });
};

export const useUpdateReviewVisibility = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ reviewId, input }: { reviewId: string; input: UpdateReviewVisibilityInput }) =>
         updateReviewVisibility(reviewId, input),
      onSuccess: updatedReview => {
         // Example: Invalidate review queries
         // queryClient.invalidateQueries({ queryKey: ['reviews'] });
         console.log('Review visibility updated successfully. Consider invalidating relevant queries.');
      },
      onError: error => {
         console.error('Error updating review visibility:', error);
         // Handle error display in UI if needed
      }
   });
};
