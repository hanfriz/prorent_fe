// components/reservations/ReservationList.tsx
"use client";

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RPResPagination } from '@/interface/paymentInterface';
import { GetUserReservationsParams } from '@/interface/queryInterface';
import { getUserReservation } from '@/service/reservationService';
import { useReservationStore } from '@/lib/stores/reservationStore'; // Adjust path
import ReservationTable from './component/reservationTable'; // Adjust path
import ReservationFilters from './component/reservationList'; // Adjust path
import ReservationSkeleton from './component/reservationSkeleton'; // Adjust path

// Main ReservationList component
const ReservationList = () => {
      const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  // Get pagination/sorting params from Zustand store
  const { reservationParams, updateReservationParams } = useReservationStore();

  // --- Handlers for filter changes ---
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    updateReservationParams({ search: term || undefined, page: 1 });
  };

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    updateReservationParams({ status: status || undefined, page: 1 });
  };

  // --- Handlers for pagination/sorting passed to table ---
  const handlePageChange = (newPage: number) => {
    updateReservationParams({ page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    updateReservationParams({ limit: newLimit, page: 1 });
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    updateReservationParams({ sortBy, sortOrder, page: 1 });
  };

  // --- Combine local state with Zustand params for the query ---
  const effectiveParams = useMemo<GetUserReservationsParams>(() => {
    return {
      ...reservationParams,
      search: searchTerm || undefined,
      status: statusFilter || undefined,
    };
  }, [reservationParams, searchTerm, statusFilter]);

  // --- TanStack Query for fetching reservations ---
  const { data, isLoading, isError, error } = getUserReservation(effectiveParams);
  

  // --- Handle query errors ---
  if (isError) {
    toast.error('Failed to load reservations', {
      description: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // --- Render the component ---
  return (
    <div className="space-y-6">
      {/* Render Filters */}
      <ReservationFilters
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentStatus={statusFilter || undefined}
      />

      {/* Render Table or Skeleton based on loading state */}
      {isLoading ? (
        <ReservationSkeleton />
      ) : (
      <ReservationTable
        // --- Correctly access properties of data, handling potential undefined ---
        reservations={data?.reservations ?? []} // Use optional chaining (?.) and nullish coalescing (??)
        pagination={data?.pagination}           // Pass pagination object directly, undefined is okay for the table if it handles it
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