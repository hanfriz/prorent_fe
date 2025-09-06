import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { roomService, AvailabilityItem } from "@/service/roomService";

interface PublicAvailabilityCalendarProps {
  roomId: string;
  roomName: string;
  onDateSelect?: (date: Date | null) => void;
  selectedDate?: Date | null;
  minDate?: Date;
  maxDate?: Date;
}

export const PublicAvailabilityCalendar: React.FC<
  PublicAvailabilityCalendarProps
> = ({
  roomId,
  roomName,
  onDateSelect,
  selectedDate,
  minDate = new Date(),
  maxDate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<AvailabilityItem[]>(
    []
  );
  const [currentMonth, setCurrentMonth] = useState(
    roomService.getCurrentMonth()
  );

  // Load availability data for current month
  const loadAvailability = async (month: string) => {
    try {
      setIsLoading(true);

      if (!roomService.validateMonthFormat(month)) {
        console.error("Invalid month format:", month);
        return;
      }

      const response = await roomService.getMonthlyAvailability(roomId, month);

      if (response.success && response.data) {
        setAvailabilityData(response.data.availabilities);
        setCurrentMonth(month);
      }
    } catch (error: any) {
      console.error("Error loading availability:", error);
      // Fail silently for public view
      setAvailabilityData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadAvailability(roomService.getCurrentMonth());
  }, [roomId]);

  // Convert availability data to a map for quick lookup
  const availabilityMap = React.useMemo(() => {
    const map: Record<string, boolean> = {};
    availabilityData?.forEach((item) => {
      map[item.date] = item.isAvailable;
    });
    return map;
  }, [availabilityData]);

  const handleDateClick = (date: Date | undefined) => {
    if (!date) return;

    // Check if date is available
    const dateString = date.toISOString().split("T")[0];
    const isAvailable = availabilityMap[dateString] ?? true;

    if (!isAvailable) {
      return; // Don't allow selection of unavailable dates
    }

    // Check if date is in the past
    if (date < minDate) {
      return; // Don't allow selection of past dates
    }

    // Check if date is beyond max date
    if (maxDate && date > maxDate) {
      return;
    }

    onDateSelect?.(date);
  };

  const goToNextMonth = () => {
    const nextMonth = roomService.getNextMonth(currentMonth);
    loadAvailability(nextMonth);
  };

  const goToPreviousMonth = () => {
    const previousMonth = roomService.getPreviousMonth(currentMonth);
    loadAvailability(previousMonth);
  };

  const getCurrentMonthFormatted = () => {
    const date = new Date(`${currentMonth}-01`);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const isDateAvailable = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return availabilityMap[dateString] ?? true;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.toISOString().split("T")[0] ===
      selectedDate.toISOString().split("T")[0]
    );
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (date < minDate) return true;

    // Disable dates beyond max date
    if (maxDate && date > maxDate) return true;

    // Disable unavailable dates
    return !isDateAvailable(date);
  };

  const modifiers = {
    available: (date: Date) => isDateAvailable(date) && !isDateDisabled(date),
    unavailable: (date: Date) => !isDateAvailable(date),
    selected: (date: Date) => isDateSelected(date),
    disabled: (date: Date) => isDateDisabled(date),
  };

  const modifiersStyles = {
    available: {
      backgroundColor: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    },
    unavailable: {
      backgroundColor: "#fecaca",
      color: "#991b1b",
      opacity: 0.6,
      cursor: "not-allowed",
    },
    selected: {
      backgroundColor: "#3b82f6",
      color: "white",
      border: "2px solid #1d4ed8",
    },
    disabled: {
      opacity: 0.3,
      cursor: "not-allowed",
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Availability Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              disabled={isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {getCurrentMonthFormatted()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              disabled={isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Room Info */}
        <p className="text-sm text-gray-600">{roomName}</p>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span>Unavailable</span>
          </div>
          {selectedDate && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded border-2 border-blue-700"></div>
              <span>Selected</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div>
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={handleDateClick}
              disabled={isDateDisabled}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border"
              fromDate={minDate}
              toDate={maxDate}
            />

            {/* Selected date info */}
            {selectedDate && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  Selected Date:{" "}
                  {selectedDate.toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <Badge variant="default" className="mt-1">
                  Available for booking
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
