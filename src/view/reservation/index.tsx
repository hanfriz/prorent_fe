"use client";

import { useState } from "react";
import { useReservationForm } from "./component/useReservationForm";
import PropertyInfoCard from "./component/propertyInfoCard";
import PaymentInfoCard from "./component/paymentInfoCard";
import DateSelectionSection from "./component/dateSelectionSection";
import SubmitButton from "./component/submitButton";

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
      />
    </div>
  );
}
