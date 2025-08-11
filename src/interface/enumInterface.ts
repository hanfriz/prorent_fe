export type Role = "USER" | "OWNER";
export type SocialLogin = "NONE" | "GOOGLE" | "FACEBOOK" | "TWITTER";
export enum PaymentType {
  MANUAL_TRANSFER = "MANUAL_TRANSFER",
  XENDIT = "XENDIT",
}
export type ReservationStatus =
  | "PENDING_PAYMENT"
  | "PENDING_CONFIRMATION"
  | "CONFIRMED"
  | "CANCELLED";
export type RateType = "FIXED" | "PERCENTAGE";
export type PropertyRentalType = "WHOLE_PROPERTY" | "ROOM_BY_ROOM";
