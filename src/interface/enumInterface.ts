export type Role = 'USER' | 'OWNER';
export type SocialLogin = 'NONE' | 'GOOGLE' | 'FACEBOOK' | 'TWITTER';
export enum PaymentType {
   MANUAL_TRANSFER = 'MANUAL_TRANSFER',
   XENDIT = 'XENDIT'
}
export enum ReservationStatus {
   PENDING_PAYMENT = 'PENDING_PAYMENT',
   PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
   CONFIRMED = 'CONFIRMED',
   CANCELLED = 'CANCELLED'
}

export type RateType = 'FIXED' | 'PERCENTAGE';
export type PropertyRentalType = 'WHOLE_PROPERTY' | 'ROOM_BY_ROOM';
