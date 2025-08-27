// src/components/myUi/customCalendar.tsx
"use client";

import * as React from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import moment from "moment-timezone";

interface PriceCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  defaultMonth?: Date;
  priceMap?: Record<string, number>;
  basePrice?: number;
}

export default function PriceCalendar({
  selected,
  onSelect,
  defaultMonth,
  priceMap = {},
  basePrice = 0,
}: PriceCalendarProps) {
  const initialDefaultMonth = defaultMonth ?? selected ?? new Date();

  return (
    <Calendar
      mode="single"
      defaultMonth={initialDefaultMonth}
      selected={selected}
      onSelect={onSelect}
      className="rounded-lg border shadow-sm"
      captionLayout="dropdown"
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
          const price = priceMap[dateStr];

          return (
            <CalendarDayButton day={day} modifiers={modifiers} {...props}>
              {children}
              {!modifiers.outside && (
                <>
                  {price !== undefined ? (
                    <span className="text-[8px] text-green-600 mt-0.5">
                      Rp. {price.toLocaleString("id-ID")}
                    </span>
                  ) : (
                    <span className="text-[8px] text-black-400 mx-0.5">
                      Rp.{" "}
                      {basePrice > 0 ? basePrice.toLocaleString("id-ID") : ""}
                    </span>
                  )}
                </>
              )}
            </CalendarDayButton>
          );
        },
      }}
    />
  );
}