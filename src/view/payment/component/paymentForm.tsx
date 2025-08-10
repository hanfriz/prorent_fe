"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "./breadcrumb";
import CreditCardForm from "./creditCardForm";
import PaymentOptions from "./paymentOptions";
import OrderSummary from "./orderSummary";
import { getReservationWithPayment } from "@/service/reservationService"; // Sesuaikan path
import { usePaymentStore } from "@/lib/stores/paymentStore"; // Sesuaikan path
import { ReservationWithPayment } from "@/interface/paymentInterface"; // Sesuaikan path

export default function PaymentForm() {
  const params = useParams();
  const reservationId = params.id as string | undefined;

  const { data, error, isLoading } = getReservationWithPayment(
    reservationId ?? ""
  );

  const setReservationData = usePaymentStore(
    (state) => state.setReservationData
  );
  const setReservationLoading = usePaymentStore(
    (state) => state.setReservationLoading
  );
  const setReservationError = usePaymentStore(
    (state) => state.setReservationError
  );

  useEffect(() => {
    if (isLoading) {
      setReservationLoading(true);
    }
    if (data) {
      setReservationData(data);
      setReservationLoading(false);
    }
    if (error) {
      setReservationError(error.message);
      setReservationLoading(false);
    }
  }, [data, isLoading, error]);

  const [formData, setFormData] = useState({
    fullName: "",
    cardNumber: "",
    expiration: "",
    cvv: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"manual" | "gateway">(
    "manual"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePaymentMethodChange = (method: "manual" | "gateway") => {
    setPaymentMethod(method);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const setReservationData = usePaymentStore.getState().reservation;
    console.log("Form submitted:", { ...formData, paymentMethod });
  };

  if (!reservationId) {
    return (
      <div className="p-4 text-red-500">
        Error: Reservation ID not found in URL.
      </div>
    );
  }

  if (isLoading) {
    return (
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="p-4 text-center">
              Loading reservation details...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error("Failed to load reservation:", error);
    const displayError =
      error instanceof Error
        ? error.message
        : "Failed to load reservation details";
    return (
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="p-4 text-red-500 text-center">
              Error: {displayError}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="p-4 text-red-500 text-center">
              No reservation data found.
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold">
            Reservation for {data.RoomType?.property?.name}
          </h2>
          <p>Room Type: {data.RoomType?.name}</p>
          <p>
            Dates: {new Date(data.startDate).toLocaleDateString()} -{" "}
            {new Date(data.endDate).toLocaleDateString()}
          </p>
          <p>
            Total Amount: Rp. {data.payment?.amount.toLocaleString("id-ID")}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
          <Breadcrumb />

          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <PaymentOptions onPaymentMethodChange={handlePaymentMethodChange} />
            {paymentMethod === "gateway" && (
              <CreditCardForm formData={formData} handleChange={handleChange} />
            )}

            {/* <Divider /> */}
          </div>

          <OrderSummary reservationData={data} />

          <PaymentInfo />
        </form>
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div className="flex items-center">
      <div className="h-px w-full bg-gray-200 dark:bg-gray-800"></div>
      <div className="px-5 text-center text-gray-500 dark:text-gray-400">
        or
      </div>
      <div className="h-px w-full bg-gray-200 dark:bg-gray-800"></div>
    </div>
  );
}

function PaymentInfo() {
  return (
    <p className="mt-6 text-base font-normal text-gray-500 dark:text-gray-400 sm:mt-8 text-center lg:text-left">
      Payment processed by{" "}
      <a
        href="#"
        title=""
        className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
      >
        Paddle
      </a>{" "}
      for{" "}
      <a
        href="#"
        title=""
        className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
      >
        Flowbite LLC
      </a>{" "}
      - United States Of America
    </p>
  );
}
