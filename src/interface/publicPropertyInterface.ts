export interface PropertyCategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  province: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PropertyPicture {
  id: string;
  url: string;
  alt: string;
  type: string;
  sizeKB: number;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyPriceRange {
  min: number;
  max: number;
}

export interface PropertyOwner {
  name: string;
  phone: string | null;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  capacity: number;
  totalQuantity: number;
  upcomingPeakRates: any[];
}

export interface Room {
  id: string;
  name: string;
  roomType: RoomType;
  isAvailable: boolean;
  pictures: PropertyPicture[];
}

export interface PublicPropertyDetail {
  id: string;
  name: string;
  description: string;
  rentalType: "ROOM_BY_ROOM" | "WHOLE_PROPERTY";
  category: PropertyCategory;
  location: PropertyLocation;
  owner: PropertyOwner;
  pictures: {
    main: PropertyPicture;
    gallery: PropertyPicture[];
  };
  rooms: Room[];
  roomTypes: RoomType[];
  createdAt: string;
  updatedAt: string;
}

export interface PublicProperty {
  id: string;
  name: string;
  description: string;
  category: PropertyCategory;
  location: PropertyLocation;
  mainPicture: PropertyPicture;
  priceRange: PropertyPriceRange;
  roomCount: number;
  capacity: number;
  createdAt: string;
}

export interface PublicPropertiesResponse {
  success: boolean;
  message: string;
  data: PublicProperty[];
  pagination: {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface PublicPropertyDetailResponse {
  success: boolean;
  message: string;
  data: PublicPropertyDetail;
}

export interface PropertySearchParams {
  search?: string;
  city?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
