// components/reservations/ReservationFilters.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ReservationStatus } from "@/interface/enumInterface";

interface ReservationFiltersProps {
  onSearch: (term: string) => void;
  onStatusFilter: (status: string | null) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  currentStatus?: string;
}

const reservationStatuses = Object.values(ReservationStatus as any) as string[];

const ReservationFilters = ({
  onSearch,
  onStatusFilter,
  searchTerm,
  setSearchTerm,
  currentStatus,
}: ReservationFiltersProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  const handleStatusChange = (value: string) => {
    onStatusFilter(value === "all" ? null : value);
  };

  const handleClearFilters = () => {
    setLocalSearchTerm("");
    onSearch("");
    onStatusFilter(null);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <form onSubmit={handleSearchSubmit} className="flex-1">
        <Label htmlFor="search" className="text-sm font-medium">
          Search
        </Label>
        <div className="flex gap-2">
          <Input
            id="search"
            type="text"
            placeholder="Search by property, room type..."
            value={localSearchTerm}
            onChange={handleSearchChange}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      <div className="w-full md:w-auto">
        <Label htmlFor="status-filter" className="text-sm font-medium">
          Status
        </Label>
        <Select
          value={currentStatus || "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger id="status-filter" className="w-full md:w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {reservationStatuses.map((status: string) => (
              <SelectItem key={status} value={status}>
                {status.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={handleClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
};

export default ReservationFilters;
