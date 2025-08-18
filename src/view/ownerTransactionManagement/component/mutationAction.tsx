// hooks/useReservationMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  cancelReservationByUser,
  rejectReservationByOwner,
  confirmReservationByOwner,
} from "@/service/reservationService";
import { ReservationWithPayment } from "@/interface/paymentInterface";
import { ReservationStatus } from "@/interface/enumInterface";

export const useReservationMutations = () => {
  const queryClient = useQueryClient();

  /**
   * Helper untuk melakukan optimistic update list + detail
   */
  const optimisticUpdate = (
    reservationId: string,
    status: ReservationStatus
  ) => {
    const prevDetail = queryClient.getQueryData<ReservationWithPayment>([
      "reservation", reservationId
    ]);
    const prevList = queryClient.getQueryData<ReservationWithPayment[]>([
      "reservations"
    ]);

    // Only update if data exists
    if (prevDetail) {
      queryClient.setQueryData<ReservationWithPayment>(
        ["reservation", reservationId],
        { ...prevDetail, orderStatus: status }
      );
    }

    if (prevList) {
      queryClient.setQueryData<ReservationWithPayment[]>(
        ["reservations"],
        prevList.map((item) =>
          item.id === reservationId ? { ...item, orderStatus: status } : item
        )
      );
    }

    return { prevDetail, prevList };
  };

  /**
   * Helper untuk rollback data
   */
  const rollbackUpdate = (
    reservationId: string,
    prevDetail?: ReservationWithPayment,
    prevList?: ReservationWithPayment[]
  ) => {
    if (prevDetail) {
      queryClient.setQueryData(["reservation", reservationId], prevDetail);
    }
    if (prevList) {
      queryClient.setQueryData(["reservations"], prevList);
    }
  };

  // ===== Reject Payment Mutation =====
  const rejectPaymentMutation = useMutation({
    mutationFn: rejectReservationByOwner,
    onMutate: async (reservationId) => {
      await queryClient.cancelQueries({
        queryKey: ["reservation", reservationId],
      });
      const result = optimisticUpdate(reservationId, ReservationStatus.PENDING_PAYMENT);
      return result;
    },
    onError: (err, reservationId, context) => {
      rollbackUpdate(reservationId, context?.prevDetail, context?.prevList);
      toast.error("Failed to reject payment", {
        description: err.message || "An unknown error occurred",
      });
    },
    onSuccess: (data, reservationId) => {
      const reservationData = data?.reservation;
      
      if (reservationData) {
        // Update detail cache - always try to update
        queryClient.setQueryData<ReservationWithPayment>(
          ["reservation", reservationId], 
          (old: ReservationWithPayment | undefined) => {
            if (old) {
              return { ...old, ...reservationData };
            }
            return reservationData;
          }
        );
        
        // Update list cache - always try to update
        queryClient.setQueryData<ReservationWithPayment[]>(
          ["reservations"],
          (old: ReservationWithPayment[] | undefined) => {
            if (!old) {
              return [reservationData];
            }
            
            // Check if item exists in list
            const itemExists = old.some(item => item.id === reservationId);
            if (itemExists) {
              return old.map(item => 
                item.id === reservationId ? { ...item, ...reservationData } : item
              );
            } else {
              return [...old, reservationData];
            }
          }
        );
      }
      toast.success("Payment rejected successfully");
    },
    onSettled: (_, __, reservationId) => {
      queryClient.invalidateQueries({ queryKey: ["reservation", reservationId] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });

  // ===== Confirm Payment Mutation =====
  const confirmPaymentMutation = useMutation({
    mutationFn: confirmReservationByOwner,
    onMutate: async (reservationId) => {
      await queryClient.cancelQueries({
        queryKey: ["reservation", reservationId],
      });
      const result = optimisticUpdate(reservationId, ReservationStatus.CONFIRMED);
      return result;
    },
    onError: (err, reservationId, context) => {
      rollbackUpdate(reservationId, context?.prevDetail, context?.prevList);
      toast.error("Failed to confirm payment", {
        description: err.message || "An unknown error occurred",
      });
    },
    onSuccess: (data, reservationId) => {
      const reservationData = data?.reservation;
      
      if (reservationData) {
        // Update detail cache
        queryClient.setQueryData<ReservationWithPayment>(
          ["reservation", reservationId], 
          (old: ReservationWithPayment | undefined) => {
            if (old) {
              return { ...old, ...reservationData };
            }
            return reservationData;
          }
        );
        
        // Update list cache
        queryClient.setQueryData<ReservationWithPayment[]>(
          ["reservations"],
          (old: ReservationWithPayment[] | undefined) => {
            if (!old) {
              return [reservationData];
            }
            
            const itemExists = old.some(item => item.id === reservationId);
            if (itemExists) {
              return old.map(item => 
                item.id === reservationId ? { ...item, ...reservationData } : item
              );
            } else {
              return [...old, reservationData];
            }
          }
        );
      }
      toast.success("Payment confirmed successfully");
    },
    onSettled: (_, __, reservationId) => {
      queryClient.invalidateQueries({ queryKey: ["reservation", reservationId] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });

  // ===== Cancel Reservation Mutation =====
  const cancelMutation = useMutation({
    mutationFn: cancelReservationByUser,
    onMutate: async (reservationId) => {
      await queryClient.cancelQueries({
        queryKey: ["reservation", reservationId],
      });
      const result = optimisticUpdate(reservationId, ReservationStatus.CANCELLED);
      return result;
    },
    onError: (err, reservationId, context) => {
      rollbackUpdate(reservationId, context?.prevDetail, context?.prevList);
      toast.error("Failed to cancel reservation", {
        description: err.message || "An unknown error occurred",
      });
    },
    onSuccess: () => {
      toast.success("Reservation cancelled successfully");
    },
    onSettled: (_, __, reservationId) => {
      queryClient.invalidateQueries({ queryKey: ["reservation", reservationId] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });

  return {
    cancelMutation,
    rejectPaymentMutation,
    confirmPaymentMutation,
  };
};