import { Property } from "./propertyInterface";

export interface RoomType {
  id: string;
  name: string;
  basePrice: string;
  propertyId: string;
  property: Property;
  description: string | null;
  capacity: number;
  totalQuantity: number;
  isWholeUnit: boolean;
  createdAt: string;
  updatedAt: string;
  // Relasi seperti 'rooms', 'availabilities', 'peakRates', 'reservations' tidak dimuat
}
