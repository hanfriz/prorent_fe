// components/reservations/ReservationActions.tsx
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelReservationByUser } from '@/service/reservationService'; // You need to implement this service
import CancelReservationDialog from './cancelReservationDialog';
import { RPResPagination, ReservationWithPayment } from '@/interface/paymentInterface'; // Import ReservationStatus
import Link from 'next/link'; // For navigation to payment page

interface ReservationActionsProps {
  reservation: ReservationWithPayment; // Pass the full reservation object
}

const ReservationActions = ({ reservation }: ReservationActionsProps) => {
  const queryClient = useQueryClient();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);

  // Mutation for cancelling reservation
  const cancelMutation = useMutation({
    mutationFn: cancelReservationByUser, // Implement this function in your service
    onSuccess: (_, cancelledReservationId) => { // Access the ID passed to mutate
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Reservation cancelled successfully');
      // Optional: Close dialog on success
      setIsCancelDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error('Failed to cancel reservation', {
        description: error.message || 'An unknown error occurred',
      });
    },
  });

  const handleCancelClick = () => {
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    cancelMutation.mutate(reservation.id); // Pass reservation ID
  };

  // Determine if payment button should be active
  const isPaymentButtonActive = reservation.orderStatus === 'PENDING_PAYMENT';

  return (
    <>
      <div className="flex items-center justify-end space-x-2">
        {/* Pay Now Button - Only active for PENDING_PAYMENT */}
        {isPaymentButtonActive && (
          <Link href={`/payment/${reservation.id}`}> {/* Adjust path as needed */}
            <Button size="sm">
              Pay Now
            </Button>
          </Link>
        )}

        {/* Actions Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => console.log('View details', reservation.id)} // Implement view details
            >
              View Details
            </DropdownMenuItem>
            {/* Conditionally render Cancel based on status */}
            {(reservation.orderStatus === 'PENDING_PAYMENT' ||
              reservation.orderStatus === 'PENDING_CONFIRMATION') && (
                <DropdownMenuItem
                  onClick={handleCancelClick}
                  className="text-red-600 focus:text-red-600"
                >
                  Cancel Reservation
                </DropdownMenuItem>
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cancel Confirmation Dialog */}
      <CancelReservationDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        isLoading={cancelMutation.isPending}
        reservationId={reservation.id}
      />
    </>
  );
};

export default ReservationActions;