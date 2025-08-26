import Axios from '@/lib/axios';
import { z } from 'zod';
import {
   createReviewSchema,
   replyToReviewSchema,
   updateReviewVisibilitySchema,
   CreateReviewInput,
   ReplyToReviewInput,
   UpdateReviewVisibilityInput
} from '@/validation/reviewValidation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Review, GetReviewsResult, OwnerReply } from '@/interface/reviewInterface';

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
         throw new Error(`Validation failed: ${JSON.stringify(error.flatten())}`);
      }
      handleAxiosError(error);
   }
};

// --- Mutation: Reply to Review ---
// Note: reviewId comes from function argument (URL path), content from input (body)
export const replyToReview = async (reviewId: string, input: ReplyToReviewInput): Promise<OwnerReply> => {
   try {
      const validatedBodyData = replyToReviewSchema.parse(input);
      console.log('Validated Reply Body Data:', validatedBodyData);
      const response = await Axios.post<OwnerReply>(`/review/${reviewId}/reply`, validatedBodyData);
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
               }
            });
            return response.data;
         } catch (error: any) {
            handleAxiosError(error);
         }
      }
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
      const response = await Axios.patch<Review>(`/review/${reviewId}/visibility`, validatedData);
      return response.data;
   } catch (error: any) {
      if (error instanceof z.ZodError) {
         console.error('Frontend Validation Error (Update Visibility):', error.flatten());
         throw new Error(`Validation failed: ${JSON.stringify(error.flatten())}`);
      }
      handleAxiosError(error);
   }
};
