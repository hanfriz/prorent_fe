'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
   createReservation,
   uploadPaymentProof,
   fetchReservationWithPayment,
   getUserReservation,
   getOwnerReservation,
   cancelReservationByUser,
   rejectReservationByOwner,
   confirmReservationByOwner,
   getReservationWithPayment,
   getReservationsByPropertyId,
   fetchAvailabilityCalendar
} from './reservationService';
import { GetUserReservationsParams } from '@/interface/queryInterface';
import { CreateReservationInput } from '@/validation/reservationValidation';

// Query Keys
const RESERVATION_KEYS = {
   all: [ 'reservations' ] as const,
   lists: () => [ ...RESERVATION_KEYS.all, 'list' ] as const,
   list: (filters: any) => [ ...RESERVATION_KEYS.lists(), filters ] as const,
   details: () => [ ...RESERVATION_KEYS.all, 'detail' ] as const,
   detail: (id: string) => [ ...RESERVATION_KEYS.details(), id ] as const,
   owner: () => [ ...RESERVATION_KEYS.all, 'owner' ] as const,
   user: () => [ ...RESERVATION_KEYS.all, 'user' ] as const,
   property: (propertyId: string) => [ ...RESERVATION_KEYS.all, 'property', propertyId ] as const,
   propertyRoomType: (
      propertyId: string,
      roomTypeId: string,
      filters?: Omit<GetUserReservationsParams, 'roomTypeId'>
   ) =>
      [
         ...RESERVATION_KEYS.property(propertyId),
         'roomType',
         roomTypeId,
         'filters',
         JSON.stringify({
            page: filters?.page,
            limit: filters?.limit,
            startDate: filters?.startDate,
            endDate: filters?.endDate,
            status: filters?.status,
            search: filters?.search,
            sortBy: filters?.sortBy,
            sortOrder: filters?.sortOrder
         })
      ] as const,
   availability: (roomTypeId: string, startDate?: string, endDate?: string) =>
      [
         ...RESERVATION_KEYS.all,
         'availability',
         roomTypeId,
         startDate || 'defaultStart',
         endDate || 'defaultEnd'
      ] as const
};

// Hook for fetching user's reservations
export function useUserReservations (params?: GetUserReservationsParams) {
   return getUserReservation(params);
}

// Hook for fetching owner's reservations
export function useOwnerReservations (params?: GetUserReservationsParams) {
   return getOwnerReservation(params);
}

// Hook for fetching reservation details
export function useReservationDetail (reservationId: string) {
   return getReservationWithPayment(reservationId);
}

// Hook for creating reservation
export function useCreateReservation () {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: createReservation,
      onSuccess: data => {
         toast.success('Reservation created successfully!');
         // Invalidate and refetch reservations
         queryClient.invalidateQueries({ queryKey: RESERVATION_KEYS.user() });
         queryClient.invalidateQueries({ queryKey: RESERVATION_KEYS.owner() });
      },
      onError: (error: any) => {
         const message = error?.response?.data?.message || 'Failed to create reservation';
         toast.error(message);
      }
   });
}

// Hook for cancelling reservation
export function useCancelReservation () {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: cancelReservationByUser,
      onSuccess: (data, reservationId) => {
         toast.success('Reservation cancelled successfully');
         // Invalidate specific reservation and lists
         queryClient.invalidateQueries({
            queryKey: RESERVATION_KEYS.detail(reservationId)
         });
         queryClient.invalidateQueries({ queryKey: RESERVATION_KEYS.user() });
         queryClient.invalidateQueries({ queryKey: RESERVATION_KEYS.owner() });
      },
      onError: (error: any) => {
         const message = error?.response?.data?.message || 'Failed to cancel reservation';
         toast.error(message);
      }
   });
}

// Hook for confirming reservation (owner only)
export function useConfirmReservation () {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: confirmReservationByOwner,
      onSuccess: (data, reservationId) => {
         toast.success('Reservation confirmed successfully');
         queryClient.invalidateQueries({
            queryKey: RESERVATION_KEYS.detail(reservationId)
         });
         queryClient.invalidateQueries({ queryKey: RESERVATION_KEYS.owner() });
      },
      onError: (error: any) => {
         const message = error?.response?.data?.message || 'Failed to confirm reservation';
         toast.error(message);
      }
   });
}

// Hook for rejecting reservation (owner only)
export function useRejectReservation () {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: rejectReservationByOwner,
      onSuccess: (data, reservationId) => {
         toast.success('Reservation rejected');
         queryClient.invalidateQueries({
            queryKey: RESERVATION_KEYS.detail(reservationId)
         });
         queryClient.invalidateQueries({ queryKey: RESERVATION_KEYS.owner() });
      },
      onError: (error: any) => {
         const message = error?.response?.data?.message || 'Failed to reject reservation';
         toast.error(message);
      }
   });
}

// Hook for uploading payment proof
export function useUploadPaymentProof () {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ reservationId, file }: { reservationId: string; file: File }) =>
         uploadPaymentProof(reservationId, file),
      onSuccess: (data, variables) => {
         toast.success('Payment proof uploaded successfully');
         queryClient.invalidateQueries({
            queryKey: RESERVATION_KEYS.detail(variables.reservationId)
         });
         queryClient.invalidateQueries({ queryKey: RESERVATION_KEYS.user() });
      },
      onError: (error: any) => {
         const message = error?.response?.data?.message || 'Failed to upload payment proof';
         toast.error(message);
      }
   });
}

// Hook for getting recent transactions (for dashboard)
export function useRecentTransactions (limit: number = 3) {
   return useQuery({
      queryKey: [ ...RESERVATION_KEYS.owner(), 'recent', limit ],
      queryFn: async () => {
         const ownerReservations = getOwnerReservation({ limit, page: 1 });

         return [];
      },
      staleTime: 1000 * 60 * 2 // 2 minutes
   });
}
// Hook for fetching reservations by property ID
export function usePropertyReservations (propertyId: string, params?: GetUserReservationsParams) {
   return useQuery({
      queryKey: RESERVATION_KEYS.propertyRoomType(propertyId, params?.roomTypeId || '', {
         page: params?.page,
         limit: params?.limit,
         startDate: params?.startDate,
         endDate: params?.endDate,
         status: params?.status,
         search: params?.search,
         sortBy: params?.sortBy,
         sortOrder: params?.sortOrder
      }),
      queryFn: () => getReservationsByPropertyId(propertyId, params),
      enabled: !!propertyId && !!params?.roomTypeId
   });
}

export function useAvailabilityCalendar (roomTypeId: string | undefined, startDate?: string, endDate?: string) {
   return useQuery({
      queryKey: RESERVATION_KEYS.availability(roomTypeId || '', startDate, endDate),
      queryFn: () => {
         if (!roomTypeId) {
            throw new Error('roomTypeId is required');
         }
         return fetchAvailabilityCalendar(roomTypeId, startDate, endDate);
      },
      enabled: !!roomTypeId, // Only run if roomTypeId is provided
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes (availability doesn't change often)
      gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
      refetchOnWindowFocus: false, // Avoid refetching on tab focus (unless you want live updates)
      retry: 1 // Retry once if fails
   });
}
