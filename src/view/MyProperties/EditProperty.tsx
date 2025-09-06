"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  useOwnerPropertyDetail,
  useUpdateOwnerProperty,
} from "@/service/useOwnerProperty";
import {
  OwnerProperty,
  PropertyType,
  OwnerRoom,
  OwnerRoomType,
  formatPrice,
  getRentalTypeDisplay,
} from "@/interface/ownerPropertyInterface";
import { Skeleton } from "@/components/ui/skeleton";
import { LocationSearchMap, LocationData } from "@/components/map";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Home,
  Users,
  Calendar,
  MapPin,
  Edit,
  Plus,
  Bed,
  Eye,
  ImageIcon,
} from "lucide-react";

interface EditPropertyForm {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  propertyType: PropertyType;
  latitude: string;
  longitude: string;
}

const EditProperty = () => {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [formData, setFormData] = useState<EditPropertyForm>({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    propertyType: PropertyType.APARTMENT,
    latitude: "",
    longitude: "",
  });

  const {
    data: property,
    isLoading: isLoadingProperty,
    error: propertyError,
  } = useOwnerPropertyDetail(propertyId);

  const updatePropertyMutation = useUpdateOwnerProperty();

  useEffect(() => {
    if (property?.data) {
      const propertyData = property.data;
      setFormData({
        name: propertyData.name || "",
        description: propertyData.description || "",
        address: propertyData.location?.address || propertyData.address || "",
        city: propertyData.location?.city?.name || propertyData.city || "",
        state:
          propertyData.location?.city?.province?.name ||
          propertyData.state ||
          "",
        country: propertyData.country || "Indonesia",
        postalCode: propertyData.postalCode || "",
        propertyType: propertyData.propertyType || PropertyType.APARTMENT,
        latitude: propertyData.location?.latitude || "",
        longitude: propertyData.location?.longitude || "",
      });
    }
  }, [property]);

  const handleInputChange = (field: keyof EditPropertyForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updatePropertyMutation.mutateAsync({
        id: propertyId,
        data: formData,
      });

      toast.success("Properti berhasil diperbarui!");
      router.push("/my-properties");
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Gagal memperbarui properti!");
    }
  };

  const handleLocationSelect = (locationData: LocationData) => {
    setFormData((prev) => ({
      ...prev,
      address: locationData.address,
      city: locationData.city,
      state: locationData.province,
      latitude: locationData.latitude.toString(),
      longitude: locationData.longitude.toString(),
    }));
  };

  const getPropertyTypeLabel = (type: PropertyType): string => {
    const labels = {
      [PropertyType.APARTMENT]: "Apartemen",
      [PropertyType.HOUSE]: "Rumah",
      [PropertyType.VILLA]: "Villa",
      [PropertyType.GUEST_HOUSE]: "Guest House",
      [PropertyType.HOTEL]: "Hotel",
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoadingProperty) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="h-8 w-64" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (propertyError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Error Loading Property
              </h3>
              <p className="text-gray-600 mb-4">
                Gagal memuat data properti. Silakan coba lagi.
              </p>
              <Button
                onClick={() => router.push("/my-properties")}
                variant="outline"
              >
                Kembali ke My Properties
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/my-properties")}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke My Properties
          </Button>
          <div className="flex items-center text-sm text-gray-600 space-x-2">
            <Link href="/my-properties" className="hover:text-blue-600">
              My Properties
            </Link>
            <span>/</span>
            <span className="text-gray-900">
              Edit {property?.data?.name || "Property"}
            </span>
          </div>
        </div>
      </div>

      {property?.data ? (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Property Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold mb-2">
                        {property.data.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {property.data.location?.city?.name},{" "}
                          {property.data.location?.city?.province?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {property.data.category?.name}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {property.data.rentalType &&
                            getRentalTypeDisplay(property.data.rentalType)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/my-properties/${propertyId}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Detail
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative h-64 w-full overflow-hidden rounded-lg mb-4">
                    <Image
                      src={
                        property.data.mainPicture?.url || "/prorent-logo.png"
                      }
                      alt={property.data.mainPicture?.alt || "Property Image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {property.data.description}
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
                      <div className="text-2xl font-bold text-blue-900">
                        {property.data.roomTypes?.length || 0}
                      </div>
                      <div className="text-sm text-blue-700">Tipe Kamar</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Bed className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold text-green-900">
                        {property.data.rooms?.length || 0}
                      </div>
                      <div className="text-sm text-green-700">Total Kamar</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold text-purple-900">
                        {property.data.rooms?.filter((room) => room.isAvailable)
                          ?.length || 0}
                      </div>
                      <div className="text-sm text-purple-700">
                        Kamar Tersedia
                      </div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                      <div className="text-2xl font-bold text-orange-900">
                        {property.data.createdAt &&
                          formatDate(property.data.createdAt)}
                      </div>
                      <div className="text-sm text-orange-700">Dibuat</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Room Types */}
              {property.data.roomTypes &&
                property.data.roomTypes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Tipe Kamar</CardTitle>
                        <Link
                          href={`/my-properties/${propertyId}/room-types/create`}
                        >
                          <Button size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Tipe Kamar
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {property.data.roomTypes.map(
                          (roomType: OwnerRoomType) => (
                            <div
                              key={roomType.id}
                              className="border rounded-lg p-4 bg-white"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-lg">
                                    {roomType.name}
                                  </h4>
                                  <p className="text-gray-600 text-sm">
                                    {roomType.description}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">
                                    {formatPrice(roomType.basePrice)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    per malam
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">
                                    Kapasitas:
                                  </span>
                                  <span className="ml-1 font-medium">
                                    {roomType.capacity} orang
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">
                                    Total Kamar:
                                  </span>
                                  <span className="ml-1 font-medium">
                                    {roomType.totalQuantity}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Tipe:</span>
                                  <span className="ml-1 font-medium">
                                    {roomType.isWholeUnit
                                      ? "Unit Penuh"
                                      : "Per Kamar"}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Link
                                    href={`/my-properties/${propertyId}/room-types/${roomType.id}/edit`}
                                  >
                                    <Button size="sm" variant="outline">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Rooms */}
              {property.data.rooms && property.data.rooms.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Daftar Kamar</CardTitle>
                      <Link href={`/my-properties/${propertyId}/rooms/create`}>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Kamar
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.data.rooms.map((room: OwnerRoom) => (
                        <div
                          key={room.id}
                          className="border rounded-lg p-4 bg-white"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{room.name}</h4>
                              <p className="text-sm text-gray-600">
                                {room.roomType?.name}
                              </p>
                            </div>
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                room.isAvailable
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {room.isAvailable ? "Tersedia" : "Tidak Tersedia"}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            <div>
                              Harga:{" "}
                              <span className="font-medium text-green-600">
                                {room.roomType &&
                                  formatPrice(room.roomType.basePrice)}
                              </span>
                            </div>
                            <div>
                              Kapasitas:{" "}
                              <span className="font-medium">
                                {room.roomType?.capacity} orang
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={`/my-properties/${propertyId}/rooms/${room.id}/edit`}
                            >
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Edit Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Edit Informasi Properti</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Property Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Properti *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Masukkan nama properti"
                          required
                        />
                      </div>

                      {/* Property Type */}
                      <div className="space-y-2">
                        <Label htmlFor="propertyType">Tipe Properti *</Label>
                        <Select
                          value={formData.propertyType}
                          onValueChange={(value) =>
                            handleInputChange(
                              "propertyType",
                              value as PropertyType
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe properti" />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.values(PropertyType) as string[]).map(
                              (type) => (
                                <SelectItem key={type} value={type}>
                                  {getPropertyTypeLabel(type as PropertyType)}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Deskripsi</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Masukkan deskripsi properti"
                        rows={4}
                      />
                    </div>

                    {/* Location Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2 lg:col-span-3">
                        <Label htmlFor="address">Alamat *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          placeholder="Masukkan alamat lengkap"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">Kota *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          placeholder="Masukkan nama kota"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">Provinsi *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) =>
                            handleInputChange("state", e.target.value)
                          }
                          placeholder="Masukkan nama provinsi"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Negara *</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) =>
                            handleInputChange("country", e.target.value)
                          }
                          placeholder="Masukkan nama negara"
                          required
                        />
                      </div>
                    </div>

                    {/* Location Search Map */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">
                        Update Lokasi di Peta
                      </Label>
                      <p className="text-sm text-gray-600">
                        Gunakan peta di bawah untuk mencari dan memperbarui
                        lokasi properti Anda. Anda dapat mencari berdasarkan
                        alamat atau klik langsung di peta.
                      </p>
                      <LocationSearchMap
                        onLocationSelect={handleLocationSelect}
                        initialLocation={
                          formData.latitude && formData.longitude
                            ? {
                                address: formData.address || "",
                                city: formData.city || "",
                                province: formData.state || "",
                                latitude: parseFloat(formData.latitude || "0"),
                                longitude: parseFloat(
                                  formData.longitude || "0"
                                ),
                              }
                            : undefined
                        }
                        className="mt-2"
                      />
                    </div>

                    {/* Coordinates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude (Opsional)</Label>
                        <Input
                          id="latitude"
                          value={formData.latitude}
                          onChange={(e) =>
                            handleInputChange("latitude", e.target.value)
                          }
                          placeholder="e.g., -8.4095"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude (Opsional)</Label>
                        <Input
                          id="longitude"
                          value={formData.longitude}
                          onChange={(e) =>
                            handleInputChange("longitude", e.target.value)
                          }
                          placeholder="e.g., 115.1889"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                      <Button
                        type="submit"
                        disabled={updatePropertyMutation.isPending}
                        className="gap-2"
                      >
                        {updatePropertyMutation.isPending && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        Simpan Perubahan
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/my-properties")}
                      >
                        Batal
                      </Button>
                    </div>
                  </form>
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
                  <Link href={`/my-properties/${propertyId}`} className="block">
                    <Button variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Lihat Detail Properti
                    </Button>
                  </Link>
                  <Link
                    href={`/my-properties/${propertyId}/rooms`}
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      <Bed className="w-4 h-4 mr-2" />
                      Kelola Kamar
                    </Button>
                  </Link>
                  <Link
                    href={`/my-properties/${propertyId}/gallery`}
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Kelola Galeri
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Property Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Properti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Kategori:</span>
                    <span className="font-medium">
                      {property.data.category?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tipe Sewa:</span>
                    <span className="font-medium">
                      {property.data.rentalType &&
                        getRentalTypeDisplay(property.data.rentalType)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dibuat:</span>
                    <span className="font-medium">
                      {property.data.createdAt &&
                        formatDate(property.data.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Terakhir Update:</span>
                    <span className="font-medium">
                      {property.data.updatedAt &&
                        formatDate(property.data.updatedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Location Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Lokasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 block">Alamat:</span>
                    <span className="font-medium">
                      {property.data.location?.address}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Kota:</span>
                    <span className="font-medium">
                      {property.data.location?.city?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Provinsi:</span>
                    <span className="font-medium">
                      {property.data.location?.city?.province?.name}
                    </span>
                  </div>
                  {property.data.location?.latitude &&
                    property.data.location?.longitude && (
                      <div>
                        <span className="text-gray-500 block">Koordinat:</span>
                        <span className="font-medium text-xs">
                          {property.data.location.latitude},{" "}
                          {property.data.location.longitude}
                        </span>
                      </div>
                    )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Loading property data...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EditProperty;
