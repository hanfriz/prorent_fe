import { Skeleton } from "@/components/ui/skeleton";

// Skeleton Components
export function DashboardHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 border-b">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

export function WelcomeSectionSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-48" />
    </div>
  );
}

export function StatsSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
      ))}
    </div>
  );
}

export function GraphSkeleton() {
  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow">
      <Skeleton className="h-6 w-48 mb-4" />
      <Skeleton className="h-80 w-full" />
    </div>
  );
}

export function QuickActionsSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

export function RecentActivitiesSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PropertiesOverviewSkeleton() {
  return (
    <div className="mt-8">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <div className="flex space-x-4">
              <Skeleton className="h-16 w-16 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}