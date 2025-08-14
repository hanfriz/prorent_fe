import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentInfoCardProps {
  data: {
    payerEmail: string;
    paymentType: string;
  };
  isLoading?: boolean;
}

export default function PaymentInfoCard({ 
  data, 
  isLoading 
}: PaymentInfoCardProps) {
  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg space-y-3 bg-gray-50">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg space-y-1 bg-gray-50">
      <p>
        <strong>Email Pembayar:</strong> {data.payerEmail}
      </p>
      <p>
        <strong>Metode Pembayaran:</strong> {data.paymentType}
      </p>
    </div>
  );
}