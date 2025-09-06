// api/endpoints.ts
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000";

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  REGISTER_USER: "/auth/register/user",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFY: "/auth/resend-verify",
  LOGIN: "/auth/login",
  LOGIN_WITH_PROVIDER: "/auth/login-with-provider",
  CHECK_EMAIL: "/auth/check-email",
  RESET_PASSWORD_REQUEST: "/auth/reset-password-request",
  RESET_PASSWORD_CONFIRM: "/auth/reset-password-confirm",
  ME: "/auth/me",
} as const;

// Public Property Endpoints
export const PUBLIC_PROPERTY_ENDPOINTS = {
  SEARCH_PROPERTIES: "/public/properties",
  GET_PROPERTY_DETAILS: (id: string) => `/public/properties/${id}`,
  GET_CALENDAR_PRICING: (id: string) =>
    `/public/properties/${id}/calendar-pricing`,
  GET_PROPERTY_ROOMS: (id: string) => `/public/properties/${id}/rooms`,
} as const;

// Upload Endpoints
export const UPLOAD_ENDPOINTS = {
  UPLOAD_FILE: "/upload",
  DELETE_FILE: (id: string) => `/upload/${id}`,
  GET_FILE_INFO: (id: string) => `/upload/${id}`,
  LIST_FILES: "/upload",
} as const;

// Utility Endpoints
export const UTILITY_ENDPOINTS = {
  TEST_EMAIL: "/utility/test-email",
  RESEND_EMAIL: "/utility/resend-email",
  EMAIL_STATUS: "/utility/email-status",
  HEALTH_CHECK: "/utility/health",
  SERVICE_INFO: "/utility/info",
} as const;

// User Endpoints
export const USER_ENDPOINTS = {
  GET_PROFILE: "/users/me",
  UPDATE_PROFILE: "/users/me",
  CHANGE_PASSWORD: "/users/me/password",
  UPLOAD_AVATAR: "/users/me/avatar",
  REVERIFY_EMAIL: "/users/reverify-email",
} as const;

// Reservation Endpoints
export const RESERVATION_ENDPOINTS = {
  GET_ALL_RESERVATIONS: "/api/reservation",
  CANCEL_EXPIRED: "/api/reservation/cancel-expired",
  GET_USER_RESERVATIONS: "/api/reservation/user",
  GET_OWNER_RESERVATIONS: "/api/reservation/owner",
  GET_RESERVATION_DETAILS: (id: string) => `/api/reservation/${id}`,
  GET_PROPERTY_RESERVATIONS: (propertyId: string) =>
    `/api/reservation/property/${propertyId}`,
  CREATE_RESERVATION: "/api/reservation",
  CANCEL_RESERVATION: (id: string) => `/api/reservation/${id}/cancel`,
  REJECT_RESERVATION: (id: string) => `/api/reservation/${id}/reject`,
  CONFIRM_RESERVATION: (id: string) => `/api/reservation/${id}/confirm`,
  UPLOAD_PAYMENT: (id: string) => `/api/reservation/${id}/upload-payment`,
} as const;

// Review Endpoints
export const REVIEW_ENDPOINTS = {
  CREATE_REVIEW: "/api/review",
  REPLY_TO_REVIEW: (reviewId: string) => `/api/review/${reviewId}/reply`,
  GET_PUBLIC_REVIEWS: (propertyId: string) =>
    `/api/review/property/${propertyId}`,
  GET_ELIGIBLE_RESERVATIONS: (propertyId: string) =>
    `/api/review/property/${propertyId}/eligible-reservations`,
  GET_OWNER_REVIEWS: (propertyId: string) =>
    `/api/review/owner/property/${propertyId}`,
  UPDATE_REVIEW_VISIBILITY: (reviewId: string) =>
    `/api/review/${reviewId}/visibility`,
} as const;

