"use client";

import { useState, useMemo } from "react";
import { useReservationForm } from "./component/useReservationForm";
import PropertyInfoCard from "./component/propertyInfoCard";
import PaymentInfoCard from "./component/paymentInfoCard";
import DateSelectionSection from "./component/dateSelectionSection";
import SubmitButton from "./component/submitButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { useReservationStore } from "@/lib/stores/reservationStore";
import { PaymentType } from "@/interface/enumInterface";
import { useAuth } from "@/lib/hooks/useAuth";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function CreateReservationPage() {
  const router = useRouter();
  const { formData, displayData, setField, reset } = useReservationStore();

  const [startDate, setStartDate] = useState<Date | undefined>(
    formData.startDate ? new Date(formData.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    formData.endDate ? new Date(formData.endDate) : undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulate loading
  useState(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  });

  const { form, priceMap, isFormValid } = useReservationForm({
    displayData,
    formData,
    startDate,
    endDate,
    setField,
  });

  const { nights, estimatedTotal } = useMemo(() => {
    if (!startDate || !endDate) return { nights: 0, estimatedTotal: 0 };
    const diff = Math.max(
      0,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
    );
    // estimate: sum priceMap or use base price
    let total = 0;
    let day = new Date(startDate);
    for (let i = 0; i < diff; i++) {
      const key = day.toISOString().slice(0, 10);
      total += priceMap[key] ?? displayData.basePrice ?? 0;
      day.setDate(day.getDate() + 1);
    }
    return { nights: diff, estimatedTotal: total };
  }, [startDate, endDate, priceMap, displayData.basePrice]);

  const { isAuthenticated, user } = useAuth();
  const { fromPropertyId } = useReservationStore();

  const Role = user?.role;
  const isOwner = Role === "OWNER";

  if (isLoading || (!displayData.propertyName && !formData.propertyId)) {
    if (!isLoading) {
      setTimeout(() => router.push(`/properties/${fromPropertyId}`), 100);
    }
    return <LoadingState />;
  }

  const handleStartDateChange = (date?: Date) => {
    setStartDate(date);
    if (endDate && date && date >= endDate) {
      setEndDate(undefined);
    }
  };

  const handleEndDateChange = (date?: Date) => {
    if (date && startDate && date <= startDate) return;
    setEndDate(date);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    try {
      await form.handleSubmit();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // compute total nights and estimated price

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toaster richColors />
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => {
            if (formData.propertyId) {
              router.push(`/properties/${fromPropertyId}`);
            } else {
              router.push("/properties");
            }
          }}
          className="cursor-pointer text-white bg-gradient-to-r from-pr-primary to-pr-mid hover:underline text-sm flex items-center gap-2"
        >
          ← Kembali ke Properti
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* LEFT: main form */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-2xl font-semibold text-pr-dark">
            Buat Reservasi
          </h1>

          <div className="bg-white rounded-2xl p-5 shadow-pr-soft border">
            <PropertyInfoCard data={displayData} isLoading={isLoading} />
            <div className="mt-4 border-t pt-4">
              <PaymentInfoCard
                data={{
                  payerEmail: formData.payerEmail || "N/A",
                  paymentType:
                    formData.paymentType || PaymentType.MANUAL_TRANSFER,
                }}
                form={form}
                isLoading={isLoading}
              />
            </div>
            <div className="mt-4 border-t pt-4">
              <DateSelectionSection
                startDate={startDate}
                endDate={endDate}
                setStartDate={handleStartDateChange}
                setEndDate={handleEndDateChange}
                priceMap={priceMap}
                basePrice={displayData.basePrice || 0}
                isLoading={isLoading}
              />
            </div>
            <div className="mt-6">
              <SubmitButton
                form={form}
                isValid={isFormValid()}
                onSubmit={handleSubmit}
                isPending={isSubmitting}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: sticky summary */}
        <aside className="md:col-span-1">
          <div className="sticky mt-[3.45rem] space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-pr-soft border">
              <div className="flex items-start gap-3">
                <div className="w-24 h-16 rounded-lg bg-gray-100 overflow-hidden">
                  {displayData.mainImageUrl ? (
                    // Next/Image optional
                    <img
                      src={displayData.mainImageUrl}
                      alt={displayData.propertyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-pr-dark">
                    {displayData.propertyName || "Nama Properti"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {displayData.propertyType || "-"}
                  </p>
                  <p className="mt-2 text-sm text-pr-mid font-medium">
                    {displayData.roomTypeName || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t pt-3 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Per malam</span>
                  <span className="font-medium">
                    {displayData.basePrice
                      ? `Rp ${displayData.basePrice.toLocaleString()}`
                      : "Rp -"}{" "}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Durasi</span>
                  <span>{nights} malam</span>
                </div>
                <div className="flex justify-between text-pr-dark font-semibold">
                  <span>Total estimasi</span>
                  <span>Rp {estimatedTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-pr-soft border">
              <h4 className="text-sm font-medium mb-2 text-pr-dark">Catatan</h4>
              <p className="text-xs text-gray-600">
                Pastikan tanggal yang dipilih sudah benar. Total akan divalidasi
                pada saat checkout.
              </p>
            </div>

            <div className="bg-gradient-to-r from-pr-primary to-pr-mid rounded-xl p-3 text-white text-center">
              <div className="text-sm font-medium">Butuh bantuan?</div>
              <div className="text-xs mt-1">Hubungi support@prorent.id</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}
