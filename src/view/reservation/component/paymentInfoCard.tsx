import React from "react";

interface PaymentInfoCardProps {
  data: {
    payerEmail: string;
    paymentType: string;
  };
}

export default function PaymentInfoCard({ data }: PaymentInfoCardProps) {
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
