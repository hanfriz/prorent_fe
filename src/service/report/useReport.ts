'use client';

import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authStore } from '@/lib/stores/authStore';
import {
   getChartReportDaily,
   getChartReportMonthly,
   getChartReportYearly,
   reportService
} from '@/service/report/reportService';
import { useReportStore } from '@/lib/stores/reportStore';
import {
   DashboardReportResponse,
   PropertyReportParams,
   ReservationReportFilters,
   ReservationReportOptions
} from '@/interface/report/reportInterface';
import { DashboardInputSchema } from '@/validation/report/dashboardReportValidation';

// --- Utils ---
export function cleanFilters<T extends object> (filters: T): Partial<T> {
   return Object.fromEntries(
      Object.entries(filters)
         .filter(([ _, value ]) => {
            if (value === null || value === undefined) {
               return false;
            }
            if (typeof value === 'string' && value.trim() === '') {
               return false;
            }
            return true;
         })
         .map(([ key, value ]) => [ key, value instanceof Date ? value.toISOString().split('T')[0] : value ])
   ) as Partial<T>;
}

export function cleanOptions (options?: ReservationReportOptions): Record<string, any> | undefined {
   if (!options) {
      return undefined;
   }

   const cleaned = Object.fromEntries(
      Object.entries(options)
         .filter(([ _, value ]) => {
            if (value === null || value === undefined) {
               return false;
            }
            // ✅ Only check for empty string if it's actually a string
            if (typeof value === 'string' && value.trim() === '') {
               return false;
            }
            return true;
         })
         .map(([ key, value ]) => {
            // Handle reservationPage: { [id]: page }
            if (key === 'reservationPage' && typeof value === 'object') {
               return [ key, JSON.stringify(value) ];
            }
            if (value instanceof Date) {
               return [ key, value.toISOString().split('T')[0] ];
            }
            return [ key, value ];
         })
   );

   return cleaned;
}

