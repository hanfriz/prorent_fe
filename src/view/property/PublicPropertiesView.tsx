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
import { Badge } from "@/components/ui/badge";
import { Loader2, Home } from "lucide-react";
import PropertyReviews from "../review/component/propertyReview";

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

        {/* Results Summary and Filters Status */}
        {!loading && !error && (
          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {pagination.totalItems} Properties Found
                </h2>
                <p className="text-gray-600">
                  Showing{" "}
                  {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} -{" "}
                  {Math.min(
                    pagination.currentPage * pagination.itemsPerPage,
                    pagination.totalItems
                  )}{" "}
                  of {pagination.totalItems} results
                </p>
              </div>

              {/* Active Filters Display */}
              {(searchParams.search ||
                searchParams.city ||
                searchParams.category ||
                searchParams.minPrice ||
                searchParams.maxPrice ||
                searchParams.capacity) && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {searchParams.search && (
                    <Badge variant="secondary" className="text-xs">
                      Search: "{searchParams.search}"
                    </Badge>
                  )}
                  {searchParams.city && (
                    <Badge variant="secondary" className="text-xs">
                      City: {searchParams.city}
                    </Badge>
                  )}
                  {searchParams.category && (
                    <Badge variant="secondary" className="text-xs">
                      Category: {searchParams.category}
                    </Badge>
                  )}
                  {searchParams.minPrice && (
                    <Badge variant="secondary" className="text-xs">
                      Min: Rp {searchParams.minPrice.toLocaleString("id-ID")}
                    </Badge>
                  )}
                  {searchParams.maxPrice && (
                    <Badge variant="secondary" className="text-xs">
                      Max: Rp {searchParams.maxPrice.toLocaleString("id-ID")}
                    </Badge>
                  )}
                  {searchParams.capacity && (
                    <Badge variant="secondary" className="text-xs">
                      Capacity: {searchParams.capacity}+
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && properties.length > 0 && (
          <>
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
          <div className="text-center py-16">
            <Home className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No Properties Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any properties matching your criteria. Try
              adjusting your search filters or explore different locations.
            </p>

            {/* Quick Actions for Empty State */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSearchParams({
                    page: 1,
                    limit: 10,
                    sortBy: "name",
                    sortOrder: "asc",
                  });
                  handleSearch({
                    page: 1,
                    limit: 10,
                    sortBy: "name",
                    sortOrder: "asc",
                  });
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Refresh Page
              </button>
            </div>

            {/* Popular Searches */}
            <div className="mt-12">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Popular Destinations
              </h4>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "Jakarta",
                  "Bali",
                  "Bandung",
                  "Yogyakarta",
                  "Surabaya",
                  "Medan",
                ].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      const newParams = { ...searchParams, city, page: 1 };
                      setSearchParams(newParams);
                      handleSearch(newParams);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
