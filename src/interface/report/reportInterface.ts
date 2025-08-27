import { ReservationStatus } from '../enumInterface';

export interface DashboardReportResponse {
   properties: PropertySummary[];
   summary: {
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
         date: string;
         available: number;
         isAvailable: boolean;
      }>;
   };
   uniqueCustomers?: CustomerMin[];
   data?: ReservationMin[];
   pagination?: any;
}

export interface RoomTypeMin {
   id: string;
   name: string;
}
export interface CustomerMin {
   id: string;
   email: string;
   firstName: string | null;
   lastName: string | null;
}

export interface PropertySummary {
   property: PropertyMin;
   roomTypes: RoomTypeWithAvailability[];
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
   reservationPage?: number | { [roomTypeId: string]: number };
   pageSize?: number;
   reservationPageSize?: number;
   sortBy?: 'startDate' | 'endDate' | 'createdAt' | 'paymentAmount';
   sortDir?: 'asc' | 'desc';
}

// --- Types ---
export type ChartTimeType = 'yearly' | 'monthly' | 'daily' | 'custom';
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
   type: ChartTimeType;
   years?: number[];
   year?: number;
   days?: number;
}

export interface Property {
   id: string;
   name: string;
   Picture?: string | null;
   address?: string;
   city?: string;
}

export interface FilterControlsProps {
   searchTerm: string;
   dateRangeType: string;
   selectedYear: number;
   selectedMonth: number;
   customStartDate: Date | null;
   customEndDate: Date | null;
   onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   onSearch: () => void;
   onSortChange: (value: string) => void;
   onSortDirectionChange: () => void;
   onResetFilters: () => void;
   onDateRangeTypeChange: (value: string) => void;
   onYearChange: (value: number) => void;
   onMonthChange: (value: number) => void;
   onCustomStartDateChange: (value: Date | null) => void;
   onCustomEndDateChange: (value: Date | null) => void;
   onApplyDates: () => void;
   sortBy: string;
   sortDir: string;
}

export type OrderStatus = ReservationStatus;

export type SortDir = 'asc' | 'desc';
export type ViewMode = 'yearly' | 'monthly' | 'daily' | 'custom';

export interface ReportFilters {
   propertyId?: string;
   roomTypeId?: string;
   startDate?: Date | null;
   endDate?: Date | null;
   status?: OrderStatus[];
   search?: string;
}

export interface PropertyReportParams {
   propertyId: string;
   startDate?: Date;
   endDate?: Date;
   options?: ReservationReportOptions;
}

export interface ReservationMin {
   id: string;
   userId: string;
   startDate: Date;
   endDate: Date;
   orderStatus: OrderStatus;
   paymentAmount: number | null;
   user: {
      email: string;
      firstName: string | null;
      lastName: string | null;
   };
}

export interface RoomTypeAccordionProps {
   roomType: RoomTypeWithAvailability;
   startDate: Date;
   endDate: Date;
   onReservationPageChange: (roomTypeId: string, page: number) => void;
}
