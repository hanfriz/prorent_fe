import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format, lastDayOfMonth } from 'date-fns'; 
import { PropertyCard } from "@/view/report/component/propertyCard";
import { PropertySummary, PropertiesOverviewProps } from "@/interface/report/reportInterface";
import { useDashboardReport } from "@/service/report/useReport";
import { useReportStore } from "@/lib/stores/reportStore";

export default function PropertiesOverview({ properties: initialProperties }: PropertiesOverviewProps) {
  const { filters: storeFilters, options: storeOptions, setFilter, setOption, setFilters } = useReportStore();
  const [searchTerm, setSearchTerm] = useState(storeFilters.search || "");
  
  // --- Date Range State ---
  // Determine initial date range type based on existing filters
  const initialDateRangeType = storeFilters.startDate && storeFilters.endDate 
    ? (storeFilters.startDate.getFullYear() === storeFilters.endDate.getFullYear() && 
       storeFilters.startDate.getMonth() === storeFilters.endDate.getMonth() &&
       storeFilters.startDate.getDate() === 1 &&
       storeFilters.endDate.getTime() === lastDayOfMonth(storeFilters.startDate).getTime())
      ? 'month'
      : (storeFilters.startDate.getFullYear() === storeFilters.endDate.getFullYear() && 
         storeFilters.startDate.getMonth() === 0 && storeFilters.startDate.getDate() === 1 &&
         storeFilters.endDate.getMonth() === 11 && storeFilters.endDate.getDate() === 31)
        ? 'year'
        : 'custom'
    : 'year'; // Default to 'year' if no dates or incomplete dates

  const [dateRangeType, setDateRangeType] = useState<'year' | 'month' | 'custom' | 'all'>(
    initialDateRangeType === 'year' || initialDateRangeType === 'month' || initialDateRangeType === 'custom' || initialDateRangeType === 'all' 
      ? initialDateRangeType 
      : 'year' // Fallback to 'year'
  );

  // Initialize year/month based on existing filters or default to current
  const initialYear = storeFilters.startDate 
    ? storeFilters.startDate.getFullYear() 
    : new Date().getFullYear();
  
  const initialMonth = storeFilters.startDate && (initialDateRangeType === 'month' || initialDateRangeType === 'year') // Assume year view starts at month 1
    ? storeFilters.startDate.getMonth() + 1 
    : new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(storeFilters.startDate || null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(storeFilters.endDate || null);

  // Use the full dashboard report to get pagination and other data
  const { data: reportData, isLoading, isFetching } = useDashboardReport();

  // Use the properties from the report data
  const properties = reportData?.properties ?? initialProperties;

  // --- Date Range Functions ---
  const calculateDateRange = () => {
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (dateRangeType === 'year') {
      startDate = new Date(selectedYear, 0, 1); // January 1st
      endDate = new Date(selectedYear, 11, 31); // December 31st
    } else if (dateRangeType === 'month') {
      // Month is 0-indexed in JS Date
      const jsMonth = selectedMonth - 1; 
      startDate = new Date(selectedYear, jsMonth, 1);
      // Last day of the month
      endDate = lastDayOfMonth(startDate); 
    } else if (dateRangeType === 'custom') {
      startDate = customStartDate;
      endDate = customEndDate;
    }
    // 'all' type would leave startDate and endDate as null
    
    return { startDate, endDate };
  };

  const applyDateFilters = () => {
    const { startDate, endDate } = calculateDateRange();
    // Update store filters with date range
    setFilters({
      ...storeFilters, // Keep other filters like search
      startDate: startDate ?? undefined, // Convert null to undefined for Zod
      endDate: endDate ?? undefined
    });
  };

  // --- Search Functions ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    // Update store filters with search term
    setFilter("search", searchTerm);
  };

  // --- Sort Functions ---
  const handleSortChange = (value: string) => {
    setOption("sortBy", value as any);
    setOption("page", 1);
  };

  const handleSortDirectionChange = () => {
    const newSortDir = storeOptions.sortDir === "asc" ? "desc" : "asc";
    setOption("sortDir", newSortDir);
    setOption("page", 1);
  };

  // --- Pagination Functions ---
  const handlePageChange = (newPage: number) => {
    setOption("page", newPage);
  };

  // --- Reset Filters ---
  const handleResetFilters = () => {
    // Reset local state
    setSearchTerm("");
    setDateRangeType('year');
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth() + 1);
    setCustomStartDate(null);
    setCustomEndDate(null);
    
    // Reset store filters (this will trigger a re-fetch)
    // Assuming resetFilters resets to default values including dates
    // If not, you might need to call setFilters with specific defaults
    // useReportStore.getState().resetFilters(); 
    setFilters({
      propertyId: undefined,
      roomTypeId: undefined,
      startDate: undefined, // Or set to a default year range
      endDate: undefined,
      status: [],
      search: ''
    });
  };

  // Update local search term when store changes
  useEffect(() => {
    setSearchTerm(storeFilters.search || "");
    // Update date states based on store filters if they change externally
    if (storeFilters.startDate) {
      setSelectedYear(storeFilters.startDate.getFullYear());
      setSelectedMonth(storeFilters.startDate.getMonth() + 1);
    }
    if (storeFilters.endDate) {
      // Logic to determine dateRangeType based on start/end dates could be more complex here
      // For simplicity, we'll rely on the initial setup and user interactions
    }
  }, [storeFilters.search, storeFilters.startDate, storeFilters.endDate]);

  // Get pagination info
  const pagination = reportData?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const currentPage = storeOptions.page || 1;

  // Skeleton component
  const PropertySkeleton = () => (
    <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-white shadow-sm">
      <Skeleton className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-md" />
      <div className="flex-1 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-start mt-4 md:mt-0">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Properties Overview</CardTitle>
        <CardDescription>Overview of your listed properties</CardDescription>
      </CardHeader>
      
      {/* Filter and Sort Controls */}
      <div className="px-6 pb-4 space-y-4">
        {/* Date Range Controls */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Period</label>
            <Select 
              value={dateRangeType} 
              onValueChange={(v: any) => setDateRangeType(v)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
                {/* <SelectItem value="all">All Time</SelectItem> Uncomment if 'all' is supported */}
              </SelectContent>
            </Select>
          </div>

          {dateRangeType !== 'all' && (
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Year</label>
              <Input 
                type="number" 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                min="2000" 
                max="2100"
                className="w-[100px]"
              />
            </div>
          )}

          {dateRangeType === 'month' && (
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Month</label>
              <Select 
                value={selectedMonth.toString()} 
                onValueChange={(v) => setSelectedMonth(Number(v))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                    <SelectItem key={m} value={m.toString()}>
                      {format(new Date(0, m - 1), 'MMMM')} {/* Use date-fns for month names */}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {dateRangeType === 'custom' && (
            <>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Start Date</label>
                <Input
                  type="date"
                  value={customStartDate ? format(customStartDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setCustomStartDate(e.target.valueAsDate)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">End Date</label>
                <Input
                  type="date"
                  value={customEndDate ? format(customEndDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setCustomEndDate(e.target.valueAsDate)}
                />
              </div>
            </>
          )}

          <Button onClick={applyDateFilters}>Apply Dates</Button>
        </div>

        {/* Search, Sort, Reset Controls */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Select 
              value={storeOptions.sortBy || "startDate"} 
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paymentAmount">Payment Amount</SelectItem>
                <SelectItem value="startDate">Start Date</SelectItem>
                <SelectItem value="endDate">End Date</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={handleSortDirectionChange}
              className="flex items-center"
            >
              {storeOptions.sortDir === "asc" ? "↑ Asc" : "↓ Desc"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleSearch}
            >
              Search
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <PropertySkeleton key={i} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No properties data available for the selected filters.
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {properties.map((item) => {
                const confirmed = item.summary.counts.CONFIRMED ?? 0;
                const cancelled = item.summary.counts.CANCELLED ?? 0;
                const status =
                  confirmed > 0
                    ? "Active"
                    : cancelled > 0
                    ? "Inactive"
                    : "No Bookings";

                return (
                  <div key={item.property.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-white shadow-sm">
                    <PropertyCard
                      property={{
                        id: item.property.id,
                        name: item.property.name,
                        picture: item.property.Picture || null,
                        address: item.property.address || item.property.city || "Unknown",
                        totalReservations: confirmed,
                        totalAnnualRevenue: item.summary.revenue.actual ?? 0,
                        averageRevenue: item.summary.revenue.average ?? 0,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isFetching}
                >
                  Previous
                </Button>
                
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isFetching}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}