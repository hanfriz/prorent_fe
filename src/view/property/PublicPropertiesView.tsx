"use client";

import { useState, useEffect } from "react";
import { publicPropertyService } from "@/service/publicPropertyService";
import {
  PublicProperty,
  PropertySearchParams,
} from "@/interface/publicPropertyInterface";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { PropertyPagination } from "@/components/property/PropertyPagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Home } from "lucide-react";

export default function PublicPropertiesView() {
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchProperties = async (params?: PropertySearchParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await publicPropertyService.getPublicProperties(params);

      if (response.success) {
        setProperties(response.data);
        setPagination(response.pagination);
      } else {
        setError("Failed to fetch properties");
      }
    } catch (err: any) {
      console.error("Error fetching properties:", err);

      // Better error handling based on error type
      if (err.code === "ECONNREFUSED") {
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
        setError("Failed to fetch properties. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (searchParams: PropertySearchParams) => {
    fetchProperties(searchParams);
  };

  const handlePageChange = (page: number) => {
    fetchProperties({ page, limit: pagination.itemsPerPage });
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Property
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover amazing properties for rent across Indonesia. From cozy
              homestays to luxury villas.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <PropertyFilters onSearch={handleSearch} loading={loading} />

        {/* Error Message */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading properties...</span>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && properties.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {pagination.totalItems} Properties Found
              </h2>
              <p className="text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            <PropertyPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && !error && (
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any properties matching your criteria. Try
              adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
