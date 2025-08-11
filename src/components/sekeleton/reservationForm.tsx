// src/components/skeletons/ReservationFormSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function ReservationFormSkeleton() {
  return (
    <div className="space-y-4">
      {/* User ID */}
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Property */}
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Room Type */}
      <div>
        <Skeleton className="h-4 w-28 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Calendar */}
      <div>
        <Skeleton className="h-4 w-36 mb-2" />
        <Skeleton className="h-80 w-full" />
      </div>

      {/* Payment Type */}
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Email */}
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Submit Button */}
      <Skeleton className="h-10 w-32" />
    </div>
  );
}
