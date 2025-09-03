// constants.ts
import { Calendar, TrendingUp, BarChart3, Activity } from 'lucide-react';

export const VIEW_MODES = [
   { value: 'yearly', label: 'Yearly', icon: Calendar },
   { value: 'monthly', label: 'Monthly', icon: BarChart3 },
   { value: 'daily', label: 'Daily', icon: TrendingUp }
];

export const CHART_TYPES = [
   { value: 'line', label: 'Line Chart', icon: Activity },
   { value: 'bar', label: 'Bar Chart', icon: BarChart3 }
];

export const DAYS_OPTIONS = [
   { value: 7, label: 'Last 7 days' },
   { value: 14, label: 'Last 14 days' },
   { value: 30, label: 'Last 30 days' },
   { value: 60, label: 'Last 60 days' },
   { value: 90, label: 'Last 90 days' }
];

export const YEARS_RANGE = 5;
