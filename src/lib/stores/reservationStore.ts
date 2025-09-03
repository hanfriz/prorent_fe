// src/lib/stores/reservationStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CreateReservationInput } from '@/validation/reservationValidation';
import { Reservation } from '@/interface/reservationInterface';
import { GetUserReservationsParams } from '@/interface/queryInterface';

interface DisplayData {
   propertyName?: string;
   propertyType?: string;
   roomTypeName?: string;
   basePrice?: number;
   mainImageUrl?: string;
}

interface ReservationState {
   formData: Partial<CreateReservationInput>;
   displayData: DisplayData;
   reservation: Reservation | null;
   reservationId?: string | null;
   searchTerm: string;
   reservationParams: GetUserReservationsParams;
   fromPropertyId?: string;

   setField: <K extends keyof CreateReservationInput>(key: K, value: CreateReservationInput[K]) => void;
   setDisplayData: (Data: DisplayData) => void;
   setReservation: (reservation: Reservation) => void;
   setReservationId: (id: string) => void;
   setFromPropertyId: (id: string) => void;
   reset: () => void;
   setSearchTerm: (searchTerm: string) => void;

   setReservationParams: (params: GetUserReservationsParams) => void;
   updateReservationParams: (params: Partial<GetUserReservationsParams>) => void;
   resetReservationParams: () => void;
}

export const useReservationStore = create<ReservationState>()(
   persist(
      set => ({
         formData: {},
         displayData: {},
         reservation: null,
         reservationId: null,
         searchTerm: '',
         reservationParams: {
            page: 1,
            limit: 10,
            sortBy: 'createdAt',
            sortOrder: 'desc'
         },
         fromPropertyId: undefined,

         setField: (key, value) =>
            set(state => ({
               formData: { ...state.formData, [key]: value }
            })),

         setDisplayData: data =>
            set(state => ({
               displayData: { ...state.displayData, ...data }
            })),

         setReservation: reservation => set({ reservation, reservationId: reservation.id }),

         setReservationId: (id: string | null) => set({ reservationId: id }),

         setFromPropertyId: (id: string) => set({ fromPropertyId: id }),

         reset: () =>
            set({
               formData: {},
               displayData: {},
               reservation: null,
               reservationId: null,
               searchTerm: '',
               reservationParams: {
                  page: 1,
                  limit: 10,
                  sortBy: 'createdAt',
                  sortOrder: 'desc'
               },
               fromPropertyId: undefined
            }),

         setSearchTerm: (searchTerm: string) => set({ searchTerm }),

         setReservationParams: params => set({ reservationParams: params }),
         updateReservationParams: params =>
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
      }),
      {
         name: 'reservation-storage',
         storage: createJSONStorage(() => localStorage),
         partialize: state => ({
            fromPropertyId: state.fromPropertyId,
            formData: state.formData,
            displayData: state.displayData
         }),
         onRehydrateStorage: () => state => {
            const now = Date.now();
            const savedAt = localStorage.getItem('reservation-storage:savedAt');
            if (savedAt && now - parseInt(savedAt) > 30 * 60 * 1000) {
               state?.reset();
            }
            localStorage.setItem('reservation-storage:savedAt', now.toString());
         }
      }
   )
);
