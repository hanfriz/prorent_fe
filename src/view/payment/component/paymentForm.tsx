"use client";

import { useState } from "react";
import Breadcrumb from "./breadcrumb";
import CreditCardForm from "./creditCardForm";
import PaymentOptions from "./paymentOptions";
import OrderSummary from "./orderSummary";

export default function PaymentForm() {
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
    console.log("Form submitted:", { ...formData, paymentMethod });
    // Add payment processing logic here
  };

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
          <Breadcrumb />

          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <PaymentOptions onPaymentMethodChange={handlePaymentMethodChange} />
            {paymentMethod === "gateway" && (
              <CreditCardForm formData={formData} handleChange={handleChange} />
            )}

            {/* <Divider /> */}
          </div>

          <OrderSummary />

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
