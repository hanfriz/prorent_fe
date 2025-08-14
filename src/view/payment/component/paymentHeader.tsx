// src/components/.../paymentHeader.tsx
"use client";

import { CheckCircle } from "lucide-react";

interface PaymentHeaderProps {
  reservationData: any;
  isPaymentProofUploaded: boolean;
}

export function PaymentHeader({ reservationData, isPaymentProofUploaded }: PaymentHeaderProps) {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold">
        Reservation for {reservationData.RoomType?.property?.name}
      </h2>
      <p>Room Type: {reservationData.RoomType?.name}</p>
      <p>
        Dates: {new Date(reservationData.startDate).toLocaleDateString()} -{" "}
        {new Date(reservationData.endDate).toLocaleDateString()}
      </p>
      <p>
        Total Amount: Rp. {reservationData.payment?.amount.toLocaleString("id-ID")}
      </p>
      {isPaymentProofUploaded && (
        <PaymentSuccessMessage />
      )}
    </div>
  );
}

function PaymentSuccessMessage() {
  return (
    <div className="mt-3 flex items-center text-green-600">
      <CheckCircle className="h-5 w-5 mr-2" />
      <span>Payment proof uploaded successfully!</span>
    </div>
  );
}