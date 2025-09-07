// src/view/reservation/component/dateSelectionSection.tsx
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
import { Skeleton } from "@/components/ui/skeleton";
import PriceAvailabilityCalendar from "@/components/myUi/customAvailabilityCalender ";

interface DateSelectionSectionProps {
  startDate?: Date;
  endDate?: Date;
  setStartDate: (date?: Date) => void;
  setEndDate: (date?: Date) => void;
  priceMap: Record<string, number>;
  basePrice: number;
  isLoading?: boolean;
  unavailableDates?: Set<string>;
  isAvailabilityLoadings?: boolean;
}

export default function DateSelectionSection({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  priceMap,
  basePrice,
  isLoading,
  unavailableDates = new Set(),
  isAvailabilityLoadings = false,
}: DateSelectionSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

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
          unavailableDates={unavailableDates}
          isAvailabilityLoadings={isAvailabilityLoadings}
        />
        <DateField
          label="Check-out"
          id="end-date-calendar"
          selected={endDate}
          onSelect={setEndDate}
          priceMap={priceMap}
          basePrice={basePrice}
          defaultMonth={endDate ?? startDate ?? new Date()}
          unavailableDates={unavailableDates}
          isAvailabilityLoadings={isAvailabilityLoadings}
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
  unavailableDates = new Set(),
  isAvailabilityLoadings,
}: {
  label: string;
  id: string;
  selected?: Date;
  onSelect: (date?: Date) => void;
  priceMap: Record<string, number>;
  basePrice: number;
  defaultMonth: Date;
  unavailableDates?: Set<string>;
  isAvailabilityLoadings?: boolean;
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
              "w-full justify-start text-left font-normal border-gray-200 cursor-pointer",
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
            <PriceAvailabilityCalendar
              selected={selected}
              onSelect={onSelect}
              priceMap={priceMap}
              basePrice={basePrice}
              defaultMonth={defaultMonth}
              unavailableDates={unavailableDates}
              isAvailabilityLoading={isAvailabilityLoadings}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
