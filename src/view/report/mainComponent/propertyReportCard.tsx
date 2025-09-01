// --- Property Report Card Component ---
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertySummary } from "@/interface/report/reportInterface";
import { format } from "date-fns";
import { RoomTypeCard } from "./roomTypeCard";
import { StatCard } from "./helper";

export const PropertyReportCard = ({
  propertySummary,
  dateRange,
  onDownloadRoomType,
  onReservationPageChange, // Add this
  reservationPageMap, // Add this
}: {
  propertySummary: PropertySummary;
  dateRange: { startDate: Date | null; endDate: Date | null };
  onDownloadRoomType: (roomTypeId: string) => void;
  onReservationPageChange?: (roomTypeId: string, page: number) => void; // Add this
  reservationPageMap?: Record<string, number>; // Add this
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
                onReservationPageChange={onReservationPageChange} // Add this
                reservationPage={
                  reservationPageMap?.[roomType.roomType.id] || 1
                } // Add this
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
