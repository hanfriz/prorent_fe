import Axios from "@/lib/axios";
import {
  Property,
  CreatePropertyRequest,
  CreatePropertyResponse,
  GetPropertiesResponse,
  Category,
  CreateCategoryRequest,
  CreateCategoryResponse,
  GetCategoriesResponse,
  UploadedFile,
  GetUploadsResponse,
  UploadFileResponse,
  GetFileResponse,
  DeleteFileResponse,
  Room,
  CreateRoomRequest,
  CreateRoomResponse,
  GetRoomsResponse,
} from "@/interface/propertyInterface";

export const propertyService = {
  // Property Management
  createProperty: async (
    data: CreatePropertyRequest
  ): Promise<CreatePropertyResponse> => {
    const response = await Axios.post("/owner/properties", data);
    return response.data;
  },

  getMyProperties: async (): Promise<GetPropertiesResponse> => {
    const response = await Axios.get("/owner/properties");
    return response.data;
  },

  getPropertyById: async (
    propertyId: string
  ): Promise<{ success: boolean; message: string; data: Property }> => {
    const response = await Axios.get(`/owner/properties/${propertyId}`);
    return response.data;
  },

  updateProperty: async (
    propertyId: string,
    data: CreatePropertyRequest
  ): Promise<CreatePropertyResponse> => {
    const response = await Axios.patch(`/owner/properties/${propertyId}`, data);
    return response.data;
  },

  // Category Management
  getCategories: async (): Promise<GetCategoriesResponse> => {
    const response = await Axios.get("/owner/categories");
    return response.data;
  },

  createCategory: async (
    data: CreateCategoryRequest
  ): Promise<CreateCategoryResponse> => {
    const response = await Axios.post("/owner/categories", data);
    return response.data;
  },

  // File Upload Management
  getUploads: async (
    page: number = 1,
    limit: number = 10,
    type: string
  ): Promise<GetUploadsResponse> => {
    const response = await Axios.get(
      `/upload?page=${page}&limit=${limit}&type=${type}`
    );
    return response.data;
  },

  uploadFile: async (
    file: File,
    type: string,
    alt: string
  ): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("alt", alt);

    const response = await Axios.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getFileById: async (fileId: string): Promise<GetFileResponse> => {
    const response = await Axios.get(`/upload/${fileId}`);
    return response.data;
  },

  deleteFile: async (fileId: string): Promise<DeleteFileResponse> => {
    const response = await Axios.delete(`/upload/${fileId}`);
    return response.data;
  },

  // Room Management
  createRoom: async (data: CreateRoomRequest): Promise<CreateRoomResponse> => {
    const response = await Axios.post("/owner/rooms", data);
    return response.data;
  },

  getRooms: async (
    page: number = 1,
    limit: number = 10,
    propertyId?: string
  ): Promise<GetRoomsResponse> => {
    let url = `/owner/rooms?page=${page}&limit=${limit}`;
    if (propertyId) {
      url += `&propertyId=${propertyId}`;
    }
    const response = await Axios.get(url);
    return response.data;
  },

  getRoomsByPropertyId: async (propertyId: string): Promise<Room[]> => {
    const response = await propertyService.getRooms(1, 100, propertyId);
    return response.data;
  },

  deleteProperty: async (
    propertyId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await Axios.delete(`/owner/properties/${propertyId}`);
    return response.data;
  },

  deleteRoom: async (
    roomId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await Axios.delete(`/owner/rooms/${roomId}`);
    return response.data;
  },
};
