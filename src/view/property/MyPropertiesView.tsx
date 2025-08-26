"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OwnerProperty } from "@/interface/ownerPropertyInterface";
import { OwnerPropertyCard } from "@/components/property/OwnerPropertyCard";
import { ownerPropertyService } from "@/service/ownerPropertyService";
import { Plus, Loader2, Home, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function MyPropertiesView() {
  const router = useRouter();
  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ownerPropertyService.getMyProperties();

      if (response.success) {
        setProperties(response.data);
      } else {
        setError("Failed to fetch your properties");
      }
    } catch (err: any) {
      console.error("Error fetching my properties:", err);

      if (err.response?.status === 401) {
        setError("Please login to access your properties");
        router.push("/login");
      } else if (err.response?.status === 403) {
        setError(
          "You don't have permission to access this page. Owner account required."
        );
      } else if (err.code === "ECONNREFUSED") {
        setError(
          "Unable to connect to server. Please check if the backend is running."
        );
      } else if (err.response?.status === 404) {
        setError(
          "API endpoint not found. Please check the backend configuration."
        );
      } else if (err.response?.status >= 500) {
        setError("Server error occurred. Please try again later.");
      } else {
        setError("Failed to fetch your properties. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleting(propertyId);

      const response = await ownerPropertyService.deleteProperty(propertyId);

      if (response.success) {
        setProperties((prev) => prev.filter((p) => p.id !== propertyId));
        toast.success("Property deleted successfully");
      } else {
        toast.error("Failed to delete property");
      }
    } catch (err: any) {
      console.error("Error deleting property:", err);

      if (err.response?.status === 401) {
        toast.error("Please login to delete properties");
        router.push("/login");
      } else if (err.response?.status === 403) {
        toast.error("You don't have permission to delete this property");
      } else if (err.response?.status === 404) {
        toast.error("Property not found");
      } else {
        toast.error("Failed to delete property. Please try again.");
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (propertyId: string) => {
    router.push(`/properties/${propertyId}/edit`);
  };

  const handleView = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  const handleCreateNew = () => {
    router.push("/my-properties/create");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                My Properties
              </h1>
              <p className="text-lg text-gray-600">
                Manage your property listings and bookings
              </p>
            </div>
            <Button onClick={handleCreateNew} className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Property
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Properties Grid */}
        {!error && properties.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {properties.length} Properties Found
              </h2>
              <p className="text-gray-600">
                Your property listings and their current status
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="relative">
                  <OwnerPropertyCard
                    property={property}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onView={handleView}
                  />
                  {deleting === property.id && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <Loader2 className="h-6 w-6 animate-spin text-red-600 mx-auto mb-2" />
                        <p className="text-sm text-red-600">Deleting...</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!error && properties.length === 0 && (
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Properties Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't created any properties yet. Start by adding your first
              property to begin receiving bookings.
            </p>
            <Button
              onClick={handleCreateNew}
              className="flex items-center mx-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Property
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
