import { ReservationStatus } from './enumInterface';

export interface GetUserReservationsParams {
   page?: number;
   limit?: number;
   sortBy?: string;
   sortOrder?: 'asc' | 'desc';
   status?: string;
   startDate?: string;
   endDate?: string;
   search?: string;
   minAmount?: number;
   maxAmount?: number;
   roomTypeId?: string;
}

// Optional: Create a more specific type for sortBy fields if you want stricter typing
export type ReservationSortField =
   | 'createdAt'
   | 'startDate'
   | 'endDate'
   | 'amount'
   | 'reservationNumber'
   | 'invoiceNumber'
   | 'property.name'
   | 'RoomType.name';

export interface GetUserReservationsParamsStrict {
   page?: number;
   limit?: number;
   sortBy?: ReservationSortField;
   sortOrder?: 'asc' | 'desc';
   status?: ReservationStatus;
   startDate?: string;
   endDate?: string;
   search?: string;
   minAmount?: number;
   maxAmount?: number;
   roomTypeId?: string;
}
