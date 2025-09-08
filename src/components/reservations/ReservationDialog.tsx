// components/reservations/ReservationDialog.tsx
"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  reservationId: string;
  actionType: "cancel" | "reject" | "confirm";
}

export const ReservationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  reservationId,
  actionType,
}: ReservationDialogProps) => {
  // Configuration based on action type
  const getConfig = () => {
    switch (actionType) {
      case "cancel":
        return {
          title: "Cancel Reservation?",
          description: `Are you sure you want to cancel reservation #${reservationId.substring(
            0,
            8
          )}? This action cannot be undone.`,
          confirmText: isLoading ? "Cancelling..." : "Yes, cancel",
          cancelText: "No, keep it",
          buttonVariant: "destructive" as const,
        };
      case "reject":
        return {
          title: "Reject Payment?",
          description: `Are you sure you want to reject payment for reservation #${reservationId.substring(
            0,
            8
          )}? This action cannot be undone.`,
          confirmText: isLoading ? "Rejecting..." : "Yes, reject",
          cancelText: "No, keep it",
          buttonVariant: "destructive" as const,
        };
      case "confirm":
        return {
          title: "Confirm Payment?",
          description: `Are you sure you want to confirm payment for reservation #${reservationId.substring(
            0,
            8
          )}? This will mark the reservation as confirmed.`,
          confirmText: isLoading ? "Confirming..." : "Yes, confirm",
          cancelText: "No, wait",
          buttonVariant: "default" as const,
        };
      default:
        return {
          title: "Are you sure?",
          description: `Are you sure you want to perform this action on reservation #${reservationId.substring(
            0,
            8
          )}?`,
          confirmText: isLoading ? "Processing..." : "Yes, proceed",
          cancelText: "No, cancel",
          buttonVariant: "default" as const,
        };
    }
  };

  const config = getConfig();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{config.title}</AlertDialogTitle>
          <AlertDialogDescription>{config.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {config.cancelText}
          </AlertDialogCancel>
          <Button
            variant={config.buttonVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className="cursor-pointer"
          >
            {config.confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
