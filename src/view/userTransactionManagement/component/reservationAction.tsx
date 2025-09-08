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
import { useReservationMutations } from "../../ownerTransactionManagement/component/mutationAction";
import { ReservationActionsProps } from "@/interface/reservationInterface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReservationStatus } from "@/interface/enumInterface";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddReviewForm from "@/view/review/component/addReviewForm";

const ReservationActions = ({ reservation }: ReservationActionsProps) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = React.useState(false);
  const [dialogAction, setDialogAction] = React.useState<
    "cancel" | "reject" | "confirm" | null
  >(null);

  const { cancelMutation, rejectPaymentMutation, confirmPaymentMutation } =
    useReservationMutations();

  const isReviewEligible =
    reservation.orderStatus === ReservationStatus.CONFIRMED &&
    reservation.payment?.paymentStatus === ReservationStatus.CONFIRMED &&
    new Date(reservation.endDate) < new Date() &&
    !reservation.review;

  // Handlers for different actions
  const handleCancelClick = () => {
    setDialogAction("cancel");
    setIsDialogOpen(true);
  };

  const handleReviewClick = () => {
    setIsReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setIsReviewDialogOpen(false);
  };

  const handleConfirmAction = () => {
    switch (dialogAction) {
      case "cancel":
        cancelMutation.mutate(reservation.id, {
          onSuccess: () => {
            handleCloseDialog();
          },
        });
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
      <div className="flex items-center justify-end space-x-2 cursor-pointer">
        {/* Actions Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link
                href={`/reservation/${reservation.id}`}
                className="capitalize font-semibold cursor-pointer"
              >
                View Details
              </Link>
            </DropdownMenuItem>

            {isPaymentButtonActive && (
              <DropdownMenuItem>
                <Link
                  href={`/payment/${reservation.id}`}
                  className="capitalize font-semibold cursor-pointer"
                >
                  Upload Payment Proof
                </Link>
              </DropdownMenuItem>
            )}

            {isReviewEligible && (
              <DropdownMenuItem
                onClick={handleReviewClick}
                className="font-semibold cursor-pointer"
              >
                {/* You could use a Star icon from lucide-react here */}
                {/* import { Star } from "lucide-react"; ... <Star className="mr-2 h-4 w-4" /> */}
                Write a Review
              </DropdownMenuItem>
            )}
            {(reservation.orderStatus === "PENDING_PAYMENT" ||
              reservation.orderStatus === "PENDING_CONFIRMATION") && (
              <DropdownMenuItem
                onClick={handleCancelClick}
                className="text-red-600 focus:text-red-600 font-semibold cursor-pointer"
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
            (dialogAction === "cancel" && cancelMutation.isPending) ||
            (dialogAction === "reject" && rejectPaymentMutation.isPending) ||
            (dialogAction === "confirm" && confirmPaymentMutation.isPending)
          }
          reservationId={reservation.id}
          actionType={dialogAction}
        />
      )}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a Review</DialogTitle>
            <DialogDescription>
              Share your experience for reservation {reservation.id}.
            </DialogDescription>
          </DialogHeader>
          <AddReviewForm
            reservationId={reservation.id}
            onClose={handleCloseReviewDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReservationActions;
