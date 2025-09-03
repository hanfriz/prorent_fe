// prorent_fe/src/view/reservation/component/paymentInfoCard.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentType } from "@/interface/enumInterface";
import { UseReservationFormReturn } from "./useReservationForm";

type ReservationForm = UseReservationFormReturn["form"];

interface PaymentInfoCardProps {
  data: { payerEmail: string; paymentType: PaymentType };
  form: ReservationForm;
  isLoading?: boolean;
}

export default function PaymentInfoCard({
  data,
  form,
  isLoading,
}: PaymentInfoCardProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Payer Email */}
      <div>
        <div className="text-sm text-gray-600">Email Pembayar</div>
        <div className="mt-1 text-sm font-medium text-pr-dark">
          {data.payerEmail ?? "N/A"}
        </div>
      </div>

      {/* Payment Type */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Metode Pembayaran
        </label>
        {form.Field && typeof form.Field === "function" ? (
          form.Field({
            name: "paymentType",
            children: (field: any) => {
              const current = field.state.value ?? data.paymentType;

              return (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      field.handleChange(PaymentType.MANUAL_TRANSFER);
                      form.setFieldValue(
                        "paymentType",
                        PaymentType.MANUAL_TRANSFER
                      );
                    }}
                    className={`p-3 rounded-lg border text-left cursor-pointer ${
                      current === PaymentType.MANUAL_TRANSFER
                        ? "border-pr-mid bg-pr-bg"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="text-sm font-semibold">Transfer Manual</div>
                    <div className="text-xs text-gray-500">
                      Transfer bank / offline
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      field.handleChange(PaymentType.XENDIT);
                      form.setFieldValue("paymentType", PaymentType.XENDIT);
                    }}
                    className={`p-3 rounded-lg border text-left cursor-pointer ${
                      current === PaymentType.XENDIT
                        ? "border-pr-mid bg-pr-bg"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="text-sm font-semibold">
                      Pembayaran Online
                    </div>
                    <div className="text-xs text-gray-500">Xendit</div>
                  </button>
                </div>
              );
            },
          })
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
}
