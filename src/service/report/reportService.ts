// src/services/report/reportService.ts

import Axios from '@/lib/axios';
import type {
   DashboardReportResponse,
   ChartDataPoint,
   ReservationReportFilters,
   ReservationReportOptions,
   ChartTimeType,
   ChartParams
} from '@/interface/report/reportInterface';
import { responseCookiesToRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// --- Chart Reports Implementation ---

// In your service file
// Fixed service
export async function getChartReportYearly (params?: {
   years?: number[];
}): Promise<{ type: 'yearly'; data: ChartDataPoint[] }> {
   const url = `/report/chart/yearly`;
   const searchParams = new URLSearchParams();

   if (params?.years) {
      searchParams.set('years', params.years.join(','));
   }

   // Get the full Axios response
   const response = await Axios.get(url, {
      params: Object.fromEntries(searchParams)
   });

   // Return the actual data from the response
   return response.data;
}

export async function getChartReportMonthly (params: {
   year: number;
}): Promise<{ type: 'monthly'; year: number; data: ChartDataPoint[] }> {
   const url = `/report/chart/monthly`;
   const searchParams = new URLSearchParams();

   searchParams.set('year', String(params.year));

   const response = await Axios.get(url, {
      params: Object.fromEntries(searchParams)
   });

   console.log(' Axios response:', response);
   console.log(' Axios response data:', response.data);
   const data = response.data;

   return data;
}

export async function getChartReportDaily (params: {
   days: number;
}): Promise<{ type: 'daily'; days: number; data: ChartDataPoint[] }> {
   const url = `/report/chart/daily`;
   const searchParams = new URLSearchParams();

   searchParams.set('days', String(params.days));

   const response = await Axios.get(url, {
      params: Object.fromEntries(searchParams)
   });
   const data = response.data;

   return data;
}

// fallback (opsional, untuk kasus dinamis)
export async function getChartReportDefault (type: ChartTimeType, params: any = {}): Promise<any> {
   const url = `/report/chart/${type}`;
   const searchParams = new URLSearchParams();

   if (params.years) {
      searchParams.set('years', params.years.join(','));
   }
   if (params.year) {
      searchParams.set('year', String(params.year));
   }
   if (params.days) {
      searchParams.set('days', String(params.days));
   }

   const { data } = await Axios.get(url, {
      params: Object.fromEntries(searchParams)
   });

   return { type, ...params, data };
}

// --- Axios Service ---
export const reportService = {
   // --- Dashboard Report ---
   async getDashboardReport (
      filters: Partial<ReservationReportFilters> = {},
      options: Partial<ReservationReportOptions> = {}
   ): Promise<DashboardReportResponse> {
      const params = new URLSearchParams();
      const allParams = { ...filters, ...options };

      Object.entries(allParams).forEach(([ key, value ]) => {
         if (value === undefined || value === null) {
            return;
         }

         if (Array.isArray(value)) {
            value.forEach(v => params.append(`${key}[]`, String(v)));
         } else if (key === 'reservationPage') {
            // Handle both object and JSON string cases
            if (typeof value === 'object' && Object.keys(value).length > 0) {
               try {
                  const serialized = JSON.stringify(value);
                  params.append(key, serialized);
               } catch (e) {
                  console.warn('Failed to stringify reservationPage:', value);
                  params.append(key, '1');
               }
            } else if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
               // Already a JSON string from cleanOptions
               params.append(key, value);
            } else {
               params.append(key, '1');
            }
         } else if (typeof value === 'number') {
            params.append(key, value.toString());
         } else if (value instanceof Date) {
            params.append(key, value.toISOString().split('T')[0]);
         } else {
            params.append(key, String(value));
         }
      });

      const { data } = await Axios.get<DashboardReportResponse>('/report/reservations', { params });
      return data;
   },

   // --- Chart Reports ---
   getChartReport: {
      yearly: getChartReportYearly,
      monthly: getChartReportMonthly,
      daily: getChartReportDaily,
      default: getChartReportDefault
   },

   // --- Excel Export ---
   async exportExcel (
      filters: Partial<ReservationReportFilters> = {},
      options: Partial<ReservationReportOptions> = {}
   ): Promise<void> {
      // --- Include fetchAllData in options for Excel export ---
      const optionsForExport = {
         ...options,
         fetchAllData: true,
         format: `${options.format || 'FULL'}`
      };
      // --- End of modification ---

      const params = new URLSearchParams();

      // --- Use optionsForExport instead of options ---
      Object.entries({ ...filters, ...optionsForExport }).forEach(([ key, value ]) => {
         // --- End of modification ---
         if (value !== undefined && value !== null) {
            // --- Handle reservationPage object serialization ---
            // Ensure reservationPage is handled correctly if it's an object
            if (key === 'reservationPage' && typeof value === 'object') {
               try {
                  const serialized = JSON.stringify(value);
                  params.append(key, serialized);
               } catch (e) {
                  console.warn('Failed to stringify reservationPage for export:', value);
                  // Fallback or skip, depending on backend expectation
                  // If fetchAllData is true, backend might ignore this anyway
               }
            } else {
               params.append(key, String(value));
            }
            // --- End of reservationPage handling ---
         }
      });

      const response = await Axios.get('/report/download/excel', {
         params: Object.fromEntries(params),
         responseType: 'blob' // Important for file download
      });

      // Create download link
      const blob = new Blob([ response.data ], {
         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
   }
};
