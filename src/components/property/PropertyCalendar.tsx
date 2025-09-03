// src/components/property/PropertyCalendar.tsx
"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import PriceCalendar from "@/components/myUi/customCalender";
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

  const handleBookingClick = () => {
    if (!propertyId || !selectedRoomTypeId) {
      alert("Please select a property and room type first.");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    if (isAuthenticated) {
      // Prepare reservation data
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

        // Set display data using property information
        setDisplayData({
          propertyName: property.name || "Property",
          propertyType: property.category?.name || "General",
          roomTypeName: selectedRoomType.name,
          basePrice: selectedRoomType.basePrice,
          mainImageUrl: property.pictures?.main?.url || "",
        });

        // Navigate to reservation creation page
        router.push("/reservation");
      }
    } else {
      // Show authentication dialog
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
          {checkInDate && checkOutDate && selectedRoomTypeId && isOwner && (
            <p className="text-red-500">
              • please login to your personal user account to make a reservation
            </p>
          )}
        </div>

        {checkInDate && checkOutDate && selectedRoomTypeId && (
          <Button
            className="w-full"
            onClick={handleBookingClick}
            disabled={authLoading || isOwner}
          >
            {authLoading
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
