// src/view/report/component/FilterControls.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { FilterControlsProps } from "@/interface/report/reportInterface";

// Define types for flexibility
export type DateRangeOption = {
  value: string;
  label: string;
};

export type SortOption = {
  value: string;
  label: string;
};

// Define specific props for the updated component
interface UpdatedFilterControlsProps {
  // Search
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;

  // Sorting
  sortBy: string;
  sortDir: "asc" | "desc";
  sortOptions: SortOption[]; // Make sort options configurable
  onSortChange: (value: string) => void;
  onSortDirectionChange: () => void;

  // Date Range
  dateRangeOptions: DateRangeOption[]; // Make date range options configurable
  dateRangeType: string;
  selectedYear: number;
  selectedMonth: number; // 1-12
  customStartDate: Date | null;
  customEndDate: Date | null;
  onDateRangeTypeChange: (value: string) => void;
  onYearChange: (value: number) => void;
  onMonthChange: (value: number) => void; // 1-12
  onCustomStartDateChange: (value: Date | null) => void;
  onCustomEndDateChange: (value: Date | null) => void;
  onApplyDates: () => void;

  // Property Filter
  propertyOptions: { value: string; label: string }[]; // Includes 'all'
  selectedPropertyId: string; // 'all' or specific ID
  onPropertyChange: (value: string) => void;

  // Room Type Filter (conditional on property selection)
  roomTypeOptions: { value: string; label: string }[]; // Includes 'all'
  selectedRoomTypeId: string; // 'all' or specific ID
  onRoomTypeChange: (value: string) => void;
  isRoomTypeFilterDisabled: boolean; // Disable if no property selected

  // Actions
  onResetFilters: () => void;
  onDownload: () => void; // New prop for download action
}

export function FilterControls({
  // Search
  searchTerm,
  onSearchChange,
  onSearch,
  // Sorting
  sortBy,
  sortDir,
  sortOptions,
  onSortChange,
  onSortDirectionChange,
  // Date Range
  dateRangeOptions,
  dateRangeType,
  selectedYear,
  selectedMonth,
  customStartDate,
  customEndDate,
  onDateRangeTypeChange,
  onYearChange,
  onMonthChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
  onApplyDates,
  // Property Filter
  propertyOptions,
  selectedPropertyId,
  onPropertyChange,
  // Room Type Filter
  roomTypeOptions,
  selectedRoomTypeId,
  onRoomTypeChange,
  isRoomTypeFilterDisabled,
  // Actions
  onResetFilters,
  onDownload,
}: UpdatedFilterControlsProps) {
  return (
    <div className="px-6 pb-4 space-y-4">
      {/* Date Range Controls */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Period Select */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Period</label>
          <Select value={dateRangeType} onValueChange={onDateRangeTypeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Year</label>
          <Input
            type="number"
            value={selectedYear}
            onChange={(e) => {
              const yearValue = Number(e.target.value);
              // Basic validation to prevent invalid years
              if (!isNaN(yearValue) && yearValue >= 1900 && yearValue <= 2200) {
                onYearChange(yearValue);
              }
            }}
            min="1900" // Reasonable min year
            max="2200" // Reasonable max year
            className="w-[100px]"
          />
        </div>

        {/* Month Select (conditional) */}
        {dateRangeType === "month" && (
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Month</label>
            <Select
              value={selectedMonth.toString()}
              onValueChange={(v) => onMonthChange(Number(v))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {/* Ensure months are 1-indexed for display and value */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <SelectItem key={m} value={m.toString()}>
                    {format(new Date(2000, m - 1, 1), "MMMM")}{" "}
                    {/* Use a valid year for formatting */}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Custom Date Inputs (conditional) */}
        {dateRangeType === "custom" && (
          <>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Start Date</label>
              <Input
                type="date"
                value={
                  customStartDate ? format(customStartDate, "yyyy-MM-dd") : ""
                }
                onChange={(e) => {
                  // Handle potential null value from valueAsDate if parsing fails
                  const dateValue =
                    e.target.valueAsDate ??
                    (e.target.value ? new Date(e.target.value) : null);
                  onCustomStartDateChange(dateValue);
                }}
                max={
                  customEndDate
                    ? format(customEndDate, "yyyy-MM-dd")
                    : undefined
                } // Prevent start date after end date
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">End Date</label>
              <Input
                type="date"
                value={customEndDate ? format(customEndDate, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  // Handle potential null value from valueAsDate if parsing fails
                  const dateValue =
                    e.target.valueAsDate ??
                    (e.target.value ? new Date(e.target.value) : null);
                  onCustomEndDateChange(dateValue);
                }}
                min={
                  customStartDate
                    ? format(customStartDate, "yyyy-MM-dd")
                    : undefined
                } // Prevent end date before start date
              />
            </div>
          </>
        )}

        {/* Apply Dates Button */}
        <Button onClick={onApplyDates}>Apply Dates</Button>
      </div>

      {/* Property, Room Type, Search, Sort, Actions */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Property Filter Dropdown */}
        <div className="flex flex-col min-w-[200px]">
          <label className="text-sm font-medium mb-1">Property</label>
          <Select value={selectedPropertyId} onValueChange={onPropertyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Property" />
            </SelectTrigger>
            <SelectContent>
              {/* Ensure "all" option is present and first */}
              <SelectItem value="all">All Properties</SelectItem>
              {propertyOptions
                .filter((option) => option.value !== "all") // Filter out "all" if it exists in propertyOptions
                .map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Room Type Filter Dropdown */}
        <div className="flex flex-col min-w-[200px]">
          <label className="text-sm font-medium mb-1">Room Type</label>
          <Select
            value={selectedRoomTypeId}
            onValueChange={onRoomTypeChange}
            disabled={isRoomTypeFilterDisabled}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  isRoomTypeFilterDisabled
                    ? "Select Property First"
                    : "Select Room Type"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {/* Ensure "all" option is present and first */}
              <SelectItem value="all">All Room Types</SelectItem>
              {roomTypeOptions
                .filter((option) => option.value !== "all") // Filter out "all" if it exists in roomTypeOptions
                .map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search properties or room types..."
            value={searchTerm}
            onChange={onSearchChange}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2 flex-wrap">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={onSortDirectionChange}
            className="flex items-center"
            aria-label={
              sortDir === "asc" ? "Sort descending" : "Sort ascending"
            }
          >
            {sortDir === "asc" ? "↑ Asc" : "↓ Desc"}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={onSearch}
            className="cursor-pointer"
          >
            Search
          </Button>
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="cursor-pointer"
          >
            Reset
          </Button>
          <Button onClick={onDownload} className="cursor-pointer">
            Download Report
          </Button>
        </div>
      </div>
    </div>
  );
}
