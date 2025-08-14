// hooks/useReservationMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cancelReservationByUser, rejectReservationByOwner, confirmReservationByOwner } from "@/service/reservationService";

export const useReservationMutations = () => {
  const queryClient = useQueryClient();

  // Cancel Reservation Mutation
  const cancelMutation = useMutation({
    mutationFn: cancelReservationByUser,
    onSuccess: (_, cancelledReservationId) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reservation cancelled successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to cancel reservation", {
        description: error.message || "An unknown error occurred",
      });
    },
  });

  // Reject Payment Mutation
  const rejectPaymentMutation = useMutation({
    mutationFn: rejectReservationByOwner, // You need to implement this in your service
    onSuccess: (_, reservationId) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Payment rejected successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to reject payment", {
        description: error.message || "An unknown error occurred",
      });
    },
  });

  // Confirm Payment Mutation
  const confirmPaymentMutation = useMutation({
    mutationFn: confirmReservationByOwner, // You need to implement this in your service
    onSuccess: (_, reservationId) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Payment confirmed successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to confirm payment", {
        description: error.message || "An unknown error occurred",
      });
    },
  });

  return {
    cancelMutation,
    rejectPaymentMutation,
    confirmPaymentMutation
  };
};