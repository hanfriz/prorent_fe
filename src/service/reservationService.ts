import { ReservationWithPayment, RPResPagination, RPResponse } from '@/interface/paymentInterface';
import { GetUserReservationsParams } from '@/interface/queryInterface';
import { ReservationResponse } from '@/interface/reservationInterface';
import Axios from '@/lib/axios';
import { paymentProofBrowserFileSchema, uploadPaymentProofFormSchema } from '@/validation/paymentProofValidation';
import { CreateReservationInput, createReservationSchema } from '@/validation/reservationValidation';
import { useQuery } from '@tanstack/react-query';
import { log } from 'console';
import { z } from 'zod';

export const createReservation = async (Input: CreateReservationInput): Promise<ReservationResponse> => {
   try {
      console.log(Input);
      const validated = createReservationSchema.parse(Input);
      const res = await Axios.post<ReservationResponse>('/reservation/', validated);
      return res.data;
   } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
   }
};

export const uploadPaymentProof = async (reservationId: string, file: File) => {
   try {
      const formData = new FormData();
      formData.append('file', file, file.name);
      const res = await Axios.patch<RPResponse>(`/reservation/${reservationId}/upload-payment`, formData, {
         headers: {}
      });
      return res.data;
   } catch (error: any) {
      if (error.response?.data?.message) {
         throw new Error(error.response.data.message);
      }
      if (error.response?.data?.error) {
         throw new Error(error.response.data.error);
      }
      throw error;
   }
};

export async function fetchReservationWithPayment (reservationId: string) {
   try {
      const response = await Axios.get<ReservationWithPayment>(`/reservation/${reservationId}`);
      return response.data;
   } catch (error) {
      console.error('Error fetching reservation:', error);
      return null;
   }
}

export function getReservationWithPayment (reservationId: string) {
   return useQuery({
      queryKey: [ 'reservation', reservationId ],
      queryFn: async () => {
         const res = await Axios.get<ReservationWithPayment>(`/reservation/${reservationId}`);
         const reservation = res.data;
         return reservation;
      }
   });
}

export function getUserReservation (params?: GetUserReservationsParams) {
   return useQuery({
      queryKey: [
         'reservations',
         params?.page,
         params?.limit,
         params?.sortBy,
         params?.sortOrder,
         params?.status,
         params?.startDate,
         params?.endDate,
         params?.search,
         params?.minAmount,
         params?.maxAmount
      ],
      queryFn: async () => {
         const res = await Axios.get<RPResPagination>(`/reservation/user`, {
            params: {
               page: params?.page || 1,
               limit: params?.limit || 10,
               sortBy: params?.sortBy || 'createdAt',
               sortOrder: params?.sortOrder || 'desc',
               status: params?.status,
               startDate: params?.startDate,
               endDate: params?.endDate,
               search: params?.search,
               minAmount: params?.minAmount,
               maxAmount: params?.maxAmount
            }
         });
         const reservation = res.data;
         return reservation;
      }
   });
}

export function getOwnerReservation (params?: GetUserReservationsParams) {
   return useQuery({
      queryKey: [
         'reservations',
         params?.page,
         params?.limit,
         params?.sortBy,
         params?.sortOrder,
         params?.status,
         params?.startDate,
         params?.endDate,
         params?.search,
         params?.minAmount,
         params?.maxAmount
      ],
      queryFn: async () => {
         const res = await Axios.get<RPResPagination>(`/reservation/owner`, {
            params: {
               page: params?.page || 1,
               limit: params?.limit || 10,
               sortBy: params?.sortBy || 'createdAt',
               sortOrder: params?.sortOrder || 'desc',
               status: params?.status,
               startDate: params?.startDate,
               endDate: params?.endDate,
               search: params?.search,
               minAmount: params?.minAmount,
               maxAmount: params?.maxAmount
            }
         });
         const reservation = res.data;
         return reservation;
      }
   });
}

export async function getReservationsByPropertyId (propertyId: string, params?: GetUserReservationsParams) {
   const response = await Axios.get<RPResPagination>(`/reservation/property/${propertyId}`, {
      params: {
         page: params?.page || 1,
         limit: params?.limit || 10,
         sortBy: params?.sortBy || 'createdAt',
         sortOrder: params?.sortOrder || 'desc',
         status: params?.status,
         startDate: params?.startDate,
         endDate: params?.endDate,
         search: params?.search,
         minAmount: params?.minAmount,
         maxAmount: params?.maxAmount,
         roomTypeId: params?.roomTypeId
      }
   });
   return response.data;
}

export async function cancelReservationByUser (reservationId: string) {
   const response = await Axios.post(`/reservation/${reservationId}/cancel`);
   return response.data;
}

export async function rejectReservationByOwner (reservationId: string) {
   const response = await Axios.patch(`/reservation/${reservationId}/reject`);
   return response.data;
}

export async function confirmReservationByOwner (reservationId: string) {
   const response = await Axios.patch(`/reservation/${reservationId}/confirm`);
   return response.data;
}
