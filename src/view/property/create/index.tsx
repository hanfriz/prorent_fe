"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Category, UploadedFile } from "@/interface/propertyInterface";
import {
  createPropertySchema,
  CreatePropertyFormData,
} from "@/validation/propertyValidation";
import { CategorySelector } from "../component/CategorySelector";
import { ImageSelector } from "../component/ImageSelector";

export default function CreatePropertyForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string>("");

  const form = useForm<CreatePropertyFormData>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      city: "",
      province: "",
      categoryId: "",
      mainPictureId: "",
      latitude: "",
      longitude: "",
    },
  });

  useEffect(() => {
    loadCategories();
    loadImages();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await propertyService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const loadImages = async () => {
    try {
      const response = await propertyService.getUploads(1, 50, "property");
      if (response.success) {
        setImages(response.data);
      }
    } catch (error) {
      console.error("Error loading images:", error);
      toast.error("Failed to load images");
    }
  };

  const onSubmit = async (data: CreatePropertyFormData) => {
    try {
      setIsLoading(true);

      if (!selectedImageId) {
        toast.error("Please select a main picture");
        return;
      }

      const requestData = {
        ...data,
        mainPictureId: selectedImageId,
      };

      const response = await propertyService.createProperty(requestData);

      if (response.success) {
        toast.success("Property created successfully!");
        router.push("/properties"); // Navigate to properties list
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create property";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryCreated = (newCategory: Category) => {
    setCategories((prev) => [...prev, newCategory]);
    form.setValue("categoryId", newCategory.id);
  };

  const handleImageUploaded = (newImage: UploadedFile) => {
    setImages((prev) => [newImage, ...prev]);
    setSelectedImageId(newImage.id);
    form.setValue("mainPictureId", newImage.id);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Property
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter property name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CategorySelector
                  categories={categories}
                  value={form.watch("categoryId")}
                  onChange={(categoryId: string) =>
                    form.setValue("categoryId", categoryId)
                  }
                  onCategoryCreated={handleCategoryCreated}
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
                        placeholder="Enter property description"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter province" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Coordinates (Optional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter latitude" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter longitude" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Main Picture Selection */}
              <ImageSelector
                images={images}
                selectedImageId={selectedImageId}
                onImageSelect={(imageId: string) => {
                  setSelectedImageId(imageId);
                  form.setValue("mainPictureId", imageId);
                }}
                onImageUploaded={handleImageUploaded}
                onImagesReload={loadImages}
                type="property"
                title="Main Picture"
              />

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
                  Create Property
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
