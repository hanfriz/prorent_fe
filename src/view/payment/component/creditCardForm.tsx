"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar, Info } from "lucide-react";

interface CreditCardFormProps {
  formData: {
    fullName: string;
    cardNumber: string;
    expiration: string;
    cvv: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CreditCardForm({
  formData,
  handleChange,
}: CreditCardFormProps) {
  return (
    <div>
      <h2 className="text-base font-normal text-gray-500 dark:text-gray-400">
        Pay with your Credit Card
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <FullNameInput formData={formData} handleChange={handleChange} />
        <CardNumberInput formData={formData} handleChange={handleChange} />
        <ExpirationInput formData={formData} handleChange={handleChange} />
        <CVVInput formData={formData} handleChange={handleChange} />
      </div>
    </div>
  );
}

function FullNameInput({ formData, handleChange }: CreditCardFormProps) {
  return (
    <div className="col-span-2 sm:col-span-1">
      <Label
        htmlFor="fullName"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Full name (as displayed on card)*
      </Label>
      <Input
        type="text"
        id="fullName"
        value={formData.fullName}
        onChange={handleChange}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
        placeholder="Bonnie Green"
        required
      />
    </div>
  );
}

function CardNumberInput({ formData, handleChange }: CreditCardFormProps) {
  return (
    <div className="col-span-2 sm:col-span-1">
      <Label
        htmlFor="cardNumber"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Card number*
      </Label>
      <Input
        type="text"
        id="cardNumber"
        value={formData.cardNumber}
        onChange={handleChange}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
        placeholder="xxxx-xxxx-xxxx-xxxx"
        pattern="^4[0-9]{12}(?:[0-9]{3})?$"
        required
      />
    </div>
  );
}

function ExpirationInput({ formData, handleChange }: CreditCardFormProps) {
  return (
    <div>
      <Label
        htmlFor="expiration"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Card expiration*
      </Label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
        <Input
          id="expiration"
          type="text"
          value={formData.expiration}
          onChange={handleChange}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="12/23"
          required
        />
      </div>
    </div>
  );
}

function CVVInput({ formData, handleChange }: CreditCardFormProps) {
  return (
    <div>
      <Label
        htmlFor="cvv"
        className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white"
      >
        CVV*
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white" />
            </TooltipTrigger>
            <TooltipContent>
              <p>The last 3 digits on back of card</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <div className="relative">
        <Input
          type="number"
          id="cvv"
          value={formData.cvv}
          onChange={handleChange}
          aria-describedby="helper-text-explanation"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 [appearance:textfield] focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="•••"
          required
        />
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5">
          <img
            className="z-10 h-4 dark:hidden"
            src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/cvv-image-light.svg"
            alt="cvv location image"
          />
          <img
            className="hidden h-4 dark:flex"
            src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/cvv-image-dark.svg"
            alt="cvv location image"
          />
        </div>
      </div>
    </div>
  );
}
