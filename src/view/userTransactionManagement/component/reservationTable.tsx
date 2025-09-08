"use client";

import React, { useState } from "react";
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
import { format } from "date-fns";
import {
  RPResPagination,
  ReservationWithPayment,
} from "@/interface/paymentInterface";
import { GetUserReservationsParams } from "@/interface/queryInterface";
import ReservationActions from "@/view/userTransactionManagement/component/reservationAction";
import { ReservationStatus } from "@/interface/enumInterface";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import renderImageModal from "./tableComponent/renderImageModal";
import renderMobileView from "./tableComponent/renderMobileview";

interface ReservationTableProps {
  reservations: ReservationWithPayment[];
  pagination?: RPResPagination["pagination"];
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  currentParams: GetUserReservationsParams;
}

const ReservationTable = ({
  reservations,
  pagination,
  onPageChange,
  onLimitChange,
  onSortChange,
  currentParams,
}: ReservationTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    alt: string;
  } | null>(null);

  const { sortBy = "createdAt", sortOrder = "desc" } = currentParams;

  const openImageModal = (url: string, alt: string) => {
    setSelectedImage({ url, alt });
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleSort = (column: string) => {
    const backendSortBy = getBackendSortBy(column);
    if (backendSortBy) {
      const newSortOrder =
        sortBy === backendSortBy && sortOrder === "asc" ? "desc" : "asc";
      onSortChange(backendSortBy, newSortOrder);
    }
  };

  const getBackendSortBy = (column: string): string | null => {
    switch (column) {
      case "startDate":
      case "endDate":
      case "createdAt":
      case "orderStatus":
      case "property.name":
      case "RoomType.name":
      case "reservation.PaymentProof?.picture?.url":
        return column;
      case "payment.invoiceNumber":
        return "invoiceNumber";
      case "payment.amount":
        return "totalAmount";
      case "id":
        return "reservationNumber";
      default:
        console.warn(`Unknown column for sorting: ${column}`);
        return null;
    }
  };

  const getStatusBadgeVariant = (status: ReservationStatus) => {
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

  const renderSortIndicator = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const formatCurrency = (v?: number) =>
    v ? `Rp ${v.toLocaleString()}` : "N/A";

  const renderDesktopTable = () => (
    <div className="hidden md:block border rounded-2xl overflow-x-auto bg-white shadow-pr-soft">
      <div className="min-w-[1000px]">
        <Table>
          <TableHeader className="bg-gradient-to-r from-pr-primary/6 to-pr-mid/6">
            <TableRow>
              <TableHead
                onClick={() => handleSort("payment.invoiceNumber")}
                className="w-[130px] cursor-pointer"
              >
                Invoice {renderSortIndicator("payment.invoiceNumber")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("property.name")}
                className="cursor-pointer"
              >
                Property {renderSortIndicator("property.name")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("RoomType.name")}
                className="cursor-pointer"
              >
                Room Type {renderSortIndicator("RoomType.name")}
              </TableHead>
              <TableHead
                onClick={() =>
                  handleSort("reservation.PaymentProof?.picture?.url")
                }
                className="cursor-pointer"
              >
                Bukti Pembayaran{" "}
                {renderSortIndicator("reservation.PaymentProof?.picture?.url")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("startDate")}
                className="cursor-pointer"
              >
                Start {renderSortIndicator("startDate")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("endDate")}
                className="cursor-pointer"
              >
                End {renderSortIndicator("endDate")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("payment.amount")}
                className="cursor-pointer"
              >
                Amount {renderSortIndicator("payment.amount")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("orderStatus")}
                className="cursor-pointer"
              >
                Status {renderSortIndicator("orderStatus")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reservations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-10 text-pr-mid"
                >
                  No reservations found.
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((reservation) => (
                <TableRow
                  key={reservation.id}
                  className="hover:bg-pr-primary/5 transition"
                >
                  {renderDesktopCellContent(reservation)}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {renderPaginationControls()}
    </div>
  );

  const renderDesktopCellContent = (reservation: ReservationWithPayment) => (
    <>
      <TableCell className="font-semibold text-pr-dark whitespace-nowrap max-w-[160px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="truncate max-w-[160px] cursor-help">
              {reservation.payment?.invoiceNumber || "N/A"}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <span>{reservation.payment?.invoiceNumber || "N/A"}</span>
          </TooltipContent>
        </Tooltip>
      </TableCell>

      <TableCell className="max-w-[220px] text-sm text-pr-mid">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="truncate max-w-[220px] cursor-help">
              {reservation.Property?.name || "N/A"}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <span>{reservation.Property?.name || "N/A"}</span>
          </TooltipContent>
        </Tooltip>
      </TableCell>

      <TableCell className="max-w-[200px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="truncate max-w-[200px] cursor-help">
              {reservation.RoomType?.name || "N/A"}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <span>{reservation.RoomType?.name || "N/A"}</span>
          </TooltipContent>
        </Tooltip>
      </TableCell>

      <TableCell className="max-w-[160px]">
        {renderPaymentProofCell(reservation)}
      </TableCell>

      <TableCell className="whitespace-nowrap text-sm">
        {reservation.startDate
          ? format(new Date(reservation.startDate), "PPP")
          : "N/A"}
      </TableCell>
      <TableCell className="whitespace-nowrap text-sm">
        {reservation.endDate
          ? format(new Date(reservation.endDate), "PPP")
          : "N/A"}
      </TableCell>

      <TableCell className="whitespace-nowrap">
        {formatCurrency(reservation.payment?.amount)}
      </TableCell>

      <TableCell>
        <Badge
          variant={getStatusBadgeVariant(reservation.orderStatus)}
          className={
            reservation.orderStatus === "CONFIRMED"
              ? "uppercase bg-green-100 text-green-800"
              : "uppercase"
          }
        >
          {reservation.orderStatus.replace("_", " ")}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <ReservationActions reservation={reservation} />
      </TableCell>
    </>
  );

  const renderPaymentProofCell = (reservation: ReservationWithPayment) => {
    if (reservation.PaymentProof?.picture?.url) {
      return (
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              openImageModal(
                reservation.PaymentProof!.picture!.url!,
                reservation.PaymentProof!.picture!.alt || "Bukti Pembayaran"
              )
            }
            className="inline-block rounded overflow-hidden border border-pr-mid/20 cursor-pointer"
            aria-label="Open payment proof"
          >
            <img
              src={reservation.PaymentProof.picture.url}
              alt={reservation.PaymentProof.picture.alt || "Payment Proof"}
              className="h-10 w-14 object-cover"
              loading="lazy"
            />
          </button>

          <div className="text-sm">
            <button
              onClick={() =>
                openImageModal(
                  reservation.PaymentProof!.picture!.url!,
                  reservation.PaymentProof!.picture!.alt || "Bukti Pembayaran"
                )
              }
              className="text-pr-primary hover:underline cursor-pointer"
            >
              View
            </button>
          </div>
        </div>
      );
    }
    return <div className="text-sm text-pr-mid">Belum mengunggah</div>;
  };

  const renderPaginationControls = () => {
    if (!pagination) return null;

    return (
      <div className="flex items-center justify-between p-4 border-t bg-white">
        <div className="text-sm text-pr-mid">
          Showing{" "}
          {(pagination.currentPage - 1) * (currentParams.limit || 10) + 1} to{" "}
          {Math.min(
            pagination.currentPage * (currentParams.limit || 10),
            pagination.totalCount
          )}{" "}
          of {pagination.totalCount} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="rounded-full cursor-pointer"
          >
            Previous
          </Button>
          <span className="text-sm text-pr-dark">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            className="rounded-full cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const renderMobileCard = (reservation: ReservationWithPayment) => (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm text-pr-mid">Invoice</div>
            <div className="font-semibold text-pr-dark truncate">
              {reservation.payment?.invoiceNumber}
            </div>
          </div>

          <div className="mt-2 text-sm text-pr-mid truncate">
            {reservation.Property?.name || "N/A"}
          </div>
          <div className="mt-1 text-xs text-pr-mid truncate">
            {reservation.RoomType?.name || "N/A"}
          </div>

          <div className="mt-2 text-xs text-pr-mid flex gap-2">
            <div>
              {reservation.startDate
                ? format(new Date(reservation.startDate), "PPP")
                : "N/A"}
            </div>
            <div>→</div>
            <div>
              {reservation.endDate
                ? format(new Date(reservation.endDate), "PPP")
                : "N/A"}
            </div>
          </div>
        </div>

        <div className="w-28 flex-shrink-0 text-right">
          <div className="mb-2">
            <Badge
              variant={getStatusBadgeVariant(reservation.orderStatus)}
              className={
                reservation.orderStatus === "CONFIRMED"
                  ? "bg-green-100 text-green-800"
                  : undefined
              }
            >
              {reservation.orderStatus.replace("_", " ")}
            </Badge>
          </div>
          <div className="text-sm font-semibold text-pr-dark">
            {reservation.payment?.amount
              ? `Rp ${reservation.payment.amount.toLocaleString()}`
              : "N/A"}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>{renderMobilePaymentProof(reservation)}</div>

        <div>
          <ReservationActions reservation={reservation} />
        </div>
      </div>
    </>
  );

  const renderMobilePaymentProof = (reservation: ReservationWithPayment) => {
    if (!reservation.PaymentProof?.picture?.url) return null;

    return (
      <>
        <button
          onClick={() =>
            openImageModal(
              reservation.PaymentProof!.picture!.url!,
              reservation.PaymentProof!.picture!.alt || "Payment Proof"
            )
          }
          className="inline-block rounded overflow-hidden border border-pr-mid/20 mr-2 cursor-pointer"
        >
          <img
            src={reservation.PaymentProof.picture.url}
            alt={reservation.PaymentProof.picture.alt || "Payment Proof"}
            className="h-10 w-12 object-cover"
            loading="lazy"
          />
        </button>
        <button
          onClick={() =>
            openImageModal(
              reservation.PaymentProof!.picture!.url!,
              reservation.PaymentProof!.picture!.alt || "Payment Proof"
            )
          }
          className="text-pr-primary text-sm hover:underline cursor-pointer"
        >
          View Proof
        </button>
      </>
    );
  };

  const renderMobilePagination = () => {
    if (!pagination) return null;

    return (
      <div className="flex flex-col items-center justify-center mt-4 space-y-2">
        <div className="text-sm text-pr-mid">
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="rounded-full cursor-pointer"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            className="rounded-full cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderDesktopTable()}
      {renderMobileView(reservations, renderMobileCard, renderMobilePagination)}
      {renderImageModal(isModalOpen, selectedImage, closeImageModal)}
    </div>
  );
};

export default ReservationTable;
