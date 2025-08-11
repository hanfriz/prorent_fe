// components/reservations/ReservationSkeleton.tsx
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const ReservationSkeleton = () => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      {/* Add more rows as needed */}
    </div>
  );
};

export default ReservationSkeleton;