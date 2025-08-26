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
   ChartDataPoint,
   ChartReportOptions,
   ChartType,
   DashboardReportResponse,
   ReservationReportFilters,
   ReservationReportOptions
} from '@/interface/report/reportInterface';
import { DashboardInputSchema } from '@/validation/report/dashboardReportValidation';

// --- Utils ---
function cleanFilters<T extends object> (filters: T): Partial<T> {
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

function cleanOptions (options?: ReservationReportOptions): ReservationReportOptions | undefined {
   if (!options) {
      return undefined;
   }

   const cleaned = {
      ...options,
      page: options.page ? Number(options.page) : 1,
      pageSize: options.pageSize ? Number(options.pageSize) : 20
   };

   console.log('✅ cleaned options:', cleaned);
   return cleaned;
}

// --- Hook: Dashboard utama → daftar properti + summary ---
export function useDashboardReportCore (filters: ReservationReportFilters, options?: ReservationReportOptions) {
   const f = useMemo(() => cleanFilters(filters), [ filters ]);
   const o = useMemo(() => cleanOptions(options), [ options ]);

   console.log('🟦 Dashboard Report Payload ->', {
      filtersRaw: filters,
      optionsRaw: options,
      filtersCleaned: f,
      optionsCleaned: o
   });

   return useQuery({
      queryKey: [ 'dashboardReport', f, o ],
      queryFn: () => reportService.getDashboardReport(f, o)
   });
}

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
         console.log('🟦 Dashboard Report Payload ->', input);
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

/**
 * Hook: RoomTypes overview
 */
export function useRoomTypesOverview (filters: ReservationReportFilters, options?: ReservationReportOptions) {
   const query = useDashboardReportCore(filters, options);
   return {
      ...query,
      data: query.data?.roomTypes ?? []
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

   // Log the parameters being used for the query
   console.log('🔍 [Chart Report] Preparing query with:', {
      viewMode,
      selectedYear,
      days,
      years: viewMode === 'yearly' ? years : undefined
   });

   return useQuery({
      queryKey: [ 'chartReport', viewMode, viewMode === 'yearly' ? years : viewMode === 'monthly' ? selectedYear : days ],
      queryFn: async () => {
         console.log('🔄 [Chart Report] Fetching data for:', {
            viewMode,
            selectedYear,
            days,
            years: viewMode === 'yearly' ? years : undefined
         });

         switch (viewMode) {
            case 'yearly':
               console.log('📈 [Chart Report] Calling getChartReportYearly with years:', years);
               const yearlyResult = await getChartReportYearly({ years });
               console.log('✅ [Chart Report] Yearly data received:', yearlyResult);
               return yearlyResult;

            case 'monthly':
               console.log('📅 [Chart Report] Calling getChartReportMonthly with year:', selectedYear);
               const monthlyResult = await getChartReportMonthly({ year: selectedYear });
               console.log('✅ [Chart Report] Monthly data received:', monthlyResult);
               return monthlyResult;

            case 'daily':
               console.log('🕒 [Chart Report] Calling getChartReportDaily with days:', days);
               const dailyResult = await getChartReportDaily({ days });
               console.log('✅ [Chart Report] Daily data received:', dailyResult);
               return dailyResult;

            default:
               const errorMsg = `Unsupported view mode: ${viewMode}`;
               console.error('❌ [Chart Report] Error:', errorMsg);
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
