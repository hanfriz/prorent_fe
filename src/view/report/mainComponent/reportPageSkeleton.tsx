import { Skeleton } from "@/components/ui/skeleton";

export function ReportPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-1/4" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
