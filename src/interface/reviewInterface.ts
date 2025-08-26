// interfaces/reviewInterface.ts

// --- Core Review Entity (Based on Prisma Schema) ---
export interface Review {
   id: string;
   reviewerId: string;
   revieweeId: string;
   reservationId: string;
   content: string;
   rating: number;
   visibility: boolean;
   createdAt: Date;
   updatedAt: Date;
   deletedAt?: Date | null;

   reviewer?: {
      id: string;
      profile?: {
         firstName?: string | null;
         lastName?: string | null;
         avatar?: {
            id: string;
            url: string;
            alt: string;
         };
      } | null;
   } | null;
   reviewee?: {
      id: string;
      profile?: {
         firstName?: string | null;
         lastName?: string | null;
         avatar?: {
            id: string;
            url: string;
            alt: string;
         };
      };
   } | null;
   reservation?: {
      id: string;
      startDate: Date;
      endDate: Date;
      orderStatus?: string;
      Property?: {
         id: string;
         name: string;
      } | null;
   } | null;
   OwnerReply?: OwnerReply | null;
}

// --- Core Owner Reply Entity (Based on Prisma Schema) ---
export interface OwnerReply {
   id: string;
   reviewId: string;
   content: string;
   rating?: number | null;
   visibility: boolean;
   createdAt: Date;
   updatedAt: Date;
   deletedAt?: Date | null;

   // Relation (as it appears in API responses)
   review?: {
      id: string;
      content: string;
      rating: number;
      reviewer?: {
         id: string;
         profile?: {
            firstName?: string | null;
            lastName?: string | null;
         } | null;
      } | null;
      reservation?: {
         Property?: {
            name: string;
         } | null;
      } | null;
   } | null;
}

export interface CreateReviewInput {
   userId: string; // Added by controller
   reservationId: string;
   content: string;
   rating: number;
}

export interface ReplyToReviewInput {
   OwnerId: string;
   reviewId: string;
   content: string;
   rating?: number;
}

export interface CreateReviewFormInput {
   reservationId: string;
   content: string;
   rating: number;
}

export interface ReplyToReviewFormInput {
   content: string;
   // rating?: number; // Optional if your form supports it for replies
}

export interface UpdateReviewVisibilityInput {
   visibility: boolean;
}

// --- Query Filter Interfaces ---

export interface GetReviewsFilter {
   propertyId: string;
   page?: number;
   limit?: number;
   sortBy?: string;
   sortOrder?: 'asc' | 'desc';
   searchContent?: string;
   includeInvisible?: boolean; // Specific to owner queries
   // ownerId?: string; // If passed explicitly, though often from auth
}

// --- Query Result Interface ---

export interface GetReviewsResult {
   reviews: Review[]; // Array of reviews with included relations
   total: number;
   page: number;
   limit: number;
   totalPages: number;
}

export interface EligibleReservation {
   id: string;
   propertyId: string;
   propertyName: string;
   propertyImageUrl: string | null;
   startDate: Date;
   endDate: Date;
}
