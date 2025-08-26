// utils.ts
// Format currency in Indonesian Rupiah
export const formatCurrency = (value: number): string => {
   return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
   }).format(value);
};

// Format number
export const formatNumber = (value: number): string => {
   return new Intl.NumberFormat('id-ID').format(value);
};

// Generate years array
export const generateYears = (range: number): number[] => {
   const currentYear = new Date().getFullYear();
   return Array.from({ length: range }, (_, i) => currentYear - i);
};

// Calculate summary metrics
export const calculateSummaryMetrics = (data: any[]) => {
   const totalActual = data.reduce((sum, item) => sum + item.actualRevenue, 0);
   const totalProjected = data.reduce((sum, item) => sum + item.projectedRevenue, 0);
   const totalReservations = data.reduce((sum, item) => sum + item.reservations, 0);
   const variance = totalActual - totalProjected;
   const variancePercent = totalProjected > 0 ? (variance / totalProjected) * 100 : 0;

   return {
      totalActual,
      totalProjected,
      totalReservations,
      variance,
      variancePercent
   };
};
