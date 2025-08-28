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
} from "@/interface/ownerPropertyInterface";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2 } from "lucide-react";

interface EditPropertyForm {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  propertyType: PropertyType;
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
        address: propertyData.address || "",
        city: propertyData.city || "",
        state: propertyData.state || "",
        country: propertyData.country || "",
        postalCode: propertyData.postalCode || "",
        propertyType: propertyData.propertyType || PropertyType.APARTMENT,
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/my-properties")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold">Edit Properti</h1>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Properti</CardTitle>
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
                  onChange={(e) => handleInputChange("name", e.target.value)}
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
                    handleInputChange("propertyType", value as PropertyType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe properti" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.values(PropertyType) as string[]).map((type) => (
                      <SelectItem key={type} value={type}>
                        {getPropertyTypeLabel(type as PropertyType)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Alamat *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                  required
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">Kota *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Masukkan nama kota"
                  required
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">Provinsi *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Masukkan nama provinsi"
                  required
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Negara *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="Masukkan nama negara"
                  required
                />
              </div>

              {/* Postal Code */}
              <div className="space-y-2">
                <Label htmlFor="postalCode">Kode Pos</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) =>
                    handleInputChange("postalCode", e.target.value)
                  }
                  placeholder="Masukkan kode pos"
                />
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

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/my-properties")}
              >
                Batal
              </Button>
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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProperty;
