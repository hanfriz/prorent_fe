"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUserReservations } from "@/service/useReservation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentWaitingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId") || undefined;

  // Ambil data reservasi tunggal via TanStack Query
  const { data, isFetching } = useUserReservations({
    page: 1,
    limit: 1,
    search: reservationId,
  });

  console.log(data);

  // Monitor orderStatus
  useEffect(() => {
    const orderStatus = data?.reservations[0]?.orderStatus;
    console.log(orderStatus);
    if (orderStatus === "CONFIRMED") {
      router.push(`/payment/success?reservationId=${reservationId}`);
    } else if (orderStatus === "CANCELLED") {
      router.push(`/payment/failed?reservationId=${reservationId}`);
    }
  }, [data, reservationId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold text-blue-700">
            Waiting for Payment...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            We're processing your payment now. This might take a moment.
          </p>
          {reservationId && (
            <p className="text-sm text-gray-500">
              Reservation ID: <span className="font-mono">{reservationId}</span>
            </p>
          )}
          <div className="flex space-x-2">
            <Button
              onClick={() => router.refresh()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
              disabled={isFetching}
            >
              {isFetching ? "Refreshing..." : "Refresh Status"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer"
              onClick={() => router.push("/reservation/me")}
            >
              My Reservations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
