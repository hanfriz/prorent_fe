// review/ReviewControls.tsx
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewControlsProps {
  sortBy: string;
  sortOrder: string;
  filterRating: number | "all";
  totalFiltered: number;
  total: number;
  isLoading: boolean;
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
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

const SortControl = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
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

const FilterControl = ({
  value,
  onChange,
  disabled,
}: {
  value: number | "all";
  onChange: (v: string) => void;
  disabled: boolean;
}) => (
  <div className="flex items-center">
    <label
      htmlFor="filter-select"
      className="mr-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Filter:
    </label>
    <Select
      onValueChange={onChange}
      defaultValue={String(value)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[120px]" id="filter-select">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Stars</SelectItem>
        {[5, 4, 3, 2, 1].map((star) => (
          <SelectItem key={star} value={String(star)}>
            {star} Stars
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

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
