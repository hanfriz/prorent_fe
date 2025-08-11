import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import moment from "moment-timezone";
import { cn } from "@/lib/utils";
import { Props } from "@/interface/reservationInterface";
import { Day } from "react-day-picker";

interface CustomComponents {
  DayContent?: React.ComponentType<{ date: Date }>;
}

export function DatePickerWithPrice({
  date,
  onSelect,
  priceMap = {},
  disabledDates = [],
  label,
}: Props) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              moment(date).tz("Asia/Bangkok").format("YYYY-MM-DD")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            disabled={disabledDates}
            autoFocus
            className="rounded-md border"
            classNames={{
              day: "relative p-2",
            }}
            components={{
              Day: ({ day, className, ...props }) => (
                <div className="flex flex-col items-center">
                  <span>{moment(date).tz("Asia/Bangkok").format("D")}</span>
                  {priceMap[
                    moment(date).tz("Asia/Bangkok").format("YYYY-MM-DD")
                  ] && (
                    <p className="text-xs text-green-600 mt-1">
                      ฿
                      {
                        priceMap[
                          moment(date).tz("Asia/Bangkok").format("YYYY-MM-DD")
                        ]
                      }
                    </p>
                  )}
                </div>
              ),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
