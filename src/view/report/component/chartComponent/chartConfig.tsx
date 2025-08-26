// chartConfig.ts
import { formatCurrency } from './utils';

// Prepare chart data
export const prepareChartData = (chartData: any[], chartType: string) => {
  console.log('📈 [Chart Config] Processing chart data:', {
    rawDataLength: chartData.length,
    chartType
  });
  
  const labels = chartData.map((d: any) => d.label);
  const actualRevenue = chartData.map((d: any) => Number(d.actualRevenue));
  const projectedRevenue = chartData.map((d: any) => Number(d.projectedRevenue));
  
  console.log('🏷️ [Chart Config] Chart labels:', labels);
  console.log('💰 [Chart Config] Actual revenue values:', actualRevenue);
  console.log('📊 [Chart Config] Projected revenue values:', projectedRevenue);

  return {
    labels,
    datasets: [
      {
        label: 'Actual Revenue',
        data: actualRevenue,
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 2,
        fill: chartType === 'line' ? false : true,
        tension: 0.4,
      },
      {
        label: 'Projected Revenue',
        data: projectedRevenue,
        backgroundColor: chartType === 'line' ? '#F59E0B' : 'rgba(245, 158, 11, 0.7)',
        borderColor: '#D97706',
        borderWidth: 2,
        borderDash: chartType === 'line' ? [5, 5] : [],
        fill: chartType === 'line' ? false : true,
        tension: 0.4,
      }
    ]
  };
};

// Chart options configuration
export const getChartOptions = (chartType: string) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${formatCurrency(value)}`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#e5e7eb',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (tickValue: string | number) => {
            const value = Number(tickValue);
            if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
            return formatCurrency(value);
          }
        },
        grid: {
          color: '#f3f4f6'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    elements: {
      point: {
        radius: chartType === 'line' ? 4 : 0,
        hoverRadius: chartType === 'line' ? 6 : 0
      }
    }
  };
};