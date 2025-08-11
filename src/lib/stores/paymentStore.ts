// src/store/paymentStore.ts
import { create } from "zustand";
import {
  ReservationWithPayment,
  PaymentState,
} from "@/interface/paymentInterface";
import apiClient from "@/lib/axios";

import { getReservationWithPayment } from "@/service/reservationService";

export const usePaymentStore = create<PaymentState>((set) => ({
  // --- Initial state ---
  reservation: null,
  isLoading: false, // Awalnya tidak loading
  error: null, // Awalnya tidak ada error

  // --- Implementasi actions ---
  setReservationData: (data) =>
    set({ reservation: data, isLoading: false, error: null }),
  setReservationLoading: (loading) => set({ isLoading: loading, error: null }), // Reset error saat loading
  setReservationError: (error) => set({ error, isLoading: false }),
  // setFormDataTemp: (data) => set({ formDataTemp: data }),
  clearReservationData: () =>
    set({ reservation: null, isLoading: false, error: null }),
}));
