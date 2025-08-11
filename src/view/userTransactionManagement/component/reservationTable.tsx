// components/reservations/ReservationTable.tsx
"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { RPResPagination, ReservationWithPayment } from '@/interface/paymentInterface';
import { GetUserReservationsParams } from '@/interface/queryInterface';
import DeleteReservationDialog from '@/view/userTransactionManagement/component/cancelReservationDialog';
import ReservationActions from '@/view/userTransactionManagement/component/reservationAction';
import {ReservationStatus } from '@/interface/enumInterface';
import { Skeleton } from '@/components/ui/skeleton';

interface ReservationTableProps {
  reservations: ReservationWithPayment[];
  pagination?: RPResPagination['pagination'];
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  currentParams: GetUserReservationsParams;
}

const ReservationTable = ({
  reservations,
  pagination,
  onPageChange,
  onLimitChange,
  onSortChange,
  currentParams
}: ReservationTableProps) => {
  const { sortBy = 'createdAt', sortOrder = 'desc' } = currentParams;

  const handleSort = (column: string) => {
    const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(column, newSortOrder);
  };

const getStatusBadgeVariant = (status: ReservationStatus) => { // Use the specific type
  switch (status) {
    case 'PENDING_PAYMENT':
      return 'destructive'; // Red badge
    case 'PENDING_CONFIRMATION':
      return 'secondary'; // Gray badge
    case 'CONFIRMED':
      return 'default'; // Blue badge (or 'success' if you add it)
    case 'CANCELLED':
      return 'outline'; // White badge with border
    default:
      return 'default'; // Fallback
  }
};

  const renderSortIndicator = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead onClick={() => handleSort('property.name')} className="cursor-pointer">
              Property {renderSortIndicator('property.name')}
            </TableHead>
            <TableHead onClick={() => handleSort('RoomType.name')} className="cursor-pointer">
              Room Type {renderSortIndicator('RoomType.name')}
            </TableHead>
            <TableHead onClick={() => handleSort('startDate')} className="cursor-pointer">
              Start Date {renderSortIndicator('startDate')}
            </TableHead>
            <TableHead onClick={() => handleSort('endDate')} className="cursor-pointer">
              End Date {renderSortIndicator('endDate')}
            </TableHead>
            <TableHead onClick={() => handleSort('payment.amount')} className="cursor-pointer">
              Amount {renderSortIndicator('payment.amount')}
            </TableHead>
            <TableHead onClick={() => handleSort('orderStatus')} className="cursor-pointer">
              Status {renderSortIndicator('orderStatus')}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No reservations found.
              </TableCell>
            </TableRow>
          ) : (
            reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.payment?.invoiceNumber}</TableCell>
                <TableCell>{reservation.RoomType?.property?.name || 'N/A'}</TableCell>
                <TableCell>{reservation.RoomType?.name || 'N/A'}</TableCell>
                <TableCell>{reservation.startDate ? format(new Date(reservation.startDate), 'PPP') : 'N/A'}</TableCell>
                <TableCell>{reservation.endDate ? format(new Date(reservation.endDate), 'PPP') : 'N/A'}</TableCell>
                <TableCell>
                  {reservation.payment?.amount ? `Rp${reservation.payment.amount.toLocaleString()}` : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(reservation.orderStatus)}>
                    {reservation.orderStatus.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ReservationActions reservation={reservation} />
                  {/* <DeleteReservationDialog reservationId={reservation.id} /> */}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.currentPage - 1) * (currentParams.limit || 10)) + 1} to{' '}
            {Math.min(pagination.currentPage * (currentParams.limit || 10), pagination.totalCount)} of{' '}
            {pagination.totalCount} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationTable;