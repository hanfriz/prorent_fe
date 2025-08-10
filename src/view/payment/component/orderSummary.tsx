"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function OrderSummary() {
  return (
    <Card className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="space-y-2">
        <PriceDetails />
        <SavingsDetails />
        <PickupDetails />
        <TaxDetails />
      </div>

      <TotalAmount />

      <Button
        type="submit"
        className="flex w-full items-center justify-center bg-blue-600 py-3 px-5 text-center text-sm font-medium text-white cursor-pointer hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Pay now
      </Button>
    </Card>
  );
}

function PriceDetails() {
  return (
    <dl className="flex items-center justify-between gap-4">
      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
        Original price
      </dt>
      <dd className="text-base font-medium text-gray-900 dark:text-white">
        $6,592.00
      </dd>
    </dl>
  );
}

function SavingsDetails() {
  return (
    <dl className="flex items-center justify-between gap-4">
      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
        Savings
      </dt>
      <dd className="text-base font-medium text-green-500">-$299.00</dd>
    </dl>
  );
}

function PickupDetails() {
  return (
    <dl className="flex items-center justify-between gap-4">
      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
        Store Pickup
      </dt>
      <dd className="text-base font-medium text-gray-900 dark:text-white">
        $99
      </dd>
    </dl>
  );
}

function TaxDetails() {
  return (
    <dl className="flex items-center justify-between gap-4">
      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
        Tax
      </dt>
      <dd className="text-base font-medium text-gray-900 dark:text-white">
        $799
      </dd>
    </dl>
  );
}

function TotalAmount() {
  return (
    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
      <dt className="text-base font-bold text-gray-900 dark:text-white">
        Total
      </dt>
      <dd className="text-base font-bold text-gray-900 dark:text-white">
        $7,191.00
      </dd>
    </dl>
  );
}
