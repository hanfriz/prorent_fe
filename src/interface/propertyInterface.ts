import { Location } from "./locationInterface";
import { PropertyRentalType } from "./enumInterface";

export interface Property {
  id: string;
  name: string;
  description: string;
  locationId: string;
  location: Location;
  categoryId: string;
  OwnerId: string;
  mainPictureId: string | null;
  rentalType: PropertyRentalType;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  mainPicture?: UploadedFile;
  gallery?: any[];
  rooms?: Room[];
  roomTypes?: any[];
  _count?: {
    rooms: number;
    Reservation: number;
  };
}

export interface CreatePropertyRequest {
  name: string;
  description: string;
  location: string;
  city: string;
  province: string;
  categoryId: string;
  mainPictureId: string;
  latitude?: string;
  longitude?: string;
}

export interface CreatePropertyResponse {
  success: boolean;
  message: string;
  data: Property;
}

// Category Interfaces
export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface CreateCategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface GetCategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

// Upload Interfaces
export interface UploadedFile {
  id: string;
  url: string;
  alt: string;
  type: string;
  sizeKB: number;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  cloudinaryInfo?: {
    id: string;
    createdAt: string;
  };
}

export interface GetUploadsResponse {
  success: boolean;
  message: string;
  data: UploadedFile[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UploadFileResponse {
  success: boolean;
  message: string;
  data: UploadedFile;
}

export interface GetFileResponse {
  success: boolean;
  message: string;
  data: UploadedFile;
}

export interface DeleteFileResponse {
  success: boolean;
  message: string;
}

// Room Interfaces
export interface Room {
  id: string;
  name: string;
  roomTypeId: string;
  propertyId: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  roomType?: RoomType;
  property?: {
    id: string;
    name: string;
    OwnerId: string;
  };
  gallery?: RoomGallery[];
  _count?: {
    reservations: number;
    availabilities: number;
  };
}

export interface RoomType {
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
}

export interface RoomGallery {
  roomId: string;
  pictureId: string;
  picture: UploadedFile;
}

export interface CreateRoomRequest {
  propertyId: string;
  name: string;
  roomTypeName: string;
  description: string;
  capacity: number;
  basePrice: number;
  pictures: string[];
}

export interface CreateRoomResponse {
  success: boolean;
  message: string;
  data: Room;
}

export interface GetRoomsResponse {
  success: boolean;
  message: string;
  data: Room[];
}

export interface GetPropertiesResponse {
  success: boolean;
  message: string;
  data: Property[];
}
