// src/components/myUi/EnhancedPriceCalendar.tsx
"use client";

import * as React from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import moment from "moment-timezone";
import { cn } from "@/lib/utils";

// Utility function to format date as YYYY-MM-DD using local timezone
const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface EnhancedPriceCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  defaultMonth?: Date;
  priceMap?: Record<string, number>;
  basePrice?: number;
  availabilityMap?: Record<string, boolean>;
  checkInDate?: Date;
  checkOutDate?: Date;
  currentStep?: "checkin" | "checkout";
}

export default function EnhancedPriceCalendar({
  selected,
  onSelect,
  defaultMonth,
  priceMap = {},
  basePrice = 0,
  availabilityMap = {},
  checkInDate,
  checkOutDate,
  currentStep = "checkin",
}: EnhancedPriceCalendarProps) {
  const initialDefaultMonth = defaultMonth ?? selected ?? new Date();

  // Check if a date is in the selected range
  const isInSelectedRange = (date: Date) => {
    if (!checkInDate || !checkOutDate) return false;
    return date >= checkInDate && date <= checkOutDate;
  };

  // Check if a date is the check-in date
  const isCheckInDate = (date: Date) => {
    if (!checkInDate) return false;
    return date.toDateString() === checkInDate.toDateString();
  };

  // Check if a date is the check-out date
  const isCheckOutDate = (date: Date) => {
    if (!checkOutDate) return false;
    return date.toDateString() === checkOutDate.toDateString();
  };

  // Check if a date is unavailable
  const isUnavailable = (date: Date) => {
    const dateStr = formatDateString(date);
    return availabilityMap[dateStr] === false;
  };

  // Check if date is in the past
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="w-full max-w-full mx-auto">
        <Calendar
          mode="single"
          defaultMonth={initialDefaultMonth}
          selected={selected}
          onSelect={onSelect}
          disabled={(date) => isPastDate(date) || isUnavailable(date)}
          className="rounded-lg border shadow-sm w-full overflow-x-scroll lg:p-4"
          captionLayout="dropdown"
          formatters={{
            formatMonthDropdown: (date) => {
              return moment(date).tz("Asia/Jakarta").format("MMMM YYYY");
            },
          }}
          classNames={{
            caption_label: cn(
              "flex items-center justify-center p-1 text-[clamp(1rem,1.2vw,1.4rem)] lg:text-[clamp(0.6rem,1.2vw,0.7rem)] font-semibold"
            ),
            dropdowns: cn(
              "flex items-center justify-center gap-2 p-2 flex gap-2 justify-center items-center text-[clamp(0.6rem,0.6vw,1rem)] font-medium"
            ),
            chevron: cn("size-3 ml-1"),
          }}
          components={{
            DayButton: ({ children, modifiers, day, ...props }) => {
              const date = day.date;
              const dateStr = moment(date)
                .tz("Asia/Jakarta")
                .format("YYYY-MM-DD");
              const price = priceMap[dateStr];

              const unavailable = isUnavailable(date);
              const inRange = isInSelectedRange(date);
              const isCheckIn = isCheckInDate(date);
              const isCheckOut = isCheckOutDate(date);
              const isPast = isPastDate(date);

              // Determine styling based on state
              let bgColor = "";
              let textColor = "";
              let borderColor = "";
              let priceColor = "";

              if (isPast || unavailable) {
                bgColor = "bg-gray-100";
                textColor = "text-gray-400";
                priceColor = "text-gray-400";
              } else if (isCheckIn) {
                bgColor = "bg-blue-500";
                textColor = "text-white";
                priceColor = "text-blue-100";
                borderColor = "border-blue-600";
              } else if (isCheckOut) {
                bgColor = "bg-blue-500";
                textColor = "text-white";
                priceColor = "text-blue-100";
                borderColor = "border-blue-600";
              } else if (inRange) {
                bgColor = "bg-blue-50";
                textColor = "text-blue-900";
                priceColor = "text-blue-600";
                borderColor = "border-blue-200";
              } else {
                bgColor = "hover:bg-blue-50";
                textColor = "text-gray-900";
                priceColor =
                  price !== undefined ? "text-green-600" : "text-blue-600";
              }

              return (
                <CalendarDayButton
                  {...props}
                  day={day}
                  modifiers={modifiers}
                  className={cn(
                    "aspect-square w-full flex flex-col items-center justify-center",
                    "p-1 text-center relative transition-all duration-200",
                    "text-[clamp(1rem,1.5vw,2rem)]",
                    bgColor,
                    textColor,
                    borderColor && `border-2 ${borderColor}`,
                    unavailable && "cursor-not-allowed opacity-50",
                    isPast && "cursor-not-allowed"
                  )}
                  disabled={isPast || unavailable}
                >
                  <div className="font-medium leading-none">{children}</div>
                  {!modifiers.outside && (
                    <div className="w-full overflow-hidden mt-0.5">
                      {price !== undefined ? (
                        <span
                          className={cn(
                            "max-[600px]:text-[clamp(0.5rem,1vw,0.3rem)] lg:text-[clamp(0.15rem,1vw,0.4rem)]",
                            "font-semibold block leading-none",
                            priceColor
                          )}
                        >
                          Rp {Math.round(price / 1000)}k
                        </span>
                      ) : (
                        basePrice > 0 && (
                          <span
                            className={cn(
                              "max-[600px]:text-[clamp(0.5rem,1vw,0.3rem)] lg:text-[clamp(0.15rem,1vw,0.4rem)]",
                              "font-semibold block leading-none",
                              priceColor
                            )}
                          >
                            Rp {Math.round(basePrice / 1000)}k
                          </span>
                        )
                      )}
                      {/* Availability indicator */}
                      {unavailable && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  )}
                </CalendarDayButton>
              );
            },
          }}
        />

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
            <span>In Range</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded relative">
              <div className="absolute top-0 right-0 w-1 h-1 bg-red-500 rounded-full"></div>
            </div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
