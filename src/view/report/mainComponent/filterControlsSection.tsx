// src/app/dashboard/report/main/components/FilterControlsSection.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FilterControls } from "@/view/dashboard/component/propertiesOverviewComponent/filterControl";
import { Property, RoomTypeMin } from "@/interface/report/reportInterface";

interface Props {
  dateRange: any;
  dateRangeType: string;
  selectedPropertyId: string;
  selectedRoomTypeId: string;
  isRoomTypeFilterDisabled: boolean;
  searchTerm: string;
  appliedSearchTerm: string;
  sortBy: string;
  sortDir: "asc" | "desc";
  allProperties: Property[];
  roomTypesForSelectedProperty: RoomTypeMin[];
  onResetFilters: () => void;
  onDownload: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onSortChange: (value: string) => void;
  onSortDirectionChange: () => void;
  onDateRangeTypeChange: (value: string) => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onCustomStartDateChange: (date: Date | null) => void;
  onCustomEndDateChange: (date: Date | null) => void;
  onApplyDates: () => void;
  onPropertyChange: (value: string) => void;
  onRoomTypeChange: (value: string) => void;
}

export const FilterControlsSection: React.FC<Props> = ({
  dateRange,
  dateRangeType,
  selectedPropertyId,
  selectedRoomTypeId,
  isRoomTypeFilterDisabled,
  searchTerm,
  appliedSearchTerm,
  sortBy,
  sortDir,
  allProperties,
  roomTypesForSelectedProperty,
  onResetFilters,
  onDownload,
  // Destructure the handler props
  onSearchChange,
  onSearch,
  onSortChange,
  onSortDirectionChange,
  onDateRangeTypeChange,
  onYearChange,
  onMonthChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
  onApplyDates,
  onPropertyChange,
  onRoomTypeChange,
}) => {
  const dateRangeOptions = [
    { value: "year", label: "Year" },
    { value: "month", label: "Month" },
    { value: "custom", label: "Custom" },
  ];

  const sortOptions = [
    { value: "name", label: "Property Name" },
    { value: "revenue", label: "Revenue" },
    { value: "city", label: "City" },
    { value: "address", label: "Address" },
    { value: "province", label: "Province" },
  ];

  const propertyOptions = [
    { value: "all", label: "All Properties" },
    ...allProperties.map((p: Property) => ({ value: p.id, label: p.name })),
  ];

  const roomTypeOptions = [
    { value: "all", label: "All Room Types" },
    ...roomTypesForSelectedProperty.map((rt: RoomTypeMin) => ({
      value: rt.id,
      label: rt.name,
    })),
  ];

  return (
    <Card>
      <CardContent className="p-0">
        <FilterControls
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onSearch={onSearch}
          sortBy={sortBy}
          sortDir={sortDir}
          sortOptions={sortOptions}
          onSortChange={onSortChange}
          onSortDirectionChange={onSortDirectionChange}
          dateRangeOptions={dateRangeOptions}
          dateRangeType={dateRangeType}
          onDateRangeTypeChange={onDateRangeTypeChange}
          selectedYear={
            dateRange.startDate?.getFullYear() || new Date().getFullYear()
          }
          selectedMonth={dateRange.startDate?.getMonth() + 1 || 1}
          customStartDate={dateRange.startDate}
          customEndDate={dateRange.endDate}
          onYearChange={onYearChange}
          onMonthChange={onMonthChange}
          onCustomStartDateChange={onCustomStartDateChange}
          onCustomEndDateChange={onCustomEndDateChange}
          onApplyDates={onApplyDates}
          propertyOptions={propertyOptions}
          selectedPropertyId={selectedPropertyId}
          onPropertyChange={onPropertyChange}
          roomTypeOptions={roomTypeOptions}
          selectedRoomTypeId={selectedRoomTypeId}
          onRoomTypeChange={onRoomTypeChange}
          isRoomTypeFilterDisabled={isRoomTypeFilterDisabled}
          onResetFilters={onResetFilters}
          onDownload={onDownload}
        />
      </CardContent>
    </Card>
  );
};
