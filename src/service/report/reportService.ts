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

      Object.entries({ ...filters, ...options }).forEach(([ key, value ]) => {
         if (value === undefined || value === null) {
            return;
         }

         if (Array.isArray(value)) {
            // kirim array sebagai key[]=val agar backend bisa parse array
            value.forEach(v => params.append(`${key}[]`, String(v)));
         } else if (typeof value === 'number') {
            params.append(key, value.toString()); // number tetap string tapi backend bisa parseInt
         } else {
            params.append(key, String(value));
         }
      });

      console.log('DashboardReport params:', params.toString());

      const { data } = await Axios.get<DashboardReportResponse>('/report/reservations', { params });
      console.log('DashboardReport data:', data);
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
      const params = new URLSearchParams();

      Object.entries({ ...filters, ...options }).forEach(([ key, value ]) => {
         if (value !== undefined && value !== null) {
            params.append(key, String(value));
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
