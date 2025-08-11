// src/components/.../orderSummary.tsx
"use client";

import {
  Card,
} from "@/components/ui/card";
import { ReservationWithPayment } from "@/interface/paymentInterface";
import { OrderDetails } from "./orderDetails";
import { OrderTotal } from "./orderTotal";

interface OrderSummaryProps {
  reservationData?: ReservationWithPayment;
}

export default function OrderSummary({ reservationData }: OrderSummaryProps) {
  if (!reservationData) {
    return <OrderSummarySkeleton />;
  }

  const { totalAmount, nights } = calculateOrderDetails(reservationData);

  return (
    <Card className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <OrderDetails nights={nights} totalAmount={totalAmount} />
      <OrderTotal totalAmount={totalAmount} />
    </Card>
  );
}

function calculateOrderDetails(reservationData: ReservationWithPayment) {
  const totalAmount = reservationData.payment?.amount ?? 0;
  
  const start = new Date(reservationData.startDate);
  const end = new Date(reservationData.endDate);
  const nights = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  return { totalAmount, nights };
}

function OrderSummarySkeleton() {
  return (
    <Card className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
          <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
        </div>
      </div>
    </Card>
  );
}