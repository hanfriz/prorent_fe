// src/view/report/component/PropertySkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function PropertySkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-white shadow-sm">
      <Skeleton className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-md" />
      <div className="flex-1 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <PropertyDetailsSkeleton />
        </div>
        <div className="flex flex-col gap-2 justify-start mt-4 md:mt-0">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

function PropertyDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      ))}
    </div>
  );
}