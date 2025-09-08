"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertySearchParams } from "@/interface/publicPropertyInterface";
import { Search, Filter, X } from "lucide-react";

interface PropertyFiltersProps {
  onSearch: (params: PropertySearchParams) => void;
  loading?: boolean;
}

export function PropertyFilters({ onSearch, loading }: PropertyFiltersProps) {
  const [searchParams, setSearchParams] = useState<PropertySearchParams>({
    page: 1,
    limit: 10,
    sortBy: "name",
    sortOrder: "asc",
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleInputChange = (
    field: keyof PropertySearchParams,
    value: string | number
  ) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value === "" || value === undefined ? undefined : value,
    }));
  };

  const handleSelectChange = (
    field: keyof PropertySearchParams,
    value: string | undefined
  ) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value === undefined || value === "" ? undefined : value,
    }));
  };

  const handleSearch = () => {
    onSearch(searchParams);
  };

  const handleReset = () => {
    const resetParams = {
      page: 1,
      limit: 10,
      sortBy: "name",
      sortOrder: "asc" as const,
    };
    setSearchParams(resetParams);
    onSearch(resetParams);
  };

  const cities = [
    "Jakarta",
    "Surabaya",
    "Bandung",
    "Medan",
    "Semarang",
    "Makassar",
    "Palembang",
    "Tangerang",
    "Depok",
    "Bekasi",
    "Yogyakarta",
    "Malang",
    "Bali",
    "Batam",
    "Denpasar",
    "Padang",
    "Balikpapan",
    "Pekanbaru",
  ];

  const categories = [
    "Villa",
    "Apartment",
    "Homestay",
    "Hotel",
    "Guest House",
    "Kost",
    "Resort",
    "Penginapan",
  ];

  const sortOptions = [
    { value: "name", label: "Property Name" },
    { value: "price", label: "Price" },
    { value: "createdAt", label: "Date Added" },
    { value: "capacity", label: "Capacity" },
  ];

  const priceRanges = [
    { label: "Under 100K", min: 0, max: 100000 },
    { label: "100K - 300K", min: 100000, max: 300000 },
    { label: "300K - 500K", min: 300000, max: 500000 },
    { label: "500K - 1M", min: 500000, max: 1000000 },
    { label: "Above 1M", min: 1000000, max: undefined },
  ];

  const handlePriceRangeSelect = (range: (typeof priceRanges)[0]) => {
    setSearchParams((prev) => ({
      ...prev,
      minPrice: range.min,
      maxPrice: range.max,
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Properties
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search" className="mb-2 block">
              Search Keywords
            </Label>
            <Input
              id="search"
              placeholder="e.g., villa, apartment, beach..."
              value={searchParams.search || ""}
              onChange={(e) => handleInputChange("search", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-5 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="mb-2 block">
                City
              </Label>
              <Select
                value={searchParams.city || undefined}
                onValueChange={(value) => handleSelectChange("city", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category" className="mb-2 block">
                Category
              </Label>
              <Select
                value={searchParams.category || undefined}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="ml-8 justify-start items-end flex">
              <Button
                variant="outline"
                size="lg"
                className="h-9"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="border-t pt-4 space-y-4">
            {/* Price Range Quick Select */}
            <div>
              <Label className="mb-2 block">
                Quick Price Range (IDR per night)
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {priceRanges.map((range, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePriceRangeSelect(range)}
                    className="text-xs"
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="minPrice" className="mb-2 block">
                  Min Price (IDR)
                </Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="e.g., 100000"
                  value={searchParams.minPrice || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "minPrice",
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                />
                {searchParams.minPrice !== undefined &&
                  searchParams.minPrice !== null && (
                    <p className="text-xs text-gray-500 mt-1">
                      Rp {searchParams.minPrice.toLocaleString("id-ID")}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="maxPrice" className="mb-2 block">
                  Max Price (IDR)
                </Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="e.g., 1000000"
                  value={searchParams.maxPrice || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "maxPrice",
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                />
                {searchParams.maxPrice !== undefined &&
                  searchParams.maxPrice !== null && (
                    <p className="text-xs text-gray-500 mt-1">
                      Rp {searchParams.maxPrice.toLocaleString("id-ID")}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="capacity" className="mb-2 block">
                  Max Capacity
                </Label>
                <Select
                  value={searchParams.capacity?.toString() || undefined}
                  onValueChange={(value) => {
                    if (value) {
                      handleInputChange("capacity", parseInt(value));
                    } else {
                      handleSelectChange("capacity", undefined);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} guests
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sortBy" className="mb-2 block">
                  Sort By
                </Label>
                <Select
                  value={searchParams.sortBy || "name"}
                  onValueChange={(value) => handleSelectChange("sortBy", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <Label
                htmlFor="sortOrder"
                className="mb-2 sm:mb-0 block sm:inline"
              >
                Sort Order:
              </Label>
              <Select
                value={searchParams.sortOrder || "asc"}
                onValueChange={(value) =>
                  handleSelectChange("sortOrder", value)
                }
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">
                    {searchParams.sortBy === "price"
                      ? "Cheapest First"
                      : searchParams.sortBy === "name"
                      ? "A to Z"
                      : searchParams.sortBy === "capacity"
                      ? "Smallest First"
                      : "Oldest First"}
                  </SelectItem>
                  <SelectItem value="desc">
                    {searchParams.sortBy === "price"
                      ? "Most Expensive First"
                      : searchParams.sortBy === "name"
                      ? "Z to A"
                      : searchParams.sortBy === "capacity"
                      ? "Largest First"
                      : "Newest First"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Searching..." : "Search Properties"}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 sm:flex-none"
          >
            <X className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
