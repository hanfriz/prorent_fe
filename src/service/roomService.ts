import Axios from "@/lib/axios";
import { ROOM_ENDPOINTS } from "@/constants/endpoint";

// Types and Interfaces
export interface AvailabilityItem {
  date: string; // Format: YYYY-MM-DD
  isAvailable: boolean;
}

export interface SetBulkAvailabilityRequest {
  availability: AvailabilityItem[];
}

export interface SetBulkAvailabilityResponse {
  success: boolean;
  message: string;
}

export interface GetMonthlyAvailabilityRequest {
  roomId: string;
  month: string; // Format: YYYY-MM
}

export interface MonthlyAvailabilityData {
  roomId: string;
  roomName: string;
  roomType: {
    id: string;
    name: string;
    basePrice: number;
  };
  month: string;
  availabilities: AvailabilityItem[]; // Changed from 'availability' to 'availabilities'
}

export interface GetMonthlyAvailabilityResponse {
  success: boolean;
  message: string;
  data: MonthlyAvailabilityData;
}

// Room Service
export const roomService = {
  /**
   * Set bulk availability for a room/room-type
   * POST /api/rooms/:id/availability
   */
  setBulkAvailability: async (
    roomId: string,
    availability: AvailabilityItem[]
  ): Promise<SetBulkAvailabilityResponse> => {
    try {
      const response = await Axios.post(
        ROOM_ENDPOINTS.SET_BULK_AVAILABILITY(roomId),
        {
          availability,
        }
      );
      return response.data;
    } catch (error: any) {
      // Re-throw with proper error structure
      throw error;
    }
  },

  /**
   * Get monthly availability for a room/room-type (Public access)
   * GET /api/public/properties/rooms/:id/availability?month=YYYY-MM
   */
  getPublicMonthlyAvailability: async (
    roomId: string,
    month: string
  ): Promise<GetMonthlyAvailabilityResponse> => {
    try {
      const response = await Axios.get(
        ROOM_ENDPOINTS.GET_PUBLIC_AVAILABILITY(roomId),
        {
          params: { month },
        }
      );
      return response.data;
    } catch (error: any) {
      // Re-throw with proper error structure
      throw error;
    }
  },

  /**
   * Get monthly availability for a room/room-type (Owner access)
   * GET /api/rooms/:id/availability?month=YYYY-MM
   */
  getMonthlyAvailability: async (
    roomId: string,
    month: string
  ): Promise<GetMonthlyAvailabilityResponse> => {
    try {
      const response = await Axios.get(
        ROOM_ENDPOINTS.GET_MONTHLY_AVAILABILITY(roomId),
        {
          params: { month },
        }
      );
      return response.data;
    } catch (error: any) {
      // Re-throw with proper error structure
      throw error;
    }
  },

  /**
   * Get monthly availability for a room/room-type (Public access - no auth required)
   * GET /public/properties/rooms/:id/availability?month=YYYY-MM
   */
  getMonthlyAvailabilityPublic: async (
    roomId: string,
    month: string
  ): Promise<GetMonthlyAvailabilityResponse> => {
    try {
      const response = await Axios.get(
        `/public/properties/rooms/${roomId}/availability`,
        {
          params: { month },
          // Skip auth redirect on error
          _skipAuthRedirect: true,
        } as any
      );
      return response.data;
    } catch (error: any) {
      // Re-throw with proper error structure
      throw error;
    }
  },

  // Helper methods for validation and formatting

  /**
   * Validate month format (YYYY-MM)
   */
  validateMonthFormat: (month: string): boolean => {
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return false;
    }

    const [yearStr, monthStr] = month.split("-");
    const year = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);

    // Validate year and month ranges
    if (year < 2000 || year > 2100) {
      return false;
    }

    if (monthNum < 1 || monthNum > 12) {
      return false;
    }

    return true;
  },

  /**
   * Validate date format (YYYY-MM-DD)
   */
  validateDateFormat: (date: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return false;
    }

    const parsedDate = new Date(date);
    return parsedDate.toISOString().split("T")[0] === date;
  },

  /**
   * Validate availability array
   */
  validateAvailabilityArray: (
    availability: AvailabilityItem[]
  ): {
    isValid: boolean;
    error?: string;
  } => {
    if (!availability || !Array.isArray(availability)) {
      return {
        isValid: false,
        error: "Availability array is required",
      };
    }

    if (availability.length === 0) {
      return {
        isValid: false,
        error: "Availability array cannot be empty",
      };
    }

    // Validate each availability item
    for (let i = 0; i < availability.length; i++) {
      const item = availability[i];

      if (!item || typeof item !== "object") {
        return {
          isValid: false,
          error: `Availability item must be an object at index ${i}`,
        };
      }

      if (!item.date || typeof item.date !== "string") {
        return {
          isValid: false,
          error: `Date is required at index ${i}`,
        };
      }

      if (typeof item.isAvailable !== "boolean") {
        return {
          isValid: false,
          error: `isAvailable must be a boolean at index ${i}`,
        };
      }

      // Validate date format
      if (!roomService.validateDateFormat(item.date)) {
        return {
          isValid: false,
          error: `Invalid date format at index ${i}. Expected YYYY-MM-DD`,
        };
      }
    }

    return { isValid: true };
  },

  /**
   * Generate availability array for a date range
   */
  generateAvailabilityForDateRange: (
    startDate: string,
    endDate: string,
    isAvailable: boolean = true
  ): AvailabilityItem[] => {
    const availability: AvailabilityItem[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      availability.push({
        date: date.toISOString().split("T")[0],
        isAvailable,
      });
    }

    return availability;
  },

  /**
   * Generate availability array for a specific month
   */
  generateMonthlyAvailability: (
    year: number,
    month: number,
    isAvailable: boolean = true
  ): AvailabilityItem[] => {
    const availability: AvailabilityItem[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      availability.push({
        date: date.toISOString().split("T")[0],
        isAvailable,
      });
    }

    return availability;
  },

  /**
   * Format month string from Date object
   */
  formatMonthFromDate: (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
  },

  /**
   * Get current month string
   */
  getCurrentMonth: (): string => {
    return roomService.formatMonthFromDate(new Date());
  },

  /**
   * Get next month string
   */
  getNextMonth: (monthStr?: string): string => {
    const date = monthStr ? new Date(`${monthStr}-01`) : new Date();
    date.setMonth(date.getMonth() + 1);
    return roomService.formatMonthFromDate(date);
  },

  /**
   * Get previous month string
   */
  getPreviousMonth: (monthStr?: string): string => {
    const date = monthStr ? new Date(`${monthStr}-01`) : new Date();
    date.setMonth(date.getMonth() - 1);
    return roomService.formatMonthFromDate(date);
  },
};
