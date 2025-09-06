import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { peakRateService } from "./peakRateService";
import {
  CreatePeakRateRequest,
  UpdatePeakRateRequest,
} from "../interface/peakRateInterface";
import { toast } from "sonner";

// Hook to get peak rates for a room type
export const usePeakRates = (roomTypeId: string) => {
  return useQuery({
    queryKey: ["peak-rates", roomTypeId],
    queryFn: () => peakRateService.getPeakRates(roomTypeId),
    enabled: !!roomTypeId,
  });
};

// Hook to add peak rate
export const useAddPeakRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomTypeId,
      data,
    }: {
      roomTypeId: string;
      data: CreatePeakRateRequest;
    }) => peakRateService.addPeakRate(roomTypeId, data),
    onSuccess: (_, variables) => {
      toast.success("Peak rate berhasil ditambahkan!");
      queryClient.invalidateQueries({
        queryKey: ["peak-rates", variables.roomTypeId],
      });
    },
    onError: (error: any) => {
      console.error("Error adding peak rate:", error);
      toast.error(
        error?.response?.data?.message || "Gagal menambahkan peak rate!"
      );
    },
  });
};

// Hook to update peak rate
export const useUpdatePeakRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomTypeId,
      date,
      data,
    }: {
      roomTypeId: string;
      date: string;
      data: UpdatePeakRateRequest;
    }) => peakRateService.updatePeakRate(roomTypeId, date, data),
    onSuccess: (_, variables) => {
      toast.success("Peak rate berhasil diperbarui!");
      queryClient.invalidateQueries({
        queryKey: ["peak-rates", variables.roomTypeId],
      });
    },
    onError: (error: any) => {
      console.error("Error updating peak rate:", error);
      toast.error(
        error?.response?.data?.message || "Gagal memperbarui peak rate!"
      );
    },
  });
};

// Hook to remove peak rate
export const useRemovePeakRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomTypeId, date }: { roomTypeId: string; date: string }) =>
      peakRateService.removePeakRate(roomTypeId, date),
    onSuccess: (_, variables) => {
      toast.success("Peak rate berhasil dihapus!");
      queryClient.invalidateQueries({
        queryKey: ["peak-rates", variables.roomTypeId],
      });
    },
    onError: (error: any) => {
      console.error("Error removing peak rate:", error);
      toast.error(
        error?.response?.data?.message || "Gagal menghapus peak rate!"
      );
    },
  });
};
