// src/components/report/RoomTypeReservationsTable.tsx
"use client";

import React, { useEffect, useState } from "react";
import { usePropertyReservations } from "@/service/useReservation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ReservationFilters from "@/view/userTransactionManagement/component/reservationList";
import { GetUserReservationsParams } from "@/interface/queryInterface";
import { useReservationStore } from "@/lib/stores/reservationStore";

interface RoomTypeReservationsTableProps {
  propertyId: string;
  roomTypeId: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
}

export default function RoomTypeReservationsTable({
  propertyId,
  roomTypeId,
  dateRange,
}: RoomTypeReservationsTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(
    dateRange.startDate || undefined
  );
  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(
    dateRange.endDate || undefined
  );

  const { reservationParams, updateReservationParams } = useReservationStore();

  // Build query params
  const queryParams: GetUserReservationsParams = {
    page: reservationParams.page || 1,
    limit: reservationParams.limit || 10,
    sortBy: reservationParams.sortBy || "createdAt",
    sortOrder: reservationParams.sortOrder || "desc",
    roomTypeId: roomTypeId,
    search: searchTerm || reservationParams.search,
    status: statusFilter || reservationParams.status,
    startDate: localStartDate
      ? localStartDate.toISOString()
      : reservationParams.startDate,
    endDate: localEndDate
      ? localEndDate.toISOString()
      : reservationParams.endDate,
  };

  // Use the property-based hook
  const { data, isLoading, isError, error } = usePropertyReservations(
    propertyId,
    queryParams
  );

  const reservations = data?.reservations || [];
  const pagination = data?.pagination;
  // Filter handlers
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    updateReservationParams({ page: 1 });
  };

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    updateReservationParams({ page: 1 });
  };

  const handleDateFilter = (start: Date | undefined, end: Date | undefined) => {
    setLocalStartDate(start);
    setLocalEndDate(end);
    updateReservationParams({ page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateReservationParams({ page: newPage });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
    setLocalStartDate(dateRange.startDate || undefined);
    setLocalEndDate(dateRange.endDate || undefined);
    updateReservationParams({
      page: 1,
      search: undefined,
      status: undefined,
      startDate: dateRange.startDate
        ? dateRange.startDate.toISOString()
        : undefined,
      endDate: dateRange.endDate ? dateRange.endDate.toISOString() : undefined,
    });
  };

  const formatDate = (date: string | Date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "destructive";
      case "PENDING_CONFIRMATION":
        return "secondary";
      case "CONFIRMED":
        return "default";
      case "CANCELLED":
        return "outline";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="mt-4 p-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-4 p-4 text-red-500">
        Error loading reservations: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold mb-2">Reservation List</h4>

      <div className="mb-4">
        <ReservationFilters
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          onDateFilter={handleDateFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          currentStatus={statusFilter || undefined}
          startDate={localStartDate}
          endDate={localEndDate}
        />
        <div className="flex justify-end mt-2">
          <Button variant="outline" onClick={handleClearFilters} size="sm">
            Clear All Filters
          </Button>
        </div>
      </div>

      {reservations.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          No reservations found.
        </p>
      ) : (
        <>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation: any) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {reservation.User?.firstName || ""}{" "}
                          {reservation.User?.lastName || ""}
                        </p>
                        <p className="text-xs text-muted-foreground truncate w-36">
                          {reservation.User?.email || "N/A"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {reservation.payment?.invoiceNumber || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {reservation.startDate
                            ? formatDate(reservation.startDate)
                            : "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-muted-foreground">
                        {reservation.endDate
                          ? formatDate(reservation.endDate)
                          : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(reservation.orderStatus)}
                      >
                        {reservation.orderStatus.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {reservation.payment?.amount
                        ? new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(reservation.payment.amount)
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {pagination && (
            <div className="flex items-center justify-between p-4 border-t mt-4">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {(pagination.currentPage - 1) * (queryParams.limit || 10) + 1}{" "}
                to{" "}
                {Math.min(
                  pagination.currentPage * (queryParams.limit || 10),
                  pagination.totalCount
                )}{" "}
                of {pagination.totalCount} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
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
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
