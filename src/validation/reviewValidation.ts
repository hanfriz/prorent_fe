// validations/frontend/reviewValidation.ts
import { z } from 'zod';

// --- Validation Schema for Creating a Review (Frontend) ---
// This matches the data the frontend needs to send for createReview
export const createReviewSchema = z.object({
   reservationId: z
      .string({ message: 'Reservation ID is required' })
      .min(1, { message: 'Reservation ID cannot be empty' }),
   content: z
      .string({ message: 'Review content is required' })
      .min(1, { message: 'Review content cannot be empty' })
      .max(1000, { message: 'Review content cannot exceed 1000 characters' }),
   rating: z
      .number({ message: 'Rating is required and must be a number' })
      .int({ message: 'Rating must be an integer' })
      .min(1, { message: 'Rating must be at least 1' })
      .max(5, { message: 'Rating cannot exceed 5' })
});

// --- Validation Schema for Replying to a Review (Frontend) ---
// This matches the data the frontend needs to send for replyToReview
// (Only the content, as reviewId comes from the URL path)
export const replyToReviewSchema = z.object({
   content: z
      .string({ message: 'Reply content is required' })
      .min(1, { message: 'Reply content cannot be empty' })
      .max(1000, { message: 'Reply content cannot exceed 1000 characters' })
   // rating could be added here if your service supports it for replies
   // rating: z.number().int().min(1).max(5).optional(),
});

// --- Validation Schema for Updating Review Visibility (Frontend) ---
// This matches the data the frontend needs to send for updateReviewVisibility
export const updateReviewVisibilitySchema = z.object({
   visibility: z.boolean({ message: 'Visibility status is required and must be a boolean' })
});

// --- Type Inference for Frontend Usage ---
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ReplyToReviewInput = z.infer<typeof replyToReviewSchema>; // For body data only
export type UpdateReviewVisibilityInput = z.infer<typeof updateReviewVisibilitySchema>;
