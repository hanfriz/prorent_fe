"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useOwnerPropertyDetail } from "@/service/useOwnerProperty";
import { ownerPropertyService } from "@/service/ownerPropertyService";
import {
  OwnerRoomType,
  OwnerRoom,
  CreateRoomTypeRequest,
  CreateRoomRequest,
  UpdateRoomRequest,
  formatPrice,
} from "@/interface/ownerPropertyInterface";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Users,
  Bed,
  Home,
  Loader2,
} from "lucide-react";

interface RoomTypeForm {
  name: string;
  description: string;
  basePrice: string;
  capacity: number;
  totalQuantity: number;
  isWholeUnit: boolean;
}

interface RoomForm {
  name: string;
  roomTypeId: string;
  isAvailable: boolean;
}

const ManageRooms = () => {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [activeTab, setActiveTab] = useState<"room-types" | "rooms">(
    "room-types"
  );
  const [roomTypeDialogOpen, setRoomTypeDialogOpen] = useState(false);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<OwnerRoomType | null>(
    null
  );
  const [editingRoom, setEditingRoom] = useState<OwnerRoom | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "roomType" | "room";
    id: string;
  } | null>(null);

  const [roomTypeForm, setRoomTypeForm] = useState<RoomTypeForm>({
    name: "",
    description: "",
    basePrice: "",
    capacity: 1,
    totalQuantity: 1,
    isWholeUnit: false,
  });

  const [roomForm, setRoomForm] = useState<RoomForm>({
    name: "",
    roomTypeId: "",
    isAvailable: true,
  });

  const {
    data: property,
    isLoading: isLoadingProperty,
    error: propertyError,
    refetch,
  } = useOwnerPropertyDetail(propertyId);

  useEffect(() => {
    if (editingRoomType) {
      setRoomTypeForm({
        name: editingRoomType.name,
        description: editingRoomType.description,
        basePrice: editingRoomType.basePrice,
        capacity: editingRoomType.capacity,
        totalQuantity: editingRoomType.totalQuantity,
        isWholeUnit: editingRoomType.isWholeUnit,
      });
    } else {
      setRoomTypeForm({
        name: "",
        description: "",
        basePrice: "",
        capacity: 1,
        totalQuantity: 1,
        isWholeUnit: false,
      });
    }
  }, [editingRoomType]);

  useEffect(() => {
    if (editingRoom) {
      setRoomForm({
        name: editingRoom.name,
        roomTypeId: editingRoom.roomTypeId,
        isAvailable: editingRoom.isAvailable,
      });
    } else {
      setRoomForm({
        name: "",
        roomTypeId: "",
        isAvailable: true,
      });
    }
  }, [editingRoom]);

  const handleRoomTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingRoomType) {
        // Update room type API call - don't include propertyId for updates
        const updateData = {
          ...roomTypeForm,
          id: editingRoomType.id,
        };
        await ownerPropertyService.updateRoomType(
          propertyId,
          editingRoomType.id,
          updateData
        );
        toast.success("Tipe kamar berhasil diperbarui!");
      } else {
        // Create room type API call
        const createData: CreateRoomTypeRequest = {
          ...roomTypeForm,
          propertyId,
        };
        await ownerPropertyService.createRoomType(propertyId, createData);
        toast.success("Tipe kamar berhasil dibuat!");
      }

      setRoomTypeDialogOpen(false);
      setEditingRoomType(null);
      // Refresh property data
      refetch();
    } catch (error) {
      console.error("Error saving room type:", error);
      toast.error("Gagal menyimpan tipe kamar!");
    }
  };

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingRoom) {
        // Update room API call
        const updateData = {
          ...roomForm,
          id: editingRoom.id,
        };
        await ownerPropertyService.updateRoom(
          propertyId,
          editingRoom.id,
          updateData
        );
        toast.success("Kamar berhasil diperbarui!");
      } else {
        // Create room API call
        const createData: CreateRoomRequest = {
          ...roomForm,
          propertyId,
        };
        await ownerPropertyService.createRoom(propertyId, createData);
        toast.success("Kamar berhasil dibuat!");
      }

      setRoomDialogOpen(false);
      setEditingRoom(null);
      // Refresh property data
      refetch();
    } catch (error) {
      console.error("Error saving room:", error);
      toast.error("Gagal menyimpan kamar!");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "roomType") {
        // Delete room type API call
        await ownerPropertyService.deleteRoomType(propertyId, deleteTarget.id);
        toast.success("Tipe kamar berhasil dihapus!");
      } else {
        // Delete room API call
        await ownerPropertyService.deleteRoom(propertyId, deleteTarget.id);
        toast.success("Kamar berhasil dihapus!");
      }

      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      // Refresh property data
      refetch();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Gagal menghapus!");
    }
  };

  if (isLoadingProperty) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="h-8 w-64" />
        </div>

        <Skeleton className="h-10 w-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (propertyError) {
    return (
      <div className="max-w-6xl mx-auto p-6">
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

  const propertyData = property?.data;
  const roomTypes = propertyData?.roomTypes || [];
  const rooms = propertyData?.rooms || [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Kelola Kamar</h1>
          <p className="text-gray-600">{propertyData?.name}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="w-full">
        <div className="grid w-full grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
          <Button
            variant={activeTab === "room-types" ? "default" : "ghost"}
            onClick={() => setActiveTab("room-types")}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Tipe Kamar ({roomTypes.length})
          </Button>
          <Button
            variant={activeTab === "rooms" ? "default" : "ghost"}
            onClick={() => setActiveTab("rooms")}
            className="gap-2"
          >
            <Bed className="w-4 h-4" />
            Kamar ({rooms.length})
          </Button>
        </div>

        {/* Room Types Content */}
        {activeTab === "room-types" && (
          <div className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tipe Kamar</h2>
              <Button
                onClick={() => {
                  setEditingRoomType(null);
                  setRoomTypeDialogOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Tambah Tipe Kamar
              </Button>
            </div>

            {roomTypes.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">
                  <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada tipe kamar</p>
                  <p className="text-sm">Tambah tipe kamar untuk memulai</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roomTypes.map((roomType: OwnerRoomType) => (
                  <Card key={roomType.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {roomType.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Users className="w-4 h-4" />
                            {roomType.capacity} orang
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            roomType.isWholeUnit ? "default" : "secondary"
                          }
                        >
                          {roomType.isWholeUnit ? "Unit Utuh" : "Per Kamar"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {roomType.description}
                        </p>

                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(roomType.basePrice)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {roomType.totalQuantity} kamar
                          </span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingRoomType(roomType);
                              setRoomTypeDialogOpen(true);
                            }}
                            className="flex-1 gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setDeleteTarget({
                                type: "roomType",
                                id: roomType.id,
                              });
                              setDeleteDialogOpen(true);
                            }}
                            className="flex-1 gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rooms Content */}
        {activeTab === "rooms" && (
          <div className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Kamar</h2>
              <Button
                onClick={() => {
                  setEditingRoom(null);
                  setRoomDialogOpen(true);
                }}
                disabled={roomTypes.length === 0}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Tambah Kamar
              </Button>
            </div>

            {roomTypes.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">
                  <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Buat tipe kamar terlebih dahulu</p>
                  <p className="text-sm">Sebelum menambah kamar individual</p>
                </CardContent>
              </Card>
            ) : rooms.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">
                  <Bed className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada kamar</p>
                  <p className="text-sm">Tambah kamar untuk memulai</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room: OwnerRoom) => (
                  <Card key={room.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                          <CardDescription>
                            {room.roomType?.name}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={room.isAvailable ? "default" : "destructive"}
                        >
                          {room.isAvailable ? "Tersedia" : "Tidak Tersedia"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {room.roomType && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Harga:
                            </span>
                            <span className="font-semibold text-blue-600">
                              {formatPrice(room.roomType.basePrice)}
                            </span>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingRoom(room);
                              setRoomDialogOpen(true);
                            }}
                            className="flex-1 gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setDeleteTarget({ type: "room", id: room.id });
                              setDeleteDialogOpen(true);
                            }}
                            className="flex-1 gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Room Type Dialog */}
      <Dialog open={roomTypeDialogOpen} onOpenChange={setRoomTypeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRoomType ? "Edit Tipe Kamar" : "Tambah Tipe Kamar"}
            </DialogTitle>
            <DialogDescription>
              {editingRoomType
                ? "Perbarui informasi tipe kamar"
                : "Buat tipe kamar baru untuk properti Anda"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRoomTypeSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomtype-name">Nama Tipe Kamar *</Label>
                <Input
                  id="roomtype-name"
                  value={roomTypeForm.name}
                  onChange={(e) =>
                    setRoomTypeForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Contoh: Deluxe Room"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="base-price">Harga Dasar (IDR) *</Label>
                <Input
                  id="base-price"
                  type="number"
                  value={roomTypeForm.basePrice}
                  onChange={(e) =>
                    setRoomTypeForm((prev) => ({
                      ...prev,
                      basePrice: e.target.value,
                    }))
                  }
                  placeholder="500000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Kapasitas (orang) *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={roomTypeForm.capacity}
                  onChange={(e) =>
                    setRoomTypeForm((prev) => ({
                      ...prev,
                      capacity: parseInt(e.target.value) || 1,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total-quantity">Jumlah Kamar *</Label>
                <Input
                  id="total-quantity"
                  type="number"
                  min="1"
                  value={roomTypeForm.totalQuantity}
                  onChange={(e) =>
                    setRoomTypeForm((prev) => ({
                      ...prev,
                      totalQuantity: parseInt(e.target.value) || 1,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={roomTypeForm.description}
                onChange={(e) =>
                  setRoomTypeForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Deskripsi tipe kamar..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-whole-unit"
                checked={roomTypeForm.isWholeUnit}
                onCheckedChange={(checked: boolean) =>
                  setRoomTypeForm((prev) => ({ ...prev, isWholeUnit: checked }))
                }
              />
              <Label htmlFor="is-whole-unit">Sewa Unit Utuh</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRoomTypeDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">
                {editingRoomType ? "Perbarui" : "Tambah"} Tipe Kamar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Room Dialog */}
      <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRoom ? "Edit Kamar" : "Tambah Kamar"}
            </DialogTitle>
            <DialogDescription>
              {editingRoom
                ? "Perbarui informasi kamar"
                : "Tambah kamar baru ke properti Anda"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRoomSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-name">Nama Kamar *</Label>
              <Input
                id="room-name"
                value={roomForm.name}
                onChange={(e) =>
                  setRoomForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Contoh: Kamar 101"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-type">Tipe Kamar *</Label>
              <Select
                value={roomForm.roomTypeId}
                onValueChange={(value) =>
                  setRoomForm((prev) => ({ ...prev, roomTypeId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe kamar" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((roomType: OwnerRoomType) => (
                    <SelectItem key={roomType.id} value={roomType.id}>
                      {roomType.name} - {formatPrice(roomType.basePrice)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-available"
                checked={roomForm.isAvailable}
                onCheckedChange={(checked: boolean) =>
                  setRoomForm((prev) => ({ ...prev, isAvailable: checked }))
                }
              />
              <Label htmlFor="is-available">Tersedia untuk disewa</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRoomDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">
                {editingRoom ? "Perbarui" : "Tambah"} Kamar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Hapus {deleteTarget?.type === "roomType" ? "Tipe Kamar" : "Kamar"}
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus{" "}
              {deleteTarget?.type === "roomType" ? "tipe kamar" : "kamar"} ini?
              Tindakan ini tidak dapat dibatalkan.
              {deleteTarget?.type === "roomType" && (
                <span className="block mt-2 text-red-600 font-medium">
                  Menghapus tipe kamar akan menghapus semua kamar yang
                  menggunakan tipe ini.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageRooms;
