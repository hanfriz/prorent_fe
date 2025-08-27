// src/view/report/PropertiesOverview.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyCard } from "@/view/report/component/propertyCard";
import { PropertiesOverviewProps } from "@/interface/report/reportInterface";
import { useDashboardReport } from "@/service/report/useReport";
import { useReportStore } from "@/lib/stores/reportStore";
import { FilterControls } from "./propertiesOverviewComponent/filterControl";
import { PropertyList } from "./propertiesOverviewComponent/propertyList";
import { PaginationControls } from "./propertiesOverviewComponent/paginationControl";
import { usePropertyFilters } from "./propertiesOverviewComponent/customHookFilter";

export default function PropertiesOverview({ properties: initialProperties }: PropertiesOverviewProps) {
  const { data: reportData, isLoading, isFetching } = useDashboardReport();
  const properties = reportData?.properties ?? initialProperties;
  const { filters, options, setFilters, setOption } = useReportStore();
  
  const {
      searchTerm,
    dateRangeType,
    selectedYear,
    selectedMonth,
    customStartDate,
    customEndDate,
    handleSearchChange,
    handleSearch,
    handleSortChange,
    handleSortDirectionChange,
    handlePageChange,
    handleResetFilters,
    handleDateRangeTypeChange,
    handleYearChange,
    handleMonthChange,
    handleCustomStartDateChange,
    handleCustomEndDateChange,
    applyDateFilters
  } = usePropertyFilters();

  const pagination = reportData?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const currentPage = options.page || 1;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Properties Overview</CardTitle>
        <CardDescription>Overview of your listed properties</CardDescription>
      </CardHeader>
      
      <FilterControls
        searchTerm={searchTerm}
        dateRangeType={dateRangeType}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        onSortDirectionChange={handleSortDirectionChange}
        onResetFilters={handleResetFilters}
        onDateRangeTypeChange={handleDateRangeTypeChange}
        onYearChange={handleYearChange}
        onMonthChange={handleMonthChange}
        onCustomStartDateChange={handleCustomStartDateChange}
        onCustomEndDateChange={handleCustomEndDateChange}
        onApplyDates={applyDateFilters}
        sortBy={options.sortBy || "startDate"}
        sortDir={options.sortDir || "desc"}
      />

      <CardContent>
        <PropertyList 
          properties={properties} 
          isLoading={isLoading} 
          isFetching={isFetching}
        />
        
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          isFetching={isFetching}
          onPageChange={handlePageChange}
        />
      </CardContent>
    </Card>
  );
}