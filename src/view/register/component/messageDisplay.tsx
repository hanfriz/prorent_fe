"use client";

interface MessageDisplayProps {
  successMessage?: string;
  errorMessage?: string;
}

export default function MessageDisplay({ successMessage, errorMessage }: MessageDisplayProps) {
  if (!successMessage && !errorMessage) return null;

  return (
    <>
      {/* Error Message */}
      {errorMessage && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
          {successMessage}
        </div>
      )}
    </>
  );
}
