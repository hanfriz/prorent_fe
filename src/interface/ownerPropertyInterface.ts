// Property Type Enum
export enum PropertyType {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  VILLA = "VILLA",
  GUEST_HOUSE = "GUEST_HOUSE",
  HOTEL = "HOTEL",
}

export interface OwnerPropertyLocation {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  address: string;
  cityId: string;
  createdAt: string;
  updatedAt: string;
  city: {
    id: string;
    name: string;
    provinceId: string;
    createdAt: string;
    updatedAt: string;
    province: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface OwnerPropertyCategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface OwnerPropertyPicture {
  id: string;
  url: string;
  alt: string;
  type: string;
  sizeKB: number;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface OwnerPropertyGalleryItem {
  propertyId: string;
  pictureId: string;
  picture: OwnerPropertyPicture;
}

export interface OwnerRoomType {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  basePrice: string; // Backend returns string
  capacity: number;
  totalQuantity: number;
  isWholeUnit: boolean;
  createdAt: string;
  updatedAt: string;
  rooms?: OwnerRoom[];
}

export interface OwnerRoom {
  id: string;
  name: string;
  roomTypeId: string;
  propertyId: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  roomType?: OwnerRoomType;
  gallery?: OwnerPropertyGalleryItem[];
}

export interface OwnerProperty {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  propertyType: PropertyType;
  locationId: string;
  categoryId: string;
  OwnerId: string;
  mainPictureId: string;
  rentalType: "ROOM_BY_ROOM" | "WHOLE_PROPERTY";
  createdAt: string;
  updatedAt: string;
  category: OwnerPropertyCategory;
  location: OwnerPropertyLocation;
  mainPicture: OwnerPropertyPicture;
  gallery: OwnerPropertyGalleryItem[];
  rooms: OwnerRoom[];
  roomTypes: OwnerRoomType[];
  _count?: {
    rooms: number;
    Reservation: number;
  };
}

// Search and Pagination
export interface OwnerPropertySearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  rentalType?: "ROOM_BY_ROOM" | "WHOLE_PROPERTY";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Analytics and Statistics
export interface PropertyAnalytics {
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  averageRating: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
}

export interface OwnerPropertiesResponse {
  success: boolean;
  message: string;
  data: OwnerProperty[];
}

export interface OwnerPropertyDetailResponse {
  success: boolean;
  message: string;
  data: OwnerProperty;
}

export interface CreatePropertyRequest {
  name: string;
  description: string;
  locationId: string;
  categoryId: string;
  rentalType: "ROOM_BY_ROOM" | "WHOLE_PROPERTY";
  mainPictureId?: string;
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {
  id: string;
}

export interface CreateRoomTypeRequest {
  name: string;
  description?: string; // Make optional since backend accepts it as optional
  basePrice: string; // Keep as string in frontend for better UX
  capacity: number;
  totalQuantity: number;
  isWholeUnit?: boolean; // Make optional with default false
  propertyId?: string; // Make optional since it's added in service
}

export interface UpdateRoomTypeRequest extends Partial<CreateRoomTypeRequest> {
  id: string;
}

export interface CreateRoomRequest {
  name: string;
  roomTypeId: string;
  propertyId: string;
  isAvailable?: boolean;
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {
  id: string;
}

// Utility functions for rental type display
export const getRentalTypeDisplay = (rentalType: string) => {
  switch (rentalType) {
    case "ROOM_BY_ROOM":
      return "Sewa Satu Kamar";
    case "WHOLE_PROPERTY":
      return "Sewa Seluruh Properti";
    default:
      return rentalType;
  }
};

export const formatPrice = (price: string | number) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numPrice);
};
