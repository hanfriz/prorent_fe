import Axios from "../lib/axios";
import {
  PeakRate,
  CreatePeakRateRequest,
  UpdatePeakRateRequest,
  PeakRateResponse,
  PeakRatesResponse,
} from "../interface/peakRateInterface";

export const peakRateService = {
  // Get peak rates for a room type
  getPeakRates: async (roomTypeId: string): Promise<PeakRatesResponse> => {
    try {
      const response = await Axios.get<PeakRatesResponse>(
        `/rooms/${roomTypeId}/peak-rates`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching peak rates:", error);
      throw error;
    }
  },

  // Add peak rate
  addPeakRate: async (
    roomTypeId: string,
    data: CreatePeakRateRequest
  ): Promise<PeakRateResponse> => {
    try {
      const response = await Axios.post<PeakRateResponse>(
        `/rooms/${roomTypeId}/peak-price`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding peak rate:", error);
      throw error;
    }
  },

  // Update peak rate for specific date
  updatePeakRate: async (
    roomTypeId: string,
    date: string,
    data: UpdatePeakRateRequest
  ): Promise<PeakRateResponse> => {
    try {
      const response = await Axios.patch<PeakRateResponse>(
        `/rooms/${roomTypeId}/peak-price/${date}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating peak rate:", error);
      throw error;
    }
  },

  // Remove peak rate for specific date
  removePeakRate: async (
    roomTypeId: string,
    date: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await Axios.delete<{
        success: boolean;
        message: string;
      }>(`/rooms/${roomTypeId}/peak-price/${date}`);
      return response.data;
    } catch (error: any) {
      console.error("Error removing peak rate:", error);
      throw error;
    }
  },
};
