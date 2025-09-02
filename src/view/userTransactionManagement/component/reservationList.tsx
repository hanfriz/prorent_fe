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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
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
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  currentStatus?: string;
  startDate?: Date;
  endDate?: Date;
}

const reservationStatuses = Object.values(ReservationStatus as any) as string[];

const ReservationFilters = ({
  onSearch,
  onStatusFilter,
  onDateFilter,
  searchTerm,
  setSearchTerm,
  currentStatus,
  startDate,
  endDate,
}: ReservationFiltersProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(
    startDate
  );
  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(endDate);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setLocalStartDate(startDate);
  }, [startDate]);

  useEffect(() => {
    setLocalEndDate(endDate);
  }, [endDate]);

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
    onSearch("");
    onStatusFilter(null);
    onDateFilter(undefined, undefined);
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

      <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
        <div className="flex flex-col">
          <Label htmlFor="start-date" className="text-sm font-medium">
            Check-in
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant={"outline"}
                className={cn(
                  "w-full md:w-[180px] justify-start text-left font-normal",
                  !localStartDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localStartDate ? (
                  format(localStartDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={localStartDate}
                onSelect={handleStartDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col">
          <Label htmlFor="end-date" className="text-sm font-medium">
            Check-out
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant={"outline"}
                className={cn(
                  "w-full md:w-[180px] justify-start text-left font-normal",
                  !localEndDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localEndDate ? (
                  format(localEndDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
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

      <Button
        variant="outline"
        onClick={handleClearFilters}
        className="mt-4 md:mt-0"
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default ReservationFilters;
