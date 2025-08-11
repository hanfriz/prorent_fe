// src/components/.../paymentOptions.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle } from "lucide-react";
import { usePaymentProofUpload } from "./usePaymentUpload";
import { paymentProofBrowserFileSchema } from "@/validation/paymentProofValidation";
import { toast } from "sonner";
import { usePaymentStore } from "@/lib/stores/paymentStore";
import { ManualTransferForm } from "./manualTransferForm";

interface PaymentOptionsProps {
  onPaymentMethodChange: (method: "manual" | "gateway") => void;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export default function PaymentOptions({
  onPaymentMethodChange,
  onFileSelect,
  selectedFile
}: PaymentOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState<"manual" | "gateway">("manual");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadError, clearError } = usePaymentProofUpload();
  const reservation = usePaymentStore(state => state.reservation);
  const isPaymentProofUploaded = !!reservation?.paymentProof;

  const handleMethodChange = (method: "manual" | "gateway") => {
    setSelectedMethod(method);
    onPaymentMethodChange(method);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setFileError(null);
    onFileSelect(null);
    setPreviewUrl(null);
    
    const file = e.target.files?.[0];
    if (!file) return;

    validateAndProcessFile(file, onFileSelect, setPreviewUrl, setFileError);
  };

  const removeFile = () => {
    onFileSelect(null);
    setPreviewUrl(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isPaymentProofUploaded) {
    return <PaymentSuccessMessage />;
  }

  return (
    <div className="space-y-6">
      <PaymentMethodButtons 
        selectedMethod={selectedMethod}
        onMethodChange={handleMethodChange}
      />
      
      {selectedMethod === "manual" && (
        <ManualTransferForm 
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          fileError={fileError}
          onRemoveFile={removeFile}
          uploadError={uploadError}
        />
      )}
    </div>
  );
}

function PaymentMethodButtons({ 
  selectedMethod, 
  onMethodChange 
}: { 
  selectedMethod: "manual" | "gateway"; 
  onMethodChange: (method: "manual" | "gateway") => void; 
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        type="button"
        variant={selectedMethod === "manual" ? "default" : "outline"}
        className="flex-1"
        onClick={() => onMethodChange("manual")}
      >
        Manual Transfer
      </Button>

      <Button
        type="button"
        variant={selectedMethod === "gateway" ? "default" : "outline"}
        className="flex-1"
        onClick={() => onMethodChange("gateway")}
      >
        Payment Gateway
      </Button>
    </div>
  );
}

function PaymentSuccessMessage() {
  return (
    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
      <div className="flex items-center text-green-700 dark:text-green-300">
        <CheckCircle className="h-5 w-5 mr-2" />
        <span>Payment proof has been uploaded successfully!</span>
      </div>
    </div>
  );
}

// Helper function
function validateAndProcessFile(
  file: File,
  onFileSelect: (file: File) => void,
  setPreviewUrl: (url: string) => void,
  setFileError: (error: string | null) => void
) {
  const validationResult = paymentProofBrowserFileSchema.safeParse(file);
  if (!validationResult.success) {
    const errorMessage = validationResult.error.issues[0].message;
    setFileError(errorMessage);
    toast.error(errorMessage);
    return;
  }

  onFileSelect(file);
  setPreviewUrl(URL.createObjectURL(file));
}