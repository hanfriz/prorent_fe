// components/reservation/ReservationItem.tsx
'use client';

import React, { useState } from 'react';
import { ReservationWithPayment } from '@/interface/paymentInterface'; 
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, CreditCard, XCircle, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { ReservationDialog } from '@/components/reservations/ReservationDialog';

interface ReservationItemProps {
  reservation: ReservationWithPayment; 
}

export function ReservationItem({ reservation }: ReservationItemProps) { 
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'cancel' | 'reject' | 'confirm' | null>(null);

  const orderId = reservation.id;
  const propertyName = reservation.RoomType?.property?.name || 'N/A';
  const roomTypeName = reservation.RoomType?.name || 'N/A';
  const displayProduct = `${propertyName} - ${roomTypeName}`;

  let formattedStartDate = 'N/A';
  let formattedEndDate = 'N/A';
  let displayDate = 'N/A';
  try {
    if (reservation.startDate) {
      formattedStartDate = format(parseISO(reservation.startDate), 'MMM dd, yyyy');
    }
    if (reservation.endDate) {
      formattedEndDate = format(parseISO(reservation.endDate), 'MMM dd, yyyy');
    }
    displayDate = `${formattedStartDate} - ${formattedEndDate}`;
  } catch (err) {
    console.error("Error formatting dates:", err);
    displayDate = 'Invalid Date';
  }

  const price = reservation.payment?.amount ?? 0;
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

  const status = reservation.orderStatus;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return {
          label: 'Pending Payment',
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        };
      case 'PENDING_CONFIRMATION':
        return {
          label: 'Pending Confirmation',
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        };
      case 'CONFIRMED':
        return {
          label: 'Confirmed',
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        };
      case 'CHECKED_IN':
        return {
          label: 'Checked In',
          className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
        };
      case 'CHECKED_OUT':
        return {
          label: 'Checked Out',
          className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        };
    }
  };

  const { label: statusLabel, className: statusBadgeClass } = getStatusInfo(status);

  const handleViewClick = () => {
    toast.info(`Viewing details for Reservation ${orderId}`);
  };

  const isPaymentButtonActive = status === 'PENDING_PAYMENT';
  const isCancelButtonActive = status === 'PENDING_PAYMENT' || status === 'PENDING_CONFIRMATION';

  // Dialog handlers
  const handleCancelClick = () => {
    if (isCancelButtonActive) {
      setDialogAction('cancel');
      setIsDialogOpen(true);
    }
  };

  const handleConfirmCancel = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Cancelling reservation...',
        success: () => {
          setIsDialogOpen(false);
          setDialogAction(null);
          return `Reservation ${orderId} cancelled.`;
        },
        error: 'Failed to cancel reservation.',
      }
    );
  };

  const handleOrderAgainClick = () => {
    toast.success(`Booking again ${displayProduct}!`);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setDialogAction(null);
  };

  return (
    <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
      <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <div className="flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-xs text-gray-500">
            Img
          </div>
          <div className="ml-4">
            <div className="text-base font-semibold">{orderId.substring(0, 8)}...</div>
            <div className="font-normal text-gray-500">{displayProduct}</div>
          </div>
        </div>
      </th>
      <td className="px-4 py-3">{displayDate}</td>
      <td className="px-4 py-3">{formattedPrice}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass}`}>
          {statusLabel}
        </span>
      </td>
      <td className="px-4 py-3 flex items-center justify-end space-x-1">
        {isPaymentButtonActive && (
                <Link href={`/payment/${reservation.id}`} className="capitalize font-semibold">
                  Upload Payment Proof
                </Link>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleViewClick}>
              <Eye className="mr-2 h-4 w-4" />
              <span>View Details</span>
            </DropdownMenuItem>

            {isCancelButtonActive && (
              <DropdownMenuItem onClick={handleCancelClick} className="text-red-600 focus:text-red-600">
                <XCircle className="mr-2 h-4 w-4" />
                <span>Cancel Reservation</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleOrderAgainClick}>
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Book Again</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
      
      {/* Unified Reservation Dialog */}
      {dialogAction && (
        <ReservationDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmCancel}
          reservationId={orderId}
          actionType={dialogAction}
        />
      )}
    </tr>
  );
}