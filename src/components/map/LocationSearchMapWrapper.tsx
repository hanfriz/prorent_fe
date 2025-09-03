"use client";

import React from "react";
import dynamic from "next/dynamic";
import { LocationData } from "./LocationSearchMap";

// Dynamic import with no SSR
const LocationSearchMapComponent = dynamic(
  () => import("./LocationSearchMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-100 rounded-lg border flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse bg-gray-300 h-8 w-32 mx-auto mb-2 rounded"></div>
          <div className="text-gray-500">Loading map...</div>
        </div>
      </div>
    ),
  }
);

interface LocationSearchMapWrapperProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
  height?: string;
  className?: string;
}

const LocationSearchMapWrapper: React.FC<LocationSearchMapWrapperProps> = (
  props
) => {
  return <LocationSearchMapComponent {...props} />;
};

export default LocationSearchMapWrapper;
export type { LocationData };
