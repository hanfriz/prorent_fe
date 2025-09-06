"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  OwnerRoomType,
  UpdateRoomTypeRequest,
} from "@/interface/ownerPropertyInterface";
import { ownerPropertyService } from "@/service/ownerPropertyService";
import PeakRateManager from "@/components/PeakRateManager";

interface EditRoomTypeForm {
  name: string;
  description: string;
  basePrice: string;
  capacity: number;
  totalQuantity: number;
  isWholeUnit: boolean;
}

const EditRoomType = () => {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const roomTypeId = params.roomTypeId as string;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<EditRoomTypeForm>({
    name: "",
    description: "",
    basePrice: "",
    capacity: 1,
    totalQuantity: 1,
    isWholeUnit: false,
  });

  // Fetch room types and find the specific one
  const { data: roomTypesResponse, isLoading } = useQuery({
    queryKey: ["property-room-types", propertyId],
    queryFn: () => ownerPropertyService.getPropertyRoomTypes(propertyId),
    enabled: !!propertyId,
  });

  const roomType = roomTypesResponse?.data?.find((rt) => rt.id === roomTypeId);

  // Update form data when room type data is loaded
  useEffect(() => {
    if (roomType) {
      setFormData({
        name: roomType.name,
        description: roomType.description,
        basePrice: roomType.basePrice,
        capacity: roomType.capacity,
        totalQuantity: roomType.totalQuantity,
        isWholeUnit: roomType.isWholeUnit,
      });
    }
  }, [roomType]);

  // Update room type mutation
  const updateRoomTypeMutation = useMutation({
    mutationFn: (data: UpdateRoomTypeRequest) =>
      ownerPropertyService.updateRoomType(propertyId, roomTypeId, data),
    onSuccess: () => {
      toast.success("Tipe kamar berhasil diperbarui!");
      queryClient.invalidateQueries({
        queryKey: ["property-room-types", propertyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["property-detail", propertyId],
      });
      router.push(`/my-properties/${propertyId}`);
    },
    onError: (error: any) => {
      console.error("Error updating room type:", error);
      toast.error(
        error?.response?.data?.message || "Gagal memperbarui tipe kamar!"
      );
    },
  });

  const handleInputChange = (
    field: keyof EditRoomTypeForm,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Nama tipe kamar wajib diisi");
      return;
    }

    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      toast.error("Harga dasar harus lebih dari 0");
      return;
    }

    if (formData.capacity <= 0) {
      toast.error("Kapasitas harus lebih dari 0");
      return;
    }

    if (formData.totalQuantity <= 0) {
      toast.error("Jumlah kamar harus lebih dari 0");
      return;
    }

    const requestData: UpdateRoomTypeRequest = {
      ...formData,
      id: roomTypeId,
    };

    updateRoomTypeMutation.mutate(requestData);
  };

  const formatCurrency = (value: string) => {
    if (!value) return "";
    const numValue = parseFloat(value.replace(/[^\d]/g, ""));
    return numValue ? new Intl.NumberFormat("id-ID").format(numValue) : "";
  };

  const handlePriceChange = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");
    setFormData((prev) => ({ ...prev, basePrice: numericValue }));
  };

  const incrementQuantity = (field: "capacity" | "totalQuantity") => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] + 1,
    }));
  };

  const decrementQuantity = (field: "capacity" | "totalQuantity") => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(1, prev[field] - 1),
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-64" />
        </div>

        {/* Form Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!roomType) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/my-properties/${propertyId}`)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold">Tipe Kamar Tidak Ditemukan</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              Tipe kamar yang Anda cari tidak ditemukan.
            </p>
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
          onClick={() => router.push(`/my-properties/${propertyId}`)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold">Edit Tipe Kamar</h1>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Tipe Kamar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Room Type Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Tipe Kamar</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Contoh: Deluxe Room"
                  required
                />
              </div>

              {/* Base Price */}
              <div className="space-y-2">
                <Label htmlFor="basePrice">Harga Dasar (per malam)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    Rp
                  </span>
                  <Input
                    id="basePrice"
                    value={formatCurrency(formData.basePrice)}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="750.000"
                    className="pl-10"
                    required
                  />
                </div>
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
                placeholder="Deskripsikan fasilitas dan keunggulan tipe kamar ini..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Capacity */}
              <div className="space-y-2">
                <Label htmlFor="capacity">Kapasitas (orang)</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => decrementQuantity("capacity")}
                    disabled={formData.capacity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    id="capacity"
                    value={formData.capacity}
                    onChange={(e) =>
                      handleInputChange(
                        "capacity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="text-center"
                    min="1"
                    type="number"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => incrementQuantity("capacity")}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Total Quantity */}
              <div className="space-y-2">
                <Label htmlFor="totalQuantity">Jumlah Kamar</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => decrementQuantity("totalQuantity")}
                    disabled={formData.totalQuantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    id="totalQuantity"
                    value={formData.totalQuantity}
                    onChange={(e) =>
                      handleInputChange(
                        "totalQuantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="text-center"
                    min="1"
                    type="number"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => incrementQuantity("totalQuantity")}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Is Whole Unit */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isWholeUnit"
                checked={formData.isWholeUnit}
                onCheckedChange={(checked) =>
                  handleInputChange("isWholeUnit", checked)
                }
              />
              <Label htmlFor="isWholeUnit" className="text-sm">
                Sewa unit lengkap (tidak per kamar)
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/my-properties/${propertyId}`)}
                disabled={updateRoomTypeMutation.isPending}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={updateRoomTypeMutation.isPending}
                className="gap-2"
              >
                {updateRoomTypeMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {updateRoomTypeMutation.isPending
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Peak Rate Management */}
      {roomType && (
        <PeakRateManager
          roomTypeId={roomTypeId}
          roomTypeName={roomType.name}
          basePrice={parseFloat(roomType.basePrice.replace(/[^\d]/g, "")) || 0}
        />
      )}
    </div>
  );
};

export default EditRoomType;
