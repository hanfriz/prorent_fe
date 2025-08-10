import { ReservationResponse } from '@/interface/reservationInterface';
import Axios from '@/lib/axios';
import { CreateReservationInput, createReservationSchema } from '@/validation/reservationValidation';
import { useQuery } from '@tanstack/react-query';
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

export const uploadPaymentProof = async (reservationId: string, userId: string, file: File) => {};

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
