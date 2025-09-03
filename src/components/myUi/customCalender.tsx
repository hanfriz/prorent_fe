// src/components/myUi/customCalender.tsx
"use client";

import * as React from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"; // Pastikan path benar
import moment from "moment-timezone";

// --- Update Props Interface untuk mode single ---
interface PriceCalendarProps {
  // mode: "single" | "range"; // Tambahkan jika ingin fleksibel, untuk sekarang hardcode "single"
  selected?: Date; // Ubah dari DateRange ke Date | undefined
  onSelect?: (date: Date | undefined) => void; // Ubah callback
  defaultMonth?: Date;
  priceMap?: Record<string, number>;
  basePrice?: number;
}

export default function PriceCalendar({
  // mode = "single", // Opsional jika ingin fleksibel
  selected,
  onSelect,
  defaultMonth,
  priceMap = {},
  basePrice = 0,
}: PriceCalendarProps) {
  // Gunakan selected (Date | undefined) langsung untuk defaultMonth jika tidak disediakan
  const initialDefaultMonth = defaultMonth ?? selected ?? new Date(); // Fallback ke hari ini jika keduanya undefined

  return (
    <Calendar
      mode="single"
      defaultMonth={initialDefaultMonth}
      selected={selected}
      onSelect={onSelect}
      className="rounded-lg border shadow-sm w-full"
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
            <CalendarDayButton
              day={day}
              modifiers={modifiers}
              {...props}
              className="h-12 w-full flex flex-col items-center justify-center p-1 text-center relative hover:bg-blue-50 text-xs"
            >
              <div className="text-xs font-medium leading-none">{children}</div>
              {!modifiers.outside && (
                <div className="w-full overflow-hidden mt-0.5">
                  {price !== undefined ? (
                    <span className="text-[8px] text-green-600 font-semibold block leading-none">
                      Rp {Math.round(price / 1000)}k
                    </span>
                  ) : (
                    basePrice > 0 && (
                      <span className="text-[8px] text-blue-600 font-semibold block leading-none">
                        Rp {Math.round(basePrice / 1000)}k
                      </span>
                    )
                  )}
                </div>
              )}
            </CalendarDayButton>
          );
        },
      }}
    />
  );
}
