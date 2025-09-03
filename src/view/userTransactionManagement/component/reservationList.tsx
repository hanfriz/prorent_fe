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
import { CalendarIcon, Search as SearchIcon, X as XIcon } from "lucide-react";
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
    onSearch("");
    onStatusFilter(null);
    onDateFilter(undefined, undefined);
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-pr-primary/8 via-pr-bg to-pr-mid/8 shadow-pr-soft border border-pr-mid/10">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col md:flex-row md:items-end gap-4"
      >
        {/* Search */}
        <div className="flex-1 min-w-0">
          <Label htmlFor="search" className="text-sm font-medium text-pr-dark">
            Search
          </Label>
          <div className="mt-2 flex gap-2">
            <div className="relative flex-1">
              <Input
                id="search"
                type="text"
                placeholder="Search by property, room type..."
                value={localSearchTerm}
                onChange={handleSearchChange}
                className="pr-10"
                aria-label="Search reservations"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-pr-mid">
                <SearchIcon className="h-4 w-4" />
              </div>
            </div>

            <Button
              type="submit"
              className="bg-pr-primary hover:bg-pr-mid text-white"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="w-full md:w-[220px]">
          <Label
            htmlFor="status-filter"
            className="text-sm font-medium text-pr-dark"
          >
            Status
          </Label>
          <Select
            value={currentStatus || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status-filter" className="w-full mt-2">
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

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div>
            <Label
              htmlFor="start-date"
              className="text-sm font-medium text-pr-dark"
            >
              Check-in
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="start-date"
                  type="button"
                  className={cn(
                    "mt-2 w-full md:w-[180px] flex items-center gap-2 justify-start rounded-lg border px-3 py-2 text-sm bg-white",
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
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label
              htmlFor="end-date"
              className="text-sm font-medium text-pr-dark"
            >
              Check-out
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="end-date"
                  type="button"
                  className={cn(
                    "mt-2 w-full md:w-[180px] flex items-center gap-2 justify-start rounded-lg border px-3 py-2 text-sm bg-white",
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

        {/* Clear */}
        <div className="self-start md:self-end">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="mt-2 md:mt-0 border-pr-mid text-pr-mid hover:bg-pr-primary/6"
          >
            <XIcon className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReservationFilters;
