"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface PaymentOptionsProps {
  onPaymentMethodChange: (method: "manual" | "gateway") => void;
}

export default function PaymentOptions({
  onPaymentMethodChange,
}: PaymentOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState<"manual" | "gateway">(
    "manual"
  );

  const handleMethodChange = (method: "manual" | "gateway") => {
    setSelectedMethod(method);
    onPaymentMethodChange(method);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          variant={selectedMethod === "manual" ? "default" : "outline"}
          className="flex-1"
          onClick={() => handleMethodChange("manual")}
        >
          Manual Transfer
        </Button>

        <Button
          type="button"
          variant={selectedMethod === "gateway" ? "default" : "outline"}
          className="flex-1"
          onClick={() => handleMethodChange("gateway")}
        >
          Payment Gateway
        </Button>
      </div>

      {selectedMethod === "manual" && <ManualTransferForm />}
    </div>
  );
}

function ManualTransferForm() {
  return (
    <div className="mt-4 space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-200">
          Bank Transfer Details
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
          Transfer to the following account and upload your payment proof:
        </p>
        <div className="mt-2 text-sm">
          <p>
            <span className="font-medium">Bank:</span> Bank Name
          </p>
          <p>
            <span className="font-medium">Account Number:</span> 1234567890
          </p>
          <p>
            <span className="font-medium">Account Name:</span> Company Name
          </p>
        </div>
      </div>

      <div>
        <Label
          htmlFor="payment-proof"
          className="text-sm font-medium text-gray-900 dark:text-white"
        >
          Upload Payment Proof
        </Label>
        <div className="flex justify-center items-center w-full mt-2">
          <UploadDropzone />
        </div>
      </div>
    </div>
  );
}

function UploadDropzone() {
  return (
    <div className="flex justify-center items-center w-full">
      <Label
        htmlFor="dropzone-file"
        className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col justify-center items-center pt-5 pb-6">
          <Upload className="mb-3 w-10 h-10 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
        <Input id="dropzone-file" type="file" className="hidden" />
      </Label>
    </div>
  );
}
