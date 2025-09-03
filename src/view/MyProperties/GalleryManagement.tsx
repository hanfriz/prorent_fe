"use client";

import { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useOwnerPropertyDetail } from "@/service/useOwnerProperty";
import { ownerPropertyService } from "@/service/ownerPropertyService";
import {
  OwnerPropertyPicture,
  OwnerPropertyGalleryItem,
} from "@/interface/ownerPropertyInterface";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Upload,
  Trash2,
  Star,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import Image from "next/image";

const GalleryManagement = () => {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const {
    data: property,
    isLoading: isLoadingProperty,
    error: propertyError,
    refetch: refetchProperty,
  } = useOwnerPropertyDetail(propertyId);

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

    setIsUploading(true);
    try {
      // Upload files one by one and add to property gallery
      for (const file of selectedFiles) {
        const altText = `${property?.data?.name || "Property"} - ${file.name}`;
        await ownerPropertyService.uploadAndAddToPropertyGallery(
          propertyId,
          file,
          altText
        );
      }

      toast.success("Gambar berhasil diupload dan ditambahkan ke galeri!");
      setSelectedFiles([]);
      // Refresh property data
      refetchProperty();
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
    try {
      // Remove from property gallery first, then delete the image
      await ownerPropertyService.removeImageFromPropertyGallery(
        propertyId,
        imageId
      );
      await ownerPropertyService.deletePropertyImage(imageId);
      toast.success("Gambar berhasil dihapus dari galeri!");
      setDeleteDialogOpen(false);
      setSelectedImageId(null);
      // Refresh property data
      refetchProperty();
    } catch (error: any) {
      console.error("Delete error:", error);
      const errorMessage =
        error?.response?.data?.message || "Gagal menghapus gambar";
      toast.error(errorMessage);
    }
  };

  const handleSetMainPicture = async (imageId: string) => {
    try {
      await ownerPropertyService.setMainPicture(propertyId, imageId);
      toast.success("Gambar utama berhasil diubah!");
      // Refresh property data
      refetchProperty();
    } catch (error: any) {
      console.error("Set main picture error:", error);
      const errorMessage = error?.response?.data?.message || "Gagal mengubah gambar utama";
      toast.error(errorMessage);
    }
  };

  if (isLoadingProperty) {
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
  const gallery = (propertyData?.gallery || [])
    .filter((item) => item && item.picture && item.picture.id)
    .map((item) => item.picture); // Extract picture from gallery item
  const mainPicture = propertyData?.mainPicture;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
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
        <div>
          <h1 className="text-2xl font-bold">Kelola Galeri</h1>
          <p className="text-gray-600">{propertyData?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gallery Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Galeri Properti ({gallery.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gallery.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada gambar di galeri</p>
                <p className="text-sm">Upload gambar pertama untuk memulai</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((image: OwnerPropertyPicture, index: number) => (
                  <div
                    key={image?.id || `gallery-image-${index}`}
                    className="relative group aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-200 transition-colors"
                  >
                    <Image
                      src={image?.url || "/prorent-logo.png"}
                      alt={image?.alt || "Property image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />

                    {/* Main Picture Badge */}
                    {mainPicture?.id === image.id && (
                      <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
                        <Star className="w-3 h-3 mr-1" />
                        Utama
                      </Badge>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {mainPicture?.id !== image.id && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSetMainPicture(image.id)}
                          className="gap-1"
                        >
                          <Star className="w-3 h-3" />
                          Set Utama
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedImageId(image.id);
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

export default GalleryManagement;
