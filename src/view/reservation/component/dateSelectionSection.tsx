import React from "react";
import moment from "moment-timezone";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import PriceCalendar from "@/components/myUi/customCalender";

interface DateSelectionSectionProps {
  startDate?: Date;
  endDate?: Date;
  setStartDate: (date?: Date) => void;
  setEndDate: (date?: Date) => void;
  priceMap: Record<string, number>;
  basePrice: number;
}

export default function DateSelectionSection({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  priceMap,
  basePrice,
}: DateSelectionSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Pilih Tanggal Reservasi</h2>
      <div className="flex flex-col gap-6">
        <DateField
          label="Check-in"
          id="start-date-calendar"
          selected={startDate}
          onSelect={setStartDate}
          priceMap={priceMap}
          basePrice={basePrice}
          defaultMonth={startDate ?? new Date()}
        />
        <DateField
          label="Check-out"
          id="end-date-calendar"
          selected={endDate}
          onSelect={setEndDate}
          priceMap={priceMap}
          basePrice={basePrice}
          defaultMonth={endDate ?? startDate ?? new Date()}
        />
      </div>
      {startDate && endDate && startDate >= endDate && (
        <p className="mt-2 text-sm text-red-600">
          Tanggal Check-out harus setelah Check-in.
        </p>
      )}
    </div>
  );
}

function DateField({
  label,
  id,
  selected,
  onSelect,
  priceMap,
  basePrice,
  defaultMonth,
}: {
  label: string;
  id: string;
  selected?: Date;
  onSelect: (date?: Date) => void;
  priceMap: Record<string, number>;
  basePrice: number;
  defaultMonth: Date;
}) {
  return (
    <div className="flex-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? (
              moment(selected).tz("Asia/Jakarta").format("YYYY-MM-DD")
            ) : (
              <span>Pick a date</span>
            )}
            <ChevronDownIcon className="ml-auto h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 max-h-[80vh] overflow-y-auto"
          align="start"
        >
          <div id={id}>
            <PriceCalendar
              selected={selected}
              onSelect={onSelect}
              priceMap={priceMap}
              basePrice={basePrice}
              defaultMonth={defaultMonth}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
