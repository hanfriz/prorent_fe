// src/components/.../orderTotal.tsx
"use client";

interface OrderTotalProps {
  totalAmount: number;
}

export function OrderTotal({ totalAmount }: OrderTotalProps) {
  return (
    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
      <dt className="text-base font-bold text-gray-900 dark:text-white">
        Total
      </dt>
      <dd className="text-base font-bold text-gray-900 dark:text-white">
        Rp. {formatCurrency(totalAmount)}
      </dd>
    </dl>
  );
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("id-ID");
}