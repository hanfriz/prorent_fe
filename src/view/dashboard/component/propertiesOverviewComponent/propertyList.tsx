// src/view/report/component/PropertyList.tsx
import { PropertyCard } from "@/view/report/component/propertyCard";
import { PropertySkeleton } from "@/view/dashboard/component/propertiesOverviewComponent/skeleton";
import { PropertySummary } from "@/interface/report/reportInterface";

interface PropertyListProps {
  properties: PropertySummary[];
  isLoading: boolean;
  isFetching: boolean;
}

export function PropertyList({ properties, isLoading, isFetching }: PropertyListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (properties.length === 0) {
    return <NoPropertiesMessage />;
  }

  return <PropertiesGrid properties={properties} />;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <PropertySkeleton key={i} />
      ))}
    </div>
  );
}

function NoPropertiesMessage() {
  return (
    <p className="text-gray-500 text-center py-8">
      No properties data available for the selected filters.
    </p>
  );
}

function PropertiesGrid({ properties }: { properties: PropertySummary[] }) {
  return (
    <div className="space-y-4">
      {properties.map(renderPropertyCard)}
    </div>
  );
}

function renderPropertyCard(item: PropertySummary) {
  const confirmed = item.summary.counts.CONFIRMED ?? 0;
  const cancelled = item.summary.counts.CANCELLED ?? 0;
  const status = getPropertyStatus(confirmed, cancelled);

  return (
    <div key={item.property.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-white shadow-sm">
      <PropertyCard
        property={{
          id: item.property.id,
          name: item.property.name,
          picture: item.property.Picture || null,
          address: item.property.address || item.property.city || "Unknown",
          totalReservations: confirmed,
          totalAnnualRevenue: item.summary.revenue.actual ?? 0,
          averageRevenue: item.summary.revenue.average ?? 0,
        }}
      />
    </div>
  );
}

function getPropertyStatus(confirmed: number, cancelled: number): string {
  if (confirmed > 0) return "Active";
  if (cancelled > 0) return "Inactive";
  return "No Bookings";
}