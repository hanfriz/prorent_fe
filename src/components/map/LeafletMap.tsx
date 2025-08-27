"use client";

import React, { useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

// Fix untuk icon marker Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LeafletMapProps {
  latitude: number;
  longitude: number;
  propertyName: string;
  address: string;
}

// Komponen untuk handle map events
function MapEventHandler({ position }: { position: [number, number] }) {
  const map = useMapEvents({
    click: () => {
      // Ketika map diklik, pindah view ke marker position
      map.setView(position, 15, {
        animate: true,
        duration: 1,
      });
    },
  });
  return null;
}

export default function LeafletMap({
  latitude,
  longitude,
  propertyName,
  address,
}: LeafletMapProps) {
  // Custom marker icon untuk property
  const propertyIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const position: [number, number] = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventHandler position={position} />
      <Marker position={position} icon={propertyIcon}>
        <Popup>
          <div className="p-2">
            <h3 className="font-semibold text-lg mb-1">{propertyName}</h3>
            <p className="text-sm text-gray-600">{address}</p>
            <div className="mt-2 text-xs text-gray-500">
              Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
