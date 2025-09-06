import React, { useState, useEffect } from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import moment from "moment-timezone";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useRoomAvailability } from "@/hooks/useRoomAvailability";
import { roomService, AvailabilityItem } from "@/service/roomService";
import { toast } from "sonner";

interface RoomAvailabilityCalendarProps {
  roomId: string;
  roomName: string;
  roomTypeName: string;
}

export const RoomAvailabilityCalendar: React.FC<
  RoomAvailabilityCalendarProps
> = ({ roomId, roomName, roomTypeName }) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [bulkAvailability, setBulkAvailability] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted before making API calls
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    isLoading,
    availabilityData,
    currentMonth,
    getMonthlyAvailability,
    setBulkAvailability: updateBulkAvailability,
    setDateAvailability,
    setDateRangeAvailability,
    setMonthAvailability,
    goToNextMonth,
    goToPreviousMonth,
    getCurrentMonthFormatted,
  } = useRoomAvailability({
    roomId,
    onSuccess: () => {
      toast.success("Availability updated successfully!");
      setSelectedDates([]);
    },
    onError: (error) => {
      toast.error(`Error: ${error}`);
    },
  });

  // Load initial data - only when component is mounted and roomId exists
  useEffect(() => {
    if (isMounted && roomId) {
      getMonthlyAvailability(roomService.getCurrentMonth());
    }
  }, [roomId, isMounted]); // Only depend on roomId and mounted state

  // Convert availability data to a map for quick lookup
  const availabilityMap = React.useMemo(() => {
    const map: Record<string, boolean> = {};
    availabilityData?.forEach((item) => {
      map[item.date] = item.isAvailable;
    });
    return map;
  }, [availabilityData]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const dateString = date.toISOString().split("T")[0];
    setSelectedDates((prev) => {
      const isSelected = prev.some(
        (d) => d.toISOString().split("T")[0] === dateString
      );
      if (isSelected) {
        return prev.filter((d) => d.toISOString().split("T")[0] !== dateString);
      } else {
        return [...prev, date];
      }
    });
  };

  const handleCalendarSelect = (dates: Date[] | Date | undefined) => {
    if (!dates) {
      setSelectedDates([]);
      return;
    }

    // Handle both single date and array of dates
    if (Array.isArray(dates)) {
      setSelectedDates(dates);
    } else {
      // Single date - toggle selection
      const dateString = dates.toISOString().split("T")[0];
      setSelectedDates((prev) => {
        const isSelected = prev.some(
          (d) => d.toISOString().split("T")[0] === dateString
        );
        if (isSelected) {
          return prev.filter(
            (d) => d.toISOString().split("T")[0] !== dateString
          );
        } else {
          return [...prev, dates];
        }
      });
    }
  };

  const handleApplyBulkAvailability = async () => {
    if (selectedDates.length === 0) {
      toast.error("Please select at least one date");
      return;
    }

    const availability: AvailabilityItem[] = selectedDates.map((date) => ({
      date: date.toISOString().split("T")[0],
      isAvailable: bulkAvailability,
    }));

    await updateBulkAvailability(availability);
  };

  const handleSetMonthAvailability = async (isAvailable: boolean) => {
    await setMonthAvailability(currentMonth, isAvailable);
  };

  const handleToggleDateAvailability = async (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    const currentAvailability = availabilityMap[dateString] ?? true;
    await setDateAvailability(dateString, !currentAvailability);
  };

  const modifiers = {
    available: (date: Date) => {
      const dateString = date.toISOString().split("T")[0];
      return availabilityMap[dateString] === true;
    },
    unavailable: (date: Date) => {
      const dateString = date.toISOString().split("T")[0];
      return availabilityMap[dateString] === false;
    },
    selected: (date: Date) => {
      const dateString = date.toISOString().split("T")[0];
      return selectedDates.some(
        (d) => d.toISOString().split("T")[0] === dateString
      );
    },
    // Add default state for dates without explicit availability data
    default: (date: Date) => {
      const dateString = date.toISOString().split("T")[0];
      return availabilityMap[dateString] === undefined;
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Availability Calendar
          </CardTitle>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Room:</span> {roomName}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Type:</span> {roomTypeName}
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Navigation and Actions */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {getCurrentMonthFormatted()}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
                disabled={isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
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

          {/* Legend */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-100 border border-green-300 rounded flex items-center justify-center text-xs font-medium text-green-700">
                ✓
              </div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-100 border border-red-300 rounded flex items-center justify-center text-xs font-medium text-red-700">
                ✕
              </div>
              <span>Unavailable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-500 border border-blue-700 rounded flex items-center justify-center text-xs font-medium text-white">
                ●
              </div>
              <span>Selected</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="w-full overflow-hidden">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={handleCalendarSelect}
                modifiers={modifiers}
                className="w-full mx-auto border rounded-lg p-4"
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
                  months: "flex w-full justify-center",
                  month: "space-y-4 w-full max-w-sm mx-auto",
                  table: "w-full border-collapse",
                  head_row: "flex w-full",
                  head_cell:
                    "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] h-10 flex items-center justify-center",
                  row: "flex w-full mt-1",
                  cell: "relative p-0.5 text-center text-sm w-full h-10 flex items-center justify-center",
                }}
                components={{
                  DayButton: ({ children, modifiers, day, ...props }) => {
                    const date = day.date;
                    const dateString = date.toISOString().split("T")[0];
                    const isAvailable = availabilityMap[dateString] === true;
                    const isUnavailable = availabilityMap[dateString] === false;
                    const isSelected = selectedDates.some(
                      (d) => d.toISOString().split("T")[0] === dateString
                    );

                    let bgColor = "#f8fafc";
                    let textColor = "#64748b";
                    let borderColor = "#e2e8f0";
                    let indicator = null;

                    if (isSelected) {
                      bgColor = "#3b82f6";
                      textColor = "white";
                      borderColor = "#1d4ed8";
                      indicator = "●";
                    } else if (isAvailable) {
                      bgColor = "#f0fdf4";
                      textColor = "#166534";
                      borderColor = "#bbf7d0";
                      indicator = "✓";
                    } else if (isUnavailable) {
                      bgColor = "#fef2f2";
                      textColor = "#991b1b";
                      borderColor = "#fca5a5";
                      indicator = "✕";
                    }

                    return (
                      <CalendarDayButton
                        {...props}
                        day={day}
                        modifiers={modifiers}
                        className={cn(
                          "aspect-square w-full flex flex-col items-center justify-center",
                          "p-1 text-center relative transition-all duration-200 ease-in-out",
                          "text-[clamp(1rem,1.5vw,2rem)]",
                          "hover:opacity-80 focus:outline-none cursor-pointer"
                        )}
                        style={{
                          backgroundColor: bgColor,
                          color: textColor,
                          border: `1px solid ${borderColor}`,
                          borderRadius: "6px",
                          fontWeight: "500",
                        }}
                        onClick={() => handleDateSelect(date)}
                      >
                        <div className="font-medium leading-none">
                          {children}
                        </div>
                        {indicator && (
                          <span
                            className="absolute top-1 right-2 text-xs font-semibold opacity-80"
                            style={{ fontSize: "8px" }}
                          >
                            {indicator}
                          </span>
                        )}
                      </CalendarDayButton>
                    );
                  },
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bulk Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="bulk-availability">Set selected dates as:</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant={bulkAvailability ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBulkAvailability(!bulkAvailability)}
                >
                  {bulkAvailability ? "Available" : "Unavailable"}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleApplyBulkAvailability}
              disabled={selectedDates.length === 0 || isLoading}
              className="w-full"
              variant={selectedDates.length > 0 ? "default" : "secondary"}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Apply to {selectedDates.length} selected date(s)
            </Button>
          </div>

          {/* Month Actions */}
          <div className="pt-4 border-t space-y-2">
            <Label>Set entire month:</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSetMonthAvailability(true)}
                disabled={isLoading}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-2" />
                All Available
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSetMonthAvailability(false)}
                disabled={isLoading}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                All Unavailable
              </Button>
            </div>
          </div>

          {/* Selected Dates Info */}
          {selectedDates.length > 0 && (
            <div className="pt-4 border-t">
              <Label className="text-sm font-medium">
                Selected Dates ({selectedDates.length}):
              </Label>
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedDates.slice(0, 10).map((date, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {date.toLocaleDateString("id-ID")}
                  </Badge>
                ))}
                {selectedDates.length > 10 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedDates.length - 10} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
