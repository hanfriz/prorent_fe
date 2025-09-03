// src/app/dashboard/report/main/page.tsx
"use client";

import React from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { ReportPageSkeleton } from "./mainComponent/reportPageSkeleton";
import { FilterControlsSection } from "./mainComponent/filterControlsSection";
import { GlobalStatsSection } from "./mainComponent/globalStatsSection";
import { PropertyListSection } from "./mainComponent/propertyListSection";
import { useReportFilters } from "./mainComponent/hooks/useReportFilters";
import { useReportData } from "./mainComponent/hooks/useReportData";

export default function MainReportPage() {
  const { user: authUser } = useAuth();
  const ownerId = authUser?.id;

  const {
    filters,
    options,
    dateRange,
    dateRangeType,
    selectedPropertyId,
    selectedRoomTypeId,
    searchTerm,
    appliedSearchTerm,
    sortBy,
    sortDir,
    reservationPageMap,
    isLoadingProperties,
    roomTypesForSelectedProperty,
    allProperties,
    // Get all the handler functions
    handleSearchChange,
    handleSearch,
    handleSortChange,
    handleSortDirectionChange,
    handleDateRangeTypeChange,
    handleYearChange,
    handleMonthChange,
    handleCustomStartDateChange,
    handleCustomEndDateChange,
    handleApplyDates,
    handlePropertyChange,
    handleRoomTypeChange,
    handleReservationPageChange,
    handleDownloadReport,
    handleDownloadRoomTypeReport,
    handleResetFilters,
    handleReservationFilterChange, // Add this
  } = useReportFilters(ownerId);

  const {
    data: reportData,
    isLoading: isReportLoading,
    isError: isReportError,
  } = useReportData(filters, options, !!ownerId);

  if (isReportLoading || isLoadingProperties) return <ReportPageSkeleton />;

  if (isReportError)
    return <div className="text-red-500 p-6">Error loading report data.</div>;

  if (!ownerId) {
    return (
      <div className="container mx-auto py-8">
        Please log in to view reports.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Property Reports</h1>

      <FilterControlsSection
        dateRange={dateRange}
        dateRangeType={dateRangeType}
        selectedPropertyId={selectedPropertyId}
        selectedRoomTypeId={selectedRoomTypeId}
        isRoomTypeFilterDisabled={selectedPropertyId === "all"}
        searchTerm={searchTerm}
        appliedSearchTerm={appliedSearchTerm}
        sortBy={sortBy}
        sortDir={sortDir}
        allProperties={allProperties}
        roomTypesForSelectedProperty={roomTypesForSelectedProperty}
        onResetFilters={handleResetFilters}
        onDownload={handleDownloadReport}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        onSortDirectionChange={handleSortDirectionChange}
        onDateRangeTypeChange={handleDateRangeTypeChange}
        onYearChange={handleYearChange}
        onMonthChange={handleMonthChange}
        onCustomStartDateChange={handleCustomStartDateChange}
        onCustomEndDateChange={handleCustomEndDateChange}
        onApplyDates={handleApplyDates}
        onPropertyChange={handlePropertyChange}
        onRoomTypeChange={handleRoomTypeChange}
      />

      <GlobalStatsSection summary={reportData?.summary?.Global} />

      <PropertyListSection
        properties={reportData?.properties || []}
        dateRange={dateRange}
        reservationPageMap={reservationPageMap}
        onReservationPageChange={handleReservationPageChange}
        onDownloadProperty={handleDownloadReport}
        onDownloadRoomType={handleDownloadRoomTypeReport}
        onReservationFilterChange={handleReservationFilterChange} // Add this
      />
    </div>
  );
}
