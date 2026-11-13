'use client';

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapClickHandlerProps {
  onLocationSelect?: (lat: number, lng: number) => void;
}

function MapClickHandler({ onLocationSelect }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export interface PelangganMapProps {
  latitude: number;
  longitude: number;
  interactive?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
  title?: string;
  className?: string;
  height?: string;
}

export default function PelangganMapInner({
  latitude,
  longitude,
  interactive = false,
  onLocationChange,
  title,
  className,
  height = '200px',
}: PelangganMapProps) {
  const position: [number, number] = [
    latitude || -6.208812,
    longitude || 106.845648,
  ];

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner z-0 ${className || ''}`}
      style={{ height }}
    >
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
        attributionControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <ChangeView center={position} />
        <Marker position={position} icon={customMarkerIcon}>
          {title && <Popup>{title}</Popup>}
        </Marker>
        {interactive && <MapClickHandler onLocationSelect={onLocationChange} />}
      </MapContainer>
    </div>
  );
}
