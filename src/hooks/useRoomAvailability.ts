import { useState, useCallback, useRef } from "react";
import { roomService, AvailabilityItem } from "@/service/roomService";
import { useAuth } from "@/lib/hooks/useAuth";

interface UseRoomAvailabilityProps {
  roomId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useRoomAvailability = ({
  roomId,
  onSuccess,
  onError,
}: UseRoomAvailabilityProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<AvailabilityItem[]>(
    []
  );
  const [currentMonth, setCurrentMonth] = useState(
    roomService.getCurrentMonth()
  );

  // Use ref to track if we've already fetched data for this room/month combination
  const fetchedKey = useRef<string>("");
  const { user } = useAuth();
  const isOwner = user?.role === "OWNER";

  // Set bulk availability (Owner only)
  const setBulkAvailability = useCallback(
    async (availability: AvailabilityItem[]) => {
      if (!isOwner) {
        onError?.("Only property owners can set availability");
        return;
      }

      try {
        setIsLoading(true);

        // Validate availability array
        const validation = roomService.validateAvailabilityArray(availability);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        const response = await roomService.setBulkAvailability(
          roomId,
          availability
        );

        if (response.success) {
          onSuccess?.();
          // Refresh current month data
          const refreshResponse = await roomService.getMonthlyAvailability(
            roomId,
            currentMonth
          );
          if (refreshResponse.success && refreshResponse.data) {
            setAvailabilityData(refreshResponse.data.availabilities);
          }
        } else {
          throw new Error(response.message || "Failed to set availability");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to set availability";
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [roomId, currentMonth, onSuccess, onError, isOwner]
  );

  // Get monthly availability with deduplication
  const getMonthlyAvailability = useCallback(
    async (month: string) => {
      // Create a unique key for this room/month combination
      const key = `${roomId}-${month}`;

      // Skip if we've already fetched this data
      if (fetchedKey.current === key || !roomId) {
        return;
      }

      try {
        setIsLoading(true);

        // Validate month format
        if (!roomService.validateMonthFormat(month)) {
          throw new Error("Invalid month format. Expected YYYY-MM");
        }

        // Use public endpoint for non-owners, owner endpoint for owners
        const response = isOwner
          ? await roomService.getMonthlyAvailability(roomId, month)
          : await roomService.getMonthlyAvailabilityPublic(roomId, month);

        if (response.success && response.data) {
          setAvailabilityData(response.data.availabilities);
          setCurrentMonth(month);
          fetchedKey.current = key; // Mark this combination as fetched
        } else {
          throw new Error(response.message || "Failed to get availability");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to get availability";
        onError?.(errorMessage);
        setAvailabilityData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [roomId, onError, isOwner]
  );

  // Navigate to next month
  const goToNextMonth = useCallback(async () => {
    const nextMonth = roomService.getNextMonth(currentMonth);
    try {
      setIsLoading(true);

      if (!roomService.validateMonthFormat(nextMonth)) {
        throw new Error("Invalid month format. Expected YYYY-MM");
      }

      const response = await roomService.getMonthlyAvailability(
        roomId,
        nextMonth
      );

      if (response.success && response.data) {
        setAvailabilityData(response.data.availabilities);
        setCurrentMonth(nextMonth);
      } else {
        throw new Error(response.message || "Failed to get availability");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to get availability";
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth, roomId, onError]);

  // Navigate to previous month
  const goToPreviousMonth = useCallback(async () => {
    const previousMonth = roomService.getPreviousMonth(currentMonth);
    try {
      setIsLoading(true);

      if (!roomService.validateMonthFormat(previousMonth)) {
        throw new Error("Invalid month format. Expected YYYY-MM");
      }

      const response = await roomService.getMonthlyAvailability(
        roomId,
        previousMonth
      );

      if (response.success && response.data) {
        setAvailabilityData(response.data.availabilities);
        setCurrentMonth(previousMonth);
      } else {
        throw new Error(response.message || "Failed to get availability");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to get availability";
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth, roomId, onError]);

  // Set availability for a specific date
  const setDateAvailability = useCallback(
    async (date: string, isAvailable: boolean) => {
      const availability: AvailabilityItem[] = [{ date, isAvailable }];
      await setBulkAvailability(availability);
    },
    [setBulkAvailability]
  );

  // Set availability for a date range
  const setDateRangeAvailability = useCallback(
    async (startDate: string, endDate: string, isAvailable: boolean) => {
      const availability = roomService.generateAvailabilityForDateRange(
        startDate,
        endDate,
        isAvailable
      );
      await setBulkAvailability(availability);
    },
    [setBulkAvailability]
  );

  // Set availability for entire month
  const setMonthAvailability = useCallback(
    async (month: string, isAvailable: boolean) => {
      const [yearStr, monthStr] = month.split("-");
      const year = parseInt(yearStr, 10);
      const monthNum = parseInt(monthStr, 10);

      const availability = roomService.generateMonthlyAvailability(
        year,
        monthNum,
        isAvailable
      );
      await setBulkAvailability(availability);
    },
    [setBulkAvailability]
  );

  return {
    // State
    isLoading,
    availabilityData,
    currentMonth,

    // Actions
    setBulkAvailability,
    getMonthlyAvailability,
    setDateAvailability,
    setDateRangeAvailability,
    setMonthAvailability,

    // Navigation
    goToNextMonth,
    goToPreviousMonth,

    // Utilities
    getCurrentMonthFormatted: () => {
      const date = new Date(`${currentMonth}-01`);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    },
  };
};
