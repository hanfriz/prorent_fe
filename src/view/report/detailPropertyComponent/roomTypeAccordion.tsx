// src/app/dashboard/report/[propertyId]/roomTypeAccordion.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RoomTypeWithAvailability } from "@/interface/report/reportInterface";
import RoomTypeCard from "./roomTypeCard";
import AvailabilityCalendar from "./availabilityCalender";
import { FaPlus } from "react-icons/fa";
import RoomTypeReservationsTable from "./roomTypeReservationTable";

interface RoomTypeAccordionProps {
  roomTypes: RoomTypeWithAvailability[];
  startDate: Date;
  endDate: Date;
  onReservationPageChange: (roomTypeId: string, page: number) => void;
}

export default function RoomTypeAccordion({
  roomTypes,
  startDate,
  endDate,
  onReservationPageChange,
}: RoomTypeAccordionProps) {
  if (roomTypes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No room types found for this property
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {roomTypes.map((roomType) => {
        if (!roomType) return null;

        return (
          <div key={roomType.roomType.id} className="border rounded-lg">
            {/* Static content for this room type */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg">
                  {roomType.roomType.name}
                </span>
                <div className="flex gap-4 text-sm">
                  <span>
                    {" "}
                    Pending Bookings:{" "}
                    {(roomType.counts?.PENDING_PAYMENT || 0) +
                      (roomType.counts?.PENDING_CONFIRMATION || 0)}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <RoomTypeCard roomType={roomType} />
              </div>
            </div>

            {/* Accordion for this room type's calendar */}
            <Accordion type="single" collapsible className="w-full border-t">
              <AccordionItem
                value={`${roomType.roomType.id}-calendar`}
                className="border-0"
              >
                <AccordionTrigger className="hover:no-underline px-4 py-3 [&[data-state=open]>div:last-child>svg]:rotate-45">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">Availability Calendar</span>
                    <span>
                      {" "}
                      {roomType.roomType.name} -{" "}
                      {roomType.availability.totalQuantity} total units
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <AvailabilityCalendar
                    roomType={roomType}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full border-t">
              <div className="border-1 rounded-2xl mb-4"></div>
              <AccordionItem
                value={`${roomType.roomType.id}-reservations`}
                className="border-0"
              >
                <AccordionTrigger className="hover:no-underline px-4 py-3">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">Reservation List</span>
                    <span className="text-sm text-muted-foreground">
                      {roomType.pagination?.total} bookings
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <RoomTypeReservationsTable
                    data={roomType.reservationListItems || []}
                    pagination={roomType.pagination}
                    onPageChange={(page) =>
                      onReservationPageChange(roomType.roomType.id, page)
                    }
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        );
      })}
    </div>
  );
}
