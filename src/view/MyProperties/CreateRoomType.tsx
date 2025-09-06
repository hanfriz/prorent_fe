"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CreateRoomTypeRequest } from "@/interface/ownerPropertyInterface";
import { ownerPropertyService } from "@/service/ownerPropertyService";

interface CreateRoomTypeForm {
  name: string;
  description: string;
  basePrice: string;
  capacity: number;
  totalQuantity: number;
  isWholeUnit: boolean;
}

const CreateRoomType = () => {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateRoomTypeForm>({
    name: "",
    description: "",
    basePrice: "",
    capacity: 1,
    totalQuantity: 1,
    isWholeUnit: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createRoomTypeMutation = useMutation({
    mutationFn: (data: CreateRoomTypeRequest) =>
      ownerPropertyService.createRoomType(propertyId, data),
    onSuccess: () => {
      toast.success("Tipe kamar berhasil dibuat!");
      queryClient.invalidateQueries({
        queryKey: ["property-room-types", propertyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["property-detail", propertyId],
      });
      router.push(`/my-properties/${propertyId}`);
    },
    onError: (error: any) => {
      console.error("Error creating room type:", error);
      toast.error(
        error?.response?.data?.message || "Gagal membuat tipe kamar!"
      );
    },
  });

  const handleInputChange = (
    field: keyof CreateRoomTypeForm,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Nama tipe kamar wajib diisi";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Nama tipe kamar minimal 3 karakter";
    }

    // Base price validation
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = "Harga dasar harus lebih dari 0";
    } else if (parseFloat(formData.basePrice) < 10000) {
      newErrors.basePrice = "Harga dasar minimal Rp 10.000";
    }

    // Capacity validation
    if (formData.capacity <= 0) {
      newErrors.capacity = "Kapasitas harus lebih dari 0";
    } else if (formData.capacity > 50) {
      newErrors.capacity = "Kapasitas maksimal 50 orang";
    }

    // Total quantity validation
    if (formData.totalQuantity <= 0) {
      newErrors.totalQuantity = "Jumlah kamar harus lebih dari 0";
    } else if (formData.totalQuantity > 1000) {
      newErrors.totalQuantity = "Jumlah kamar maksimal 1000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon periksa kembali data yang diisi");
      return;
    }

    const requestData: CreateRoomTypeRequest = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      basePrice: formData.basePrice,
      capacity: formData.capacity,
      totalQuantity: formData.totalQuantity,
      isWholeUnit: formData.isWholeUnit,
    };

    createRoomTypeMutation.mutate(requestData);
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
        <h1 className="text-2xl font-bold">Buat Tipe Kamar Baru</h1>
      </div>

      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Tipe Kamar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Room Type Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Tipe Kamar *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Contoh: Deluxe Room, Standard Room"
                  required
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Base Price */}
              <div className="space-y-2">
                <Label htmlFor="basePrice">Harga Dasar per Malam (IDR) *</Label>
                <Input
                  id="basePrice"
                  value={formatCurrency(formData.basePrice)}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="500,000"
                  required
                  className={errors.basePrice ? "border-red-500" : ""}
                />
                {errors.basePrice ? (
                  <p className="text-sm text-red-500">{errors.basePrice}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Harga dalam Rupiah per malam
                  </p>
                )}
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <Label htmlFor="capacity">Kapasitas (orang) *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.capacity}
                  onChange={(e) =>
                    handleInputChange("capacity", parseInt(e.target.value) || 1)
                  }
                  required
                  className={errors.capacity ? "border-red-500" : ""}
                />
                {errors.capacity ? (
                  <p className="text-sm text-red-500">{errors.capacity}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Maksimal orang yang dapat menginap
                  </p>
                )}
              </div>

              {/* Total Quantity */}
              {/* <div className="space-y-2">
                <Label htmlFor="totalQuantity">Jumlah Kamar *</Label>
                <Input
                  id="totalQuantity"
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.totalQuantity}
                  onChange={(e) =>
                    handleInputChange(
                      "totalQuantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                  required
                  className={errors.totalQuantity ? "border-red-500" : ""}
                />
                {errors.totalQuantity ? (
                  <p className="text-sm text-red-500">{errors.totalQuantity}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Total kamar dengan tipe ini
                  </p>
                )}
              </div> */}
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
              <p className="text-sm text-gray-500">
                Opsional: Jelaskan fasilitas yang tersedia di tipe kamar ini
              </p>
            </div>

            {/* Whole Unit Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isWholeUnit"
                checked={formData.isWholeUnit}
                onCheckedChange={(checked: boolean) =>
                  handleInputChange("isWholeUnit", checked)
                }
              />
              <div className="space-y-1">
                <Label htmlFor="isWholeUnit" className="cursor-pointer">
                  Sewa Unit Utuh
                </Label>
                <p className="text-sm text-gray-500">
                  Centang jika tipe kamar ini disewakan sebagai unit utuh (bukan
                  per kamar)
                </p>
              </div>
            </div>

            {/* Price Preview */}
            {formData.basePrice && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Preview Harga
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="text-blue-800">
                    <span className="font-medium">Per malam:</span>{" "}
                    {formatCurrency(formData.basePrice)} IDR
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Kapasitas:</span>{" "}
                    {formData.capacity} orang
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Tipe:</span>{" "}
                    {formData.isWholeUnit ? "Unit Utuh" : "Per Kamar"}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/my-properties/${propertyId}`)}
                disabled={createRoomTypeMutation.isPending}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={createRoomTypeMutation.isPending}
                className="gap-2"
              >
                {createRoomTypeMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {createRoomTypeMutation.isPending
                  ? "Membuat..."
                  : "Buat Tipe Kamar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRoomType;
