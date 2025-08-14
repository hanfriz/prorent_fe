// src/components/.../usePaymentForm.ts
import { toast } from 'sonner';

export function usePaymentForm () {
   function syncWithStore (
      isLoading: boolean,
      reservationData: any,
      error: any,
      setReservationLoading: any,
      setReservationData: any,
      setReservationError: any
   ) {
      if (isLoading) {
         setReservationLoading(true);
      }
      if (reservationData) {
         setReservationData(reservationData);
         setReservationLoading(false);
      }
      if (error) {
         setReservationError(error.message);
         setReservationLoading(false);
      }
   }

   async function handleSubmit (
      value: any,
      reservationId: string,
      uploadPaymentProofMutation: any,
      isPaymentProofUploaded: boolean,
      router: any
   ) {
      if (value.paymentMethod === 'manual') {
         if (isPaymentProofUploaded) {
            toast.info('Payment proof already uploaded!');
            return;
         }

         if (!value.file) {
            toast.error('Please select a payment proof file');
            return;
         }

         try {
            await uploadPaymentProofMutation.mutateAsync({
               reservationId,
               file: value.file
            });
         } catch (error) {
            toast.error('Failed to upload payment proof');
         }
      } else {
         toast.success('Processing gateway payment...');
      }
   }

   function handleMutationSuccess (
      data: any,
      queryClient: any,
      reservationId: string | undefined,
      setReservationData: any,
      router: any
   ) {
      queryClient.setQueryData([ 'reservation', reservationId ], data);
      setReservationData(data.reservation);
      toast.success('Payment proof uploaded successfully!');
      router.push(`/reservation`);
   }

   function handleMutationError (error: any) {
      const errorMessage =
         error.response?.data?.message ||
         error.response?.data?.error ||
         error.message ||
         'Failed to upload payment proof';
      toast.error(errorMessage);
   }

   return {
      syncWithStore,
      handleSubmit,
      handleMutationSuccess,
      handleMutationError
   };
}
