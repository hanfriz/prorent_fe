// components/reservations/ReservationList.tsx
"use client";

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RPResPagination } from '@/interface/paymentInterface';
import { GetUserReservationsParams } from '@/interface/queryInterface';
import { getOwnerReservation } from '@/service/reservationService';
import { useReservationStore } from '@/lib/stores/reservationStore';
import ReservationTable from '../userTransactionManagement/component/reservationTable'; 
import ReservationFilters from '../userTransactionManagement/component/reservationList'; 
import ReservationSkeleton from '../userTransactionManagement/component/reservationSkeleton';

const ReservationList = () => {
      const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { reservationParams, updateReservationParams } = useReservationStore();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    updateReservationParams({ search: term || undefined, page: 1 });
  };

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    updateReservationParams({ status: status || undefined, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateReservationParams({ page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    updateReservationParams({ limit: newLimit, page: 1 });
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    updateReservationParams({ sortBy, sortOrder, page: 1 });
  };

  const effectiveParams = useMemo<GetUserReservationsParams>(() => {
    return {
      ...reservationParams,
      search: searchTerm || undefined,
      status: statusFilter || undefined,
    };
  }, [reservationParams, searchTerm, statusFilter]);

  const { data, isLoading, isError, error } = getOwnerReservation(effectiveParams);
  

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