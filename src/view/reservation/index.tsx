"use client";

import { useState } from "react";
import { useReservationForm } from "./component/useReservationForm";
import PropertyInfoCard from "./component/propertyInfoCard";
import PaymentInfoCard from "./component/paymentInfoCard";
import DateSelectionSection from "./component/dateSelectionSection";
import SubmitButton from "./component/submitButton";
import { Skeleton } from "@/components/ui/skeleton";

const mockReservationData = {
  userId: "GTrOzXbTNxts",
  propertyId: "48312158",
  propertyName: "Villa Sejuk Puncak",
  propertyType: "Room by Room",
  roomTypeId: "541253415",
  roomTypeName: "Deluxe Room",
  basePrice: 100000,
  paymentType: "MANUAL_TRANSFER",
  payerEmail: "ashtin.lorin@doodrops.org",
};

export default function CreateReservationPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading data
  useState(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  });

  const { form, priceMap, isFormValid } = useReservationForm({
    mockReservationData,
    startDate,
    endDate,
  });

  const handleStartDateChange = (date?: Date) => {
    setStartDate(date);
    if (endDate && date && date >= endDate) {
      setEndDate(undefined);
    }
  };

  if (isLoading) {
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

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Create Reservation</h1>

      <PropertyInfoCard data={mockReservationData} />
      <PaymentInfoCard data={mockReservationData} />

      <DateSelectionSection
        startDate={startDate}
        endDate={endDate}
        setStartDate={handleStartDateChange}
        setEndDate={setEndDate}
        priceMap={priceMap}
        basePrice={mockReservationData.basePrice}
      />

      <SubmitButton
        form={form}
        isValid={isFormValid()}
        onSubmit={form.handleSubmit}
        isPending={isLoading}        
      />
    </div>
  );
}