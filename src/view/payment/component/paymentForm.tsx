// src/components/.../paymentForm.tsx
"use client";

import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "./breadcrumb";
import CreditCardForm from "./creditCardForm";
import PaymentOptions from "./paymentOptions";
import OrderSummary from "./orderSummary";
import { getReservationWithPayment, uploadPaymentProof } from "@/service/reservationService";
import { usePaymentStore } from "@/lib/stores/paymentStore";
import { paymentFormSchema, type PaymentFormValues } from '@/validation/paymentProofValidation';
import { PaymentFormSkeleton } from "./paymentFormSkeleton";
import { PaymentHeader } from "./paymentHeader";
import { PaymentActions } from "./paymentAction";
import { usePaymentForm } from "./usePaymentForm";

export default function PaymentForm() {
  const params = useParams();
  const reservationId = params.id as string | undefined;
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const {  data: reservationData, error, isLoading } = getReservationWithPayment(reservationId ?? "");
  const { setReservationData, setReservationLoading, setReservationError } = usePaymentStore();
  const { syncWithStore, handleSubmit, handleMutationSuccess, handleMutationError } = usePaymentForm();

  useEffect(() => {
    syncWithStore(isLoading, reservationData, error, setReservationLoading, setReservationData, setReservationError);
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
      handleSubmit(value, reservationId!, uploadPaymentProofMutation, isPaymentProofUploaded, router);
    },
  });

  const uploadPaymentProofMutation = useMutation({
    mutationFn: async ({ reservationId, file }: { reservationId: string; file: File }) => {
      return uploadPaymentProof(reservationId, file);
    },
    onSuccess: (data) => {
      handleMutationSuccess(data, queryClient, reservationId, setReservationData, router);
    },
    onError: (error: any) => {
      handleMutationError(error);
    },
  });

  const isPaymentProofUploaded = !!reservationData?.paymentProof;

  if (!reservationId) {
    return <ErrorMessage message="Error: Reservation ID not found in URL." />;
  }

  if (isLoading) {
    return <PaymentFormSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={getErrorDisplayMessage(error)} />;
  }

  if (!reservationData) {
    return <ErrorMessage message="No reservation data found." />;
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

function PaymentFormContent({ 
  reservationData, 
  form, 
  uploadPaymentProofMutation, 
  isPaymentProofUploaded 
}: any) {
  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <PaymentHeader reservationData={reservationData} isPaymentProofUploaded={isPaymentProofUploaded} />
        
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }} 
          className="mx-auto max-w-3xl space-y-8"
        >
          <Breadcrumb />

          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <PaymentOptions 
              onPaymentMethodChange={(method) => 
                form.setFieldValue('paymentMethod', method)
              }
              onFileSelect={(file) => 
                form.setFieldValue('file', file)
              }
              selectedFile={form.state.values.file}
            />
            {form.state.values.paymentMethod === "gateway" && (
              <CreditCardForm 
                formData={{
                  fullName: form.state.values.fullName || "",
                  cardNumber: form.state.values.cardNumber || "",
                  expiration: form.state.values.expiration || "",
                  cvv: form.state.values.cvv || "",
                }} 
                handleChange={(e) => {
                  const { id, value } = e.target;
                  form.setFieldValue(id as keyof PaymentFormValues, value);
                }} 
              />
            )}
          </div>

          <OrderSummary reservationData={reservationData} />

          <PaymentActions 
            uploadPaymentProofMutation={uploadPaymentProofMutation}
            isPaymentProofUploaded={isPaymentProofUploaded}
            paymentMethod={form.state.values.paymentMethod}
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
          <div className="p-4 text-red-500 text-center">
            {message}
          </div>
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