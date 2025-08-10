export interface Location {
  id: string;
  name: string;
  latitude: number | null; // Decimal di Prisma sering menjadi number/string di JSON
  longitude: number | null;
  address: string | null;
  cityId: string;
  createdAt: string; // ISO 8601 Date String
  updatedAt: string;
  // Relasi seperti 'properties' dan 'Profile' biasanya tidak dimuat dalam query ini
}
