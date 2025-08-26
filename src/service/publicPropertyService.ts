import axiosInstance from "@/lib/axios";
import {
  PublicPropertiesResponse,
  PublicPropertyDetailResponse,
  PropertySearchParams,
  PublicProperty,
  PublicPropertyDetail,
} from "@/interface/publicPropertyInterface";

export const publicPropertyService = {
  getPublicProperties: async (
    params?: PropertySearchParams
  ): Promise<PublicPropertiesResponse> => {
    try {
      const queryParams = new URLSearchParams();

      if (params?.search) queryParams.append("search", params.search);
      if (params?.city) queryParams.append("city", params.city);
      if (params?.category) queryParams.append("category", params.category);
      if (params?.minPrice)
        queryParams.append("minPrice", params.minPrice.toString());
      if (params?.maxPrice)
        queryParams.append("maxPrice", params.maxPrice.toString());
      if (params?.capacity)
        queryParams.append("capacity", params.capacity.toString());
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const url = `/public/properties${
        queryParams.toString() ? "?" + queryParams.toString() : ""
      }`;
      const response = await axiosInstance.get<PublicPropertiesResponse>(url);

      return response.data;
    } catch (error: any) {
      console.error("Error fetching public properties:", error);
      throw error;
    }
  },

  getPublicPropertyById: async (
    id: string
  ): Promise<PublicPropertyDetailResponse> => {
    try {
      const response = await axiosInstance.get<PublicPropertyDetailResponse>(
        `/public/properties/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching property detail:", error);
      throw error;
    }
  },
};
