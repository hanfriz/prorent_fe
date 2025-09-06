import Axios from "../lib/axios";
import { PeakRate } from "../interface/peakRateInterface";

export interface PriceData {
  date: string;
  basePrice: number;
  finalPrice: number;
  hasPeakRate: boolean;
  peakRate?: PeakRate;
}

export interface CalendarPricingResponse {
  success: boolean;
  message: string;
  data: {
    property: any;
    dailyPricing: Array<{
      date: string;
      basePrice: number;
      finalPrice: number;
      isAvailable: boolean;
    }>;
  };
}

export const pricingService = {
  // Get calendar pricing from public property endpoint
  getCalendarPricing: async (
    propertyId: string
  ): Promise<CalendarPricingResponse> => {
    try {
      const response = await Axios.get<CalendarPricingResponse>(
        `/public/properties/${propertyId}/calendar-pricing`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching calendar pricing:", error);
      throw error;
    }
  },

  // Extract price map from calendar pricing data for a specific room type
  extractPriceMapForRoomType: (
    calendarData: CalendarPricingResponse,
    roomTypeId: string
  ): Record<string, number> => {
    const priceMap: Record<string, number> = {};

    if (calendarData.success && calendarData.data.dailyPricing) {
      calendarData.data.dailyPricing.forEach((dayData) => {
        // For now, use the same pricing for all room types
        // In a more complex system, you might filter by room type
        priceMap[dayData.date] = dayData.finalPrice;
      });
    }

    return priceMap;
  },
};
