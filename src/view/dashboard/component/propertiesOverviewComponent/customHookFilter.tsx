// src/view/report/hooks/usePropertyFilters.ts
import { useState, useEffect } from "react";
import { useReportStore } from "@/lib/stores/reportStore";
import { lastDayOfMonth } from 'date-fns';

export function usePropertyFilters() {
  const { filters: storeFilters, options: storeOptions, setFilter, setOption, setFilters } = useReportStore();
  const [searchTerm, setSearchTerm] = useState(storeFilters.search || "");
  
  const {
    dateRangeType,
    setDateRangeType,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate
  } = useDateFilters(storeFilters);

  useEffect(() => {
    syncFiltersWithStore(storeFilters, setSearchTerm, setSelectedYear, setSelectedMonth);
  }, [storeFilters.search, storeFilters.startDate, storeFilters.endDate]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setFilter("search", searchTerm);
  };

  const handleSortChange = (value: string) => {
    setOption("sortBy", value as any);
    setOption("page", 1);
  };

  const handleSortDirectionChange = () => {
    const newSortDir = storeOptions.sortDir === "asc" ? "desc" : "asc";
    setOption("sortDir", newSortDir);
    setOption("page", 1);
  };

  const handlePageChange = (newPage: number) => {
    setOption("page", newPage);
  };

  const handleResetFilters = () => {
    resetLocalFilters(setSearchTerm, setDateRangeType, setSelectedYear, setSelectedMonth, setCustomStartDate, setCustomEndDate);
    resetStoreFilters(setFilters);
  };

  // Wrapper functions to convert SetStateAction to simple functions
  const handleDateRangeTypeChange = (value: string) => {
    setDateRangeType(value as 'year' | 'month' | 'custom' | 'all');
  };

  const handleYearChange = (value: number) => {
    setSelectedYear(value);
  };

  const handleMonthChange = (value: number) => {
    setSelectedMonth(value);
  };

  const handleCustomStartDateChange = (value: Date | null) => {
    setCustomStartDate(value);
  };

  const handleCustomEndDateChange = (value: Date | null) => {
    setCustomEndDate(value);
  };

  const applyDateFilters = () => {
    const { startDate, endDate } = calculateDateRange(
      dateRangeType, 
      selectedYear, 
      selectedMonth, 
      customStartDate, 
      customEndDate
    );
    
    setFilters({
      ...storeFilters,
      startDate: startDate ?? undefined,
      endDate: endDate ?? undefined
    });
  };

  return {
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
  };
}

function useDateFilters(storeFilters: any) {
  const initialDateRangeType = getInitialDateRangeType(storeFilters);
  const [dateRangeType, setDateRangeType] = useState<'year' | 'month' | 'custom' | 'all'>(initialDateRangeType);
  
  const initialYear = storeFilters.startDate 
    ? storeFilters.startDate.getFullYear() 
    : new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(initialYear);
  
  const initialMonth = storeFilters.startDate && (initialDateRangeType === 'month' || initialDateRangeType === 'year')
    ? storeFilters.startDate.getMonth() + 1 
    : new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  
  const [customStartDate, setCustomStartDate] = useState<Date | null>(storeFilters.startDate || null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(storeFilters.endDate || null);

  return {
    dateRangeType,
    setDateRangeType,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate
  };
}

function getInitialDateRangeType(storeFilters: any): 'year' | 'month' | 'custom' | 'all' {
  if (!storeFilters.startDate || !storeFilters.endDate) return 'year';
  
  const { startDate, endDate } = storeFilters;
  
  if (isYearRange(startDate, endDate)) return 'year';
  if (isMonthRange(startDate, endDate)) return 'month';
  return 'custom';
}

function isYearRange(startDate: Date, endDate: Date): boolean {
  return startDate.getFullYear() === endDate.getFullYear() && 
         startDate.getMonth() === 0 && 
         startDate.getDate() === 1 &&
         endDate.getMonth() === 11 && 
         endDate.getDate() === 31;
}

function isMonthRange(startDate: Date, endDate: Date): boolean {
  return startDate.getFullYear() === endDate.getFullYear() && 
         startDate.getMonth() === endDate.getMonth() &&
         startDate.getDate() === 1 &&
         endDate.getTime() === lastDayOfMonth(startDate).getTime();
}

function syncFiltersWithStore(
  storeFilters: any,
  setSearchTerm: (term: string) => void,
  setSelectedYear: (year: number) => void,
  setSelectedMonth: (month: number) => void
) {
  setSearchTerm(storeFilters.search || "");
  
  if (storeFilters.startDate) {
    setSelectedYear(storeFilters.startDate.getFullYear());
    setSelectedMonth(storeFilters.startDate.getMonth() + 1);
  }
}

function resetLocalFilters(
  setSearchTerm: (term: string) => void,
  setDateRangeType: (type: 'year' | 'month' | 'custom' | 'all') => void,
  setSelectedYear: (year: number) => void,
  setSelectedMonth: (month: number) => void,
  setCustomStartDate: (date: Date | null) => void,
  setCustomEndDate: (date: Date | null) => void
) {
  setSearchTerm("");
  setDateRangeType('year');
  setSelectedYear(new Date().getFullYear());
  setSelectedMonth(new Date().getMonth() + 1);
  setCustomStartDate(null);
  setCustomEndDate(null);
}

function resetStoreFilters(setFilters: (filters: any) => void) {
  setFilters({
    propertyId: undefined,
    roomTypeId: undefined,
    startDate: undefined,
    endDate: undefined,
    status: [],
    search: ''
  });
}

function calculateDateRange(
  dateRangeType: 'year' | 'month' | 'custom' | 'all',
  selectedYear: number,
  selectedMonth: number,
  customStartDate: Date | null,
  customEndDate: Date | null
): { startDate: Date | null; endDate: Date | null } {
  if (dateRangeType === 'year') {
    return {
      startDate: new Date(selectedYear, 0, 1),
      endDate: new Date(selectedYear, 11, 31)
    };
  }
  
  if (dateRangeType === 'month') {
    const jsMonth = selectedMonth - 1;
    const startDate = new Date(selectedYear, jsMonth, 1);
    return {
      startDate,
      endDate: lastDayOfMonth(startDate)
    };
  }
  
  if (dateRangeType === 'custom') {
    return {
      startDate: customStartDate,
      endDate: customEndDate
    };
  }
  
  return { startDate: null, endDate: null };
}