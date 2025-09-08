"use client";

import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReservationDialog } from "@/components/reservations/ReservationDialog";
import { toast } from "sonner";
import { useReservationDetail } from "@/service/useReservation"; // ganti sesuai path hook-mu
import { useRouter } from "next/navigation";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

export function ReservationDetail({
  reservationId,
}: {
  reservationId: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<
    "cancel" | "reject" | "confirm" | null
  >(null);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  // ambil data pakai TanStack Query
  const {
    data: reservation,
    isLoading,
    isError,
    error,
  } = useReservationDetail(reservationId);

  const role = user?.role;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Memuat detail reservasi...</p>
      </div>
    );
  }

  if (isError || !reservation) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">
          Gagal memuat reservasi:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  // Helper tanggal
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(parseISO(dateString), "dd MMM yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  const checkIn = formatDate(reservation.startDate);
  const checkOut = formatDate(reservation.endDate);

  // Harga
  const price = reservation.payment?.amount ?? 0;
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

  // Status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800";
      case "PENDING_CONFIRMATION":
        return "bg-blue-100 text-blue-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "CHECKED_IN":
        return "bg-indigo-100 text-indigo-800";
      case "CHECKED_OUT":
        return "bg-purple-100 text-purple-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusClass = getStatusStyle(reservation.orderStatus);

  // Action logic
  const isPaymentButtonActive = reservation.orderStatus === "PENDING_PAYMENT";
  const isCancelButtonActive = reservation.orderStatus === "PENDING_PAYMENT";

  const handleCancel = () => {
    setDialogAction("cancel");
    setIsDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: "Membatalkan reservasi...",
      success: () => {
        setIsDialogOpen(false);
        setDialogAction(null);
        return "Reservasi berhasil dibatalkan";
      },
      error: "Gagal membatalkan reservasi",
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border relative mt-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <h1 className="text-xl font-bold">Hotel Reservation Ticket</h1>
        <p className="text-sm opacity-90">ID: {reservation.id}</p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            {reservation.RoomType?.property?.name || "Property"}
          </h2>
          <p className="text-gray-500">{reservation.RoomType?.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Check-In</p>
            <p className="text-gray-900">{checkIn}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Check-Out</p>
            <p className="text-gray-900">{checkOut}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Harga</p>
            <p className="text-gray-900">{formattedPrice}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Status</p>
            <Badge className={statusClass}>
              {reservation.orderStatus.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t flex justify-between items-center">
        <Button
          variant="default"
          onClick={() => {
            if (role === "USER") {
              router.push("/reservation/me");
            } else {
              router.push("/dashboard/reservations");
            }
          }}
          className="cursor-pointer"
        >
          <ArrowLeft className="mr-0" />
          Back
        </Button>
        {isPaymentButtonActive ? (
          <Link href={`/payment/${reservation.id}`}>
            <Button variant="default" className="cursor-pointer">
              Upload Payment Proof
            </Button>
          </Link>
        ) : (
          <Button variant="outline" className="cursor-pointer">
            Book Again
          </Button>
        )}

        {isCancelButtonActive && (
          <Button
            variant="destructive"
            onClick={handleCancel}
            className="cursor-pointer"
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Dialog */}
      {dialogAction && (
        <ReservationDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={handleConfirmCancel}
          reservationId={reservation.id}
          actionType={dialogAction}
        />
      )}
    </div>
  );
}
