// src/components/availability/EnhancedRoomAvailabilityCalendar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import moment from "moment-timezone";
import { CalendarDays, Check, X, Loader2 } from "lucide-react";
import { useRoomAvailability } from "@/hooks/useRoomAvailability";
import { roomService, AvailabilityItem } from "@/service/roomService";
import { toast } from "sonner";

interface EnhancedRoomAvailabilityCalendarProps {
  roomId: string;
  roomName: string;
  roomTypeName: string;
  roomPrice?: number;
  onChangeMonth?: (month: string) => void; // Callback when month changes
}

export const EnhancedRoomAvailabilityCalendar: React.FC<
  EnhancedRoomAvailabilityCalendarProps
> = ({ roomId, roomName, roomTypeName, roomPrice = 0, onChangeMonth }) => {
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
      console.log("🚀 Initial data load");
      getMonthlyAvailability(roomService.getCurrentMonth());
    }
  }, [roomId, isMounted]);

  // Watch for currentMonth changes and call callback (but don't fetch again)
  useEffect(() => {
    if (isMounted && roomId && currentMonth) {
      console.log(
        `📊 CurrentMonth changed to: ${currentMonth}, calling callback only`
      );
      // Call the callback if provided (don't fetch here to avoid double fetch)
      onChangeMonth?.(currentMonth);
    }
  }, [currentMonth, roomId, isMounted, onChangeMonth]);

  // Convert availability data to a map for quick lookup
  const availabilityMap = React.useMemo(() => {
    const map: Record<string, boolean> = {};
    availabilityData?.forEach((item) => {
      map[item.date] = item.isAvailable;
    });
    return map;
  }, [availabilityData]);

  // Utility function to format date as YYYY-MM-DD (fixes timezone issues)
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const dateString = formatDateString(date);
    console.log(`🗓️ Date selected: ${dateString}`);

    setSelectedDates((prev) => {
      const isSelected = prev.some((d) => formatDateString(d) === dateString);

      if (isSelected) {
        return prev.filter((d) => formatDateString(d) !== dateString);
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
      // Single date - toggle selection using utility function
      const dateString = formatDateString(dates);

      setSelectedDates((prev) => {
        const isSelected = prev.some((d) => formatDateString(d) === dateString);

        if (isSelected) {
          return prev.filter((d) => formatDateString(d) !== dateString);
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

    // Create payload with properly formatted dates
    const availability: AvailabilityItem[] = selectedDates.map((date) => {
      const dateString = formatDateString(date);
      console.log(`📤 Sending date: ${dateString}`);

      return {
        date: dateString,
        isAvailable: bulkAvailability,
      };
    });

    console.log("🚀 Bulk availability payload:", availability);
    await updateBulkAvailability(availability);
  };

  const handleSetMonthAvailability = async (isAvailable: boolean) => {
    await setMonthAvailability(currentMonth, isAvailable);
  };

  // Handle month/year dropdown changes
  const handleMonthYearChange = (newDate: Date) => {
    const newMonth = roomService.formatMonthFromDate(newDate);
    console.log(`📅 Month changed from ${currentMonth} to ${newMonth}`);
    if (newMonth !== currentMonth) {
      console.log(`🔄 Fetching availability for ${newMonth}`);
      getMonthlyAvailability(newMonth);
    }
  };

  const formatSelectedDatesRange = () => {
    if (selectedDates.length === 0) return "No dates selected";
    if (selectedDates.length === 1) {
      return `Selected: ${selectedDates[0].toLocaleDateString("id-ID")}`;
    }
    return `${selectedDates.length} dates selected`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Manage Availability
        </CardTitle>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Room:</span> {roomName}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Type:</span> {roomTypeName}
          </p>
          {roomPrice > 0 && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Price:</span>{" "}
              {formatPrice(roomPrice)}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Selection Info */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="font-semibold">{formatSelectedDatesRange()}</p>
          {selectedDates.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Will be set as {bulkAvailability ? "Available" : "Unavailable"}
            </p>
          )}
          <p className="text-xs text-blue-600 mt-1">
            Click dates to select/deselect for bulk operations
          </p>
        </div>

        {/* Calendar */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="w-full overflow-x-hidden">
            <div className="w-full max-w-full mx-auto">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={handleCalendarSelect}
                month={
                  currentMonth ? new Date(`${currentMonth}-01`) : new Date()
                }
                onMonthChange={handleMonthYearChange}
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
                    const date = day.date;
                    const dateString = formatDateString(date);

                    const isAvailable = availabilityMap[dateString] === true;
                    const isUnavailable = availabilityMap[dateString] === false;
                    const isSelected = selectedDates.some((d) => {
                      const dDateString = formatDateString(d);
                      return dDateString === dateString;
                    });

                    // Color scheme similar to PriceCalendar
                    let bgColor = "";
                    let textColor = "";
                    let borderColor = "";
                    let indicator = null;

                    if (isSelected) {
                      bgColor = "bg-blue-500";
                      textColor = "text-white";
                      borderColor = "border-blue-700";
                      indicator = "●";
                    } else if (isAvailable) {
                      bgColor = "bg-green-50 hover:bg-green-100";
                      textColor = "text-green-700";
                      borderColor = "border-green-200";
                      indicator = "✓";
                    } else if (isUnavailable) {
                      bgColor = "bg-red-50 hover:bg-red-100";
                      textColor = "text-red-700";
                      borderColor = "border-red-200";
                      indicator = "✕";
                    } else {
                      bgColor = "hover:bg-blue-50";
                      textColor = "text-gray-700";
                      borderColor = "border-gray-200";
                    }

                    return (
                      <CalendarDayButton
                        {...props}
                        day={day}
                        modifiers={modifiers}
                        className={cn(
                          "aspect-square w-full flex flex-col items-center justify-center",
                          "p-1 text-center relative transition-all duration-200",
                          "text-[clamp(1rem,1.5vw,2rem)]",
                          bgColor,
                          textColor,
                          borderColor && `border ${borderColor}`,
                          "cursor-pointer"
                        )}
                        onClick={() => handleDateSelect(date)}
                      >
                        <div className="font-medium leading-none">
                          {children}
                        </div>
                        {!modifiers.outside && indicator && (
                          <div className="w-full overflow-hidden mt-0.5">
                            <span className="text-xs font-semibold block leading-none opacity-80">
                              {indicator}
                            </span>
                          </div>
                        )}
                      </CalendarDayButton>
                    );
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-50 border border-green-200 rounded flex items-center justify-center text-green-700">
              ✓
            </div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-50 border border-red-200 rounded flex items-center justify-center text-red-700">
              ✕
            </div>
            <span>Unavailable</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 border border-blue-700 rounded flex items-center justify-center text-white">
              ●
            </div>
            <span>Selected</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {/* Bulk Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Set selected dates as:</Label>
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
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Click on dates to select them for bulk operations</p>
          <p>
            • Green (✓) = Available, Red (✕) = Unavailable, Blue (●) = Selected
          </p>
          <p>• Use month actions to quickly set availability for all dates</p>
        </div>
      </CardContent>
    </Card>
  );
};
