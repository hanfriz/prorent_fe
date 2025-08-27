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
  ];

  const categories = [
    "Villa",
    "Apartment",
    "Homestay",
    "Hotel",
    "Guest House",
    "Kost",
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Properties
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Search Keywords</Label>
            <Input
              id="search"
              placeholder="e.g., villa, apartment, beach..."
              value={searchParams.search || ""}
              onChange={(e) => handleInputChange("search", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
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
            <Label htmlFor="category">Category</Label>
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
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="minPrice">Min Price (IDR)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="100000"
                  value={searchParams.minPrice || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "minPrice",
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="maxPrice">Max Price (IDR)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="1000000"
                  value={searchParams.maxPrice || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "maxPrice",
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="capacity">Max Capacity</Label>
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
                <Label htmlFor="sortBy">Sort By</Label>
                <Select
                  value={searchParams.sortBy || "name"}
                  onValueChange={(value) => handleSelectChange("sortBy", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="capacity">Capacity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="sortOrder">Sort Order:</Label>
              <Select
                value={searchParams.sortOrder || "asc"}
                onValueChange={(value) =>
                  handleSelectChange("sortOrder", value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
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
