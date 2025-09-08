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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
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
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const PropertyMap = dynamic(() => import("@/components/map/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
});

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
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "property" | "roomType";
    id: string;
    name: string;
  }>({ open: false, type: "property", id: "", name: "" });
  const [isDeleting, setIsDeleting] = useState(false);

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
    return property?.rooms?.filter((room) => room.isAvailable) || [];
  };

  const handleDeleteProperty = () => {
    if (!property) return;
    setDeleteDialog({
      open: true,
      type: "property",
      id: property.id,
      name: property.name,
    });
  };

  const handleDeleteRoomType = (roomTypeId: string, roomTypeName: string) => {
    setDeleteDialog({
      open: true,
      type: "roomType",
      id: roomTypeId,
      name: roomTypeName,
    });
  };

  const confirmDelete = async () => {
    if (!property || !deleteDialog.id || isDeleting) return;

    setIsDeleting(true);
    try {
      if (deleteDialog.type === "property") {
        const response = await ownerPropertyService.deleteProperty(property.id);
        if (response.success) {
          toast.success("Property deleted successfully");
          router.push("/my-properties");
        } else {
          toast.error(response.message || "Failed to delete property");
        }
      } else if (deleteDialog.type === "roomType") {
        const response = await ownerPropertyService.deleteRoomType(
          property.id,
          deleteDialog.id
        );
        if (response.success) {
          toast.success("Room type deleted successfully");
          fetchPropertyDetail();
        } else {
          toast.error(response.message || "Failed to delete room type");
        }
      }
    } catch (err: any) {
      console.error("Error deleting:", err);
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ open: false, type: "property", id: "", name: "" });
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
                        {property.location?.city?.name},{" "}
                        {property.location?.city?.province?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">
                        {property.category?.name}
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
                      {property.rooms?.length || 0}
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
                      {property.roomTypes?.length || 0}
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
                  {property.roomTypes?.map((roomType) => (
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
                            onClick={() =>
                              handleDeleteRoomType(roomType.id, roomType.name)
                            }
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

                  {property.roomTypes?.length === 0 && (
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

            {/* Rooms Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Rooms</CardTitle>
                  <Link href={`/my-properties/${property.id}/rooms`}>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Room
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.rooms?.map((room) => (
                    <div
                      key={room.id}
                      className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{room.name}</h4>
                          <p className="text-sm text-gray-600">
                            {room.roomType?.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              room.isAvailable ? "default" : "destructive"
                            }
                            className={
                              room.isAvailable
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : ""
                            }
                          >
                            {room.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                          <div className="flex gap-1">
                            <Link
                              href={`/my-properties/${property.id}/rooms/${room.id}/edit`}
                            >
                              <Button variant="outline" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Add delete room functionality if needed
                                toast.info(
                                  "Delete room functionality to be implemented"
                                );
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Price per night:
                          </span>
                          <span className="font-semibold text-green-600">
                            {room.roomType
                              ? formatPrice(room.roomType.basePrice)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="font-semibold">
                            {room.roomType?.capacity} guests
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-semibold">
                            {room.roomType?.isWholeUnit
                              ? "Whole Unit"
                              : "Individual Room"}
                          </span>
                        </div>
                        {room.roomType?.description && (
                          <div className="pt-2 border-t">
                            <p className="text-gray-700 text-xs">
                              {room.roomType.description}
                            </p>
                          </div>
                        )}
                      </div>

                      {room.gallery && room.gallery.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-gray-500 mb-2">
                            Room Gallery ({room.gallery.length} images)
                          </p>
                          <div className="flex gap-1 overflow-x-auto">
                            {room.gallery
                              .slice(0, 3)
                              .map((galleryItem: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex-shrink-0 w-12 h-12 rounded overflow-hidden"
                                >
                                  <Image
                                    src={
                                      galleryItem.picture?.url ||
                                      "/prorent-logo.png"
                                    }
                                    alt={
                                      galleryItem.picture?.alt ||
                                      `Room image ${index + 1}`
                                    }
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              ))}
                            {room.gallery.length > 3 && (
                              <div className="flex-shrink-0 w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                                +{room.gallery.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {property.rooms?.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="mb-4">No rooms created yet</p>
                      <p className="text-sm mb-4 text-gray-400">
                        Create room types first, then add individual rooms
                      </p>
                      <div className="flex gap-2 justify-center">
                        {(property.roomTypes?.length || 0) === 0 ? (
                          <Link
                            href={`/my-properties/${property.id}/room-types/create`}
                          >
                            <Button>
                              <Plus className="w-4 h-4 mr-2" />
                              Create Room Type First
                            </Button>
                          </Link>
                        ) : (
                          <Link
                            href={`/my-properties/${property.id}/rooms/create`}
                          >
                            <Button>
                              <Plus className="w-4 h-4 mr-2" />
                              Create First Room
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gallery Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Property Gallery</CardTitle>
                  <Link href={`/my-properties/${property.id}/gallery`}>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Manage Gallery
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {property.gallery && property.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {property.gallery.map((galleryItem, index) => (
                      <div
                        key={galleryItem.pictureId}
                        className="relative group"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={galleryItem.picture.url}
                            alt={galleryItem.picture.alt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                        </div>
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-o  pacity duration-200">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="bg-white bg-opacity-90 hover:bg-opacity-100"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded truncate">
                            {galleryItem.picture.alt}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="mb-4">No images in gallery yet</p>
                    <p className="text-sm mb-4 text-gray-400">
                      Add images to showcase your property
                    </p>
                    <Link href={`/my-properties/${property.id}/gallery`}>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Images
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card>
              <CardHeader>
                <CardTitle>Property Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Address Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Address
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {property.location?.address}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-gray-500">City:</span>
                            <span className="ml-2 font-medium">
                              {property.location?.city?.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Province:</span>
                            <span className="ml-2 font-medium">
                              {property.location?.city?.province?.name}
                            </span>
                          </div>
                          {property.location?.latitude &&
                            property.location?.longitude && (
                              <div className="col-span-2">
                                <span className="text-gray-500">
                                  Coordinates:
                                </span>
                                <span className="ml-2 font-mono text-xs bg-gray-200 px-1 rounded">
                                  {property.location.latitude},{" "}
                                  {property.location.longitude}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Map */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">
                      Interactive Map
                    </h4>
                    <p className="text-sm text-gray-600">
                      Exact location of {property.name} on the map
                    </p>
                    {property.location?.latitude &&
                    property.location?.longitude &&
                    !isNaN(parseFloat(property.location.latitude)) &&
                    !isNaN(parseFloat(property.location.longitude)) ? (
                      <PropertyMap
                        latitude={parseFloat(property.location.latitude)}
                        longitude={parseFloat(property.location.longitude)}
                        propertyName={property.name}
                        address={property.location?.address ?? ""}
                      />
                    ) : (
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600">
                            Location coordinates not available
                          </p>
                          <p className="text-sm text-gray-500">
                            Please update the property location to display the
                            map
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
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
                        {property.rooms?.length && property.rooms.length > 0
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
                  <span>{property.location?.city?.name}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deleteDialog.type === "property"
                ? "Delete Property"
                : "Delete Room Type"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{deleteDialog.name}"</span>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog((prev) => ({ ...prev, open: false }))
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
