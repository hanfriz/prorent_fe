// src/components/.../orderDetails.tsx
"use client";

interface OrderDetailsProps {
  nights: number;
  totalAmount: number;
}

export function OrderDetails({ nights, totalAmount }: OrderDetailsProps) {
  return (
    <div className="space-y-2">
      <PriceDetails nights={nights} totalAmount={totalAmount} />
    </div>
  );
}

interface PriceDetailsProps {
  nights: number;
  totalAmount: number;
}

function PriceDetails({ nights, totalAmount }: PriceDetailsProps) {
  return (
    <dl className="flex items-center justify-between gap-4">
      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
        Harga untuk {nights} malam
      </dt>
      <dd className="text-base font-medium text-gray-900 dark:text-white">
        Rp. {totalAmount.toLocaleString("id-ID")}
      </dd>
    </dl>
  );
}