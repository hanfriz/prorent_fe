// src/store/reservationStore.ts
import { create } from 'zustand';
import { CreateReservationInput } from '@/validation/reservationValidation';
import { Reservation } from '@/interface/reservationInterface';

interface ReservationState {
   formData: Partial<CreateReservationInput>;
   reservation: Reservation | null;
   reservationId?: string | null;

   setField: <K extends keyof CreateReservationInput>(key: K, value: CreateReservationInput[K]) => void;
   setReservation: (reservation: Reservation) => void;
   setReservationId: (id: string) => void;
   reset: () => void;
}

export const useReservationStore = create<ReservationState>(set => ({
   formData: {},
   reservation: null,
   reservationId: '',

   setField: (key, value) =>
      set(state => ({
         formData: { ...state.formData, [key]: value }
      })),
   setReservation: reservation => set({ reservation, reservationId: reservation.id }),
   setReservationId: (id: string) => set({ reservationId: id }),
   reset: () => set({ formData: {}, reservation: null, reservationId: null })
}));

export default useReservationStore;
