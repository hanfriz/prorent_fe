// src/components/report/RoomTypeReservationsTable.tsx
import React from "react";
import { ReservationMin } from "@/interface/report/reportInterface";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "./pagination";

interface RoomTypeReservationsTableProps {
  data: ReservationMin[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export default function RoomTypeReservationsTable({
  data,
  pagination,
  onPageChange,
}: RoomTypeReservationsTableProps) {
  const formatDate = (date: Date) => format(new Date(date), "MMM dd, yyyy");

  const getStatusBadge = (status: string) => {
    const base = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case "CONFIRMED":
        return <Badge className={`${base} bg-green-100 text-green-800`}>Confirmed</Badge>;
      case "PENDING_CONFIRMATION":
        return <Badge className={`${base} bg-yellow-100 text-yellow-800`}>Pending</Badge>;
      case "PENDING_PAYMENT":
        return <Badge className={`${base} bg-blue-100 text-blue-800`}>Payment</Badge>;
      case "CANCELLED":
        return <Badge className={`${base} bg-red-100 text-red-800`}>Cancelled</Badge>;
      default:
        return <Badge className={`${base} bg-gray-100 text-gray-800`}>{status}</Badge>;
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold mb-2">Reservation List</h4>

      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No reservations found.</p>
      ) : (
        <>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {reservation.user.firstName || "Guest"} {reservation.user.lastName || ""}
                        </p>
                        <p className="text-xs text-muted-foreground truncate w-36">
                          {reservation.user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(reservation.startDate)}</div>
                        <div className="text-muted-foreground">→ {formatDate(reservation.endDate)}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(reservation.orderStatus)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(reservation.paymentAmount || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
              className="mt-3"
            />
          )}
        </>
      )}
    </div>
  );
}