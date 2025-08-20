"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { UploadedFile } from "@/interface/propertyInterface";
import { propertyService } from "@/service/propertyService";
import { toast } from "sonner";
import Image from "next/image";

interface SimpleImageSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  type: string;
  label?: string;
}

export function SimpleImageSelector({
  value,
  onValueChange,
  type,
  label = "Select Image",
}: SimpleImageSelectorProps) {
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<UploadedFile | null>(null);

  useEffect(() => {
    loadImages();
  }, [type]);

  useEffect(() => {
    if (value) {
      const image = images.find((img) => img.id === value);
      setSelectedImage(image || null);
    }
  }, [value, images]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getUploads(1, 50, type);
      setImages(response.data);
    } catch (error: any) {
      toast.error("Failed to load images");
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await propertyService.uploadFile(file, type, file.name);
      const newImage = response.data;

      setImages((prev) => [newImage, ...prev]);
      onValueChange(newImage.id);
      setSelectedImage(newImage);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload image");
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleImageSelect = (image: UploadedFile) => {
    onValueChange(image.id);
    setSelectedImage(image);
    setDialogOpen(false);
  };

  const handleImageDelete = async (
    imageId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await propertyService.deleteFile(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));

      if (value === imageId) {
        onValueChange("");
        setSelectedImage(null);
      }

      toast.success("Image deleted successfully!");
    } catch (error: any) {
      toast.error("Failed to delete image");
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Selected Image Preview */}
      {selectedImage && (
        <div className="relative w-full h-32 border rounded-lg overflow-hidden">
          <Image
            src={selectedImage.url}
            alt={selectedImage.alt}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-2 right-2">Selected</Badge>
        </div>
      )}

      {/* Selection Button */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <ImageIcon className="h-4 w-4 mr-2" />
            {selectedImage ? "Change Image" : label}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload new image
                    </span>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </Label>
                  {uploading && (
                    <p className="mt-2 text-sm text-gray-500">Uploading...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                    />
                  ))
                : images.map((image) => (
                    <div
                      key={image.id}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        value === image.id
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleImageSelect(image)}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />

                      {value === image.id && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                          <Badge>Selected</Badge>
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={(e) => handleImageDelete(image.id, e)}
                      >
                        <X className="h-3 w-3" />
                      </Button>

                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                        <p className="text-xs truncate">{image.alt}</p>
                        <p className="text-xs opacity-75">{image.sizeKB}KB</p>
                      </div>
                    </div>
                  ))}
            </div>

            {images.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-2">
                  No images found. Upload your first image above.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
