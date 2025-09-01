// --- Room Type Card Component ---
import {
  PropertySummary,
  RoomTypeWithAvailability,
} from "@/interface/report/reportInterface";
import { useEffect, useState } from "react";
import RoomTypeReservationsTable from "../detailPropertyComponent/roomTypeReservationTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReportStore } from "@/lib/stores/reportStore";
import { usePropertyReport } from "@/service/report/useReport"; // This might not be needed
import AvailabilityCalendar from "../detailPropertyComponent/availabilityCalender";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const RoomTypeCard = ({
  roomType,
  propertyId,
  onDownload,
  onReservationPageChange, // Add this
  reservationPage = 1, // Add this with default
}: {
  roomType: RoomTypeWithAvailability;
  propertyId: string;
  onDownload: (roomTypeId: string) => void;
  onReservationPageChange?: (roomTypeId: string, page: number) => void; // Add this
  reservationPage?: number; // Add this
}) => {
  const { filters: storeFilters } = useReportStore();
  const [dateRange, setDateRange] = useState({
    startDate:
      storeFilters.startDate || new Date(new Date().getFullYear(), 0, 1),
    endDate: storeFilters.endDate || new Date(new Date().getFullYear(), 11, 31),
  });

  useEffect(() => {
    setDateRange({
      startDate:
        storeFilters.startDate || new Date(new Date().getFullYear(), 0, 1),
      endDate:
        storeFilters.endDate || new Date(new Date().getFullYear(), 11, 31),
    });
  }, [storeFilters.startDate, storeFilters.endDate]);

  const handleReservationPageChangeLocal = (page: number) => {
    if (onReservationPageChange) {
      onReservationPageChange(roomType.roomType.id, page);
    }
  };

  // Use the roomType data directly since it comes from the main report
  const currentRoomTypeData = roomType;

  return (
    <Card key={roomType.roomType.id} className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h4 className="text-md font-medium">{roomType.roomType.name}</h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDownload(roomType.roomType.id)}
          className="cursor-pointer"
        >
          Download Room Report
        </Button>
      </div>

      {/* Room Type Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Confirmed:</span>{" "}
          {currentRoomTypeData.counts.CONFIRMED}
        </div>
        <div>
          <span className="text-gray-500">Pending:</span>{" "}
          {currentRoomTypeData.counts.PENDING_PAYMENT +
            currentRoomTypeData.counts.PENDING_CONFIRMATION}
        </div>
        <div>
          <span className="text-gray-500">Cancelled:</span>{" "}
          {currentRoomTypeData.counts.CANCELLED}
        </div>
        <div>
          <span className="text-gray-500">Actual Revenue:</span> Rp
          {currentRoomTypeData.revenue.actual.toLocaleString("id-ID")}
        </div>
      </div>

      {/* Reservation List Table */}
      <div className="mb-4 border-2 border-gray-200 rounded-lg p-2">
        <h5 className="text-sm font-semibold mb-2">Recent Reservations</h5>
        {currentRoomTypeData.reservationListItems &&
        currentRoomTypeData.reservationListItems.length > 0 ? (
          <>
            <RoomTypeReservationsTable
              data={currentRoomTypeData.reservationListItems}
              pagination={
                currentRoomTypeData.pagination || {
                  page: reservationPage,
                  pageSize: 10,
                  total: currentRoomTypeData.pagination?.total || 0,
                  totalPages: currentRoomTypeData.pagination?.totalPages || 0,
                }
              }
              onPageChange={handleReservationPageChangeLocal}
            />
          </>
        ) : (
          <p className="text-gray-500 text-sm">
            No reservations found for this room type.
          </p>
        )}
      </div>

      {/* Availability Calendar Accordion */}
      <Accordion type="single" collapsible className="w-full border-t">
        <AccordionItem
          value={`${roomType.roomType.id}-calendar`}
          className="border-0"
        >
          <div className="mb-4 border-2 border-gray-200 rounded-lg p-2">
            <AccordionTrigger className="hover:no-underline px-4 py-3 [&[data-state=open]>div:last-child>svg]:rotate-45">
              <h5 className="text-sm font-semibold mb-2">
                Availability Calendar
              </h5>
            </AccordionTrigger>
            <AccordionContent>
              <div className="border rounded-lg p-4">
                <AvailabilityCalendar
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  roomType={currentRoomTypeData}
                />
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
