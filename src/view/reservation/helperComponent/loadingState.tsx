import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}
