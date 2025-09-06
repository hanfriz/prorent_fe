import { RateType } from "./enumInterface";

export interface PeakRate {
  id: string;
  roomTypeId: string;
  startDate: string;
  endDate: string;
  rateType: RateType;
  value: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePeakRateRequest {
  startDate: string;
  endDate: string;
  rateType: RateType;
  value: number;
  description?: string;
}

export interface UpdatePeakRateRequest {
  startDate?: string;
  endDate?: string;
  rateType?: RateType;
  value?: number;
  description?: string;
}

export interface PeakRateResponse {
  success: boolean;
  message: string;
  data: PeakRate;
}

export interface PeakRatesResponse {
  success: boolean;
  message: string;
  data: PeakRate[];
}
