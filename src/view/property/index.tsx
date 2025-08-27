"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MapPin,
  Calendar,
  Building,
  Users,
  Star,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { propertyService } from "@/service/propertyService";
import { Property } from "@/interface/propertyInterface";

export default function PropertiesListView() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const response = await propertyService.getMyProperties();
      if (response.success) {
        setProperties(response.data);
      }
    } catch (error) {
      console.error("Error loading properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Properties</h1>
          <p className="text-gray-600 mt-2">
            Manage your property listings and track performance
          </p>
        </div>
        <Button
          onClick={() => router.push("/my-properties/create")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Property
        </Button>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Properties Yet</h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first property listing
            </p>
            <Button
              onClick={() => router.push("/my-properties/create")}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Create Your First Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-video">
                {property.mainPicture?.url ? (
                  <img
                    src={property?.mainPicture?.url || "/prorent-logo.png"}
                    alt={property?.mainPicture?.alt || property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Building className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <Badge className="absolute top-2 right-2">
                  {property.category?.name || "Uncategorized"}
                </Badge>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                  {property.name}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {property.description}
                </p>

                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">
                    {property.location?.city?.name},{" "}
                    {property.location?.city?.province?.name}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {property._count?.rooms || property.rooms?.length || 0}{" "}
                      Rooms
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(property.createdAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/properties/${property.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/properties/${property.id}/edit`)
                    }
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
