// src/app/dashboard/report/main/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDashboardReportCore } from "@/service/report/useReport";
import { cleanFilters, cleanOptions } from "@/service/report/useReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Property,
  PropertySummary,
  ReportFormat,
  ReservationReportOptions,
  RoomTypeMin,
} from "@/interface/report/reportInterface";
import { propertyService } from "@/service/propertyService";
import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/service/report/reportService";
import { toast } from "sonner";
import { PropertyReportCard } from "./mainComponent/propertyReportCard";
import { StatCard } from "./mainComponent/helper";
import {
  FilterControls,
  DateRangeOption,
  SortOption,
} from "@/view/dashboard/component/propertiesOverviewComponent/filterControl";

// --- Skeleton Components ---
function ReportPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-1/4" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

// --- Main Component ---
export default function MainReportPage() {
  const { user: authUser } = useAuth();
  const ownerId = authUser?.id;

  // --- Local State for Filters ---
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(new Date().getFullYear(), 11, 31),
  });
  // --- NEW STATE: Track the selected date range type ---
  const [dateRangeType, setDateRangeType] = useState<string>("year");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("all");
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    | "name"
    | "revenue"
    | "confirmed"
    | "pending"
    | "city"
    | "address"
    | "province"
    | "startDate"
    | "endDate"
    | "createdAt"
    | "paymentAmount"
  >("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // --- Reservation Pagination State ---
  const [reservationPageMap, setReservationPageMap] = useState<
    Record<string, number>
  >({});

  // --- Fetch All Properties for Property Dropdown ---
  const { data: allPropertiesData, isLoading: isLoadingProperties } = useQuery({
    queryKey: ["allPropertiesForReport", ownerId],
    queryFn: async () => {
      if (!ownerId) throw new Error("Owner ID not found");
      const response = await propertyService.getMyProperties();
      return response?.data || [];
    },
    enabled: !!ownerId,
  });
  const allProperties = allPropertiesData || [];

  // --- Fetch Room Types for Selected Property ---
  const {
    data: roomTypesForSelectedPropertyData,
    isLoading: isLoadingRoomTypes,
  } = useQuery({
    queryKey: ["roomTypesForSelectedProperty", selectedPropertyId, ownerId],
    queryFn: async () => {
      if (!ownerId || selectedPropertyId === "all" || !selectedPropertyId)
        return [];
      try {
        const response = await propertyService.getPropertyById(
          selectedPropertyId
        );
        return response?.data?.roomTypes || [];
      } catch (error) {
        console.error("Error fetching room types for property:", error);
        return [];
      }
    },
    enabled: !!ownerId && selectedPropertyId !== "all" && !!selectedPropertyId,
  });
  const roomTypesForSelectedProperty = roomTypesForSelectedPropertyData || [];

  // --- Prepare Filters and Options for useDashboardReportCore ---
  const filtersForReportHook = useMemo(() => {
    if (!ownerId) {
      console.warn("OwnerId is not available for filters");
      return {};
    }

    const filters: any = {
      ownerId: ownerId,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    };

    // Add property filter if selected
    if (selectedPropertyId !== "all" && selectedPropertyId) {
      filters.propertyId = selectedPropertyId;
    }

    // Add room type filter if selected
    if (selectedRoomTypeId !== "all" && selectedRoomTypeId) {
      filters.roomTypeId = selectedRoomTypeId;
    }

    // Add search term if applied
    if (appliedSearchTerm) {
      filters.search = appliedSearchTerm;
    }

    return cleanFilters(filters);
  }, [
    ownerId,
    selectedPropertyId,
    selectedRoomTypeId,
    dateRange.startDate,
    dateRange.endDate,
    appliedSearchTerm,
  ]);

  // Add this debugging useEffect to see what filters are being generated
  useEffect(() => {
    console.log("=== FILTER DEBUG ===");
    console.log("Raw filters object:", {
      ownerId: ownerId,
      propertyId: selectedPropertyId !== "all" ? selectedPropertyId : undefined,
      roomTypeId: selectedRoomTypeId !== "all" ? selectedRoomTypeId : undefined,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      search: appliedSearchTerm || undefined,
    });
    console.log("Cleaned filters:", filtersForReportHook);
  }, [
    filtersForReportHook,
    ownerId,
    selectedPropertyId,
    selectedRoomTypeId,
    dateRange,
    appliedSearchTerm,
  ]);

  const optionsForReportHook = useMemo(() => {
    return cleanOptions({
      page: page,
      pageSize: pageSize,
      reservationPage: reservationPageMap, // Add reservation pagination
      reservationPageSize: 10, // Set reservation page size
      sortBy: sortBy,
      sortDir: sortDir,
      fetchAllData: false,
    });
  }, [page, sortBy, sortDir, reservationPageMap]); // Add reservationPageMap to dependencies

  // --- Fetch Main Report Data ---
  const shouldFetchReport = !!ownerId;
  const {
    data: reportData,
    isLoading: isReportLoading,
    isError: isReportError,
  } = useDashboardReportCore(
    filtersForReportHook,
    shouldFetchReport ? optionsForReportHook : undefined
  );

  // --- Handle Reservation Page Change ---
  const handleReservationPageChange = (roomTypeId: string, page: number) => {
    setReservationPageMap((prev) => ({
      ...prev,
      [roomTypeId]: page,
    }));
    // Reset main page when reservation page changes
    setPage(1);
  };

  // --- Handle Download Report ---
  const handleDownloadReport = async () => {
    if (!ownerId) {
      toast.error("User not authenticated.");
      return;
    }

    try {
      const exportFilters = {
        ownerId: ownerId,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        propertyId:
          selectedPropertyId !== "all" ? selectedPropertyId : undefined,
        roomTypeId:
          selectedRoomTypeId !== "all" ? selectedRoomTypeId : undefined,
        search: appliedSearchTerm || undefined,
      };
      let exportFormat: ReportFormat = ReportFormat.ALL;

      if (selectedPropertyId !== "all") {
        if (selectedRoomTypeId !== "all") {
          exportFormat = ReportFormat.ROOM_TYPE;
        } else {
          exportFormat = ReportFormat.PROPERTY;
        }
      }
      await reportService.exportExcel(exportFilters, {
        fetchAllData: true,
        format: exportFormat || ReportFormat.ALL,
      });

      toast.success("Report download started!");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download report.");
    }
  };

  // --- Filter Control Handlers ---
  const handlePropertyChange = (value: string) => {
    setSelectedPropertyId(value);
    setSelectedRoomTypeId("all");
    setPage(1);
    // Reset reservation pagination when filters change
    setReservationPageMap({});
  };

  const handleRoomTypeChange = (value: string) => {
    setSelectedRoomTypeId(value);
    setPage(1);
    // Reset reservation pagination when filters change
    setReservationPageMap({});
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setPage(1);
    // Reset reservation pagination when filters change
    setReservationPageMap({});
  };

  const handleSortChange = (value: string) => {
    if (allowedSortByValues.includes(value)) {
      setSortBy(value as any);
      setPage(1);
      // Reset reservation pagination when filters change
      setReservationPageMap({});
    } else {
      console.error(`Invalid sort by value: ${value}`);
    }
  };

  const allowedSortByValues = [
    "startDate",
    "endDate",
    "name",
    "revenue",
    "confirmed",
    "pending",
    "city",
    "address",
    "province",
    "createdAt",
    "paymentAmount",
  ];

  const handleSortDirectionChange = () => {
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
    // Reset reservation pagination when filters change
    setReservationPageMap({});
  };

  // --- NEW HANDLERS: Date Range Type and Apply ---
  const handleDateRangeTypeChange = (value: string) => {
    setDateRangeType(value);
    setPage(1);
    // Reset reservation pagination when filters change
    setReservationPageMap({});
  };

  const handleYearChange = (year: number) => {
    const newStart = new Date(year, 0, 1);
    const newEnd = new Date(year, 11, 31);
    setDateRange({ startDate: newStart, endDate: newEnd });
    setPage(1);
    // Reset reservation pagination when filters change
    setReservationPageMap({});
  };

  const handleMonthChange = (month: number) => {
    const year = dateRange.startDate?.getFullYear() ?? new Date().getFullYear();
    const newStart = new Date(year, month - 1, 1);
    const newEnd = new Date(year, month, 0);
    setDateRange({ startDate: newStart, endDate: newEnd });
    setPage(1);
    // Reset reservation pagination when filters change
    setReservationPageMap({});
  };

  const handleCustomStartDateChange = (date: Date | null) => {
    setDateRange((prev) => ({ ...prev, startDate: date }));
    setPage(1);
    // Reset reservation pagination when filters change
    setReservationPageMap({});
  };

  const handleCustomEndDateChange = (date: Date | null) => {
    setDateRange((prev) => ({ ...prev, endDate: date }));
    setPage(1);
    // Reset reservation pagination when filters change
    setReservationPageMap({});
  };

  const handleApplyDates = () => {
    setPage(1);
    // Reset reservation pagination when filters change
    setReservationPageMap({});
  };

  const handleResetFilters = () => {
    setDateRangeType("year");
    setDateRange({
      startDate: new Date(new Date().getFullYear(), 0, 1),
      endDate: new Date(new Date().getFullYear(), 11, 31),
    });
    setSelectedPropertyId("all");
    setSelectedRoomTypeId("all");
    setSearchTerm("");
    setAppliedSearchTerm("");
    setSortBy("name");
    setSortDir("asc");
    setPage(1);
    // Reset reservation pagination when filters change
    setReservationPageMap({});
  };

  // --- Prepare data for FilterControls ---
  const dateRangeOptions: DateRangeOption[] = [
    { value: "year", label: "Year" },
    { value: "month", label: "Month" },
    { value: "custom", label: "Custom" },
  ];

  const sortOptions: SortOption[] = [
    { value: "name", label: "Property Name" },
    { value: "revenue", label: "Revenue" },
    { value: "confirmed", label: "Confirmed Bookings" },
    { value: "pending", label: "Pending Bookings" },
    { value: "city", label: "City" },
    { value: "address", label: "Address" },
    { value: "province", label: "Province" },
    { value: "startDate", label: "Start Date" },
    { value: "endDate", label: "End Date" },
    { value: "createdAt", label: "Created Date" },
    { value: "paymentAmount", label: "Payment Amount" },
  ];

  const propertyOptions = useMemo(() => {
    const options = [{ value: "all", label: "All Properties" }];
    if (allProperties && Array.isArray(allProperties)) {
      options.push(
        ...allProperties.map((p: Property) => ({ value: p.id, label: p.name }))
      );
    }
    return options;
  }, [allProperties]);

  const roomTypeOptions = useMemo(() => {
    const options = [{ value: "all", label: "All Room Types" }];
    if (
      roomTypesForSelectedProperty &&
      Array.isArray(roomTypesForSelectedProperty)
    ) {
      options.push(
        ...roomTypesForSelectedProperty.map((rt: RoomTypeMin) => ({
          value: rt.id,
          label: rt.name,
        }))
      );
    }
    return options;
  }, [roomTypesForSelectedProperty]);

  const isRoomTypeFilterDisabled = selectedPropertyId === "all";

  // --- Combine Loading States ---
  const isAnyLoading = isReportLoading || isLoadingProperties;

  // --- Render ---
  if (!ownerId) {
    return <div>Please log in.</div>;
  }

  if (isAnyLoading) {
    return <ReportPageSkeleton />;
  }

  if (isReportError) {
    return <div className="text-red-500 p-6">Error loading report data.</div>;
  }

  const properties = reportData?.properties || [];
  const globalSummary = reportData?.summary?.Global;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Property Reports</h1>

      {/* Updated Filter Controls */}
      <Card>
        <CardContent className="p-0">
          <FilterControls
            // Search
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onSearch={handleSearch}
            // Sorting
            sortBy={sortBy || "name"}
            sortDir={sortDir}
            sortOptions={sortOptions}
            onSortChange={handleSortChange}
            onSortDirectionChange={handleSortDirectionChange}
            // Date Range
            dateRangeOptions={dateRangeOptions}
            dateRangeType={dateRangeType}
            onDateRangeTypeChange={handleDateRangeTypeChange}
            selectedYear={
              dateRange.startDate
                ? dateRange.startDate.getFullYear()
                : new Date().getFullYear()
            }
            selectedMonth={
              dateRange.startDate ? dateRange.startDate.getMonth() + 1 : 1
            }
            customStartDate={dateRange.startDate}
            customEndDate={dateRange.endDate}
            onYearChange={handleYearChange}
            onMonthChange={handleMonthChange}
            onCustomStartDateChange={handleCustomStartDateChange}
            onCustomEndDateChange={handleCustomEndDateChange}
            onApplyDates={handleApplyDates}
            // Property Filter
            propertyOptions={propertyOptions}
            selectedPropertyId={selectedPropertyId}
            onPropertyChange={handlePropertyChange}
            // Room Type Filter
            roomTypeOptions={roomTypeOptions}
            selectedRoomTypeId={selectedRoomTypeId}
            onRoomTypeChange={handleRoomTypeChange}
            isRoomTypeFilterDisabled={isRoomTypeFilterDisabled}
            // Actions
            onResetFilters={handleResetFilters}
            onDownload={handleDownloadReport}
          />
        </CardContent>
      </Card>

      {/* Global Stats */}
      {globalSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Global Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Properties"
              value={globalSummary.totalProperties}
            />
            <StatCard
              label="Active Bookings"
              value={globalSummary.totalActiveBookings}
            />
            <StatCard
              label="Actual Revenue"
              value={globalSummary.totalActualRevenue}
              isCurrency
            />
            <StatCard
              label="Projected Revenue"
              value={globalSummary.totalProjectedRevenue}
              isCurrency
            />
          </CardContent>
        </Card>
      )}

      {/* Property List */}
      <div className="grid grid-cols-1 gap-6">
        {properties.length > 0 ? (
          properties.map((propertySummary: PropertySummary) => (
            <PropertyReportCard
              key={propertySummary.property.id}
              propertySummary={propertySummary}
              dateRange={dateRange}
              onDownloadRoomType={(roomTypeId) => {
                handleDownloadReport();
              }}
              onReservationPageChange={handleReservationPageChange} // Add this
              reservationPageMap={reservationPageMap} // Add this
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No properties found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
