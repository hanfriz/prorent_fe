"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import PriceCalendar from "@/components/myUi/customCalender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

interface PropertyCalendarProps {
  onDateSelect?: (dateRange: DateRange | undefined) => void;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  propertyId?: string;
  priceMap?: Record<string, number>;
  basePrice?: number;
}

export default function PropertyCalendar({
  onDateSelect,
  disabledDates = [],
  minDate = new Date(),
  maxDate,
  propertyId,
  priceMap = {},
  basePrice = 0,
}: PropertyCalendarProps) {
  const [checkInDate, setCheckInDate] = React.useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = React.useState<Date | undefined>();
  const [currentStep, setCurrentStep] = React.useState<"checkin" | "checkout">(
    "checkin"
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    if (currentStep === "checkin") {
      setCheckInDate(selectedDate);
      setCheckOutDate(undefined);
      setCurrentStep("checkout");
    } else {
      // Ensure checkout is after checkin
      if (checkInDate && selectedDate > checkInDate) {
        setCheckOutDate(selectedDate);
        // Create DateRange and call onDateSelect
        const dateRange: DateRange = {
          from: checkInDate,
          to: selectedDate,
        };
        onDateSelect?.(dateRange);
        setCurrentStep("checkin"); // Reset for next selection
      } else {
        // If selected date is before or same as checkin, reset
        setCheckInDate(selectedDate);
        setCheckOutDate(undefined);
        setCurrentStep("checkout");
      }
    }
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (date < minDate) return true;

    // Disable dates beyond max date
    if (maxDate && date > maxDate) return true;

    // Disable specific dates if provided
    return disabledDates.some(
      (disabledDate) => date.toDateString() === disabledDate.toDateString()
    );
  };

  const formatDateRange = () => {
    if (!checkInDate) return "Select check-in date";
    if (!checkOutDate)
      return `Check-in: ${checkInDate.toLocaleDateString()} - Select check-out date`;
    return `${checkInDate.toLocaleDateString()} - ${checkOutDate.toLocaleDateString()}`;
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSelectedDate = () => {
    if (currentStep === "checkin") return checkInDate;
    return checkOutDate;
  };

  const resetSelection = () => {
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setCurrentStep("checkin");
    onDateSelect?.(undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Select Your Dates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="font-semibold">{formatDateRange()}</p>
          {checkInDate && checkOutDate && (
            <p className="text-sm text-gray-600 mt-1">
              {calculateNights()} night(s)
            </p>
          )}
          <p className="text-xs text-blue-600 mt-1">
            {currentStep === "checkin"
              ? "Select check-in date"
              : "Select check-out date"}
          </p>
        </div>

        <div className="space-y-2">
          <PriceCalendar
            selected={getSelectedDate()}
            onSelect={handleDateSelect}
            defaultMonth={checkInDate || new Date()}
            priceMap={priceMap}
            basePrice={basePrice}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetSelection}
            disabled={!checkInDate}
          >
            Reset
          </Button>
          {checkInDate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentStep(
                  currentStep === "checkin" ? "checkout" : "checkin"
                )
              }
            >
              Switch to {currentStep === "checkin" ? "check-out" : "check-in"}
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Check-in time: 14:00</p>
          <p>• Check-out time: 12:00</p>
          <p>• Minimum stay: 1 night</p>
          <p>• Select check-in date first, then check-out date</p>
        </div>

        {checkInDate && checkOutDate && (
          <Button
            className="w-full"
            onClick={() => {
              const dateRange: DateRange = {
                from: checkInDate,
                to: checkOutDate,
              };
              console.log("Book dates:", dateRange);
              // Handle booking logic here
            }}
          >
            Continue to Booking ({calculateNights()} nights)
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
