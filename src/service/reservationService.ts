import { ReservationWithPayment, RPResponse } from '@/interface/paymentInterface';
import { ReservationResponse } from '@/interface/reservationInterface';
import Axios from '@/lib/axios';
import { paymentProofBrowserFileSchema, uploadPaymentProofFormSchema } from '@/validation/paymentProofValidation';
import { CreateReservationInput, createReservationSchema } from '@/validation/reservationValidation';
import { useQuery } from '@tanstack/react-query';
import { log } from 'console';
import { z } from 'zod';

export const createReservation = async (Input: CreateReservationInput): Promise<ReservationResponse> => {
   try {
      const validated = createReservationSchema.parse(Input);
      console.log(validated);
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
      console.log('Uploading file:', file.name, file.size, file.type);
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

export function useReservationOptions () {
   return useQuery({
      queryKey: [ 'reservation-options' ],
      queryFn: async () => {
         const [ properties, roomTypes ] = await Promise.all([
            Axios.get('/properties').then(r => r.data),
            Axios.get('/room-types').then(r => r.data)
         ]);
         return { properties, roomTypes };
      }
   });
}
