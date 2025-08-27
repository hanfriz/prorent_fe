"use client";

import React from "react";
import dynamic from "next/dynamic";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  propertyName: string;
  address: string;
}

// Dynamic import untuk menghindari SSR issues dengan Leaflet
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

export default function PropertyMap({
  latitude,
  longitude,
  propertyName,
  address,
}: PropertyMapProps) {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border">
      <LeafletMap
        latitude={latitude}
        longitude={longitude}
        propertyName={propertyName}
        address={address}
      />
    </div>
  );
}
