import { useQuery } from "@tanstack/react-query";
import { pricingService } from "./pricingService";

// Hook to get calendar pricing for a property
export const useCalendarPricing = (propertyId: string) => {
  return useQuery({
    queryKey: ["calendar-pricing", propertyId],
    queryFn: () => pricingService.getCalendarPricing(propertyId),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get price map for a specific room type
export const usePriceMapForRoomType = (
  propertyId: string,
  roomTypeId: string
) => {
  const {
    data: calendarData,
    isLoading,
    error,
  } = useCalendarPricing(propertyId);

  const priceMap = calendarData
    ? pricingService.extractPriceMapForRoomType(calendarData, roomTypeId)
    : {};

  return {
    data: priceMap,
    isLoading,
    error,
  };
};
