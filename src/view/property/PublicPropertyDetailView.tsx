"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropertyMap from "@/components/map/PropertyMap";
import { useAuth } from "@/lib/hooks/useAuth";
import PropertyCalendar from "@/components/property/PropertyCalendar";
import { PropertyDetailSkeleton } from "@/components/sekeleton/PropertySkeleton";
import { MapPin, Users, Home, ArrowLeft, Calendar, Star } from "lucide-react";
import { usePublicPropertyDetail } from "@/service/useProperty";
import type { PublicPropertyDetail } from "@/interface/publicPropertyInterface";
import PropertyReviews from "../review/component/propertyReview";
import Link from "next/link";
import { useReservationStore } from "@/lib/stores/reservationStore";
import { PaymentType } from "@/interface/enumInterface";

interface PublicPropertyDetailProps {
  propertyId: string;
}

export default function PublicPropertyDetail({
  propertyId,
}: PublicPropertyDetailProps) {
  const router = useRouter();
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>("");
  const [selectedDateRange, setSelectedDateRange] = useState<{
    checkIn: string | null;
    checkOut: string | null;
  }>({ checkIn: null, checkOut: null });

  // Use TanStack Query hook
  const {
    data: propertyResponse,
    isLoading: loading,
    error,
  } = usePublicPropertyDetail(propertyId);

  // Extract property from response
  const property = propertyResponse?.success ? propertyResponse.data : null;
  
const { setField, setDisplayData } = useReservationStore();
const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  useEffect(() => {
    if (property && property.roomTypes.length > 0) {
      if (property.rentalType === "WHOLE_PROPERTY") {
        // Auto-select first room type for whole property
        setSelectedRoomTypeId(property.roomTypes[0].id);
      } else if (property.rentalType === "ROOM_BY_ROOM") {
        // For room by room, let user choose or auto-select first available
        const availableRoomType = property.roomTypes.find((rt) =>
          property.rooms.some(
            (room) => room.roomType.id === rt.id && room.isAvailable
          )
        );
        if (availableRoomType) {
          setSelectedRoomTypeId(availableRoomType.id);
        }
      }
    }
  }, [property]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper functions
  const getSelectedRoomType = () => {
    return property?.roomTypes.find((rt) => rt.id === selectedRoomTypeId);
  };

  const getAvailableRoomsForType = (roomTypeId: string) => {
    return (
      property?.rooms.filter(
        (room) => room.roomType.id === roomTypeId && room.isAvailable
      ) || []
    );
  };

  const canUserSelectRoomType = () => {
    return (
      property?.rentalType === "ROOM_BY_ROOM" && property.roomTypes.length > 1
    );
  };

  const getRoomSelectionLabel = () => {
    if (property?.rentalType === "WHOLE_PROPERTY") {
      return "Booking Type: Whole Property";
    }
    return "Select Room Type";
  };

  const getRentalTypeText = (rentalType: string) => {
    switch (rentalType) {
      case "ROOM_BY_ROOM":
        return "Menyewa satu kamar";
      case "WHOLE_PROPERTY":
        return "Menyewa satu unit / sewa 1 properti";
      default:
        return rentalType;
    }
  };

  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  if (error || !property) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "The property you're looking for doesn't exist.";

    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <Button onClick={() => router.push("/properties")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/properties")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-96 w-full overflow-hidden rounded-lg">
                  <Image
                    src={property?.pictures?.main?.url || "/prorent-logo.png"}
                    alt={property?.pictures?.main?.alt || "Property Image"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-gray-900"
                    >
                      {property.category.name}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{property.name}</CardTitle>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{property.location.address}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{property.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Home className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold">{property.rooms.length}</p>
                    <p className="text-sm text-gray-600">Rooms</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold">
                      {property.roomTypes.reduce(
                        (total, rt) => total + rt.capacity,
                        0
                      )}
                    </p>
                    <p className="text-sm text-gray-600">Max Guests</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold">{property.location.city}</p>
                    <p className="text-sm text-gray-600">City</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold">
                      {formatDate(property.createdAt)}
                    </p>
                    <p className="text-sm text-gray-600">Listed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {property.location.address}
                  </p>
                  <p>
                    <span className="font-semibold">City:</span>{" "}
                    {property.location.city}
                  </p>
                  <p>
                    <span className="font-semibold">Province:</span>{" "}
                    {property.location.province}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            {property.location.coordinates && (
              <Card>
                <CardHeader>
                  <CardTitle>Property Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <PropertyMap
                    latitude={property.location.coordinates.latitude}
                    longitude={property.location.coordinates.longitude}
                    propertyName={property.name}
                    address={property.location.address}
                  />
                  <div className="mt-4 text-sm text-gray-600">
                    <p>
                      📍 Click on the map to center the view on the property
                      location.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Room Types - Show First */}
            <Card>
              <CardHeader>
                <CardTitle>Available Room Types</CardTitle>
                <p className="text-sm text-gray-600">
                  Choose from our different room categories, each with multiple
                  units available
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {property.roomTypes.map((roomType) => (
                    <div
                      key={roomType.id}
                      className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {roomType.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>Max {roomType.capacity} guests</span>
                            </div>
                            <div className="flex items-center">
                              <Home className="h-4 w-4 mr-1" />
                              <span>
                                {roomType.totalQuantity} units available
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            {formatPrice(roomType.basePrice)}
                          </p>
                          <p className="text-sm text-gray-600">per night</p>
                        </div>
                      </div>
                      {roomType.description && (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {roomType.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Individual Rooms - Show rooms within each type */}
            {property.rooms && property.rooms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Individual Room Units</CardTitle>
                  <p className="text-sm text-gray-600">
                    Browse specific room units and their current availability
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Group rooms by room type */}
                    {property.roomTypes.map((roomType) => {
                      const roomsOfType = property.rooms.filter(
                        (room) => room.roomType.id === roomType.id
                      );

                      if (roomsOfType.length === 0) return null;

                      return (
                        <div key={roomType.id} className="space-y-4">
                          <div className="flex items-center justify-between border-b pb-2">
                            <h4 className="font-semibold text-lg text-gray-900">
                              {roomType.name} Units
                            </h4>
                            <Badge variant="outline" className="text-blue-600">
                              {roomsOfType.length} unit(s)
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {roomsOfType.map((room) => (
                              <div
                                key={room.id}
                                className="border rounded-lg p-4 bg-white"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <h5 className="font-medium text-gray-900">
                                    {room.name}
                                  </h5>
                                  <Badge
                                    variant={
                                      room.isAvailable ? "default" : "secondary"
                                    }
                                    className={
                                      room.isAvailable
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }
                                  >
                                    {room.isAvailable
                                      ? "Available"
                                      : "Not Available"}
                                  </Badge>
                                </div>

                                {room.pictures && room.pictures.length > 0 && (
                                  <div className="grid grid-cols-2 gap-2 mb-3">
                                    {room.pictures
                                      .slice(0, 4)
                                      .map((picture) => (
                                        <div
                                          key={picture.id}
                                          className="relative h-20 rounded overflow-hidden"
                                        >
                                          <Image
                                            src={picture.url}
                                            alt={picture.alt}
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                      ))}
                                  </div>
                                )}

                                <div className="text-sm text-gray-600 space-y-1">
                                  <p>
                                    Capacity: {room.roomType.capacity} guests
                                  </p>
                                  <p className="font-medium text-blue-600">
                                    {formatPrice(room.roomType.basePrice)} per
                                    night
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking and Calendar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Room Selection & Booking */}
            <Card>
              <CardHeader>
                <CardTitle>Book This Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pricing Display */}
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {getSelectedRoomType()
                      ? formatPrice(getSelectedRoomType()?.basePrice!)
                      : (() => {
                          const prices = property.roomTypes.map(
                            (rt) => rt.basePrice
                          );
                          const minPrice = Math.min(...prices);
                          const maxPrice = Math.max(...prices);
                          return minPrice === maxPrice
                            ? formatPrice(minPrice)
                            : `${formatPrice(minPrice)} - ${formatPrice(
                                maxPrice
                              )}`;
                        })()}
                  </p>
                  <p className="text-gray-600">per night</p>
                </div>

                {/* Room Type Selection */}
                <div>
                  <Label htmlFor="roomType" className="text-sm font-medium">
                    {getRoomSelectionLabel()}
                  </Label>
                  {canUserSelectRoomType() ? (
                    <Select
                      value={selectedRoomTypeId || ""}
                      onValueChange={setSelectedRoomTypeId}
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Pilih tipe kamar" />
                      </SelectTrigger>
                      <SelectContent>
                        {property?.roomTypes.map((roomType) => (
                          <SelectItem key={roomType.id} value={roomType.id}>
                            <div className="flex justify-between items-center w-full">
                              <span>{roomType.name}</span>
                              <span className="text-sm text-gray-500 ml-2">
                                ({getAvailableRoomsForType(roomType.id).length}{" "}
                                tersedia)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      <span className="text-sm font-medium text-gray-900">
                        {getSelectedRoomType()?.name || "Loading..."}
                      </span>
                      {property?.rentalType === "WHOLE_PROPERTY" && (
                        <span className="text-xs text-gray-500 block mt-1">
                          Sewa seluruh properti
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Room Type Details */}
                {getSelectedRoomType() && (
                  <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kapasitas:</span>
                        <span className="font-medium">
                          {getSelectedRoomType()?.capacity} orang
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kamar tersedia:</span>
                        <span className="font-medium">
                          {getAvailableRoomsForType(selectedRoomTypeId!).length}
                        </span>
                      </div>
                      {getSelectedRoomType()?.description && (
                        <div className="mt-2">
                          <span className="text-gray-600 text-xs">
                            Deskripsi:
                          </span>
                          <p className="text-xs text-gray-700 mt-1">
                            {getSelectedRoomType()?.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Date Selection */}
                <div>
                  <Label htmlFor="dateRange" className="text-sm font-medium">
                    Tanggal Check-in & Check-out
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <Input
                        type="date"
                        placeholder="Check-in"
                        className="w-full"
                        min={new Date().toISOString().split("T")[0]}
                        value={selectedDateRange?.checkIn || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSelectedDateRange((prev) => ({
                            ...prev,
                            checkIn: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Input
                        type="date"
                        placeholder="Check-out"
                        className="w-full"
                        min={
                          selectedDateRange?.checkIn ||
                          new Date().toISOString().split("T")[0]
                        }
                        value={selectedDateRange?.checkOut || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSelectedDateRange((prev) => ({
                            ...prev,
                            checkOut: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Total Calculation */}
                {selectedDateRange?.checkIn &&
                  selectedDateRange?.checkOut &&
                  getSelectedRoomType() && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>
                          {formatPrice(getSelectedRoomType()?.basePrice!)} x{" "}
                          {Math.ceil(
                            (new Date(selectedDateRange.checkOut).getTime() -
                              new Date(selectedDateRange.checkIn).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          malam
                        </span>
                        <span>
                          {formatPrice(
                            getSelectedRoomType()?.basePrice! *
                              Math.ceil(
                                (new Date(
                                  selectedDateRange.checkOut
                                ).getTime() -
                                  new Date(
                                    selectedDateRange.checkIn
                                  ).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-blue-600">
                          {formatPrice(
                            getSelectedRoomType()?.basePrice! *
                              Math.ceil(
                                (new Date(
                                  selectedDateRange.checkOut
                                ).getTime() -
                                  new Date(
                                    selectedDateRange.checkIn
                                  ).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                {/* Booking Actions */}
                <div className="space-y-2 pt-2">
                  <Alert className="mb-3">
                    <AlertDescription className="text-xs">
                      Untuk melakukan reservasi, silakan login atau daftar akun
                      terlebih dahulu.
                    </AlertDescription>
                  </Alert>

  {/* Conditional Buttons */}
  <div className="space-y-2">
    {isAuthenticated ? (
<Button
  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
  onClick={() => {
    const firstRoomType = property.roomTypes[0];

    // Set initial reservation form data
setField("userId", user.id); // if available, or set later
setField("propertyId", property.id);
setField("roomTypeId", firstRoomType.id);
setField("paymentType", PaymentType.MANUAL_TRANSFER);

// 🖼️ Set display-only data
setDisplayData({
  propertyName: property.name,
  propertyType: property.category.name,
  roomTypeName: firstRoomType.name,
  basePrice: firstRoomType.basePrice,
  mainImageUrl: property.pictures?.main?.url || "",
});
    router.push("/reservation");
  }}
>
  🛏️ Make Reservation
</Button>
    ) : (
      <>
        <Button
          className="w-full"
          onClick={() => router.push("/login")}
        >
          Login to Book
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push("/register")}
        >
          Register New Account
        </Button>
      </>
    )}
  </div>

                {/* Additional Info */}
                <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
                  <p>• Pembatalan gratis hingga 24 jam</p>
                  <p>• Konfirmasi booking instan</p>
                  <p>• Customer support 24/7</p>
                </div>
              </CardContent>
            </Card>

            {/* Calendar for Date Selection */}
            <PropertyCalendar
              propertyId={propertyId}
              onDateSelect={(dateRange) => {
                if (dateRange) {
                  setSelectedDateRange({
                    checkIn:
                      dateRange.from?.toISOString().split("T")[0] || null,
                    checkOut: dateRange.to?.toISOString().split("T")[0] || null,
                  });
                }
              }}
            />

            {/* Property Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Properti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipe Properti:</span>
                    <span className="font-medium">
                      {property?.category?.name || "Tidak ditentukan"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mode Sewa:</span>
                    <span className="font-medium">
                      {property?.rentalType === "WHOLE_PROPERTY"
                        ? "Seluruh Properti"
                        : "Per Kamar"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Kamar:</span>
                    <span className="font-medium">
                      {property?.rooms.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kamar Tersedia:</span>
                    <span className="font-medium text-green-600">
                      {
                        property?.rooms.filter((room) => room.isAvailable)
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipe Kamar:</span>
                    <span className="font-medium">
                      {property?.roomTypes.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <PropertyReviews propertyId={property.id} />
    </div>
  );
}
