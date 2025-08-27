"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PropertyMap from "@/components/map/PropertyMap";
import {
  MapPin,
  Users,
  Home,
  ArrowLeft,
  Loader2,
  Calendar,
  Star,
} from "lucide-react";
import { publicPropertyService } from "@/service/publicPropertyService";
import type { PublicPropertyDetail } from "@/interface/publicPropertyInterface";

interface PublicPropertyDetailProps {
  propertyId: string;
}

export default function PublicPropertyDetail({
  propertyId,
}: PublicPropertyDetailProps) {
  const router = useRouter();
  const [property, setProperty] = useState<PublicPropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPropertyDetail();
  }, [propertyId]);

  const fetchPropertyDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await publicPropertyService.getPublicPropertyById(
        propertyId
      );

      if (response.success) {
        setProperty(response.data);
      } else {
        setError("Property not found");
      }
    } catch (err) {
      console.error("Error fetching property detail:", err);
      setError("Failed to fetch property details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The property you're looking for doesn't exist."}
          </p>
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
                    src={property.pictures.main.url}
                    alt={property.pictures.main.alt}
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

            {/* Room Types */}
            <Card>
              <CardHeader>
                <CardTitle>Available Room Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {property.roomTypes.map((roomType) => (
                    <div
                      key={roomType.id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">
                          {roomType.name}
                        </h3>
                        <div className="text-right">
                          <p className="text-xl font-bold text-blue-600">
                            {formatPrice(roomType.basePrice)}
                          </p>
                          <p className="text-sm text-gray-600">per night</p>
                        </div>
                      </div>
                      {roomType.description && (
                        <p className="text-gray-700 mb-3">
                          {roomType.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Max {roomType.capacity} guests</span>
                        </div>
                        <div className="flex items-center">
                          <Home className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{roomType.totalQuantity} units available</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rooms Gallery */}
            {property.rooms && property.rooms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Room Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {property.rooms.map((room) => (
                      <div key={room.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-lg">{room.name}</h3>
                          <Badge
                            variant={room.isAvailable ? "default" : "secondary"}
                            className={
                              room.isAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {room.isAvailable ? "Available" : "Not Available"}
                          </Badge>
                        </div>
                        {room.pictures && room.pictures.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {room.pictures.map((picture) => (
                              <div
                                key={picture.id}
                                className="relative h-32 rounded-lg overflow-hidden"
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
                        <div className="mt-3 text-sm text-gray-600">
                          <p>Type: {room.roomType.name}</p>
                          <p>Capacity: {room.roomType.capacity} guests</p>
                          <p>
                            Price: {formatPrice(room.roomType.basePrice)} per
                            night
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {(() => {
                      const prices = property.roomTypes.map(
                        (rt) => rt.basePrice
                      );
                      const minPrice = Math.min(...prices);
                      const maxPrice = Math.max(...prices);
                      return minPrice === maxPrice
                        ? formatPrice(minPrice)
                        : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
                    })()}
                  </p>
                  <p className="text-gray-600">per night</p>
                </div>

                <Alert>
                  <AlertDescription>
                    To make a reservation, please register or login to your
                    account first.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
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
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Free cancellation up to 24 hours</p>
                  <p>• Instant booking confirmation</p>
                  <p>• 24/7 customer support</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
