export interface Location {
  id: string;
  name: string;
  latitude: number | null; // Decimal di Prisma sering menjadi number/string di JSON
  longitude: number | null;
  address: string | null;
  cityId: string;
  createdAt: string; // ISO 8601 Date String
  updatedAt: string;
  city?: City;
  // Relasi seperti 'properties' dan 'Profile' biasanya tidak dimuat dalam query ini
}

export interface City {
  id: string;
  name: string;
  provinceId: string;
  createdAt: string;
  updatedAt: string;
  province?: Province;
}

export interface Province {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
