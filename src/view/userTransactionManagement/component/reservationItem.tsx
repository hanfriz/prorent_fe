// components/reservation/ReservationItem.tsx
'use client';

import React, { useState } from 'react';
// Assuming you have the correct interface for a single reservation item
// Update the import path and interface name as needed
import { ReservationWithPayment } from '@/interface/paymentInterface'; // Or wherever your single reservation interface is
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
import Link from 'next/link'; // Import Link for navigation
import CancelReservationDialog from './cancelReservationDialog'; // Assuming this is the correct path/name

// --- Correct the Prop Type ---
interface ReservationItemProps {
  // reservation should be a single item, not the whole paginated response
  reservation: ReservationWithPayment;
  // If you still need onDelete for cancelling (though using mutation is better):
  // onDelete: (id: string) => void;
}

export function ReservationItem({ reservation }: ReservationItemProps) { // Remove onDelete from props if using mutation
  const router = useRouter();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // --- Corrected Data Mapping (Access properties directly on 'reservation') ---
  const orderId = reservation.id;
  // Use optional chaining (?.) to safely access nested properties
  const propertyName = reservation.RoomType?.property?.name || 'N/A';
  const roomTypeName = reservation.RoomType?.name || 'N/A';
  const displayProduct = `${propertyName} - ${roomTypeName}`;

  // Format dates (ensure dates are valid before formatting)
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

  // Access payment amount
  const price = reservation.payment?.amount ?? 0; // Default to 0 if undefined
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

  // Use orderStatus
  const status = reservation.orderStatus;

  // --- Status Handling ---
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

  // --- Action Handlers ---
  const handleViewClick = () => {
    toast.info(`Viewing details for Reservation ${orderId}`);
    // Example navigation to a details page
    // router.push(`/reservations/${orderId}`);
  };

  // Pay Now button logic (conditionally rendered)
  const isPaymentButtonActive = status === 'PENDING_PAYMENT';

  // Cancel button logic (conditionally rendered)
  const isCancelButtonActive = status === 'PENDING_PAYMENT' || status === 'PENDING_CONFIRMATION';

  const handleCancelClick = () => {
    if (isCancelButtonActive) {
       setIsCancelDialogOpen(true);
    }
  };

  const handleConfirmCancel = () => {
    // Trigger the cancel mutation here, or call a function passed down if preferred
    // For example, if using the mutation hook in the parent list component:
    // onCancel(reservation.id);
    toast.promise(
      // Simulate an API call or call the actual mutation function
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Cancelling reservation...',
        success: () => {
          setIsCancelDialogOpen(false);
          // Optionally, invalidate queries here or let parent handle it
          // queryClient.invalidateQueries({ queryKey: ['reservations'] });
          return `Reservation ${orderId} cancelled.`;
        },
        error: 'Failed to cancel reservation.',
      }
    );
    // setIsCancelDialogOpen(false); // Handled in toast.promise success
  };

  const handleOrderAgainClick = () => {
    toast.success(`Booking again ${displayProduct}!`);
    // router.push(`/book?propertyId=${reservation.propertyId}&roomTypeId=${reservation.roomTypeId}`);
  };

  // If using the dialog for cancel confirmation:
  const handleCancelDialogClose = () => {
    setIsCancelDialogOpen(false);
  };


  return (
    <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
      {/* Product/Reservation Info */}
      <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <div className="flex items-center">
          {/* Placeholder for property image - ideally use an actual image URL */}
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-xs text-gray-500">
            Img
          </div>
          <div className="ml-4">
            <div className="text-base font-semibold">{orderId.substring(0, 8)}...</div> {/* Truncate ID */}
            <div className="font-normal text-gray-500">{displayProduct}</div>
          </div>
        </div>
      </th>
      {/* Date */}
      <td className="px-4 py-3">{displayDate}</td>
      {/* Price */}
      <td className="px-4 py-3">{formattedPrice}</td>
      {/* Status */}
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass}`}>
          {statusLabel}
        </span>
      </td>
      {/* Actions */}
      <td className="px-4 py-3 flex items-center justify-end space-x-1"> {/* Add space between buttons */}
         {/* Pay Now Button - Only active for PENDING_PAYMENT */}
         {isPaymentButtonActive && (
          <Link href={`/payment/${orderId}`}> {/* Adjust path as needed */}
            <Button size="sm" className="h-8"> {/* Adjust size if needed */}
              Pay Now
            </Button>
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

            {/* Conditionally render Cancel based on status */}
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
            {/* Remove or disable the Delete option if not needed */}
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600">
              <XCircle className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>

      {/* Cancel Confirmation Dialog */}
<CancelReservationDialog
  isOpen={isCancelDialogOpen}
  onClose={handleCancelDialogClose}
  onConfirm={handleConfirmCancel}  
  reservationId={orderId}
/>
    </tr>
  );
}