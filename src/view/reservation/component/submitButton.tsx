import React from "react";

interface SubmitButtonProps {
  form: any;
  isValid: boolean;
  onSubmit: () => void;
}

export default function SubmitButton({
  form,
  isValid,
  onSubmit,
}: SubmitButtonProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <button
        type="submit"
        disabled={!isValid}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
      >
        Buat Reservasi
      </button>
    </form>
  );
}
