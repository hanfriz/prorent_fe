"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, Loader2, X } from "lucide-react";
import { userService } from "../../../service/userService";
import { useAuth } from "@/lib/hooks/useAuth";
import { authService } from "@/service/authService";
import { toast } from "sonner";

interface AvatarUploadProps {
  user: any;
}

export default function AvatarUpload({ user }: AvatarUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refreshUserData } = useAuth();

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

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

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const response = await userService.uploadAvatar(formData);

      if (response.success) {
        toast.success("Avatar updated successfully");

        // Clear preview
        setPreviewUrl(null);
        setSelectedFile(null);

        // Refresh user data from server to get latest info
        await refreshUserData();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload avatar";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        {/* Current/Preview Avatar */}
        <div className="relative">
          <Avatar className="h-32 w-32">
            <AvatarImage
              src={previewUrl || user?.profile?.avatar?.url}
              alt="Profile picture"
            />
            <AvatarFallback className="text-2xl">
              {getInitials(user?.email || "")}
            </AvatarFallback>
          </Avatar>

          {/* Camera overlay button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-0 right-0 rounded-full p-2 h-10 w-10"
            onClick={triggerFileInput}
            disabled={isLoading}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        {/* File input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Upload profile picture"
        />

        {/* Selected file info */}
        {selectedFile && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Upload className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{selectedFile.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={triggerFileInput}
            disabled={isLoading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose Image
          </Button>

          {selectedFile && (
            <Button onClick={handleUpload} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload Avatar
            </Button>
          )}
        </div>
      </div>

      {/* Guidelines */}
      <div className="text-center space-y-2">
        <h3 className="font-medium text-gray-900">Upload Guidelines</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Image should be square (1:1 ratio) for best results</p>
          <p>• Maximum file size: 5MB</p>
          <p>• Supported formats: JPG, PNG, GIF</p>
          <p>• Recommended size: 400x400 pixels or larger</p>
        </div>
      </div>
    </div>
  );
}
