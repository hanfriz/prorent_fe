// components.tsx
import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Calendar, TrendingUp, BarChart3, Activity, RefreshCw } from 'lucide-react';
import { VIEW_MODES, CHART_TYPES, DAYS_OPTIONS } from './constant';
import { generateYears, calculateSummaryMetrics, formatCurrency, formatNumber } from './utils';

// View mode selector component
export const ViewModeSelector = ({ 
  viewMode, 
  setViewMode, 
  days, 
  setDays, 
  selectedYear, 
  setSelectedYear 
}: any) => {
  const years = generateYears(5);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex bg-gray-100 rounded-lg p-1">
        {VIEW_MODES.map((mode: any) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.value}
              onClick={() => setViewMode(mode.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === mode.value
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {mode.label}
            </button>
          );
        })}
      </div>

      {viewMode === 'monthly' && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}

      {viewMode === 'daily' && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Days:</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {DAYS_OPTIONS.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

// Chart type selector
export const ChartTypeSelector = ({ 
  chartType, 
  setChartType 
}: any) => {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {CHART_TYPES.map((type: any) => {
        const Icon = type.icon;
        return (
          <button
            key={type.value}
            onClick={() => setChartType(type.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              chartType === type.value
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon size={16} />
            {type.label}
          </button>
        );
      })}
    </div>
  );
};

// Summary cards component
export const SummaryCards = ({ data }: any) => {
  const metrics = calculateSummaryMetrics(data);
  
  const cards = [
    {
      title: 'Total Actual Revenue',
      value: formatCurrency(metrics.totalActual),
      color: 'blue',
      icon: TrendingUp,
      subValue: `${data.length} periods`
    },
    {
      title: 'Total Projected Revenue',
      value: formatCurrency(metrics.totalProjected),
      color: 'gray',
      icon: BarChart3,
      subValue: 'Target'
    },
    {
      title: 'Total Reservations',
      value: formatNumber(metrics.totalReservations),
      color: 'green',
      icon: Calendar,
      subValue: 'Bookings'
    },
    {
      title: 'Variance',
      value: `${metrics.variancePercent >= 0 ? '+' : ''}${metrics.variancePercent.toFixed(1)}%`,
      color: metrics.variancePercent >= 0 ? 'green' : 'red',
      icon: TrendingUp,
      subValue: metrics.variancePercent >= 0 ? 'Above target' : 'Below target'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const colorClasses = {
          blue: 'bg-blue-100 text-blue-600',
          gray: 'bg-gray-100 text-gray-600',
          green: 'bg-green-100 text-green-600',
          red: 'bg-red-100 text-red-600',
        };

        return (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                <Icon size={20} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className={`text-2xl font-bold mb-1 ${
                card.color === 'red' ? 'text-red-600' : 
                card.color === 'green' ? 'text-green-600' : 
                card.color === 'blue' ? 'text-blue-600' : 
                'text-gray-600'
              }`}>
                {card.value}
              </p>
              <p className="text-xs text-gray-500">{card.subValue}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Loading component
export const ChartLoading = () => {
  console.log('⏳ [Chart Loading] Showing loading state');
  return (
    <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <p className="text-gray-600">Loading chart data...</p>
      </div>
    </div>
  );
};

// Error component
export const ChartError = ({ error, onRetry }: any) => {
  console.log('❌ [Chart Error] Showing error state', { error });
  return (
    <div className="flex items-center justify-center h-80 bg-red-50 rounded-lg border border-red-200">
      <div className="text-center">
        <div className="text-red-600 mb-2">
          <TrendingUp size={32} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-red-900 mb-2">Failed to load chart</h3>
        <p className="text-red-700 mb-4">{error?.message || 'An unexpected error occurred'}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

// No data component
export const NoData = () => {
  console.log('📭 [Chart No Data] Showing no data state');
  return (
    <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
      <div className="text-center">
        <BarChart3 size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600">No data available for the selected period</p>
      </div>
    </div>
  );
};