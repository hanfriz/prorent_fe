import { PaymentType, ReservationStatus } from './enumInterface';
import { PaymentProof } from './pictureInterface';
import { RoomType } from './roomTypeInterface';

export interface Payment {
   id: string;
   invoiceNumber: string;
   amount: number;
   method: PaymentType;
   paymentStatus: ReservationStatus;
   payerEmail: string;
   reservationId: string;
   xenditInvoiceId: string | null;
   externalInvoiceUrl: string | null;
   paidAt: string | null;
   callbackStatus: string | null;
   xenditCallback: JSON | null;
   createdAt: string;
   updatedAt: string;
   deletedAt: string | null;
   // logs: TransactionLog[]; // Tidak dimuat dalam query ini
}

export interface ReservationWithPayment {
   id: string;
   userId: string;
   propertyId: string;
   roomTypeId: string;
   roomId: string | null;
   startDate: string; // ISO 8601 Date String
   endDate: string; // ISO 8601 Date String
   orderStatus: ReservationStatus; // Gunakan tipe string union
   CheckinAt: string | null; // ISO 8601 Date String
   CheckoutAt: string | null; // ISO 8601 Date String
   expiresAt: string | null; // ISO 8601 Date String
   createdAt: string; // ISO 8601 Date String
   updatedAt: string; // ISO 8601 Date String
   deletedAt: string | null; // ISO 8601 Date String

   // Relasi yang dimuat berdasarkan query backend
   RoomType: RoomType;
   payment: Payment | null;
   paymentProof: PaymentProof | null;
}

export interface RPResponse {
   reservation: ReservationWithPayment;
   message: string;
}

export interface PaymentState {
   reservation: ReservationWithPayment | null; // Data reservasi yang dimuat
   isLoading: boolean; // Status loading
   error: string | null; // Pesan error

   // --- Definisikan actions ---
   setReservationData: (data: ReservationWithPayment | null) => void;
   setReservationLoading: (loading: boolean) => void;
   setReservationError: (error: string | null) => void;
   clearReservationData: () => void; // Action untuk reset state
}
