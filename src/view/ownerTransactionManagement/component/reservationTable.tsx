// components/reservations/ReservationTable.tsx
"use client";

import React, { useState } from 'react';
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
import { ImageModal } from './imageModal'; // Make sure this path is correct
import ReservationActions from './reservationAction';
import {ReservationStatus } from '@/interface/enumInterface';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
  
  const { sortBy = 'createdAt', sortOrder = 'desc' } = currentParams;

  const handleSort = (column: string) => {
    let backendSortBy: string | null = null;
    switch (column) {
      case 'startDate':
      case 'endDate':
      case 'createdAt':
      case 'orderStatus':
      case 'property.name':
      case 'RoomType.name':
        backendSortBy = column;
        break;
      case 'payment.invoiceNumber':
        backendSortBy = 'invoiceNumber';
        break;
      case 'payment.amount':
        backendSortBy = 'totalAmount';
        break;
      case 'id':
        backendSortBy = 'reservationNumber';
        break;
      default:
        console.warn(`Unknown column for sorting: ${column}`);
        return;
    }
    if (backendSortBy) {
      const newSortOrder = (sortBy === backendSortBy && sortOrder === 'asc') ? 'desc' : 'asc';
      onSortChange(backendSortBy, newSortOrder);
    }
  };

  const getStatusBadgeVariant = (status: ReservationStatus) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'destructive';
      case 'PENDING_CONFIRMATION':
        return 'secondary';
      case 'CONFIRMED':
        return 'default';
      case 'CANCELLED':
        return 'outline';
      default:
        return 'default';
    }
  };

  const renderSortIndicator = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const openImageModal = (url: string, alt: string) => {
    setSelectedImage({ url, alt });
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('payment.invoiceNumber')} className="w-[100px] cursor-pointer">Invoice Number
              {renderSortIndicator('payment.invoiceNumber')}
            </TableHead>
            <TableHead onClick={() => handleSort('property.name')} className="cursor-pointer">
              Property {renderSortIndicator('property.name')}
            </TableHead>
            <TableHead onClick={() => handleSort('RoomType.name')} className="cursor-pointer">
              Room Type {renderSortIndicator('RoomType.name')}
            </TableHead>
            <TableHead className="cursor-pointer">
              Payment Proof
            </TableHead>
            <TableHead onClick={() => handleSort('startDate')} className="cursor-pointer">
              CheckIn {renderSortIndicator('startDate')}
            </TableHead>
            <TableHead onClick={() => handleSort('endDate')} className="cursor-pointer">
              CheckOut {renderSortIndicator('endDate')}
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
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No reservations found.
              </TableCell>
            </TableRow>
          ) : (
            reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.payment?.invoiceNumber}</TableCell>
                <TableCell>{reservation.Property?.name || 'N/A'}</TableCell>
                <TableCell>{reservation.RoomType?.name || 'N/A'}</TableCell>
                <TableCell>
                  {reservation.PaymentProof?.picture?.url ? (
                    <button
                      onClick={() => openImageModal(
                        reservation.PaymentProof!.picture!.url!, 
                        reservation.PaymentProof!.picture!.alt || 'Payment Proof'
                      )}
                      className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      {reservation.PaymentProof?.picture?.alt || 'View Proof'}
                    </button>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeImageModal}
        imageUrl={selectedImage?.url || ''}
        altText={selectedImage?.alt || ''}
      />

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