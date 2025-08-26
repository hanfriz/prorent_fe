import { ReservationStatus } from '../enumInterface';

export interface DashboardReportResponse {
   properties: PropertySummary[];
   roomTypes?: RoomTypeWithAvailability[];
   summary: {
      // Combined summary across all filtered data
      counts: StatusCounts;
      revenue: RevenueSummary;
   };
   period: PeriodDetail;
   pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
   };
}

export interface RoomTypeWithAvailability {
   roomType: RoomTypeMin;
   counts: StatusCounts;
   revenue: RevenueSummary;
   availability: {
      totalQuantity: number;
      dates: Array<{
         date: string; // ISO date string: "2025-01-01"
         available: number;
         isAvailable: boolean;
      }>;
   };
}

export interface RoomTypeMin {
   id: string;
   name: string;
}

export interface PropertySummary {
   property: PropertyMin;
   period: PeriodDetail;
   summary: {
      counts: StatusCounts;
      revenue: RevenueSummary;
   };
}

export interface PropertiesOverviewProps {
   properties: PropertySummary[];
}

export interface PropertyMin {
   id: string;
   name: string;
   Picture: string | null;
   address: string | null;
   city: string | null;
}

export interface PeriodDetail {
   startDate: Date | null;
   endDate: Date | null;
}

export interface StatusCounts {
   PENDING_PAYMENT: number;
   PENDING_CONFIRMATION: number;
   CONFIRMED: number;
   CANCELLED: number;
}

export interface RevenueSummary {
   actual: number;
   projected: number;
   average: number;
}

export interface ChartDataPoint {
   label: string; // e.g., "Jan", "2025-08-01"
   actualRevenue: number;
   projectedRevenue: number;
   reservations: number;
}

export interface ReservationReportFilters {
   propertyId?: string;
   roomTypeId?: string;
   ownerId: string;
   startDate?: Date | null;
   endDate?: Date | null;
   status?: ReservationStatus[];
   search?: string; // Search by user email/name
}

export interface ReservationReportOptions {
   page?: number;
   pageSize?: number;
   sortBy?: 'startDate' | 'endDate' | 'createdAt' | 'paymentAmount';
   sortDir?: 'asc' | 'desc';
}

// --- Types ---
export type ChartType = 'yearly' | 'monthly' | 'daily' | 'custom';
export type ChartParams = {
   years?: string; // "2023,2024,2025"
   year?: number;
   days?: number;
};

export type ChartReportParams =
   | { type: 'yearly'; years: number[] }
   | { type: 'monthly'; year: number; months: number[] }
   | { type: 'daily'; year: number; days: number }
   | { type: 'custom'; year: number; startDate: string; endDate: string };

export interface ChartReportOptions {
   type: ChartType;
   years?: number[];
   year?: number;
   days?: number;
}
