// src/view/reservation/component/submitButton.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SubmitButtonProps {
  form: any;
  isValid: boolean;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  isPending?: boolean;
}

export default function SubmitButton({
  form,
  isValid,
  onSubmit,
  isLoading,
  isPending,
}: SubmitButtonProps) {
  if (isLoading) {
    return <Skeleton className="h-10 w-full rounded-md" />;
  }

  return (
    <form onSubmit={onSubmit}>
      <button
        type="submit"
        disabled={!isValid || isPending || isLoading}
        className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
          isValid || !isLoading || !isPending
            ? "bg-gradient-to-r from-pr-primary to-pr-mid shadow-md cursor-pointer hover:shadow-lg"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {isPending ? "Memproses..." : "Buat Reservasi"}
      </button>
    </form>
  );
}
