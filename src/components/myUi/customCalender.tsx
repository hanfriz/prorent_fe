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
      // mode={mode} // atau hardcode mode="single"
      mode="single" // Karena kita modifikasi untuk single date
      defaultMonth={initialDefaultMonth}
      selected={selected} // selected adalah Date | undefined
      onSelect={onSelect} // onSelect menerima Date | undefined
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
