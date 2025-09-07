// src/components/myUi/customCalendar.tsx
"use client";

import * as React from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import moment from "moment-timezone";
import { cn } from "@/lib/utils";

interface PriceCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  defaultMonth?: Date;
  priceMap?: Record<string, number>;
  basePrice?: number;
  unavailableDates?: Set<string>;
  isAvailabilityLoading?: boolean;
}

export default function PriceAvailabilityCalendar({
  selected,
  onSelect,
  defaultMonth,
  priceMap = {},
  basePrice = 0,
  unavailableDates = new Set(),
  isAvailabilityLoading = false,
}: PriceCalendarProps) {
  const initialDefaultMonth = defaultMonth ?? selected ?? new Date();

  return (
    <div className="w-full overflow-x-hidden">
      <div className="w-full max-w-full mx-auto">
        <Calendar
          mode="single"
          defaultMonth={initialDefaultMonth}
          selected={selected}
          onSelect={onSelect}
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
              const dateStr = moment(day.date)
                .tz("Asia/Jakarta")
                .format("YYYY-MM-DD");
              const price = priceMap[dateStr];

              const isUnavailable = unavailableDates.has(dateStr);
              const isOutside = modifiers.outside;

              return (
                <CalendarDayButton
                  {...props}
                  day={day}
                  modifiers={modifiers}
                  className={cn(
                    "aspect-square w-full flex flex-col items-center justify-center",
                    "p-1 text-center relative",
                    isUnavailable && !isOutside
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100"
                      : "hover:bg-blue-50",
                    "text-[clamp(1rem,1.5vw,2rem)]"
                  )}
                  disabled={isUnavailable && !isOutside}
                >
                  <div className="font-medium leading-none">{children}</div>
                  {!isOutside && (
                    <div className="w-full overflow-hidden mt-0.5">
                      {isUnavailable ? (
                        <span className="max-[600px]:text-[clamp(0.5rem,1vw,0.3rem)] lg:text-[clamp(0.15rem,1vw,0.4rem)] text-red-500 font-semibold block leading-none">
                          Unavailable
                        </span>
                      ) : price !== undefined ? (
                        <span className="max-[600px]:text-[clamp(0.5rem,1vw,0.3rem)] lg:text-[clamp(0.15rem,1vw,0.4rem)] text-green-600 font-semibold block leading-none">
                          Rp {Math.round(price / 1000)}k
                        </span>
                      ) : basePrice > 0 ? (
                        <span className="max-[600px]:text-[clamp(0.5rem,1vw,0.3rem)] lg:text-[clamp(0.15rem,1vw,0.4rem)] text-blue-600 font-semibold block leading-none">
                          Rp {Math.round(basePrice / 1000)}k
                        </span>
                      ) : null}
                    </div>
                  )}
                </CalendarDayButton>
              );
            },
          }}
        />
      </div>
    </div>
  );
}
