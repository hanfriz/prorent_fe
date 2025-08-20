"use client";

import { useState, useRef } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Loader2, X, Check, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { propertyService } from "@/service/propertyService";
import { UploadedFile } from "@/interface/propertyInterface";

interface ImageSelectorProps {
  images: UploadedFile[];
  selectedImageId: string;
  onImageSelect: (imageId: string) => void;
  onImageUploaded: (newImage: UploadedFile) => void;
  onImagesReload: () => void;
  type: string;
  title: string;
}

export function ImageSelector({
  images,
  selectedImageId,
  onImageSelect,
  onImageUploaded,
  onImagesReload,
  type,
  title,
}: ImageSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    if (!altText.trim()) {
      toast.error("Please enter alt text for the image");
      return;
    }

    try {
      setIsUploading(true);

      const response = await propertyService.uploadFile(
        selectedFile,
        type,
        altText.trim()
      );

      if (response.success) {
        toast.success("Image uploaded successfully!");
        onImageUploaded(response.data);
        setIsDialogOpen(false);
        resetUploadForm();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload image";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await propertyService.deleteFile(imageId);
      if (response.success) {
        toast.success("Image deleted successfully!");
        onImagesReload();
        if (selectedImageId === imageId) {
          onImageSelect("");
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete image";
      toast.error(errorMessage);
    }
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAltText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{title}</Label>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* File Input */}
              <div>
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={resetUploadForm}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Alt Text */}
              <div>
                <Label htmlFor="altText">Alt Text</Label>
                <Input
                  id="altText"
                  placeholder="Enter image description"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>

              {/* Upload Button */}
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading || !selectedFile}
                >
                  {isUploading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Upload Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card
            key={image.id}
            className={`cursor-pointer transition-all ${
              selectedImageId === image.id
                ? "ring-2 ring-blue-500 bg-blue-50"
                : "hover:shadow-md"
            }`}
            onClick={() => onImageSelect(image.id)}
          >
            <CardContent className="p-2">
              <div className="relative aspect-square">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover rounded"
                />
                {selectedImageId === image.id && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 left-1 h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(image.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-1 truncate">{image.alt}</p>
              <p className="text-xs text-gray-400">{image.sizeKB} KB</p>
            </CardContent>
          </Card>
        ))}

        {images.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <ImageIcon className="h-12 w-12 mb-2" />
            <p>No images uploaded yet</p>
            <p className="text-sm">Upload your first image to get started</p>
          </div>
        )}
      </div>

      {!selectedImageId && images.length > 0 && (
        <p className="text-sm text-red-500">Please select an image</p>
      )}
    </div>
  );
}
