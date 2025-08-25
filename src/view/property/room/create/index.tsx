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
import { Property, UploadedFile } from "@/interface/propertyInterface";
import {
  createRoomSchema,
  CreateRoomFormData,
} from "@/validation/propertyValidation";
import { ImageSelector } from "../../component/ImageSelector";

interface CreateRoomFormProps {
  propertyId?: string;
}

export default function CreateRoomForm({ propertyId }: CreateRoomFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);

  const form = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      propertyId: propertyId || "",
      name: "",
      roomTypeName: "",
      description: "",
      capacity: 1,
      basePrice: 100000,
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
    }
  }, [propertyId, form]);

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

      if (selectedImageIds.length === 0) {
        toast.error("Please select at least one picture");
        return;
      }

      const requestData = {
        ...data,
        pictures: selectedImageIds,
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
                      <FormLabel>Room Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter room name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roomTypeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter room type name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter room description"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Room Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (Guests)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          placeholder="Enter capacity"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price (IDR)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1000"
                          placeholder="Enter base price"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Room Pictures */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Room Pictures</label>
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // This could open a dialog for uploading images
                    toast.info("Image upload feature coming soon");
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Room Images
                </Button>

                {selectedImageIds.length === 0 && (
                  <p className="text-sm text-red-500">
                    Please select at least one picture
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
                <Button type="submit" disabled={isLoading}>
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
