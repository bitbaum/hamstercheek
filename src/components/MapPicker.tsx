"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import type { Coordinates } from "@/lib/coordinates";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER: Coordinates = { lat: 47.3769, lng: 8.5417 };

function ClickCapture({ onPick }: { onPick: (coords: Coordinates) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

type MapPickerProps = {
  value: Coordinates | null;
  onChange?: (coords: Coordinates) => void;
  readOnly?: boolean;
};

export default function MapPicker({ value, onChange, readOnly = false }: MapPickerProps) {
  const center = useMemo(() => value ?? DEFAULT_CENTER, [value]);

  return (
    <div className="overflow-hidden rounded-[var(--radius-token)] border border-border">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={value ? 15 : 12}
        scrollWheelZoom
        style={{ height: "320px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {value && <Marker position={[value.lat, value.lng]} icon={markerIcon} />}
        {!readOnly && onChange && <ClickCapture onPick={onChange} />}
      </MapContainer>
    </div>
  );
}
