// src/components/property/PropertyCalendar.tsx
"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  RoomType,
  PublicPropertyDetail,
} from "@/interface/publicPropertyInterface"; // ✅ Import PublicPropertyDetail
import { useReservationStore } from "@/lib/stores/reservationStore";
import { PaymentType } from "@/interface/enumInterface";
import { useAvailabilityCalendar } from "@/service/useReservation";
import PriceAvailabilityCalendar from "../myUi/customAvailabilityCalender ";
import moment from "moment-timezone";
import {
  addOneMinute,
  formatDateToJakartaYYYYMMDD,
} from "@/view/reservation/component/calenderHelper";

interface PropertyCalendarProps {
  onDateSelect?: (dateRange: DateRange | undefined) => void;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  userName?: string;
  email?: string;
  propertyId?: string;
  property?: PublicPropertyDetail;
  priceMap?: Record<string, number>;
  basePrice?: number;
  roomTypes?: RoomType[];
  onRoomTypeSelect?: (roomTypeId: string) => void;
  selectedRoomTypeId?: string;
}

export default function PropertyCalendar({
  onDateSelect,
  disabledDates = [],
  minDate = new Date(),
  maxDate,
  userName,
  email,
  propertyId,
  property,
  priceMap = {},
  basePrice = 0,
  roomTypes = [],
  onRoomTypeSelect,
  selectedRoomTypeId,
}: PropertyCalendarProps) {
  const [checkInDate, setCheckInDate] = React.useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = React.useState<Date | undefined>();
  const [currentStep, setCurrentStep] = React.useState<"checkin" | "checkout">(
    "checkin"
  );
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();
  const { setField, setDisplayData, setFromPropertyId } = useReservationStore();

  const User = user?.role;
  const isOwner = User === "OWNER";

  // ✅ Fetch availability for selected room type
  const {
    data: availabilityData,
    isLoading: isAvailabilityLoading,
    error: availabilityError,
  } = useAvailabilityCalendar(selectedRoomTypeId, undefined, undefined); // Defaults to current year

  // ✅ Create Set of unavailable dates for O(1) lookup
  const unavailableDateSet = React.useMemo(() => {
    if (!availabilityData?.unavailableDates) return new Set<string>();
    return new Set(
      availabilityData.unavailableDates.map((d) => {
        const date = new Date(d.date + "T17:00:00Z");
        console.log(date);
        if (isNaN(date.getTime())) {
          throw new Error(
            `Invalid date format: ${d.date}. Use YYYY-MM-DD format`
          );
        }
        return formatDateToJakartaYYYYMMDD(date);
      })
    );
  }, [availabilityData]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const dateKey = formatDateToJakartaYYYYMMDD(selectedDate);

    // ✅ ONLY block if selecting check-in AND date is unavailable
    if (currentStep === "checkin" && unavailableDateSet.has(dateKey)) {
      alert(
        "This date is not available for check-in. Please choose another date."
      );
      return;
    }

    if (currentStep === "checkin") {
      setCheckInDate(selectedDate);
      setCheckOutDate(undefined);
      setCurrentStep("checkout");
    } else {
      // Ensure checkout is after checkin
      if (checkInDate && selectedDate > checkInDate) {
        setCheckOutDate(selectedDate);
        const dateRange: DateRange = {
          from: checkInDate,
          to: selectedDate,
        };
        onDateSelect?.(dateRange);
        setCurrentStep("checkin");
      } else {
        // If selected date is before or same as checkin, reset
        setCheckInDate(selectedDate);
        setCheckOutDate(undefined);
        setCurrentStep("checkout");
      }
    }
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

  const validateDateRange = (from: Date, to: Date): string[] => {
    const invalidDates: string[] = [];
    const currentDate = addOneMinute(from);

    while (currentDate < to) {
      const dateKey = formatDateToJakartaYYYYMMDD(currentDate); // ✅ FIXED
      if (unavailableDateSet.has(dateKey)) {
        invalidDates.push(dateKey);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return invalidDates;
  };

  const handleBookingClick = () => {
    if (!propertyId || !selectedRoomTypeId) {
      alert("Please select a property and room type first.");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    // ✅ Validate entire date range
    const invalidDates = validateDateRange(checkInDate, checkOutDate);

    if (invalidDates.length > 0) {
      const formattedDates = invalidDates
        .map((dateStr) => {
          const d = new Date(dateStr);
          return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        })
        .join(", ");

      alert(
        `Dates ${formattedDates} are unavailable. Please adjust your stay.`
      );
      return;
    }

    if (isAuthenticated) {
      const selectedRoomType = roomTypes.find(
        (rt) => rt.id === selectedRoomTypeId
      );

      if (selectedRoomType && property) {
        setField("userId", userName || "");
        setField("payerEmail", email || "");
        setField("propertyId", propertyId);
        setField("roomTypeId", selectedRoomTypeId);
        setField("startDate", new Date(checkInDate));
        setField("endDate", new Date(checkOutDate));
        setField("paymentType", PaymentType.MANUAL_TRANSFER);

        setFromPropertyId(propertyId);

        setDisplayData({
          propertyName: property.name || "Property",
          propertyType: property.category?.name || "General",
          roomTypeName: selectedRoomType.name,
          basePrice: selectedRoomType.basePrice,
          mainImageUrl: property.pictures?.main?.url || "",
        });

        router.push("/reservation");
      }
    } else {
      setShowAuthDialog(true);
    }
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
          <CalendarIcon className="h-5 w-5" />
          Select Your Dates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Room Type Selection */}
        {roomTypes && roomTypes.length > 0 && (
          <div className="space-y-2 w-full">
            <label className="text-sm font-medium">Select Room Type</label>
            <Select value={selectedRoomTypeId} onValueChange={onRoomTypeSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((roomType) => (
                  <SelectItem
                    key={roomType.id}
                    value={roomType.id}
                    className="w-full"
                  >
                    <div className="flex justify-between w-full items-center">
                      <span className="truncate">{roomType.name}</span>
                      <span className="mx-2">-</span>
                      <span className="text-blue-600 font-medium whitespace-nowrap">
                        {formatPrice(roomType.basePrice)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
          <PriceAvailabilityCalendar
            selected={getSelectedDate()}
            onSelect={handleDateSelect}
            defaultMonth={checkInDate || new Date()}
            priceMap={priceMap}
            basePrice={basePrice}
            // ✅ Pass unavailable dates to calendar
            unavailableDates={unavailableDateSet}
            isAvailabilityLoading={isAvailabilityLoading}
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
          {checkInDate && checkOutDate && selectedRoomTypeId && isOwner && (
            <p className="text-red-500">
              • Please login to your personal user account to make a reservation
            </p>
          )}
        </div>

        {checkInDate && checkOutDate && selectedRoomTypeId && (
          <Button
            className="w-full"
            onClick={handleBookingClick}
            disabled={authLoading || isOwner || isAvailabilityLoading}
          >
            {authLoading || isAvailabilityLoading
              ? "Checking..."
              : `Continue to Booking (${calculateNights()} nights)`}
          </Button>
        )}

        <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Authentication Required</AlertDialogTitle>
              <AlertDialogDescription>
                You need to be logged in to make a reservation. Would you like
                to go to the login page?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => router.push("/login")}>
                Go to Login
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
