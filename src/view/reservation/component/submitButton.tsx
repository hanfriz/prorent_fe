import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SubmitButtonProps {
  form: any;
  isValid: boolean;
  onSubmit: () => void;
  isLoading?: boolean;
  isPending?: boolean; // Add pending state
}

export default function SubmitButton({
  form,
  isValid,
  onSubmit,
  isLoading,
  isPending,
}: SubmitButtonProps) {
  // Show skeleton when explicitly loading (data fetching)
  if (isLoading) {
    return <Skeleton className="h-10 w-full rounded-md" />;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Button
        type="submit"
        variant="default"
        className="w-full"
        disabled={!isValid || isPending}
      >
        {isPending ? "Memproses..." : "Buat Reservasi"}
      </Button>
    </form>
  );
}