// --- Hook: Dashboard utama → daftar properti + summary ---
// Make sure your useDashboardReportCore hook properly serializes the reservationPage parameter
export const useDashboardReportCore = (
   filters: Partial<ReservationReportFilters>,
   options?: Partial<ReservationReportOptions>
) => {
   // Create a proper query key that includes all parameters for caching
   const queryKey = useMemo(() => {
      // Create a serializable version of options for the query key
      const serializableOptions = {
         ...options,
         // Convert reservationPage object to a string for query key comparison
         reservationPage: options?.reservationPage ? JSON.stringify(options.reservationPage) : undefined
      };

      return [ 'dashboard-report', filters, serializableOptions ];
   }, [ filters, JSON.stringify(options) ]);

   return useQuery<DashboardReportResponse>({
      queryKey,
      queryFn: async () => {
         return reportService.getDashboardReport(filters, options);
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retryDelay: 1000 * 10, // 10 seconds
      retry: 3
   });
};

/**
 * Store-based: default untuk dashboard utama
 */
export function useDashboardReport () {
   const { filters: storeFilters, options: storeOptions } = useReportStore();
   const ownerId = authStore.getState().user?.id;

   const input = useMemo(() => {
      const cleanedFilters = cleanFilters(storeFilters);

      const rawPayload = {
         ownerId,
         filters: cleanedFilters,
         options: storeOptions
      };

      try {
         return DashboardInputSchema.parse(rawPayload);
      } catch (err) {
         console.error('Dashboard input validation failed:', err);
         return null;
      }
   }, [ storeFilters, storeOptions, ownerId ]);

   return useQuery<DashboardReportResponse>({
      queryKey: [ 'dashboardReport', input ],
      queryFn: async () => {
         if (!input) {
            throw new Error('Invalid dashboard input');
         }
         return reportService.getDashboardReport(input.filters, input.options);
      },
      enabled: !!input
   });
}

/**
 * Hook: Properties overview
 */
export function usePropertiesOverview (filters: ReservationReportFilters, options?: ReservationReportOptions) {
   const query = useDashboardReportCore(filters, options);
   return {
      ...query,
      data: query.data?.properties ?? []
   };
}

export function usePropertyReport (params: PropertyReportParams, options?: ReservationReportOptions) {
   const { propertyId, startDate, endDate } = params;

   const filters = useMemo(() => {
      const baseFilters: any = { propertyId };
      if (startDate) {
         baseFilters.startDate = startDate;
      }
      if (endDate) {
         baseFilters.endDate = endDate;
      }
      return cleanFilters(baseFilters);
   }, [ propertyId, startDate, endDate ]);

   const resolvedOptions = useMemo(() => {
      const sortDir = options?.sortDir;
      const sortBy = options?.sortBy;
      const reservationPage = options?.reservationPage ?? {};
      const reservationPageSize = options?.reservationPageSize ?? 10;
      const fetchAllData = options?.fetchAllData ?? false;

      return {
         page: options?.page ?? 1,
         pageSize: options?.pageSize ?? 20,
         reservationPage,
         reservationPageSize,
         sortBy: isValidSortBy(sortBy) ? sortBy : 'startDate',
         sortDir: isValidSortDir(sortDir) ? sortDir : 'desc',
         fetchAllData
      };
   }, [ options ]);

   // Use the core function for consistency
   return useDashboardReportCore(filters, resolvedOptions);
}

// Helper functions
function isValidSortDir (dir: any): dir is 'asc' | 'desc' {
   return dir === 'asc' || dir === 'desc';
}

function isValidSortBy (by: any): by is 'startDate' | 'endDate' | 'createdAt' | 'paymentAmount' {
   return [ 'startDate', 'endDate', 'createdAt', 'paymentAmount' ].includes(by);
}
/**
 * Hook: RoomTypes overview
 */
export function usePropertyRoomTypes ({ propertyId, startDate, endDate }: PropertyReportParams) {
   const { data, isLoading, isError, ...query } = usePropertyReport({ propertyId, startDate, endDate });

   return {
      ...query,
      data: data?.properties?.[0]?.roomTypes ?? [],
      isLoading,
      isError
   };
}

// --- Enhanced Chart Report Hooks ---
export const useChartReportYearly = () => {
   const { chartSettings } = useReportStore();
   const years = useMemo(() => {
      // Generate years based on selected year (e.g., current year and previous 2 years)
      const currentYear = chartSettings.selectedYear;
      return [ currentYear - 2, currentYear - 1, currentYear ];
   }, [ chartSettings.selectedYear ]);

   return useQuery({
      queryKey: [ 'chartReport', 'yearly', years ],
      queryFn: () => getChartReportYearly({ years }),
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10 // 10 minutes
   });
};

export const useChartReportMonthly = () => {
   const { chartSettings } = useReportStore();
   const year = chartSettings.selectedYear;

   return useQuery({
      queryKey: [ 'chartReport', 'monthly', year ],
      queryFn: () => getChartReportMonthly({ year }),
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10 // 10 minutes
   });
};

export const useChartReportDaily = () => {
   const { chartSettings } = useReportStore();
   const days = chartSettings.days;

   return useQuery({
      queryKey: [ 'chartReport', 'daily', days ],
      queryFn: () => getChartReportDaily({ days }),
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 5 // 5 minutes
   });
};

// hooks/useChartReportByViewMode.ts
export const useChartReportByViewMode = () => {
   const { chartSettings } = useReportStore();
   const { viewMode, selectedYear, days } = chartSettings;

   // Generate years for yearly view
   const years = useMemo(() => {
      return [ selectedYear - 2, selectedYear - 1, selectedYear ];
   }, [ selectedYear ]);

   ({
      viewMode,
      selectedYear,
      days,
      years: viewMode === 'yearly' ? years : undefined
   });

   return useQuery({
      queryKey: [ 'chartReport', viewMode, viewMode === 'yearly' ? years : viewMode === 'monthly' ? selectedYear : days ],
      queryFn: async () => {
         ({
            viewMode,
            selectedYear,
            days,
            years: viewMode === 'yearly' ? years : undefined
         });

         switch (viewMode) {
            case 'yearly':
               const yearlyResult = await getChartReportYearly({ years });

               return yearlyResult;

            case 'monthly':
               const monthlyResult = await getChartReportMonthly({ year: selectedYear });

               return monthlyResult;

            case 'daily':
               const dailyResult = await getChartReportDaily({ days });

               return dailyResult;

            default:
               const errorMsg = `Unsupported view mode: ${viewMode}`;
               throw new Error(errorMsg);
         }
      },
      staleTime: viewMode === 'daily' ? 1000 * 60 * 2 : 1000 * 60 * 5,
      gcTime: viewMode === 'daily' ? 1000 * 60 * 5 : 1000 * 60 * 10
   });
};
/**
 * Hook to invalidate chart reports (useful for refresh buttons)
 */
export function useInvalidateChartReports () {
   const queryClient = useQueryClient();

   return {
      invalidateAll: () => queryClient.invalidateQueries({ queryKey: [ 'chartReport' ] }),
      invalidateYearly: () => queryClient.invalidateQueries({ queryKey: [ 'chartReport', 'yearly' ] }),
      invalidateMonthly: () => queryClient.invalidateQueries({ queryKey: [ 'chartReport', 'monthly' ] }),
      invalidateDaily: () => queryClient.invalidateQueries({ queryKey: [ 'chartReport', 'daily' ] })
   };
}
