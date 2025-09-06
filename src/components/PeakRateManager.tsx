"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CalendarDays, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { RateType } from "@/interface/enumInterface";
import { CreatePeakRateRequest, PeakRate } from "@/interface/peakRateInterface";
import {
  usePeakRates,
  useAddPeakRate,
  useUpdatePeakRate,
  useRemovePeakRate,
} from "@/service/usePeakRate";

interface PeakRateManagerProps {
  roomTypeId: string;
  roomTypeName: string;
  basePrice: number;
}

interface PeakRateFormData {
  startDate: string;
  endDate: string;
  rateType: RateType;
  value: number;
  description: string;
}

const PeakRateManager: React.FC<PeakRateManagerProps> = ({
  roomTypeId,
  roomTypeName,
  basePrice,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPeakRate, setEditingPeakRate] = useState<PeakRate | null>(null);
  const [formData, setFormData] = useState<PeakRateFormData>({
    startDate: "",
    endDate: "",
    rateType: "FIXED" as RateType,
    value: 0,
    description: "",
  });

  // Query hooks
  const { data: peakRatesResponse, isLoading } = usePeakRates(roomTypeId);
  const addPeakRateMutation = useAddPeakRate();
  const updatePeakRateMutation = useUpdatePeakRate();
  const removePeakRateMutation = useRemovePeakRate();

  const peakRates = peakRatesResponse?.data || [];

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isAddDialogOpen && !editingPeakRate) {
      setFormData({
        startDate: "",
        endDate: "",
        rateType: "FIXED" as RateType,
        value: 0,
        description: "",
      });
    }
  }, [isAddDialogOpen, editingPeakRate]);

  // Populate form when editing
  useEffect(() => {
    if (editingPeakRate) {
      setFormData({
        startDate: editingPeakRate.startDate.split("T")[0],
        endDate: editingPeakRate.endDate.split("T")[0],
        rateType: editingPeakRate.rateType,
        value: editingPeakRate.value,
        description: editingPeakRate.description || "",
      });
    }
  }, [editingPeakRate]);

  const handleInputChange = (field: keyof PeakRateFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.startDate) return "Tanggal mulai wajib diisi";
    if (!formData.endDate) return "Tanggal selesai wajib diisi";
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      return "Tanggal selesai harus setelah tanggal mulai";
    }
    if (formData.value <= 0) return "Nilai harus lebih dari 0";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      return;
    }

    const requestData: CreatePeakRateRequest = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      rateType: formData.rateType,
      value: formData.value,
      description: formData.description || undefined,
    };

    if (editingPeakRate) {
      // Update existing peak rate
      updatePeakRateMutation.mutate(
        {
          roomTypeId,
          date: editingPeakRate.startDate.split("T")[0],
          data: requestData,
        },
        {
          onSuccess: () => {
            setEditingPeakRate(null);
          },
        }
      );
    } else {
      // Add new peak rate
      addPeakRateMutation.mutate(
        { roomTypeId, data: requestData },
        {
          onSuccess: () => {
            setIsAddDialogOpen(false);
          },
        }
      );
    }
  };

  const handleRemovePeakRate = (peakRate: PeakRate) => {
    removePeakRateMutation.mutate({
      roomTypeId,
      date: peakRate.startDate.split("T")[0],
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateFinalPrice = (peakRate: PeakRate) => {
    if (peakRate.rateType === "FIXED") {
      return peakRate.value;
    } else {
      return basePrice + (basePrice * peakRate.value) / 100;
    }
  };

  const getRateDisplayText = (peakRate: PeakRate) => {
    if (peakRate.rateType === "FIXED") {
      return formatCurrency(peakRate.value);
    } else {
      return `+${peakRate.value}%`;
    }
  };

  const isPending =
    addPeakRateMutation.isPending ||
    updatePeakRateMutation.isPending ||
    removePeakRateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Peak Rate Management
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Atur harga khusus untuk periode tertentu pada {roomTypeName}
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Tambah Peak Rate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Peak Rate</DialogTitle>
                <DialogDescription>
                  Tambahkan harga khusus untuk periode tertentu
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Tanggal Mulai</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Tanggal Selesai</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tipe Tarif</Label>
                  <Select
                    value={formData.rateType}
                    onValueChange={(value) =>
                      handleInputChange("rateType", value as RateType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FIXED">Harga Tetap</SelectItem>
                      <SelectItem value="PERCENTAGE">Persentase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">
                    {formData.rateType === "FIXED"
                      ? "Harga (Rp)"
                      : "Persentase (%)"}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    min="0"
                    step={formData.rateType === "PERCENTAGE" ? "0.1" : "1000"}
                    value={formData.value}
                    onChange={(e) =>
                      handleInputChange(
                        "value",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder={
                      formData.rateType === "FIXED" ? "750000" : "25"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi (Opsional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Contoh: Harga weekend, Hari libur nasional"
                    rows={2}
                  />
                </div>

                {formData.rateType === "PERCENTAGE" && basePrice > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Preview:</strong> Harga akan menjadi{" "}
                      {formatCurrency(
                        basePrice + (basePrice * formData.value) / 100
                      )}
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={isPending}
                >
                  Batal
                </Button>
                <Button onClick={handleSubmit} disabled={isPending}>
                  {isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Simpan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : peakRates.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Belum ada peak rate</p>
            <p className="text-sm text-gray-400">
              Tambahkan harga khusus untuk periode tertentu
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {peakRates.map((peakRate) => (
              <div
                key={peakRate.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge
                      variant={
                        peakRate.rateType === "FIXED" ? "default" : "secondary"
                      }
                    >
                      {peakRate.rateType === "FIXED"
                        ? "Harga Tetap"
                        : "Persentase"}
                    </Badge>
                    <span className="font-semibold text-lg">
                      {getRateDisplayText(peakRate)}
                    </span>
                    <span className="text-sm text-gray-500">
                      → {formatCurrency(calculateFinalPrice(peakRate))}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      {formatDate(peakRate.startDate)} -{" "}
                      {formatDate(peakRate.endDate)}
                    </p>
                    {peakRate.description && (
                      <p className="text-gray-500 mt-1">
                        {peakRate.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog
                    open={editingPeakRate?.id === peakRate.id}
                    onOpenChange={(open) =>
                      setEditingPeakRate(open ? peakRate : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Peak Rate</DialogTitle>
                        <DialogDescription>
                          Perbarui harga khusus untuk periode ini
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-startDate">
                              Tanggal Mulai
                            </Label>
                            <Input
                              id="edit-startDate"
                              type="date"
                              value={formData.startDate}
                              onChange={(e) =>
                                handleInputChange("startDate", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-endDate">
                              Tanggal Selesai
                            </Label>
                            <Input
                              id="edit-endDate"
                              type="date"
                              value={formData.endDate}
                              onChange={(e) =>
                                handleInputChange("endDate", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Tipe Tarif</Label>
                          <Select
                            value={formData.rateType}
                            onValueChange={(value) =>
                              handleInputChange("rateType", value as RateType)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FIXED">Harga Tetap</SelectItem>
                              <SelectItem value="PERCENTAGE">
                                Persentase
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-value">
                            {formData.rateType === "FIXED"
                              ? "Harga (Rp)"
                              : "Persentase (%)"}
                          </Label>
                          <Input
                            id="edit-value"
                            type="number"
                            min="0"
                            step={
                              formData.rateType === "PERCENTAGE"
                                ? "0.1"
                                : "1000"
                            }
                            value={formData.value}
                            onChange={(e) =>
                              handleInputChange(
                                "value",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-description">
                            Deskripsi (Opsional)
                          </Label>
                          <Textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                            rows={2}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setEditingPeakRate(null)}
                          disabled={isPending}
                        >
                          Batal
                        </Button>
                        <Button onClick={handleSubmit} disabled={isPending}>
                          {isPending && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          )}
                          Perbarui
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Peak Rate</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus peak rate untuk
                          periode {formatDate(peakRate.startDate)} -{" "}
                          {formatDate(peakRate.endDate)}? Tindakan ini tidak
                          dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemovePeakRate(peakRate)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PeakRateManager;
