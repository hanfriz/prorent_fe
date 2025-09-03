"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { propertyService } from "@/service/propertyService";
import { Property, UploadedFile, RoomType, CreateRoomRequest } from "@/interface/propertyInterface";
import {
  createRoomSchema,
  CreateRoomFormData,
} from "@/validation/propertyValidation";
import { ImageSelector } from "../../component/ImageSelector";
import { RoomImageUploader } from "../../component/RoomImageUploader";
import { RoomTypeSelector } from "../../component/RoomTypeSelector";

interface CreateRoomFormProps {
  propertyId?: string;
}

export default function CreateRoomForm({ propertyId }: CreateRoomFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);

  const form = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      propertyId: propertyId || "",
      roomTypeId: "",
      name: "",
      pictures: [],
    },
  });

  useEffect(() => {
    loadProperties();
    loadImages();
  }, []);

  useEffect(() => {
    if (propertyId) {
      form.setValue("propertyId", propertyId);
      loadRoomTypes(propertyId);
    }
  }, [propertyId, form]);

  // Watch propertyId changes to load room types
  const watchedPropertyId = form.watch("propertyId");
  useEffect(() => {
    if (watchedPropertyId) {
      loadRoomTypes(watchedPropertyId);
    } else {
      setRoomTypes([]);
    }
  }, [watchedPropertyId]);

  const loadProperties = async () => {
    try {
      const response = await propertyService.getMyProperties();
      if (response.success) {
        setProperties(response.data);
      }
    } catch (error) {
      console.error("Error loading properties:", error);
      toast.error("Failed to load properties");
    }
  };

  const loadRoomTypes = async (propertyId: string) => {
    try {
      const response = await propertyService.getRoomTypes(propertyId);
      if (response.success) {
        setRoomTypes(response.data);
      }
    } catch (error) {
      console.error("Error loading room types:", error);
      toast.error("Failed to load room types. Please create a room type first.");
      // Set empty array to show that no room types exist
      setRoomTypes([]);
    }
  };

  const loadImages = async () => {
    try {
      const response = await propertyService.getUploads(1, 50, "room");
      if (response.success) {
        setImages(response.data);
      }
    } catch (error) {
      console.error("Error loading images:", error);
      toast.error("Failed to load images");
    }
  };

  const onSubmit = async (data: CreateRoomFormData) => {
    try {
      setIsLoading(true);

      // Validate room type is selected
      if (!data.roomTypeId) {
        toast.error("Please select a room type first");
        return;
      }

      // Pictures are optional in backend
      const requestData: CreateRoomRequest = {
        propertyId: data.propertyId,
        roomTypeId: data.roomTypeId,
        ...(data.name && data.name.trim() && { name: data.name.trim() }),
        ...(selectedImageIds.length > 0 && { pictures: selectedImageIds }),
      };

      const response = await propertyService.createRoom(requestData);

      if (response.success) {
        toast.success("Room created successfully!");
        router.push(`/properties/${data.propertyId}`); // Navigate to property detail
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create room";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (imageId: string) => {
    setSelectedImageIds((prev) => {
      if (prev.includes(imageId)) {
        return prev.filter((id) => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const handleImageUploaded = (newImage: UploadedFile) => {
    setImages((prev) => [newImage, ...prev]);
    setSelectedImageIds((prev) => [...prev, newImage.id]);
  };

  const handleRoomTypeCreated = (newRoomType: RoomType) => {
    setRoomTypes((prev) => [newRoomType, ...prev]);
  };

  useEffect(() => {
    form.setValue("pictures", selectedImageIds);
  }, [selectedImageIds, form]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Room</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Property Selection */}
              {!propertyId && (
                <FormField
                  control={form.control}
                  name="propertyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a property" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {properties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter room name (e.g., Room 101)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roomTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <FormControl>
                        <RoomTypeSelector
                          propertyId={watchedPropertyId}
                          roomTypes={roomTypes}
                          value={field.value}
                          onChange={field.onChange}
                          onRoomTypeCreated={handleRoomTypeCreated}
                          disabled={!watchedPropertyId}
                        />
                      </FormControl>
                      <FormMessage />
                      {roomTypes.length === 0 && watchedPropertyId && (
                        <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mt-2">
                          <p className="text-sm text-orange-800">
                            ⚠️ No room types found for this property.
                          </p>
                          <p className="text-xs text-orange-600 mt-1">
                            You need to create a room type first before creating rooms. 
                            Click the + button to create one.
                          </p>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {/* Room Pictures */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Room Pictures (Optional)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <Card
                      key={image.id}
                      className={`cursor-pointer transition-all ${
                        selectedImageIds.includes(image.id)
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => handleImageSelect(image.id)}
                    >
                      <CardContent className="p-2">
                        <div className="relative aspect-square">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover rounded"
                          />
                          {selectedImageIds.includes(image.id) && (
                            <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1 text-xs">
                              {selectedImageIds.indexOf(image.id) + 1}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {image.alt}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Upload Button */}
                <RoomImageUploader onImageUploaded={handleImageUploaded} />

                {selectedImageIds.length > 0 && (
                  <p className="text-sm text-green-600">
                    {selectedImageIds.length} image(s) selected
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !form.watch("roomTypeId")}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Room
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
