// components/review/ReviewControls.tsx
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// ✅ Define valid sort & filter values
type SortBy = "createdAt" | "rating";
type SortOrder = "desc" | "asc";
type FilterRating = "all" | "5" | "4" | "3" | "2" | "1";

interface ReviewControlsProps {
  sortBy: SortBy;
  sortOrder: SortOrder;
  filterRating: FilterRating;
  totalFiltered: number;
  total: number;
  isLoading: boolean;
  onSortChange: (value: `${SortBy}-${SortOrder}`) => void;
  onFilterChange: (value: FilterRating) => void;
}

export const ReviewControls = ({
  sortBy,
  sortOrder,
  filterRating,
  totalFiltered,
  total,
  isLoading,
  onSortChange,
  onFilterChange,
}: ReviewControlsProps) => {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-4 py-3 border-y border-gray-200 dark:border-gray-700">
      <SortControl
        value={`${sortBy}-${sortOrder}`}
        onChange={onSortChange}
        disabled={isLoading}
      />
      <FilterControl
        value={filterRating}
        onChange={onFilterChange}
        disabled={isLoading}
      />
      <ReviewCountInfo
        isLoading={isLoading}
        count={totalFiltered}
        total={total}
      />
    </div>
  );
};

// --- Sort Control ---
const SortControl = ({
  value,
  onChange,
  disabled,
}: {
  value: `${SortBy}-${SortOrder}`;
  onChange: (value: `${SortBy}-${SortOrder}`) => void;
  disabled: boolean;
}) => (
  <div className="flex items-center">
    <label
      htmlFor="sort-select"
      className="mr-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Sort by:
    </label>
    <Select onValueChange={onChange} defaultValue={value} disabled={disabled}>
      <SelectTrigger className="w-[180px]" id="sort-select">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="createdAt-desc">Newest</SelectItem>
        <SelectItem value="createdAt-asc">Oldest</SelectItem>
        <SelectItem value="rating-desc">Highest Rating</SelectItem>
        <SelectItem value="rating-asc">Lowest Rating</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

// --- Filter Control ---
const FilterControl = ({
  value,
  onChange,
  disabled,
}: {
  value: FilterRating;
  onChange: (value: FilterRating) => void;
  disabled: boolean;
}) => (
  <div className="flex items-center">
    <label
      htmlFor="filter-select"
      className="mr-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Filter:
    </label>
    <Select onValueChange={onChange} defaultValue={value} disabled={disabled}>
      <SelectTrigger className="w-[120px]" id="filter-select">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Stars</SelectItem>
        <SelectItem value="5">5 Stars</SelectItem>
        <SelectItem value="4">4 Stars</SelectItem>
        <SelectItem value="3">3 Stars</SelectItem>
        <SelectItem value="2">2 Stars</SelectItem>
        <SelectItem value="1">1 Star</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

// --- Count Display ---
const ReviewCountInfo = ({
  isLoading,
  count,
  total,
}: {
  isLoading: boolean;
  count: number;
  total: number;
}) => {
  return (
    <div className="text-sm text-gray-700 dark:text-gray-400 ms-auto">
      {isLoading ? (
        <Skeleton className="h-4 w-40 ml-auto" />
      ) : (
        <>
          Showing <b>{count}</b> of <b>{total}</b> Reviews
        </>
      )}
    </div>
  );
};
