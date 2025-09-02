"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ownerPropertyService } from "./ownerPropertyService";

// Query Keys
const OWNER_PROPERTY_KEYS = {
  all: ["owner-properties"] as const,
  lists: () => [...OWNER_PROPERTY_KEYS.all, "list"] as const,
  list: (filters: any) => [...OWNER_PROPERTY_KEYS.lists(), filters] as const,
  details: () => [...OWNER_PROPERTY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...OWNER_PROPERTY_KEYS.details(), id] as const,
  roomTypes: (propertyId: string) => ["room-types", propertyId] as const,
};

// Hook for fetching owner property by ID
export function useOwnerPropertyDetail(propertyId: string) {
  return useQuery({
    queryKey: OWNER_PROPERTY_KEYS.detail(propertyId),
    queryFn: () => ownerPropertyService.getPropertyById(propertyId),
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for updating owner property
export function useUpdateOwnerProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      ownerPropertyService.updateProperty(id, data),
    onSuccess: (data, variables) => {
      toast.success("Properti berhasil diperbarui!");
      // Invalidate specific property and lists
      queryClient.invalidateQueries({
        queryKey: OWNER_PROPERTY_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: OWNER_PROPERTY_KEYS.lists(),
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Gagal memperbarui properti";
      toast.error(message);
    },
  });
}

// Hook for invalidating owner property queries
export function useInvalidateOwnerProperties() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: OWNER_PROPERTY_KEYS.all }),
    invalidateProperty: (propertyId: string) => {
      queryClient.invalidateQueries({
        queryKey: OWNER_PROPERTY_KEYS.detail(propertyId),
      });
    },
  };
}

// Hook for fetching room types by property ID
export function useOwnerRoomTypes(propertyId: string) {
  return useQuery({
    queryKey: OWNER_PROPERTY_KEYS.roomTypes(propertyId),
    queryFn: () => ownerPropertyService.getRoomTypesByProperty(propertyId),
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
