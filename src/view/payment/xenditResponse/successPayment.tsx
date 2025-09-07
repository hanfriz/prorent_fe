// app/payment/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !isRedirecting) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/reservation/me");
    }
  }, [countdown, isRedirecting, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold text-green-700">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600">
              Thank you for your payment! Your reservation has been confirmed
              successfully.
            </p>
            {reservationId && (
              <p className="mt-2 text-sm text-gray-500">
                Reservation ID:{" "}
                <span className="font-mono">{reservationId}</span>
              </p>
            )}
          </div>

          <div className="rounded-lg bg-green-50 p-4">
            <h3 className="font-semibold text-green-800">What happens next?</h3>
            <ul className="mt-2 space-y-1 text-sm text-green-700">
              <li>• You will receive a confirmation email shortly</li>
              <li>
                • Your reservation details are available in your dashboard
              </li>
              <li>• Property owner has been notified of your booking</li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Redirecting to your reservations in {countdown} seconds...
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => {
                setIsRedirecting(true);
                router.push("/reservation/me");
              }}
              disabled={isRedirecting}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                "View My Reservations Now"
              )}
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
