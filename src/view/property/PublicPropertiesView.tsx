"use client";

import { useState } from "react";
import { usePublicProperties } from "@/service/useProperty";
import {
  PublicProperty,
  PropertySearchParams,
} from "@/interface/publicPropertyInterface";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { PropertyPagination } from "@/components/property/PropertyPagination";
import { PropertyListSkeleton } from "@/components/sekeleton/PropertySkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Home } from "lucide-react";

export default function PublicPropertiesView() {
  const [searchParams, setSearchParams] = useState<PropertySearchParams>({
    page: 1,
    limit: 10,
  });

  // Use TanStack Query hook
  const {
    data: response,
    isLoading: loading,
    error,
  } = usePublicProperties(searchParams);

  // Extract data from response
  const properties = response?.success ? response.data : [];
  const pagination = response?.success
    ? response.pagination
    : {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

  const handleSearch = (newParams: PropertySearchParams) => {
    setSearchParams({ ...newParams, page: 1 }); // Reset to page 1 when filters change
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ ...searchParams, page });
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format error message
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Failed to fetch properties. Please try again.";

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
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && <PropertyListSkeleton />}

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
