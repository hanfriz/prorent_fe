// src/components/.../paymentForm.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OrderSummary from "./orderSummary";
import {
  getReservationWithPayment,
  uploadPaymentProof,
} from "@/service/reservationService";
import { usePaymentStore } from "@/lib/stores/paymentStore";
import {
  paymentFormSchema,
  type PaymentFormValues,
} from "@/validation/paymentProofValidation";
import { PaymentFormSkeleton } from "./paymentFormSkeleton";
import { PaymentHeader } from "./paymentHeader";
import { PaymentActions } from "./paymentAction";
import { usePaymentForm } from "./usePaymentForm";
import { useReservationStore } from "@/lib/stores/reservationStore";
import { Card } from "@/components/ui/card";
import moment from "moment-timezone";

export default function PaymentForm() {
  const params = useParams();
  const reservationId = params.id as string | undefined;
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: reservationData,
    error,
    isLoading,
  } = getReservationWithPayment(reservationId ?? "");
  const { setReservationData, setReservationLoading, setReservationError } =
    usePaymentStore();
  const {
    syncWithStore,
    handleSubmit,
    handleMutationSuccess,
    handleMutationError,
  } = usePaymentForm();
  const { reset } = useReservationStore();

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    syncWithStore(
      isLoading,
      reservationData,
      error,
      setReservationLoading,
      setReservationData,
      setReservationError
    );
  }, [reservationData, isLoading, error]);

  const form = useForm({
    defaultValues: {
      paymentMethod: "manual" as "manual" | "gateway",
      file: null as File | null,
      fullName: "",
      cardNumber: "",
      expiration: "",
      cvv: "",
    } satisfies PaymentFormValues,
    onSubmit: async ({ value }) => {
      handleSubmit(
        value,
        reservationId!,
        uploadPaymentProofMutation,
        isPaymentProofUploaded,
        router
      );
    },
  });

  const uploadPaymentProofMutation = useMutation({
    mutationFn: async ({
      reservationId,
      file,
    }: {
      reservationId: string;
      file: File;
    }) => {
      return uploadPaymentProof(reservationId, file);
    },
    onSuccess: (data) => {
      handleMutationSuccess(
        data,
        queryClient,
        reservationId,
        setReservationData,
        router
      );
    },
    onError: (error: any) => {
      handleMutationError(error);
    },
  });

  const isPaymentProofUploaded = !!reservationData?.PaymentProof;
  const isTimeHasExpired = moment().isAfter(reservationData?.expiresAt);

  if (!reservationId) {
    return (
      <ErrorMessage message="Error: Tidak dapat menemukan ID reservasi." />
    );
  }

  useEffect(() => {
    if (isTimeHasExpired && reservationData?.propertyId) {
      router.push(`/properties/${reservationData.propertyId}`);
    }
  }, [isTimeHasExpired, reservationData?.propertyId, router]);

  if (isTimeHasExpired) {
    return (
      <ErrorMessage message="Waktu pembayaran telah habis silahkan lakukan pemesanan ulang." />
    );
  }

  if (isLoading) {
    return <PaymentFormSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={getErrorDisplayMessage(error)} />;
  }

  if (!reservationData) {
    return <ErrorMessage message="Tidak dapat menemukan data reservasi." />;
  }

  return (
    <PaymentFormContent
      reservationData={reservationData}
      form={form}
      uploadPaymentProofMutation={uploadPaymentProofMutation}
      isPaymentProofUploaded={isPaymentProofUploaded}
    />
  );
}

export function PaymentFormContent({
  reservationData,
  form,
  uploadPaymentProofMutation,
  isPaymentProofUploaded,
}: any) {
  // Countdown state (hanya UI)
  const [timeLeft, setTimeLeft] = useState<string>("");
  const file = form?.state?.values?.file;

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  // Cleanup URL lama biar tidak leak
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const exp = reservationData?.expiresAt;
    if (!exp) return;

    const tick = () => {
      // Bandingkan expiredDate dengan lokal Asia/Jakarta, sesuai permintaan
      const now = moment().tz("Asia/Jakarta");
      const expiry = moment(exp).tz("Asia/Jakarta");
      const diff = expiry.diff(now);

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const dur = moment.duration(diff);
      const h = Math.floor(dur.asHours());
      const m = dur.minutes().toString().padStart(2, "00");
      const s = dur.seconds().toString().padStart(2, "00");
      setTimeLeft(`${h}J ${m}M ${s}D`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [reservationData?.expiredDate]);

  return (
    <section className="bg-gradient-to-br from-pr-primary/10 via-pr-bg to-pr-mid/10 py-10">
      <div className="mx-auto max-w-screen-md px-4">
        <PaymentHeader
          reservationData={reservationData}
          isPaymentProofUploaded={isPaymentProofUploaded}
        />

        {timeLeft && (
          <Card className="mb-8 p-4 text-center rounded-2xl border border-pr-primary shadow-pr-soft bg-pr-bg">
            {timeLeft === "Expired" ? (
              <span className="text-base md:text-lg font-semibold text-red-600">
                Reservasi sudah kedaluwarsa
              </span>
            ) : (
              <span className="text-base md:text-lg font-semibold text-pr-dark">
                Sisa waktu pembayaran:{" "}
                <span className="text-pr-primary">{timeLeft}</span>
              </span>
            )}
          </Card>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form?.handleSubmit?.();
          }}
          className="mx-auto max-w-3xl space-y-8"
        >
          <div className="bg-white p-6 rounded-2xl shadow-pr-soft border border-pr-primary/20 space-y-4">
            <label className="block text-sm font-medium text-pr-dark">
              Upload Bukti Pembayaran
            </label>

            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  form?.setFieldValue?.("file", e.target.files?.[0] || null)
                }
                className="block w-full rounded-xl border border-pr-mid/30 bg-pr-bg p-3 text-sm text-pr-dark 
                 focus:border-pr-primary focus:ring-pr-primary outline-none transition"
              />
            </div>

            {/* Preview file terpilih */}
            {form?.state?.values?.file && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-pr-mid">
                  File terpilih:{" "}
                  <span className="font-medium text-pr-dark">
                    {form.state.values.file.name}
                  </span>
                </p>
                <img
                  src={previewUrl || ""}
                  alt="Preview bukti pembayaran"
                  className="max-h-64 rounded-xl border border-pr-mid/20 shadow-md"
                />
              </div>
            )}
          </div>

          <OrderSummary reservationData={reservationData} />

          <PaymentActions
            uploadPaymentProofMutation={uploadPaymentProofMutation}
            isPaymentProofUploaded={isPaymentProofUploaded}
            paymentMethod={form?.state?.values?.paymentMethod ?? "manual"}
          />
        </form>
      </div>
    </section>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="p-4 text-red-500 text-center">{message}</div>
        </div>
      </div>
    </section>
  );
}

function getErrorDisplayMessage(error: any): string {
  return error instanceof Error
    ? error.message
    : "Failed to load reservation details";
}
