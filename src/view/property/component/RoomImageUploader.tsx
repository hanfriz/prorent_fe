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
import { Upload, Loader2, Plus, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { propertyService } from "@/service/propertyService";
import { UploadedFile } from "@/interface/propertyInterface";

interface RoomImageUploaderProps {
  onImageUploaded: (newImage: UploadedFile) => void;
}

export function RoomImageUploader({ onImageUploaded }: RoomImageUploaderProps) {
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
        toast.error("Image size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setAltText(file.name.split(".")[0]); // Default alt text from filename

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !altText.trim()) {
      toast.error("Please select a file and provide alt text");
      return;
    }

    try {
      setIsUploading(true);

      const response = await propertyService.uploadFile(
        selectedFile,
        "room", // type for room images
        altText.trim()
      );

      if (response.success) {
        toast.success("Image uploaded successfully!");
        onImageUploaded(response.data);
        handleCloseDialog();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload image";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setAltText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Upload Room Images
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Room Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Select Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
              title="Select image file"
            />
            <Card
              className="border-dashed border-2 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={triggerFileSelect}
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                {previewUrl ? (
                  <div className="relative w-full aspect-square max-w-48">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 text-center">
                      Click to select an image
                    </p>
                    <p className="text-xs text-gray-400 text-center">
                      JPG, PNG up to 5MB
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {selectedFile && (
            <div className="space-y-2">
              <Label htmlFor="alt-text">Image Description</Label>
              <Input
                id="alt-text"
                placeholder="Enter image description"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                This helps with accessibility and SEO
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || !altText.trim() || isUploading}
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
