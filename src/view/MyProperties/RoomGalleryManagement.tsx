"use client";

import { useState, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ownerPropertyService } from "@/service/ownerPropertyService";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useOwnerRoomTypes } from "@/service/useOwnerProperty";

const RoomGalleryManagement = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const propertyId = params.id as string;
  const roomId = searchParams.get("roomId");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const {
    data: roomTypesData,
    isLoading: isLoadingRoomTypes,
    error: roomTypesError,
    refetch: refetchRoomTypes,
  } = useOwnerRoomTypes(propertyId);

  // Find the current room from room types data
  const currentRoom = roomTypesData?.data
    ?.flatMap((roomType: any) => roomType.rooms || [])
    ?.find((room: any) => room.id === roomId);

  const roomGallery = currentRoom?.gallery || [];

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} bukan file gambar yang valid`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          toast.error(`${file.name} terlalu besar. Maksimal 5MB`);
          return false;
        }
        return true;
      });

      setSelectedFiles((prev) => [...prev, ...validFiles]);
    },
    []
  );

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Pilih file gambar terlebih dahulu");
      return;
    }

    if (!roomId) {
      toast.error("Room ID tidak ditemukan");
      return;
    }

    setIsUploading(true);
    try {
      // Upload files one by one and add to room gallery
      for (const file of selectedFiles) {
        const altText = `${currentRoom?.name || "Room"} - ${file.name}`;
        await ownerPropertyService.uploadAndAddToRoomGallery(
          roomId,
          file,
          altText
        );
      }

      toast.success(
        "Gambar berhasil diupload dan ditambahkan ke galeri kamar!"
      );
      setSelectedFiles([]);
      // Refresh room types data to get updated gallery
      refetchRoomTypes();
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage =
        error?.response?.data?.message || "Gagal mengupload gambar";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!roomId) {
      toast.error("Room ID tidak ditemukan");
      return;
    }

    try {
      // Remove from room gallery first, then delete the image
      await ownerPropertyService.removeImageFromRoomGallery(roomId, imageId);
      await ownerPropertyService.deletePropertyImage(imageId);
      toast.success("Gambar berhasil dihapus dari galeri kamar!");
      setDeleteDialogOpen(false);
      setSelectedImageId(null);
      // Refresh room types data
      refetchRoomTypes();
    } catch (error: any) {
      console.error("Delete error:", error);
      const errorMessage =
        error?.response?.data?.message || "Gagal menghapus gambar";
      toast.error(errorMessage);
    }
  };

  if (isLoadingRoomTypes) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-square rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (roomTypesError || !currentRoom) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Error Loading Room
              </h3>
              <p className="text-gray-600 mb-4">
                {!currentRoom
                  ? "Kamar tidak ditemukan."
                  : "Gagal memuat data kamar. Silakan coba lagi."}
              </p>
              <Button
                onClick={() => router.push(`/my-properties/${propertyId}`)}
                variant="outline"
              >
                Kembali ke Property
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
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
        <div>
          <h1 className="text-2xl font-bold">Kelola Galeri Kamar</h1>
          <p className="text-gray-600">{currentRoom.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gallery Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Galeri Kamar ({roomGallery.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {roomGallery.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada gambar di galeri kamar</p>
                <p className="text-sm">Upload gambar pertama untuk memulai</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {roomGallery.map((image: any, index: number) => (
                  <div
                    key={image?.picture?.id || `room-gallery-image-${index}`}
                    className="relative group aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-200 transition-colors"
                  >
                    <Image
                      src={image?.picture?.url || "/prorent-logo.png"}
                      alt={image?.picture?.alt || "Room image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />

                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedImageId(image?.picture?.id);
                          setDeleteDialogOpen(true);
                        }}
                        className="gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Gambar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Pilih Gambar</Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Maksimal 5MB per file. Format: JPG, PNG, WebP
              </p>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>File Terpilih ({selectedFiles.length})</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${file.size}-${index}`}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeSelectedFile(index)}
                        className="flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="w-full gap-2"
            >
              {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUploading ? "Mengupload..." : "Upload Gambar"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Gambar</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus gambar ini? Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedImageId && handleDeleteImage(selectedImageId)
              }
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomGalleryManagement;
