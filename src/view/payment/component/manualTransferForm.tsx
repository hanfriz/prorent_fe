// src/components/.../manualTransferForm.tsx
"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle } from "lucide-react";

interface ManualTransferFormProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
  previewUrl: string | null;
  fileError: string | null;
  onRemoveFile: () => void;
  uploadError: string | null;
}

export function ManualTransferForm({
  fileInputRef,
  onFileChange,
  selectedFile,
  previewUrl,
  fileError,
  onRemoveFile,
  uploadError,
}: ManualTransferFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <BankTransferDetails />

      <div>
        <Label
          htmlFor="payment-proof"
          className="text-sm font-medium text-gray-900 dark:text-white"
        >
          Upload Payment Proof
        </Label>

        {previewUrl ? (
          <FilePreview
            previewUrl={previewUrl}
            selectedFile={selectedFile}
            onRemoveFile={onRemoveFile}
          />
        ) : (
          <UploadDropzone fileInputRef={fileInputRef} onChange={onFileChange} />
        )}

        <ErrorMessages fileError={fileError} uploadError={uploadError} />
      </div>
    </div>
  );
}

export function BankTransferDetails() {
  return (
    <div className="bg-pr-bg p-6 rounded-2xl border border-pr-mid/30 shadow-pr-soft">
      <h3 className="text-lg font-semibold text-pr-dark">
        Bank Transfer Details
      </h3>
      <p className="text-sm text-pr-mid mt-1">
        Silakan transfer ke rekening berikut dan unggah bukti pembayaran Anda:
      </p>

      <div className="mt-4 space-y-2 text-sm text-pr-dark">
        <p>
          <span className="font-medium text-pr-mid">Bank:</span> Bank Mandiri
        </p>
        <p>
          <span className="font-medium text-pr-mid">Nomor Rekening:</span>{" "}
          1234567890
        </p>
        <p>
          <span className="font-medium text-pr-mid">Atas Nama:</span> PT.
          ProRent Indonesia
        </p>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-pr-primary/10 text-pr-dark text-sm">
        Pastikan jumlah transfer sesuai dengan nominal di tagihan agar proses
        verifikasi berjalan lancar.
      </div>
    </div>
  );
}

interface FilePreviewProps {
  previewUrl: string;
  selectedFile: File | null;
  onRemoveFile: () => void;
}

function FilePreview({
  previewUrl,
  selectedFile,
  onRemoveFile,
}: FilePreviewProps) {
  return (
    <div className="mt-2 flex flex-col items-center">
      <div className="relative">
        <img
          src={previewUrl}
          alt="Preview"
          className="max-h-48 rounded-lg border"
        />
        <button
          aria-label="Remove file"
          type="button"
          onClick={onRemoveFile}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="mt-2 flex items-center text-green-600">
        <CheckCircle className="h-5 w-5 mr-1" />
        <span className="text-sm">File selected: {selectedFile?.name}</span>
      </div>
    </div>
  );
}

interface UploadDropzoneProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function UploadDropzone({ fileInputRef, onChange }: UploadDropzoneProps) {
  return (
    <div className="flex justify-center items-center w-full mt-2">
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
            PNG, JPG or JPEG (MAX. 1MB)
          </p>
        </div>
        <Input
          id="dropzone-file"
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={onChange}
          accept="image/png, image/jpeg, image/jpg"
        />
      </Label>
    </div>
  );
}

interface ErrorMessagesProps {
  fileError: string | null;
  uploadError: string | null;
}

function ErrorMessages({ fileError, uploadError }: ErrorMessagesProps) {
  return (
    <>
      {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}

      {uploadError && (
        <p className="mt-2 text-sm text-red-600">{uploadError}</p>
      )}
    </>
  );
}
