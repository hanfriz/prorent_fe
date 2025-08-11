// components/reservations/CancelReservationDialog.tsx
"use client";

import React from 'react';
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

interface CancelReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  reservationId: string; // Pass ID for context
}

const CancelReservationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  reservationId
}: CancelReservationDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Reservation?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel reservation <span className="font-semibold">#{reservationId.substring(0, 8)}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>No, keep it</AlertDialogCancel>
          {/* Use Button with variant="destructive" for consistency */}
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
                      >
            {isLoading ? 'Cancelling...' : 'Yes, cancel'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelReservationDialog;