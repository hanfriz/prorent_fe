// src/components/.../paymentFormSkeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PaymentFormSkeleton() {
  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-3xl space-y-8">
          <ReservationInfoSkeleton />
          <FormSkeleton />
        </div>
      </div>
    </section>
  );
}

function ReservationInfoSkeleton() {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50 space-y-3">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

function FormSkeleton() {
  return (
    <form className="mx-auto max-w-3xl space-y-8">
      <Skeleton className="h-4 w-1/6" />
      
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        <PaymentOptionsSkeleton />
      </div>
      
      <OrderSummarySkeleton />
      
      <div className="mt-6">
        <Skeleton className="h-12 w-full" />
      </div>
      
      <div className="mt-6">
        <Skeleton className="h-4 w-3/4 mx-auto" />
      </div>
    </form>
  );
}

function PaymentOptionsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
      <div className="mt-4 space-y-4">
        <Skeleton className="h-24 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}

function OrderSummarySkeleton() {
  return (
    <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
        </div>
      </div>
    </div>
  );
}