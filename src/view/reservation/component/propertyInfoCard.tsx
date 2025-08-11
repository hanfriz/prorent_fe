import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyInfoCardProps {
  data: {
    propertyName: string;
    roomTypeName: string;
  };
  isLoading?: boolean;
}

export default function PropertyInfoCard({ 
  data, 
  isLoading 
}: PropertyInfoCardProps) {
  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg space-y-3 bg-gray-50">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg space-y-1 bg-gray-50">
      <p>
        <strong>Nama Properti:</strong> {data.propertyName}
      </p>
      <p>
        <strong>Tipe Kamar:</strong> {data.roomTypeName}
      </p>
    </div>
  );
}