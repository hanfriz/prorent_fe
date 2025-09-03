// review/ReviewEmptyStates.tsx
import React from "react";

export const ReviewSkeleton = () => (
  <div className="mt-6 space-y-8">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="py-6 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center mb-3">
          <Skeleton className="h-10 w-10 rounded-full mr-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-4 h-4 rounded-full mr-1" />
          ))}
          <Skeleton className="ml-2 h-4 w-8" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-1" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    ))}
  </div>
);

export const ErrorState = ({ error }: { error: any }) => (
  <div className="mt-6 text-center py-10 text-red-500">
    Error: {error?.message || "Failed to load reviews"}
  </div>
);

export const EmptyFilteredState = () => (
  <div className="mt-6 text-center py-10">
    <p className="text-gray-500 dark:text-gray-400">
      No reviews match your filters.
    </p>
  </div>
);

export const InitialEmptyState = () => (
  <div className="mt-6 text-center py-10">
    <p className="text-gray-500 dark:text-gray-400">
      No reviews yet. Be the first!
    </p>
  </div>
);

// Re-export for convenience
import { Skeleton } from "@/components/ui/skeleton";
export { Skeleton };
