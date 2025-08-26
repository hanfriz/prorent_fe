// hooks.ts
import { useEffect, useState } from 'react';
import { useChartReportByViewMode, useInvalidateChartReports } from '@/service/report/useReport';
import { useReportStore } from '@/lib/stores/reportStore';
import { ChartDataPoint } from '@/interface/report/reportInterface';

// This represents the actual structure TanStack Query returns
interface WrappedResponse<T> {
   type: string;
   data: T;
}

// Custom hook for chart data
export const useChartData = () => {
   const queryResult = useChartReportByViewMode();
   const { invalidateAll } = useInvalidateChartReports();

   // Extract the actual data array
   // queryResult.data is { type: 'yearly',  { type: 'yearly', data: ChartDataPoint[] } }
   type ChartReportData =
      | { type: 'yearly'; data: ChartDataPoint[] }
      | { type: 'monthly'; year: number; data: ChartDataPoint[] }
      | { type: 'daily'; days: number; data: ChartDataPoint[] };

   const chartData: ChartDataPoint[] = (queryResult.data as ChartReportData)?.data || [];

   console.log('🔧 [Chart Data] Final extraction result:', {
      chartDataLength: chartData.length,
      isChartDataArray: Array.isArray(chartData),
      firstItem: chartData[0]
   });

   return {
      data: chartData,
      rawData: queryResult.data,
      isLoading: queryResult.isLoading,
      error: queryResult.error,
      refetch: queryResult.refetch,
      invalidateAll
   };
};

// Custom hook for chart settings
export const useChartSettings = () => {
   const { chartSettings, setViewMode, setChartType, setDays, setSelectedYear } = useReportStore();

   useEffect(() => {
      console.log('🏪 [Chart Settings] Settings changed:', chartSettings);
   }, [ chartSettings ]);

   return {
      chartSettings,
      setViewMode,
      setChartType,
      setDays,
      setSelectedYear
   };
};

// Custom hook for error handling
export const useChartError = (error: any) => {
   const [ chartError, setChartError ] = useState<Error | null>(null);

   useEffect(() => {
      if (error) {
         setChartError(error as Error);
         console.error('💥 [Chart Error] Chart data error:', error);
      }
   }, [ error ]);

   return { chartError, setChartError };
};
