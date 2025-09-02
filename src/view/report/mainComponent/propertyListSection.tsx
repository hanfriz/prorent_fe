// src/app/dashboard/report/main/components/PropertyListSection.tsx
import React from "react";
import { PropertyReportCard } from "./propertyReportCard";
import { PropertySummary } from "@/interface/report/reportInterface";

interface Props {
  properties: PropertySummary[];
  dateRange: any;
  reservationPageMap: Record<string, number>;
  onReservationPageChange: (roomTypeId: string, page: number) => void;
  onDownloadProperty: (propertyId: string) => void; // Changed name for clarity
  onDownloadRoomType: (propertyId: string, roomTypeId: string) => void;
  onReservationFilterChange: (roomTypeId: string, filters: any) => void; // Add this
}

export const PropertyListSection: React.FC<Props> = ({
  properties,
  dateRange,
  reservationPageMap,
  onReservationPageChange,
  onDownloadProperty,
  onDownloadRoomType,
  onReservationFilterChange, // Add this
}) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {properties.length > 0 ? (
        properties.map((summary) => (
          <PropertyReportCard
            key={summary.property.id}
            propertySummary={summary}
            dateRange={dateRange}
            onDownloadProperty={onDownloadProperty}
            onDownloadRoomType={onDownloadRoomType}
            onReservationPageChange={onReservationPageChange}
            reservationPageMap={reservationPageMap}
            onReservationFilterChange={onReservationFilterChange} // Add this
          />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          No properties found for the selected filters.
        </div>
      )}
    </div>
  );
};
