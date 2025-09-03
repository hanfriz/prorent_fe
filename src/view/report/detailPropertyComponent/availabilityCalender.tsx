// src/app/dashboard/report/[propertyId]/availabilityCalendar.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
      <CardContent className="p-4">
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

                  let displayText = "";
                  let textColor = "";

                  if (modifiers.outside) {
                    // Don't show anything for outside dates
                  } else if (availabilityInfo) {
                    displayText = `${availabilityInfo.available}/${totalQuantity}`;
                    if (availabilityInfo.isAvailable) {
                      textColor =
                        availabilityInfo.available === totalQuantity
                          ? "text-blue-600" // Fully available
                          : "text-green-600"; // Partially available
                    } else {
                      textColor = "text-red-600"; // Not available
                    }
                  } else {
                    // Default to fully available if not in map
                    displayText = `${totalQuantity}/${totalQuantity}`;
                    textColor = "text-blue-600";
                  }

                  return (
                    <CalendarDayButton
                      day={day}
                      modifiers={modifiers}
                      {...props}
                    >
                      {children}
                      {!modifiers.outside && totalQuantity > 0 && (
                        <span className={`text-[10px] mt-0.5 ${textColor}`}>
                          {displayText}
                        </span>
                      )}
                    </CalendarDayButton>
                  );
                },
              }}
              onMonthChange={setCurrentMonth}
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
    map[dateInfo.date] = dateInfo;
  });

  return map;
}
