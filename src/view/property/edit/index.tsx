"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Property } from "@/interface/propertyInterface";
import { propertyService } from "@/service/propertyService";
import { editPropertySchema, EditPropertyFormData } from "@/validation/propertyValidation";
import { SimpleCategorySelector } from "../component/SimpleCategorySelector";
import { SimpleImageSelector } from "../component/SimpleImageSelector";
import { LocationSearchMap, LocationData } from "@/components/map";
import { ArrowLeft, Save } from "lucide-react";

interface EditPropertyViewProps {
  propertyId: string;
}

export default function EditPropertyView({
  propertyId,
}: EditPropertyViewProps) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<EditPropertyFormData>({
    resolver: zodResolver(editPropertySchema),
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
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getPropertyById(propertyId);
      const propertyData = response.data;
      setProperty(propertyData);

      // Populate form with existing data
      form.reset({
        name: propertyData.name,
        description: propertyData.description,
        location: propertyData.location?.address || "",
        city: typeof propertyData.location?.city === 'string' 
          ? propertyData.location.city 
          : propertyData.location?.city?.name || "",
        province: propertyData.location?.city?.province?.name || "",
        categoryId: propertyData.categoryId,
        mainPictureId: propertyData.mainPictureId || "",
        latitude: propertyData.location?.latitude?.toString() || "",
        longitude: propertyData.location?.longitude?.toString() || "",
      });
    } catch (error: any) {
      toast.error("Failed to load property details");
      console.error("Error loading property:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: EditPropertyFormData) => {
    try {
      setSubmitting(true);
      await propertyService.updateProperty(propertyId, data);
      toast.success("Property updated successfully!");
      router.push(`/properties/${propertyId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update property");
      console.error("Error updating property:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLocationSelect = (locationData: LocationData) => {
    form.setValue("location", locationData.address);
    form.setValue("city", locationData.city);
    form.setValue("province", locationData.province);
    form.setValue("latitude", locationData.latitude.toString());
    form.setValue("longitude", locationData.longitude.toString());
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Property not found</p>
            <Button 
              variant="outline" 
              onClick={() => router.push("/properties")}
              className="mt-4"
            >
              Back to Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => router.push(`/properties/${propertyId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Property</h1>
          <p className="text-muted-foreground">
            Update information for "{property.name}"
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
          <CardDescription>
            Update your property details and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter property name" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category Selector */}
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <FormControl>
                        <SimpleCategorySelector
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your property..."
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Property address" 
                          {...field} 
                        />
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
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="City name" 
                          {...field} 
                        />
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
                      <FormLabel>Province *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Province name" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location Search Map */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Update Location</Label>
                <p className="text-sm text-gray-600">
                  Use the map below to search and update the location of your property. 
                  You can search by address or click directly on the map.
                </p>
                <LocationSearchMap
                  onLocationSelect={handleLocationSelect}
                  initialLocation={
                    form.watch("latitude") && form.watch("longitude")
                      ? {
                          address: form.watch("location") || "",
                          city: form.watch("city") || "",
                          province: form.watch("province") || "",
                          latitude: parseFloat(form.watch("latitude") || "0"),
                          longitude: parseFloat(form.watch("longitude") || "0"),
                        }
                      : undefined
                  }
                  className="mt-2"
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., -8.4095" 
                          {...field} 
                        />
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
                        <Input 
                          placeholder="e.g., 115.1889" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Main Picture */}
              <FormField
                control={form.control}
                name="mainPictureId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Picture *</FormLabel>
                    <FormControl>
                      <SimpleImageSelector
                        value={field.value}
                        onValueChange={field.onChange}
                        type="property"
                        label="Select Main Picture"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Buttons */}
              <div className="flex items-center gap-4 pt-6">
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="min-w-32"
                >
                  {submitting ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Property
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push(`/properties/${propertyId}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
