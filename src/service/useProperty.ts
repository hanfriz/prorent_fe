"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { propertyService } from "./propertyService";
import { publicPropertyService } from "./publicPropertyService";
import { PropertySearchParams } from "@/interface/publicPropertyInterface";
import { CreatePropertyRequest } from "@/interface/propertyInterface";

// Query Keys
const PROPERTY_KEYS = {
  all: ["properties"] as const,
  lists: () => [...PROPERTY_KEYS.all, "list"] as const,
  list: (filters: any) => [...PROPERTY_KEYS.lists(), filters] as const,
  details: () => [...PROPERTY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PROPERTY_KEYS.details(), id] as const,
  public: () => [...PROPERTY_KEYS.all, "public"] as const,
  owner: () => [...PROPERTY_KEYS.all, "owner"] as const,
  publicDetail: (id: string) =>
    [...PROPERTY_KEYS.public(), "detail", id] as const,
};

// Hook for fetching public properties
export function usePublicProperties(params?: PropertySearchParams) {
  return useQuery({
    queryKey: [...PROPERTY_KEYS.public(), params],
    queryFn: () => publicPropertyService.getPublicProperties(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for fetching public property detail
export function usePublicPropertyDetail(propertyId: string) {
  return useQuery({
    queryKey: PROPERTY_KEYS.publicDetail(propertyId),
    queryFn: () => publicPropertyService.getPublicPropertyById(propertyId),
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for fetching owner's properties
export function useOwnerProperties() {
  return useQuery({
    queryKey: PROPERTY_KEYS.owner(),
    queryFn: () => propertyService.getMyProperties(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for fetching property detail (owner view)
export function usePropertyDetail(propertyId: string) {
  return useQuery({
    queryKey: PROPERTY_KEYS.detail(propertyId),
    queryFn: () => propertyService.getPropertyById(propertyId),
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for creating property
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyService.createProperty,
    onSuccess: (data) => {
      toast.success("Property created successfully!");
      // Invalidate and refetch owner properties
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.owner() });
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.public() });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to create property";
      toast.error(message);
    },
  });
}

// Hook for updating property
export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      data,
    }: {
      propertyId: string;
      data: CreatePropertyRequest;
    }) => propertyService.updateProperty(propertyId, data),
    onSuccess: (data, variables) => {
      toast.success("Property updated successfully!");
      // Invalidate specific property and lists
      queryClient.invalidateQueries({
        queryKey: PROPERTY_KEYS.detail(variables.propertyId),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTY_KEYS.publicDetail(variables.propertyId),
      });
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.owner() });
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.public() });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update property";
      toast.error(message);
    },
  });
}

// Hook for deleting property
export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyService.deleteProperty,
    onSuccess: (data, propertyId) => {
      toast.success("Property deleted successfully");
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.owner() });
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.public() });
      // Remove specific property from cache
      queryClient.removeQueries({ queryKey: PROPERTY_KEYS.detail(propertyId) });
      queryClient.removeQueries({
        queryKey: PROPERTY_KEYS.publicDetail(propertyId),
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete property";
      toast.error(message);
    },
  });
}

// Hook for rooms
export function usePropertyRooms(propertyId: string) {
  return useQuery({
    queryKey: [...PROPERTY_KEYS.detail(propertyId), "rooms"],
    queryFn: () => propertyService.getRoomsByPropertyId(propertyId),
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for room types
export function usePropertyRoomTypes(propertyId: string) {
  return useQuery({
    queryKey: [...PROPERTY_KEYS.detail(propertyId), "roomTypes"],
    queryFn: () => propertyService.getRoomTypes(propertyId),
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for invalidating property queries (useful for manual refresh)
export function useInvalidateProperties() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.all }),
    invalidatePublic: () =>
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.public() }),
    invalidateOwner: () =>
      queryClient.invalidateQueries({ queryKey: PROPERTY_KEYS.owner() }),
    invalidateProperty: (propertyId: string) => {
      queryClient.invalidateQueries({
        queryKey: PROPERTY_KEYS.detail(propertyId),
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTY_KEYS.publicDetail(propertyId),
      });
    },
  };
}
