// components/reservations/ReservationActions.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { ReservationDialog } from "@/components/reservations/ReservationDialog";
import { useReservationMutations } from "./mutationAction";
import { ReservationActionsProps } from "@/interface/reservationInterface";
import Link from "next/link";

const ReservationActions = ({ reservation }: ReservationActionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [dialogAction, setDialogAction] = React.useState<'cancel' | 'reject' | 'confirm' | null>(null);

  const {
    cancelMutation,
    rejectPaymentMutation,
    confirmPaymentMutation
  } = useReservationMutations();

  // Handlers for different actions
  const handleCancelClick = () => {
    setDialogAction('cancel');
    setIsDialogOpen(true);
  };

  const handleRejectClick = () => {
    setDialogAction('reject');
    setIsDialogOpen(true);
  };

  const handleConfirmClick = () => {
    setDialogAction('confirm');
    setIsDialogOpen(true);
  };

  const handleConfirmAction = () => {
    switch (dialogAction) {
      case 'cancel':
        cancelMutation.mutate(reservation.id);
        break;
      case 'reject':
        rejectPaymentMutation.mutate(reservation.id);
        break;
      case 'confirm':
        confirmPaymentMutation.mutate(reservation.id);
        break;
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setDialogAction(null);
  };

  // Determine if payment button should be active
  const isPaymentButtonActive = reservation.orderStatus === "PENDING_PAYMENT";

  return (
    <>
      <div className="flex items-center justify-end space-x-2">
        {/* Actions Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/reservation/${reservation.id}`} className="capitalize font-semibold">
                View Details
              </Link>
            </DropdownMenuItem>
            
            {isPaymentButtonActive && (
              <DropdownMenuItem>
                <Link href={`/payment/${reservation.id}`} className="capitalize font-semibold">
                  Upload Payment Proof
                </Link>
              </DropdownMenuItem>
            )}
            
            {(reservation.orderStatus === "PENDING_CONFIRMATION" ||
              reservation.orderStatus === "PENDING_PAYMENT") && (
              <>
                <DropdownMenuItem
                  onClick={handleRejectClick}
                  className="text-red-600 focus:text-red-600 font-semibold"
                >
                  Reject Payment
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  onClick={handleConfirmClick}
                  className="text-green-600 focus:text-green-600 font-semibold"
                >
                  Confirm Payment
                </DropdownMenuItem>
              </>
            )}
            
            {(reservation.orderStatus === "PENDING_PAYMENT" ||
              reservation.orderStatus === "PENDING_CONFIRMATION") && (
              <DropdownMenuItem
                onClick={handleCancelClick}
                className="text-red-600 focus:text-red-600 font-semibold"
              >
                Cancel Reservation
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Unified Reservation Dialog */}
      {dialogAction && (
        <ReservationDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmAction}
          isLoading={
            (dialogAction === 'cancel' && cancelMutation.isPending) ||
            (dialogAction === 'reject' && rejectPaymentMutation.isPending) ||
            (dialogAction === 'confirm' && confirmPaymentMutation.isPending)
          }
          reservationId={reservation.id}
          actionType={dialogAction}
        />
      )}
    </>
  );
};

export default ReservationActions;