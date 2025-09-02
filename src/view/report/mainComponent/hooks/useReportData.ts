// src/app/dashboard/report/main/hooks/useReportData.ts
import { useDashboardReportCore } from '@/service/report/useReport';

export const useReportData = (filters: any, options: any, shouldFetch: boolean) => {
   return useDashboardReportCore(filters, shouldFetch ? options : undefined);
};
