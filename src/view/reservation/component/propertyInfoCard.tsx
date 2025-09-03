// propertyInfoCard.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyInfoCardProps {
  data: {
    propertyName?: string;
    roomTypeName?: string;
    mainImageUrl?: string;
    propertyType?: string;
  };
  isLoading?: boolean;
}

export default function PropertyInfoCard({
  data,
  isLoading,
}: PropertyInfoCardProps) {
  if (isLoading) {
    return (
      <div className="flex gap-4 items-center">
        <Skeleton className="h-20 w-28 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-start">
      <div className="w-28 h-20 rounded-lg overflow-hidden bg-gray-100">
        {data.mainImageUrl ? (
          <img
            src={data.mainImageUrl}
            alt={data.propertyName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-pr-dark">
          {data.propertyName ?? "Nama Properti"}
        </h2>
        <p className="text-sm text-gray-600">
          {data.propertyType ?? "Tipe Properti"}
        </p>
        <p className="mt-2 text-sm text-pr-mid">{data.roomTypeName ?? "-"}</p>
      </div>
    </div>
  );
}
