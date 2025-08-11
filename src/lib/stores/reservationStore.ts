// src/store/reservationStore.ts
import { create } from 'zustand';
import { CreateReservationInput } from '@/validation/reservationValidation';
import { Reservation } from '@/interface/reservationInterface';
import { GetUserReservationsParams } from '@/interface/queryInterface';

interface ReservationState {
   formData: Partial<CreateReservationInput>;
   reservation: Reservation | null;
   reservationId?: string | null;
   searchTerm: string;
   reservationParams: GetUserReservationsParams;

   setField: <K extends keyof CreateReservationInput>(key: K, value: CreateReservationInput[K]) => void;
   setReservation: (reservation: Reservation) => void;
   setReservationId: (id: string) => void;
   reset: () => void;
   setSearchTerm: (searchTerm: string) => void;

   setReservationParams: (params: GetUserReservationsParams) => void;
   updateReservationParams: (params: Partial<GetUserReservationsParams>) => void;
   resetReservationParams: () => void;
}

export const useReservationStore = create<ReservationState>(set => ({
   formData: {},
   reservation: null,
   reservationId: '',
   searchTerm: '',

   reservationParams: {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
   },

   setField: (key, value) =>
      set(state => ({
         formData: { ...state.formData, [key]: value }
      })),
   setReservation: reservation => set({ reservation, reservationId: reservation.id }),
   setReservationId: (id: string | null) => set({ reservationId: id }),
   reset: () =>
      set({
         formData: {},
         reservation: null,
         reservationId: null,
         searchTerm: '',
         reservationParams: {
            page: 1,
            limit: 10,
            sortBy: 'createdAt',
            sortOrder: 'desc'
         }
      }),
   setSearchTerm: (searchTerm: string) => set({ searchTerm }),

   // New actions
   setReservationParams: (params: GetUserReservationsParams) => set({ reservationParams: params }),
   updateReservationParams: (params: Partial<GetUserReservationsParams>) =>
      set(state => ({
         reservationParams: { ...state.reservationParams, ...params }
      })),
   resetReservationParams: () =>
      set({
         reservationParams: {
            page: 1,
            limit: 10,
            sortBy: 'createdAt',
            sortOrder: 'desc'
         }
      })
}));

export default useReservationStore;
