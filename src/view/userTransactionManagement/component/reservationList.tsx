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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Search as SearchIcon,
  X as XIcon,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ReservationStatus } from "@/interface/enumInterface";

interface ReservationFiltersProps {
  onSearch: (term: string) => void;
  onStatusFilter: (status: string | null) => void;
  onDateFilter: (
    startDate: Date | undefined,
    endDate: Date | undefined
  ) => void;
  onSortChange?: (sortOrder: "asc" | "desc" | null) => void; // Added for sort functionality
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  currentStatus?: string;
  startDate?: Date;
  endDate?: Date;
  currentSortOrder?: "asc" | "desc" | null; // Added to track current sort
}

const reservationStatuses = Object.values(ReservationStatus as any) as string[];

const ReservationFilters = ({
  onSearch,
  onStatusFilter,
  onDateFilter,
  onSortChange, // Destructure the new prop
  searchTerm,
  setSearchTerm,
  currentStatus,
  startDate,
  endDate,
  currentSortOrder, // Destructure the new state
}: ReservationFiltersProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(
    startDate
  );
  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(endDate);

  useEffect(() => setLocalSearchTerm(searchTerm), [searchTerm]);
  useEffect(() => setLocalStartDate(startDate), [startDate]);
  useEffect(() => setLocalEndDate(endDate), [endDate]);

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

  const handleStartDateChange = (date: Date | undefined) => {
    setLocalStartDate(date);
    onDateFilter(date, localEndDate);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setLocalEndDate(date);
    onDateFilter(localStartDate, date);
  };

  const handleClearFilters = () => {
    setLocalSearchTerm("");
    setLocalStartDate(undefined);
    setLocalEndDate(undefined);
    if (onSortChange) onSortChange(null); // Reset sort
    onSearch("");
    onStatusFilter(null);
    onDateFilter(undefined, undefined);
  };

  // Handle sort button clicks
  const handleToggleSort = () => {
    if (!onSortChange) return;

    if (currentSortOrder === "asc") {
      onSortChange("desc");
    } else if (currentSortOrder === "desc") {
      onSortChange(null); // bisa reset kalau klik lagi
    } else {
      onSortChange("asc");
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-pr-primary/8 via-pr-bg to-pr-mid/8 shadow-pr-soft border border-pr-mid/10 w-full">
      {/* === SEARCH + SORT SECTION === */}
      <form onSubmit={handleSearchSubmit} className="mb-6 w-full sm:w-xl">
        <Label
          htmlFor="search"
          className="text-sm font-medium text-pr-dark block mb-2"
        >
          Search
        </Label>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-1 min-w-0">
            <Input
              id="search"
              type="text"
              placeholder="Search by property, room type..."
              value={localSearchTerm}
              onChange={handleSearchChange}
              className="pr-10 lg:w-full"
              aria-label="Search reservations"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-pr-mid">
              <SearchIcon className="h-4 w-4" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="bg-pr-primary hover:bg-pr-mid text-white whitespace-nowrap cursor-pointer"
            >
              Search
            </Button>
          </div>
        </div>
      </form>

      {/* === FILTERS SECTION === */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 w-full md:w-xl">
        {/* STATUS FILTER */}
        <div className="w-full md:max-w-xl flex-1">
          <Label
            htmlFor="status-filter"
            className="text-sm font-medium text-pr-dark block mb-2"
          >
            Status
          </Label>
          <Select
            value={currentStatus || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status-filter" className="w-full">
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

        {/* DATE RANGE FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-xl">
          {/* CHECK-IN */}
          <div>
            <Label
              htmlFor="start-date"
              className="text-sm font-medium text-pr-dark block mb-2"
            >
              Check-in
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="start-date"
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-2 justify-start rounded-lg border px-3 py-2 text-sm bg-white cursor-pointer",
                    !localStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-4 w-4 text-pr-mid" />
                  {localStartDate ? (
                    format(localStartDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={localStartDate}
                  onSelect={handleStartDateChange}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* CHECK-OUT */}
          <div>
            <Label
              htmlFor="end-date"
              className="text-sm font-medium text-pr-dark block mb-2"
            >
              Check-out
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="end-date"
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-2 justify-start rounded-lg border px-3 py-2 text-sm bg-white cursor-pointer",
                    !localEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-4 w-4 text-pr-mid" />
                  {localEndDate ? (
                    format(localEndDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={localEndDate}
                  onSelect={handleEndDateChange}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* CLEAR BUTTON */}
        <div className="self-end md:self-end">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="w-full md:w-auto mt-6 md:mt-0 border-pr-mid text-pr-mid hover:bg-pr-primary/6 whitespace-nowrap cursor-pointer"
          >
            <XIcon className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReservationFilters;
