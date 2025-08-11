import React from "react";

interface PropertyInfoCardProps {
  data: {
    propertyName: string;
    roomTypeName: string;
  };
}

export default function PropertyInfoCard({ data }: PropertyInfoCardProps) {
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
