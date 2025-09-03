// submitButton.tsx
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isValid: boolean;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export default function SubmitButton({
  isValid,
  onSubmit,
  isPending,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={!isValid || isPending}
      onClick={onSubmit}
    >
      {isPending ? "Submitting..." : "Continue to Booking"}
    </Button>
  );
}
