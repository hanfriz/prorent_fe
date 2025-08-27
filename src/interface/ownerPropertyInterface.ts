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

export interface OwnerRoomType {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  basePrice: string;
  capacity: number;
  totalQuantity: number;
  isWholeUnit: boolean;
  createdAt: string;
  updatedAt: string;
  rooms: OwnerRoom[];
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
}

export interface OwnerProperty {
  id: string;
  name: string;
  description: string;
  locationId: string;
  categoryId: string;
  OwnerId: string;
  mainPictureId: string;
  rentalType: "ROOM_BY_ROOM" | "WHOLE_UNIT";
  createdAt: string;
  updatedAt: string;
  category: OwnerPropertyCategory;
  location: OwnerPropertyLocation;
  mainPicture: OwnerPropertyPicture;
  gallery: OwnerPropertyPicture[];
  rooms: OwnerRoom[];
  roomTypes: OwnerRoomType[];
  _count?: {
    rooms: number;
    Reservation: number;
  };
}

export interface OwnerPropertiesResponse {
  success: boolean;
  message: string;
  data: OwnerProperty[];
}

export interface CreatePropertyRequest {
  name: string;
  description: string;
  locationId: string;
  categoryId: string;
  rentalType: "ROOM_BY_ROOM" | "WHOLE_UNIT";
  mainPictureId?: string;
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> {
  id: string;
}

export interface CreateRoomTypeRequest {
  name: string;
  description: string;
  basePrice: string;
  capacity: number;
  totalQuantity: number;
  isWholeUnit: boolean;
}

export interface UpdateRoomTypeRequest extends Partial<CreateRoomTypeRequest> {
  id: string;
}

export interface CreateRoomRequest {
  name: string;
  roomTypeId: string;
  isAvailable?: boolean;
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {
  id: string;
}

// For property search and filtering
export interface OwnerPropertySearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  rentalType?: "ROOM_BY_ROOM" | "WHOLE_UNIT";
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface PropertyAnalytics {
  totalProperties: number;
  totalRooms: number;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  averageRating: number;
}
