// components/reservations/ReservationList.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { RPResPagination } from "@/interface/paymentInterface";
import { GetUserReservationsParams } from "@/interface/queryInterface";
import { getUserReservation } from "@/service/reservationService";
import { useReservationStore } from "@/lib/stores/reservationStore";
import ReservationTable from "./component/reservationTable";
import ReservationFilters from "./component/reservationList";
import ReservationSkeleton from "./component/reservationSkeleton";

const ReservationList = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const { reservationParams, updateReservationParams } = useReservationStore();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    updateReservationParams({ search: term || undefined, page: 1 });
  };

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    updateReservationParams({ status: status || undefined, page: 1 });
  };

  const handleDateFilter = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
    updateReservationParams({
      startDate: start ? start.toISOString() : undefined,
      endDate: end ? end.toISOString() : undefined,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    updateReservationParams({ page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    updateReservationParams({ limit: newLimit, page: 1 });
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    updateReservationParams({ sortBy, sortOrder, page: 1 });
  };

  const effectiveParams = useMemo<GetUserReservationsParams>(() => {
    return {
      ...reservationParams,
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    };
  }, [reservationParams, searchTerm, statusFilter, startDate, endDate]);

  const { data, isLoading, isError, error } =
    getUserReservation(effectiveParams);

  if (isError) {
    toast.error("Failed to load reservations", {
      description: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return (
    <div className="space-y-6 m-5 p-5">
      <h1 className="text-2xl font-semibold text-pr-dark">
        My Reservation Transaction List
      </h1>
      <ReservationFilters
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        onDateFilter={handleDateFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentStatus={statusFilter || undefined}
        startDate={startDate}
        endDate={endDate}
      />

      {isLoading ? (
        <ReservationSkeleton />
      ) : (
        <ReservationTable
          reservations={data?.reservations ?? []}
          pagination={data?.pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSortChange={handleSortChange}
          currentParams={effectiveParams}
        />
      )}
    </div>
  );
};

export default ReservationList;
