import { Role, SocialLogin, PaymentType, ReservationStatus, RateType, PropertyRentalType } from './enumInterface';
import { ReservationWithPayment } from './paymentInterface';

export interface Location {
   id: string;
   name: string;
   latitude: number | null; // Decimal di Prisma sering menjadi number/string di JSON
   longitude: number | null;
   address: string | null;
   cityId: string;
   createdAt: string; // ISO 8601 Date String
   updatedAt: string;
   // Relasi seperti 'properties' dan 'Profile' biasanya tidak dimuat dalam query ini
}

export interface Reservation {
   id: string;
   userId: string;
   propertyId: string;
   roomTypeId: string | null;
   roomId: string | null;
   startDate: string; // ISO string
   endDate: string; // ISO string
   orderStatus: ReservationStatus;
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

export interface ReservationActionsProps {
   reservation: ReservationWithPayment; // Pass the full reservation object
}

export type UnavailableDate = {
   date: string; // "YYYY-MM-DD"
   isAvailable: false;
};

export type AvailabilityCalendarResponse = {
   unavailableDates: UnavailableDate[];
};
