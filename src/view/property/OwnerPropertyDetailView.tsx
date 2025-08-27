"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Users,
  Home,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  Loader2,
  Calendar,
  DollarSign,
  Eye,
  Settings,
} from "lucide-react";
import { OwnerProperty } from "@/interface/ownerPropertyInterface";
import { ownerPropertyService } from "@/service/ownerPropertyService";

interface OwnerPropertyDetailViewProps {
  propertyId: string;
}

export function OwnerPropertyDetailView({
  propertyId,
}: OwnerPropertyDetailViewProps) {
  const router = useRouter();
  const [property, setProperty] = useState<OwnerProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPropertyDetail();
  }, [propertyId]);

  const fetchPropertyDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ownerPropertyService.getPropertyById(propertyId);

      if (response.success) {
        setProperty(response.data);
      } else {
        setError(response.message || "Failed to fetch property details");
      }
    } catch (err: any) {
      console.error("Error fetching property detail:", err);

      if (err.response?.status === 404) {
        setError("Property not found");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to view this property");
      } else if (err.response?.status === 401) {
        setError("Please login to view your properties");
        router.push("/login");
      } else if (err.code === "ECONNREFUSED") {
        setError(
          "Unable to connect to server. Please check if the backend is running."
        );
      } else {
        setError("Failed to fetch property details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseInt(price));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPriceRange = () => {
    if (!property?.roomTypes || property.roomTypes.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = property.roomTypes.map((rt) => parseInt(rt.basePrice));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  const getAvailableRooms = () => {
    return property?.rooms.filter((room) => room.isAvailable) || [];
  };

  const handleDeleteProperty = async () => {
    if (!property) return;

    if (
      !confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await ownerPropertyService.deleteProperty(property.id);
      if (response.success) {
        alert("Property deleted successfully");
        router.push("/my-properties");
      } else {
        alert(response.message || "Failed to delete property");
      }
    } catch (err: any) {
      console.error("Error deleting property:", err);
      alert(err.response?.data?.message || "Failed to delete property");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Alert className="border-red-200 bg-red-50 max-w-2xl mx-auto">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Button
              onClick={() => router.push("/my-properties")}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Property Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The property you are looking for does not exist.
            </p>
            <Button
              onClick={() => router.push("/my-properties")}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const priceRange = getPriceRange();
  const availableRooms = getAvailableRooms();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => router.push("/my-properties")}
            variant="ghost"
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Properties
          </Button>
          <div className="flex items-center text-sm text-gray-600 space-x-2">
            <Link href="/my-properties" className="hover:text-blue-600">
              My Properties
            </Link>
            <span>/</span>
            <span className="text-gray-900">{property.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {property.name}
                    </CardTitle>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {property.location.city.name},{" "}
                        {property.location.city.province.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">
                        {property.category.name}
                      </Badge>
                      <Badge
                        variant={
                          property.rentalType === "WHOLE_PROPERTY"
                            ? "default"
                            : "outline"
                        }
                      >
                        {property.rentalType === "WHOLE_PROPERTY"
                          ? "Whole Property"
                          : "Room by Room"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/properties/${property.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Public View
                      </Button>
                    </Link>
                    <Link href={`/my-properties/${property.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeleteProperty}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative h-64 w-full overflow-hidden rounded-lg mb-4">
                  <Image
                    src={property?.mainPicture?.url || "/prorent-logo.png"}
                    alt={property?.mainPicture?.alt || "Property Image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Property Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Property Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Home className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">
                      {property.rooms.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Rooms</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">
                      {availableRooms.length}
                    </div>
                    <div className="text-sm text-gray-600">Available</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Settings className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-purple-600">
                      {property.roomTypes.length}
                    </div>
                    <div className="text-sm text-gray-600">Room Types</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold text-orange-600">
                      {property._count?.Reservation || 0}
                    </div>
                    <div className="text-sm text-gray-600">Bookings</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Room Types Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Room Types</CardTitle>
                  <Link
                    href={`/my-properties/${property.id}/room-types/create`}
                  >
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Room Type
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {property.roomTypes.map((roomType) => (
                    <div
                      key={roomType.id}
                      className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg">
                          {roomType.name}
                        </h4>
                        <div className="flex gap-2">
                          <Link
                            href={`/my-properties/${property.id}/room-types/${roomType.id}/edit`}
                          >
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Price:</span>
                          <div className="font-semibold text-blue-600">
                            {formatPrice(roomType.basePrice)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Capacity:</span>
                          <div className="font-semibold">
                            {roomType.capacity} guests
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Quantity:</span>
                          <div className="font-semibold">
                            {roomType.totalQuantity} rooms
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <div className="font-semibold">
                            {roomType.isWholeUnit ? "Whole Unit" : "Individual"}
                          </div>
                        </div>
                      </div>

                      {roomType.description && (
                        <p className="text-gray-700 text-sm mt-3">
                          {roomType.description}
                        </p>
                      )}
                    </div>
                  ))}

                  {property.roomTypes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="mb-4">No room types created yet</p>
                      <Link
                        href={`/my-properties/${property.id}/room-types/create`}
                      >
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Room Type
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/properties/${property.id}`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    View Public Page
                  </Button>
                </Link>
                <Link
                  href={`/my-properties/${property.id}/edit`}
                  className="block"
                >
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Property
                  </Button>
                </Link>
                <Link
                  href={`/my-properties/${property.id}/rooms`}
                  className="block"
                >
                  <Button variant="outline" className="w-full justify-start">
                    <Home className="w-4 h-4 mr-2" />
                    Manage Rooms
                  </Button>
                </Link>
                <Link
                  href={`/my-properties/${property.id}/gallery`}
                  className="block"
                >
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Gallery
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Revenue Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      Price Range
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {priceRange.min === priceRange.max
                        ? formatPrice(priceRange.min.toString())
                        : `${formatPrice(
                            priceRange.min.toString()
                          )} - ${formatPrice(priceRange.max.toString())}`}
                    </div>
                    <div className="text-sm text-gray-500">per night</div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Bookings:</span>
                      <span className="font-semibold">
                        {property._count?.Reservation || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Occupancy Rate:</span>
                      <span className="font-semibold">
                        {property.rooms.length > 0
                          ? `${Math.round(
                              (availableRooms.length / property.rooms.length) *
                                100
                            )}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property ID:</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {property.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span>{formatDate(property.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span>{formatDate(property.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span>{property.location.city.name}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
