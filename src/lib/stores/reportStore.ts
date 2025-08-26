// src/lib/stores/reportStore.ts
import { ReservationStatus } from '@/interface/enumInterface';
import { create } from 'zustand';

export type OrderStatus = ReservationStatus;

export type SortDir = 'asc' | 'desc';
export type ViewMode = 'yearly' | 'monthly' | 'daily' | 'custom';
export type ChartType = 'line' | 'bar';

interface ReportFilters {
   propertyId?: string;
   roomTypeId?: string;
   startDate?: Date | null;
   endDate?: Date | null;
   status?: OrderStatus[];
   search?: string;
}

interface ReportOptions {
   page: number;
   pageSize: number;
   sortBy: 'startDate' | 'endDate' | 'createdAt' | 'paymentAmount';
   sortDir: SortDir;
}

interface ChartSettings {
   viewMode: ViewMode;
   chartType: ChartType;
   days: number;
   selectedYear: number;
}

interface ReportState {
   // Filters & options
   filters: ReportFilters;
   options: ReportOptions;
   chartSettings: ChartSettings;

   // Actions
   setFilter: (key: keyof ReportFilters, value: any) => void;
   setFilters: (filters: Partial<ReportFilters>) => void;
   setOption: (key: keyof ReportOptions, value: any) => void;
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

const defaultOptions: ReportOptions = {
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
