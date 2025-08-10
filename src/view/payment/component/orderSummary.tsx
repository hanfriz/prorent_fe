// src/components/.../orderSummary.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ReservationWithPayment } from "@/interface/paymentInterface"; // Sesuaikan path

interface OrderSummaryProps {
  reservationData?: ReservationWithPayment; // Jadikan opsional jika komponen bisa digunakan tanpa data
}

export default function OrderSummary({ reservationData }: OrderSummaryProps) {
  if (!reservationData) {
    return <div className="p-4 text-gray-500">Loading order summary...</div>;
  }

  // --- Ekstrak data yang dibutuhkan untuk kemudahan ---
  // Asumsikan amount sudah merupakan total harga untuk seluruh masa menginap
  const totalAmount = reservationData.payment?.amount ?? 0;
  // Hitung jumlah malam
  const start = new Date(reservationData.startDate);
  const end = new Date(reservationData.endDate);
  const nights = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Hitung harga per malam (perkiraan)
  const pricePerNight = nights > 0 ? totalAmount / nights : totalAmount;
  // --- Akhir ekstrak data ---

  return (
    <Card className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="space-y-2">
        {/* Teruskan data yang dibutuhkan ke sub-komponen */}
        <PriceDetails
          pricePerNight={pricePerNight}
          nights={nights}
          totalAmount={totalAmount}
        />
      </div>

      {/* Teruskan totalAmount ke TotalAmount */}
      <TotalAmount totalAmount={totalAmount} />

      <Button
        type="submit"
        className="flex w-full items-center justify-center bg-blue-600 py-3 px-5 text-center text-sm font-medium text-white cursor-pointer hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Pay now
      </Button>
    </Card>
  );
}

// --- Perbarui sub-komponen untuk menerima props ---
interface PriceDetailsProps {
  pricePerNight: number;
  nights: number;
  totalAmount: number;
}

function PriceDetails({
  pricePerNight,
  nights,
  totalAmount,
}: PriceDetailsProps) {
  return (
    <dl className="flex items-center justify-between gap-4">
      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
        Harga ({nights} malam x Rp. {pricePerNight.toLocaleString("id-ID")})
      </dt>
      <dd className="text-base font-medium text-gray-900 dark:text-white">
        {/* Rp. {reservationData.payment?.amount.toLocaleString("id-ID")} */}
        Rp. {totalAmount.toLocaleString("id-ID")}
      </dd>
    </dl>
  );
}

interface TotalAmountProps {
  totalAmount: number;
}

function TotalAmount({ totalAmount }: TotalAmountProps) {
  return (
    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
      <dt className="text-base font-bold text-gray-900 dark:text-white">
        Total
      </dt>
      <dd className="text-base font-bold text-gray-900 dark:text-white">
        {/* $7,191.00 */}
        Rp. {totalAmount.toLocaleString("id-ID")}
      </dd>
    </dl>
  );
}
// --- Akhir perbarui sub-komponen ---
