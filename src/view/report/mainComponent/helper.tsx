// --- Helper Components ---

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export const StatCard = ({
  label,
  value,
  isCurrency = false,
}: {
  label: string;
  value: number;
  isCurrency?: boolean;
}) => (
  <div className="border rounded-lg p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-xl font-bold">
      {isCurrency
        ? `Rp${value.toLocaleString("id-ID")}`
        : value.toLocaleString("id-ID")}
    </p>
  </div>
);

const DateRangePicker = ({
  dateRange,
  onDateRangeChange,
}: {
  dateRange: { startDate: Date | null; endDate: Date | null };
  onDateRangeChange: (range: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
}) => {
  const [tempRange, setTempRange] = useState(dateRange);

  useEffect(() => {
    setTempRange(dateRange);
  }, [dateRange]);

  const handleApply = () => {
    onDateRangeChange(tempRange);
  };

  return (
    <div className="flex flex-col space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !dateRange.startDate &&
                !dateRange.endDate &&
                "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.startDate ? (
              dateRange.endDate ? (
                <>
                  {format(dateRange.startDate, "LLL dd, y")} -{" "}
                  {format(dateRange.endDate, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.startDate, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.startDate || new Date()}
            selected={{
              from: dateRange.startDate || undefined,
              to: dateRange.endDate || undefined,
            }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setTempRange({ startDate: range.from, endDate: range.to });
              } else if (range?.from) {
                setTempRange({ startDate: range.from, endDate: null });
              } else {
                setTempRange({ startDate: null, endDate: null });
              }
            }}
            numberOfMonths={2}
          />
          <div className="p-3 flex justify-end">
            <Button onClick={handleApply}>Apply</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
