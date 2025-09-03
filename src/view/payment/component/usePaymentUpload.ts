// src/hooks/usePaymentProofUpload.ts
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { uploadPaymentProof as uploadPaymentProofService } from '@/service/reservationService';
import { usePaymentStore } from '@/lib/stores/paymentStore';
import { toast } from 'sonner';

export function usePaymentProofUpload () {
   const params = useParams();
   const reservationId = params.id as string;
   const queryClient = useQueryClient();
   const [ isUploading, setIsUploading ] = useState(false);
   const [ uploadError, setUploadError ] = useState<string | null>(null);

   const reservation = usePaymentStore(state => state.reservation);

   const uploadProof = async (file: File) => {
      if (!reservationId || !reservation) {
         const errorMessage = 'Missing reservation data';
         setUploadError(errorMessage);
         toast.error(errorMessage);
         return { success: false, error: errorMessage };
      }

      setIsUploading(true);
      setUploadError(null);

      try {
         const result = await uploadPaymentProofService(reservationId, file);

         // Update the store with the new reservation data
         usePaymentStore.getState().setReservationData(result.reservation);

         // Invalidate and refetch reservation data
         queryClient.invalidateQueries({ queryKey: [ 'reservation', reservationId ] });

         setIsUploading(false);
         return { success: true, result };
      } catch (error: any) {
         const errorMessage = error.response?.data?.message || error.message || 'Failed to upload payment proof';
         setUploadError(errorMessage);
         setIsUploading(false);
         toast.error(errorMessage);
         return { success: false, error: errorMessage };
      }
   };

   return {
      uploadProof,
      isUploading,
      uploadError,
      clearError: () => setUploadError(null)
   };
}