// Cron Job Endpoints
export const CRONJOB_ENDPOINTS = {
  RECALCULATE_ALL: "/api/cronjob/recalculate-all",
  CANCEL_EXPIRED: "/api/cronjob/cancel-expired",
  SEND_BOOKING_REMINDER: "/api/cronjob/send-booking-reminder",
  SEND_BOOKING_REMINDER_BY_ID: (reservationId: string) =>
    `/api/cronjob/${reservationId}/send`,
} as const;

// Report Endpoints
export const REPORT_ENDPOINTS = {
  RESERVATION_REPORT: "/api/report/reservations",
  YEARLY_CHART: "/api/report/chart/yearly",
  MONTHLY_CHART: "/api/report/chart/monthly",
  DAILY_CHART: "/api/report/chart/daily",
  EXPORT_EXCEL: "/api/report/download/excel",
} as const;

// Owner Category Endpoints
export const OWNER_CATEGORY_ENDPOINTS = {
  GET_ALL: "/api/owner/categories",
  CREATE: "/api/owner/categories",
  UPDATE: (id: string) => `/api/owner/categories/${id}`,
  DELETE: (id: string) => `/api/owner/categories/${id}`,
} as const;

// Owner Property Endpoints
export const OWNER_PROPERTY_ENDPOINTS = {
  GET_ALL: "/api/owner/properties",
  CREATE: "/api/owner/properties",
  GET_BY_ID: (id: string) => `/api/owner/properties/${id}`,
  UPDATE: (id: string) => `/api/owner/properties/${id}`,
  DELETE: (id: string) => `/api/owner/properties/${id}`,
} as const;

// Owner Room Endpoints
export const OWNER_ROOM_ENDPOINTS = {
  GET_BY_PROPERTY: "/api/owner/rooms",
  CREATE: "/api/owner/rooms",
  UPDATE: (id: string) => `/api/owner/rooms/${id}`,
  DELETE: (id: string) => `/api/owner/rooms/${id}`,
} as const;

// Owner Room Type Endpoints
export const OWNER_ROOM_TYPE_ENDPOINTS = {
  CREATE: "/api/owner/room-types",
  GET_BY_PROPERTY: "/api/owner/room-types",
  UPDATE: (id: string) => `/api/owner/room-types/${id}`,
  DELETE: (id: string) => `/api/owner/room-types/${id}`,
} as const;

// Room Operations Endpoints
export const ROOM_OPERATIONS_ENDPOINTS = {
  SET_BULK_AVAILABILITY: (id: string) => `/api/rooms/${id}/availability`,
  GET_MONTHLY_AVAILABILITY: (id: string) => `/api/rooms/${id}/availability`,
  ADD_PEAK_RATE: (id: string) => `/api/rooms/${id}/peak-price`,
  UPDATE_PEAK_RATE: (id: string, date: string) =>
    `/api/rooms/${id}/peak-price/${date}`,
  REMOVE_PEAK_RATE: (id: string, date: string) =>
    `/api/rooms/${id}/peak-price/${date}`,
} as const;

// Main Endpoints Export - Simple and Clean
export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  PUBLIC_PROPERTY: PUBLIC_PROPERTY_ENDPOINTS,
  UPLOAD: UPLOAD_ENDPOINTS,
  UTILITY: UTILITY_ENDPOINTS,
  USER: USER_ENDPOINTS,
  RESERVATION: RESERVATION_ENDPOINTS,
  REVIEW: REVIEW_ENDPOINTS,
  CRONJOB: CRONJOB_ENDPOINTS,
  REPORT: REPORT_ENDPOINTS,
  OWNER_CATEGORY: OWNER_CATEGORY_ENDPOINTS,
  OWNER_PROPERTY: OWNER_PROPERTY_ENDPOINTS,
  OWNER_ROOM: OWNER_ROOM_ENDPOINTS,
  OWNER_ROOM_TYPE: OWNER_ROOM_TYPE_ENDPOINTS,
  ROOM_OPERATIONS: ROOM_OPERATIONS_ENDPOINTS,
} as const;

export default ENDPOINTS;
