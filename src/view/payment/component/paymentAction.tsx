// src/components/.../paymentActions.tsx
"use client";

import { Button } from "@/components/ui/button";

interface PaymentActionsProps {
  uploadPaymentProofMutation: any;
  isPaymentProofUploaded: boolean;
  paymentMethod: "manual" | "gateway";
}

export function PaymentActions({ 
  uploadPaymentProofMutation, 
  isPaymentProofUploaded, 
  paymentMethod 
}: PaymentActionsProps) {
  return (
    <>
      <div className="mt-6">
        <SubmitButton 
          isPending={uploadPaymentProofMutation.isPending}
          isPaymentProofUploaded={isPaymentProofUploaded}
          paymentMethod={paymentMethod}
        />
      </div>
      <PaymentInfo />
    </>
  );
}

function SubmitButton({ 
  isPending, 
  isPaymentProofUploaded, 
  paymentMethod 
}: { 
  isPending: boolean; 
  isPaymentProofUploaded: boolean; 
  paymentMethod: "manual" | "gateway"; 
}) {
  return (
    <Button
      type="submit"
      className="w-full py-3 px-5 text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg"
      disabled={isPending || isPaymentProofUploaded}
    >
      {getButtonText(isPending, isPaymentProofUploaded, paymentMethod)}
    </Button>
  );
}

function getButtonText(
  isPending: boolean, 
  isPaymentProofUploaded: boolean, 
  paymentMethod: "manual" | "gateway"
): React.ReactNode {
  if (isPending) {
    return (
      <>
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </>
    );
  }
  
  if (isPaymentProofUploaded) {
    return "Reservation Completed";
  }
  
  if (paymentMethod === "manual") {
    return "Upload Payment Proof";
  }
  
  return "Pay Now";
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