export enum PaymentType {
   MANUAL_TRANSFER = 'MANUAL_TRANSFER',
   XENDIT = 'XENDIT'
}

export interface Reservation {
   id: string;
   userId: string;
   propertyId: string;
   roomTypeId: string | null;
   roomId: string | null;
   startDate: string; // ISO string
   endDate: string; // ISO string
   orderStatus: string;
   CheckinAt: string | null;
   CheckoutAt: string | null;
   expiresAt: string;
   createdAt: string;
   updatedAt: string;
   deletedAt: string | null;
}

export type ReservationResponse = {
   reservation: Reservation;
   message: string;
};

export type Props = {
   date: Date | undefined;
   onSelect: (date: Date | undefined) => void;
   disabledDates?: Date[];
   priceMap?: Record<string, number>; // "YYYY-MM-DD" -> price
   label: string;
};
