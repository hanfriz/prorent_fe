// src/app/dashboard/report/[propertyId]/availabilityCalendar.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import moment from "moment-timezone";
import { RoomTypeWithAvailability } from "@/interface/report/reportInterface";

interface AvailabilityCalendarProps {
  roomType: RoomTypeWithAvailability;
  startDate: Date;
  endDate: Date;
}

export default function AvailabilityCalendar({
  roomType,
  startDate,
  endDate,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const availabilityMap = createAvailabilityMap(roomType.availability);

  return (
    <Card>
      <CardContent>
        <div className="flex justify-center">
          <div className="inline-block border rounded-lg p-2">
            <Calendar
              mode="single"
              defaultMonth={currentMonth}
              className="rounded-md"
              disabled={{ before: startDate, after: endDate }}
              formatters={{
                formatMonthDropdown: (date) => {
                  return moment(date).tz("Asia/Jakarta").format("MMMM YYYY");
                },
              }}
              components={{
                DayButton: ({ children, modifiers, day, ...props }) => {
                  const dateStr = moment(day.date)
                    .tz("Asia/Jakarta")
                    .format("YYYY-MM-DD");

                  const availabilityInfo = availabilityMap[dateStr];
                  const totalQuantity = roomType.availability.totalQuantity;

                  return (
                    <CalendarDayButton
                      day={day}
                      modifiers={modifiers}
                      {...props}
                    >
                      {children}
                      {!modifiers.outside && totalQuantity > 0 && (
                        <span
                          className={`text-[10px] mt-0.5 ${
                            availabilityInfo?.isAvailable
                              ? availabilityInfo?.available === totalQuantity
                                ? "text-red-600"
                                : "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          {availabilityInfo
                            ? `${availabilityInfo.available}/${totalQuantity}`
                            : `${totalQuantity}/${totalQuantity}`}
                        </span>
                      )}
                    </CalendarDayButton>
                  );
                },
              }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Partially Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Fully Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Not Available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function createAvailabilityMap(availability: {
  totalQuantity: number;
  dates: Array<{
    date: string;
    available: number;
    isAvailable: boolean;
  }>;
}) {
  const map: Record<
    string,
    {
      date: string;
      available: number;
      isAvailable: boolean;
    }
  > = {};

  availability.dates.forEach((dateInfo) => {
    // Only include dates with different availability than total
    if (dateInfo.available !== availability.totalQuantity) {
      map[dateInfo.date] = dateInfo;
    }
  });

  return map;
}
