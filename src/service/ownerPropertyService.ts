import axiosInstance from "@/lib/axios";
import {
  OwnerProperty,
  OwnerPropertiesResponse,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  CreateRoomTypeRequest,
  UpdateRoomTypeRequest,
  CreateRoomRequest,
  UpdateRoomRequest,
  OwnerPropertySearchParams,
  PropertyAnalytics,
  OwnerRoomType,
  OwnerRoom,
} from "@/interface/ownerPropertyInterface";

interface DeleteResponse {
  success: boolean;
  message: string;
}

interface SinglePropertyResponse {
  success: boolean;
  message: string;
  data: OwnerProperty;
}

interface SingleRoomTypeResponse {
  success: boolean;
  message: string;
  data: OwnerRoomType;
}

interface RoomTypesResponse {
  success: boolean;
  message: string;
  data: OwnerRoomType[];
}

interface SingleRoomResponse {
  success: boolean;
  message: string;
  data: OwnerRoom;
}

interface RoomsResponse {
  success: boolean;
  message: string;
  data: OwnerRoom[];
}

interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: PropertyAnalytics;
}

interface ImageUploadResponse {
  success: boolean;
  message: string;
  data: { id: string; url: string };
}

export const ownerPropertyService = {
  // Property CRUD operations
  getMyProperties: async (
    params?: OwnerPropertySearchParams
  ): Promise<OwnerPropertiesResponse> => {
    try {
      const response = await axiosInstance.get<OwnerPropertiesResponse>(
        "/owner/properties",
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching owner properties:", error);
      throw error;
    }
  },

  getPropertyById: async (id: string): Promise<SinglePropertyResponse> => {
    try {
      const response = await axiosInstance.get<SinglePropertyResponse>(
        `/owner/properties/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching owner property:", error);
      throw error;
    }
  },

  createProperty: async (
    data: CreatePropertyRequest
  ): Promise<SinglePropertyResponse> => {
    try {
      const response = await axiosInstance.post<SinglePropertyResponse>(
        "/owner/properties",
        data
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating property:", error);
      throw error;
    }
  },

  updateProperty: async (
    id: string,
    data: UpdatePropertyRequest
  ): Promise<SinglePropertyResponse> => {
    try {
      const response = await axiosInstance.patch<SinglePropertyResponse>(
        `/owner/properties/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating property:", error);
      throw error;
    }
  },

  deleteProperty: async (propertyId: string): Promise<DeleteResponse> => {
    try {
      const response = await axiosInstance.delete<DeleteResponse>(
        `/owner/properties/${propertyId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error deleting property:", error);
      throw error;
    }
  },

  // Room Type CRUD operations
  getPropertyRoomTypes: async (
    propertyId: string
  ): Promise<RoomTypesResponse> => {
    try {
      const response = await axiosInstance.get<RoomTypesResponse>(
        `/owner/room-types?propertyId=${propertyId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching room types:", error);
      throw error;
    }
  },

  createRoomType: async (
    propertyId: string,
    data: CreateRoomTypeRequest
  ): Promise<SingleRoomTypeResponse> => {
    try {
      // Convert basePrice to number and add propertyId to payload
      const payload = {
        ...data,
        propertyId,
        basePrice: Number(data.basePrice), // Convert string to number
      };

      const response = await axiosInstance.post<SingleRoomTypeResponse>(
        `/owner/room-types`,
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating room type:", error);
      throw error;
    }
  },

  updateRoomType: async (
    propertyId: string,
    roomTypeId: string,
    data: UpdateRoomTypeRequest
  ): Promise<SingleRoomTypeResponse> => {
    try {
      // Convert basePrice to number if provided
      const payload = {
        ...data,
        ...(data.basePrice && { basePrice: Number(data.basePrice) }),
      };

      const response = await axiosInstance.put<SingleRoomTypeResponse>(
        `/owner/room-types/${roomTypeId}`,
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating room type:", error);
      throw error;
    }
  },

  deleteRoomType: async (
    propertyId: string,
    roomTypeId: string
  ): Promise<DeleteResponse> => {
    try {
      const response = await axiosInstance.delete<DeleteResponse>(
        `/owner/room-types/${roomTypeId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error deleting room type:", error);
      throw error;
    }
  },

  // Room CRUD operations
  getPropertyRooms: async (
    propertyId: string,
    roomTypeId?: string
  ): Promise<RoomsResponse> => {
    try {
      const params = roomTypeId ? { roomTypeId } : {};
      const response = await axiosInstance.get<RoomsResponse>(
        `/owner/properties/${propertyId}/rooms`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  },

  createRoom: async (
    propertyId: string,
    data: CreateRoomRequest
  ): Promise<SingleRoomResponse> => {
    try {
      const response = await axiosInstance.post<SingleRoomResponse>(
        `/owner/properties/${propertyId}/rooms`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating room:", error);
      throw error;
    }
  },

  updateRoom: async (
    propertyId: string,
    roomId: string,
    data: UpdateRoomRequest
  ): Promise<SingleRoomResponse> => {
    try {
      const response = await axiosInstance.patch<SingleRoomResponse>(
        `/owner/properties/${propertyId}/rooms/${roomId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating room:", error);
      throw error;
    }
  },

  deleteRoom: async (
    propertyId: string,
    roomId: string
  ): Promise<DeleteResponse> => {
    try {
      const response = await axiosInstance.delete<DeleteResponse>(
        `/owner/properties/${propertyId}/rooms/${roomId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error deleting room:", error);
      throw error;
    }
  },

  // Analytics
  getPropertyAnalytics: async (): Promise<AnalyticsResponse> => {
    try {
      const response = await axiosInstance.get<AnalyticsResponse>(
        "/owner/properties/analytics"
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching property analytics:", error);
      throw error;
    }
  },

  // Gallery management - Updated to use /api/upload endpoint
  uploadPropertyImage: async (
    file: File,
    alt?: string
  ): Promise<ImageUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "property");
      if (alt) {
        formData.append("alt", alt);
      }

      const response = await axiosInstance.post<ImageUploadResponse>(
        `/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error uploading property image:", error);
      throw error;
    }
  },

  uploadRoomImage: async (
    file: File,
    alt?: string
  ): Promise<ImageUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "room");
      if (alt) {
        formData.append("alt", alt);
      }

      const response = await axiosInstance.post<ImageUploadResponse>(
        `/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error uploading room image:", error);
      throw error;
    }
  },

  deletePropertyImage: async (imageId: string): Promise<DeleteResponse> => {
    try {
      const response = await axiosInstance.delete<DeleteResponse>(
        `/upload/${imageId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error deleting property image:", error);
      throw error;
    }
  },

  setMainPropertyImage: async (
    propertyId: string,
    imageId: string
  ): Promise<DeleteResponse> => {
    try {
      const response = await axiosInstance.put<DeleteResponse>(
        `/owner/properties/${propertyId}/main-image`,
        { imageId }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error setting main property image:", error);
      throw error;
    }
  },
};
