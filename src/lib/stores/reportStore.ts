// src/lib/stores/reportStore.ts
import { ReservationStatus } from '@/interface/enumInterface';
import { ReservationReportOptions, ReportFilters, ViewMode, SortDir } from '@/interface/report/reportInterface';
import { create } from 'zustand';

export type ChartType = 'line' | 'bar';

export interface ChartSettings {
   viewMode: ViewMode;
   chartType: ChartType;
   days: number;
   selectedYear: number;
}

interface ReportState {
   // Filters & options
   filters: ReportFilters;
   options: ReservationReportOptions;
   chartSettings: ChartSettings;

   // Actions
   setFilter: (key: keyof ReportFilters, value: any) => void;
   setFilters: (filters: Partial<ReportFilters>) => void;
   setOption: (key: keyof ReservationReportOptions, value: any) => void;
   setChartSetting: <T extends keyof ChartSettings>(key: T, value: ChartSettings[T]) => void;
   setViewMode: (mode: ViewMode) => void;
   setChartType: (type: ChartType) => void;
   setDays: (days: number) => void;
   setSelectedYear: (year: number) => void;
   resetFilters: () => void;
}

// --- Default Values (agar tidak hard-coded berkali-kali) ---
const defaultFilters: ReportFilters = {
   propertyId: undefined,
   roomTypeId: undefined,
   startDate: null,
   endDate: null,
   status: [],
   search: ''
};

const defaultOptions: ReservationReportOptions = {
   page: 1,
   pageSize: 20,
   sortBy: 'startDate',
   sortDir: 'desc'
};

const defaultChartSettings: ChartSettings = {
   viewMode: 'yearly',
   chartType: 'line',
   days: 30,
   selectedYear: new Date().getFullYear()
};

// --- Store ---
export const useReportStore = create<ReportState>(set => ({
   filters: { ...defaultFilters },
   options: { ...defaultOptions },
   chartSettings: { ...defaultChartSettings },

   setFilter: (key, value) =>
      set(state => ({
         filters: { ...state.filters, [key]: value }
      })),

   setFilters: filters =>
      set(state => ({
         filters: { ...state.filters, ...filters }
      })),

   setOption: (key, value) =>
      set(state => ({
         options: { ...state.options, [key]: value }
      })),

   setChartSetting: (key, value) =>
      set(state => ({
         chartSettings: { ...state.chartSettings, [key]: value }
      })),

   setViewMode: mode =>
      set(state => ({
         chartSettings: { ...state.chartSettings, viewMode: mode }
      })),

   setChartType: type =>
      set(state => ({
         chartSettings: { ...state.chartSettings, chartType: type }
      })),

   setDays: days =>
      set(state => ({
         chartSettings: { ...state.chartSettings, days }
      })),

   setSelectedYear: year =>
      set(state => ({
         chartSettings: { ...state.chartSettings, selectedYear: year }
      })),

   resetFilters: () =>
      set({
         filters: { ...defaultFilters },
         options: { ...defaultOptions },
         chartSettings: { ...defaultChartSettings }
      })
}));
