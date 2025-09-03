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
  paymentMethod,
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
  paymentMethod,
}: {
  isPending: boolean;
  isPaymentProofUploaded: boolean;
  paymentMethod: "manual" | "gateway";
}) {
  return (
    <Button
      type="submit"
      className="w-full py-3 px-5 text-center text-sm font-semibold 
                 text-white bg-pr-primary hover:bg-pr-mid 
                 focus:ring-4 focus:outline-none focus:ring-pr-primary/40 
                 rounded-xl shadow-pr-soft transition disabled:opacity-60 cursor-pointer"
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
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
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
    <p
      className="mt-6 text-sm md:text-base font-medium 
                  text-pr-mid text-center lg:text-left"
    >
      Payment processed securely by{" "}
      <span className="text-pr-dark font-semibold">ProRent</span> - Indonesia
    </p>
  );
}
