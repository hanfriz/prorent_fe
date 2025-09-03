// Graph.tsx
import React, { useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  useChartData,
  useChartSettings,
  useChartError,
} from "./chartComponent/hooks";
import {
  ViewModeSelector,
  ChartTypeSelector,
  SummaryCards,
  ChartLoading,
  ChartError,
  NoData,
} from "./chartComponent/graphComponent";
import {
  prepareChartData,
  getChartOptions,
} from "./chartComponent/chartConfig";

// Register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { RefreshCw } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
);

export default function Graph({
  title = "Revenue Analytics",
  showControls = true,
  showSummary = true,
  height = 400,
}: any) {
  // Initialize hooks
  const { data, rawData, isLoading, error, refetch, invalidateAll } =
    useChartData();
  const { chartSettings, setViewMode, setChartType, setDays, setSelectedYear } =
    useChartSettings();
  const { chartError, setChartError } = useChartError(error);

  // Set default chart type
  useEffect(() => {
    if (chartSettings.chartType !== "line") {
      setChartType("line");
    }
  }, [chartSettings.chartType, setChartType]);

  // Handle refresh
  const handleRefresh = async () => {
    setChartError(null);
    await invalidateAll();
    const result = await refetch();
  };

  // Error state - show for the entire component
  if (chartError || error) {
    return <ChartError error={chartError || error} onRetry={handleRefresh} />;
  }

  // No data state - show for the entire component
  if (!isLoading && (!data || data.length === 0)) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        {showControls && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
              <p className="text-gray-600">
                Track your actual vs projected revenue performance
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <ViewModeSelector
                viewMode={chartSettings.viewMode}
                setViewMode={setViewMode}
                days={chartSettings.days}
                setDays={setDays}
                selectedYear={chartSettings.selectedYear}
                setSelectedYear={setSelectedYear}
              />
              <ChartTypeSelector
                chartType={chartSettings.chartType}
                setChartType={setChartType}
              />
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title="Refresh data"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Show no data in chart area */}
        <NoData />
      </div>
    );
  }

  // Prepare chart data (only if we have data)
  const chartJsData = data
    ? prepareChartData(data, chartSettings.chartType)
    : null;
  const options = getChartOptions(chartSettings.chartType);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      {/* Header - always visible */}
      {showControls && (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
            <p className="text-gray-600">
              Track your actual vs projected revenue performance
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <ViewModeSelector
              viewMode={chartSettings.viewMode}
              setViewMode={setViewMode}
              days={chartSettings.days}
              setDays={setDays}
              selectedYear={chartSettings.selectedYear}
              setSelectedYear={setSelectedYear}
            />
            <ChartTypeSelector
              chartType={chartSettings.chartType}
              setChartType={setChartType}
            />
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Refresh data"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards - visible even during loading */}
      {showSummary && data && <SummaryCards data={data} />}

      {/* Chart Area - this is where loading/error/no-data will be shown */}
      <div style={{ height: `${height}px` }} className="w-full">
        {isLoading ? (
          <ChartLoading />
        ) : chartError || error ? (
          <ChartError error={chartError || error} onRetry={handleRefresh} />
        ) : !data || data.length === 0 ? (
          <NoData />
        ) : chartJsData !== null ? (
          chartSettings.chartType === "line" ? (
            <Line data={chartJsData} options={options} />
          ) : (
            <Bar data={chartJsData} options={options} />
          )
        ) : (
          <NoData /> // or some other fallback component
        )}
      </div>
    </div>
  );
}
