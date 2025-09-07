// app/payment/failed/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  const [status, setStatus] = useState<
    "checking" | "failed" | "expired" | "pending"
  >("checking");

  useEffect(() => {
    const checkReservationStatus = async () => {
      if (!reservationId) {
        setStatus("failed");
        return;
      }

      try {
        const response = await fetch(`/api/reservation/${reservationId}`);

        if (!response.ok) {
          setStatus("failed");
          return;
        }

        const data = await response.json();

        // Check the actual status from backend
        switch (data.orderStatus) {
          case "CANCELLED":
            setStatus("expired");
            break;
          case "PENDING_PAYMENT":
            setStatus("pending");
            break;
          case "CONFIRMED":
            router.push(`/payment/success?reservationId=${reservationId}`);
            break;
          default:
            setStatus("failed");
        }
      } catch (error) {
        console.error("Error checking reservation status:", error);
        setStatus("failed");
      }
    };

    checkReservationStatus();
  }, [reservationId, router]);

  const handleRetryPayment = () => {
    if (reservationId) {
      router.push(`/reservation/${reservationId}`);
    } else {
      router.push("/");
    }
  };

  const renderContent = () => {
    switch (status) {
      case "checking":
        return (
          <div className="flex flex-col items-center space-y-4 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-blue-500"></div>
            <p className="text-gray-600">Checking payment status...</p>
          </div>
        );

      case "expired":
        return (
          <>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="mt-4 text-2xl font-bold text-yellow-700">
                Payment Expired
              </CardTitle>
            </div>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600">
                  Your payment session has expired. For security reasons,
                  payment links are only valid for a limited time.
                </p>
                {reservationId && (
                  <p className="mt-2 text-sm text-gray-500">
                    Reservation ID:{" "}
                    <span className="font-mono">{reservationId}</span>
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-yellow-50 p-4">
                <h3 className="font-semibold text-yellow-800">
                  What you can do:
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-yellow-700">
                  <li>
                    • Create a new reservation to generate a fresh payment link
                  </li>
                  <li>• Contact customer support if you need assistance</li>
                </ul>
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  onClick={handleRetryPayment}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Create New Reservation
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                >
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </>
        );

      case "pending":
        return (
          <>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="mt-4 text-2xl font-bold text-blue-700">
                Payment Still Processing
              </CardTitle>
            </div>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600">
                  Your payment is still being processed. This may take a few
                  minutes.
                </p>
                {reservationId && (
                  <p className="mt-2 text-sm text-gray-500">
                    Reservation ID:{" "}
                    <span className="font-mono">{reservationId}</span>
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="font-semibold text-blue-800">
                  Please wait or check back later:
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-blue-700">
                  <li>• Payment processing can take up to 5-10 minutes</li>
                  <li>• Refresh this page to check the latest status</li>
                  <li>• You will receive an email once payment is confirmed</li>
                </ul>
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Status
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Link href="/reservation/me">Check My Reservations</Link>
                </Button>
              </div>
            </CardContent>
          </>
        );

      case "failed":
      default:
        return (
          <>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="mt-4 text-2xl font-bold text-red-700">
                Payment Failed
              </CardTitle>
            </div>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600">
                  We're sorry, but your payment could not be processed at this
                  time.
                </p>
                {reservationId && (
                  <p className="mt-2 text-sm text-gray-500">
                    Reservation ID:{" "}
                    <span className="font-mono">{reservationId}</span>
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-red-50 p-4">
                <h3 className="font-semibold text-red-800">
                  Common reasons for payment failure:
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-red-700">
                  <li>• Insufficient funds in your payment method</li>
                  <li>• Bank or payment provider declined the transaction</li>
                  <li>• Network issues during payment processing</li>
                  <li>• Incorrect payment details entered</li>
                </ul>
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  onClick={handleRetryPayment}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Payment Again
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        {renderContent()}
      </Card>
    </div>
  );
}
