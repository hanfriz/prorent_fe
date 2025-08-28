"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useReservationForm } from "./component/useReservationForm";
import PropertyInfoCard from "./component/propertyInfoCard";
import PaymentInfoCard from "./component/paymentInfoCard";
import DateSelectionSection from "./component/dateSelectionSection";
import SubmitButton from "./component/submitButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/hooks/useAuth";
import { useReservationStore } from "@/lib/stores/reservationStore";
import { CreateReservationInput } from "@/validation/reservationValidation";
import { format } from "date-fns";

export default function CreateReservationPage() {
  const router = useRouter();
  const { isAuthenticated, user: currentUser } = useAuth();

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control dialog

  const { formData, displayData } = useReservationStore();

  // Fill userId if not already set
  useEffect(() => {
    if (currentUser?.id && !formData.userId) {
      useReservationStore.getState().setField("userId", currentUser.id);
    }
  }, [currentUser, formData.userId]);

  // Validate required form data
  useEffect(() => {
    if (!formData.propertyId || !formData.roomTypeId) {
      console.warn("Missing required reservation data in store");
      router.push("/properties");
      return;
    }

    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [formData.propertyId, formData.roomTypeId, router]);

  // 🔒 Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const displayReservationData = {
    propertyName: displayData.propertyName || "Unnamed Property",
    propertyType: displayData.propertyType || "General",
    roomTypeName: displayData.roomTypeName || "Room",
    basePrice: displayData.basePrice || 0,
    mainImageUrl: displayData.mainImageUrl,
    payerEmail: currentUser?.email || formData.payerEmail,
    paymentType: formData.paymentType,
  };

  const formInputData: Partial<CreateReservationInput> = {
    ...formData,
    startDate,
    endDate,
    payerEmail: displayReservationData.payerEmail,
  };

  const { form, priceMap, isFormValid } = useReservationForm({
    mockReservationData: formInputData,
    startDate,
    endDate,
  });

  if (isLoading || !isAuthenticated) {
    return <LoadingSkeleton />;
  }

  const handleStartDateChange = (date?: Date) => {
    setStartDate(date);
    if (endDate && date && date >= endDate) {
      setEndDate(undefined);
    }
  };

  // ✅ Open dialog only if form is valid
  const handleOpenDialog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setIsDialogOpen(true);
  };

  // ✅ Actual submission happens here
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      await form.handleSubmit();
      // Optional: Clear store after success
      // useReservationStore.getState().reset();
      router.push("/my-reservations");
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalNights = startDate && endDate
    ? Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const totalPrice = totalNights > 0 ? totalNights * displayReservationData.basePrice : 0;

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <Toaster />

      <h1 className="text-2xl font-semibold">Make Reservation</h1>

      <PropertyInfoCard data={displayReservationData} />

      <PaymentInfoCard
        data={{
          ...displayReservationData,
          paymentType: displayReservationData.paymentType?.toString() ?? "",
        }}
      />

      <DateSelectionSection
        startDate={startDate}
        endDate={endDate}
        setStartDate={handleStartDateChange}
        setEndDate={setEndDate}
        priceMap={priceMap}
        basePrice={displayReservationData.basePrice}
      />

      {/* Use form with AlertDialog */}
      <form onSubmit={handleOpenDialog}>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <button type="submit" style={{ display: "none" }} />
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Your Reservation</AlertDialogTitle>
              <AlertDialogDescription>
                Please review your reservation details before confirming.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-3 text-sm">
              <p>
                <strong>Property:</strong> {displayReservationData.propertyName}
              </p>
              <p>
                <strong>Room Type:</strong> {displayReservationData.roomTypeName}
              </p>
              <p>
                <strong>Dates:</strong>{" "}
                {startDate ? format(startDate, "PPP") : "–"} →{" "}
                {endDate ? format(endDate, "PPP") : "–"}
              </p>
              <p>
                <strong>Nights:</strong> {totalNights}
              </p>
              <p>
                <strong>Price per Night:</strong>{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(displayReservationData.basePrice)}
              </p>
              <p className="font-semibold text-blue-600">
                <strong>Total:</strong>{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(totalPrice)}
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                {displayReservationData.paymentType === "MANUAL_TRANSFER"
                  ? "Bank Transfer"
                  : "Credit Card (Xendit)"}
              </p>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>
                Back to Edit
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Submitting...</span>
                    <svg
                      className="animate-spin h-4 w-4 inline-block"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  </>
                ) : (
                  "Confirm Reservation"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Submit Button (triggers dialog) */}
        <SubmitButton
          form={form}
          isValid={isFormValid()}
          onSubmit={handleOpenDialog}
          isPending={isSubmitting}
        />
      </form>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
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