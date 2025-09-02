// src/components/report/PropertyReportCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertySummary } from "@/interface/report/reportInterface";
import { format } from "date-fns";
import { RoomTypeCard } from "./roomTypeCard";
import { StatCard } from "./helper";
import { Button } from "@/components/ui/button";

export const PropertyReportCard = ({
  propertySummary,
  dateRange,
  onDownloadProperty,
  onDownloadRoomType,
  onReservationPageChange,
  reservationPageMap,
  onReservationFilterChange, // Add this prop
}: {
  propertySummary: PropertySummary;
  dateRange: { startDate: Date | null; endDate: Date | null };
  onDownloadProperty: (propertyId: string) => void; // Add this prop
  onDownloadRoomType: (propertyId: string, roomTypeId: string) => void;
  onReservationPageChange?: (roomTypeId: string, page: number) => void;
  reservationPageMap?: Record<string, number>;
  onReservationFilterChange?: (roomTypeId: string, filters: any) => void; // Add this prop
}) => {
  const property = propertySummary.property;
  const summary = propertySummary.summary;
  const roomTypes = propertySummary.roomTypes;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              {property.name}
            </CardTitle>
            <p className="text-sm text-gray-500">
              {property.address || property.city || "Address not available"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownloadProperty(property.id)} // Property-level download
              className="cursor-pointer"
            >
              Download Property Report
            </Button>
            <span className="text-sm text-muted-foreground">
              Period:{" "}
              {dateRange.startDate
                ? format(dateRange.startDate, "MMM d, yyyy")
                : ""}{" "}
              -{" "}
              {dateRange.endDate
                ? format(dateRange.endDate, "MMM d, yyyy")
                : ""}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Property Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Confirmed" value={summary.counts.CONFIRMED} />
          <StatCard
            label="Pending"
            value={
              summary.counts.PENDING_PAYMENT +
              summary.counts.PENDING_CONFIRMATION
            }
          />
          <StatCard label="Cancelled" value={summary.counts.CANCELLED} />
          <StatCard
            label="Actual Revenue"
            value={summary.revenue.actual}
            isCurrency
          />
        </div>

        {/* Room Types Section */}
        <h3 className="text-lg font-semibold mb-4">Room Types</h3>
        {roomTypes.length > 0 ? (
          <div className="space-y-4">
            {roomTypes.map((roomType) => (
              <RoomTypeCard
                key={roomType.roomType.id}
                roomType={roomType}
                propertyId={property.id}
                onDownload={onDownloadRoomType}
                onReservationPageChange={onReservationPageChange}
                reservationPage={
                  reservationPageMap?.[roomType.roomType.id] || 1
                }
                onReservationFilterChange={onReservationFilterChange} // Add this
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No room types found for this property.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
