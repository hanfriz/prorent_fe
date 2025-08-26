import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <Card className="p-4 flex flex-row gap-4 border-0 shadow-none">
      {/* Gambar properti skeleton */}
      <Skeleton className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-md" />

      {/* Konten properti skeleton */}
      <div className="flex-1 flex flex-col md:flex-row gap-4">
        {/* Nama properti skeleton */}
        <div className="flex-1">
          <Skeleton className="h-6 w-1/3 mb-4" />

          {/* Informasi properti skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Tombol skeleton */}
        <div className="flex flex-col gap-2 justify-start mt-4 md:mt-0">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </Card>
  );
}