"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export interface LocationData {
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
}

interface LocationSearchMapProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
  height?: string;
  className?: string;
}

interface SearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    town?: string;
    village?: string;
    province?: string;
  };
}

// Component to handle map events
const MapEventHandler: React.FC<{
  onLocationSelect: (location: LocationData) => void;
  setMarkerPosition: (position: [number, number]) => void;
}> = ({ onLocationSelect, setMarkerPosition }) => {
  const map = useMapEvents({
    click: async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);

      // Reverse geocoding to get address details
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await response.json();

        const locationData: LocationData = {
          address: data.display_name || `${lat}, ${lng}`,
          city:
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "",
          province: data.address?.state || data.address?.province || "",
          latitude: lat,
          longitude: lng,
        };

        onLocationSelect(locationData);
      } catch (error) {
        console.error("Error in reverse geocoding:", error);
        // Fallback if reverse geocoding fails
        onLocationSelect({
          address: `${lat}, ${lng}`,
          city: "",
          province: "",
          latitude: lat,
          longitude: lng,
        });
      }
    },
  });

  return null;
};

// Component to update map view when marker position changes
const MapViewController: React.FC<{ position: [number, number] }> = ({
  position,
}) => {
  const map = useMap();

  useEffect(() => {
    if (map && position) {
      map.setView(position, 15);
    }
  }, [map, position]);

  return null;
};

const LocationSearchMap: React.FC<LocationSearchMapProps> = ({
  onLocationSelect,
  initialLocation,
  height = "400px",
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(
    initialLocation
      ? [initialLocation.latitude, initialLocation.longitude]
      : [-7.2575, 112.7521] // Default to Surabaya, Indonesia
  );

  const provider = useRef(new OpenStreetMapProvider());

  // Manual search function using Nominatim API directly
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    console.log("Starting search for:", searchQuery);
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&addressdetails=1&limit=5`
      );
      const results = await response.json();
      console.log("Search results:", results);
      setSearchResults(results);

      // If there's only one result, automatically select it
      if (results.length === 1) {
        handleResultSelect(results[0]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    console.log("Selected location:", { lat, lng, result });
    setMarkerPosition([lat, lng]);
    setSearchResults([]);
    setSearchQuery("");

    const locationData: LocationData = {
      address: result.display_name,
      city:
        result.address?.city ||
        result.address?.town ||
        result.address?.village ||
        "",
      province: result.address?.state || result.address?.province || "",
      latitude: lat,
      longitude: lng,
    };

    onLocationSelect(locationData);

    // The MapViewController component will handle the view change automatically
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="mb-4 relative z-50">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Cari alamat atau tempat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            type="button"
          >
            {isSearching ? "Mencari..." : "Cari"}
          </Button>
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-[9999] bg-white border border-gray-200 rounded-md shadow-xl max-h-60 overflow-y-auto mt-1">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleResultSelect(result)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {result.name || result.display_name.split(",")[0]}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {result.display_name}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="rounded-lg overflow-hidden border h-96 relative z-10">
        <MapContainer
          center={markerPosition}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={markerPosition}>
            <Popup>
              <div className="text-sm">
                <div className="font-medium">Lokasi Terpilih</div>
                <div className="text-gray-600">
                  Lat: {markerPosition[0].toFixed(6)}
                  <br />
                  Lng: {markerPosition[1].toFixed(6)}
                </div>
              </div>
            </Popup>
          </Marker>

          <MapEventHandler
            onLocationSelect={onLocationSelect}
            setMarkerPosition={setMarkerPosition}
          />

          <MapViewController position={markerPosition} />
        </MapContainer>
      </div>

      <div className="mt-2 text-sm text-gray-500 text-center">
        Klik pada peta untuk memilih lokasi atau gunakan kotak pencarian di atas
      </div>
    </div>
  );
};

export default LocationSearchMap;
