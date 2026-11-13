import * as React from 'react';
import type { Pelanggan } from '@/types/customer.types';

function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export interface UseStageGeolocationProps {
  open: boolean;
  isVisitStage: boolean;
  currentPelanggan: Pelanggan | null;
}

export function useStageGeolocation({
  open,
  isVisitStage,
  currentPelanggan,
}: UseStageGeolocationProps) {
  const [gpsCoords, setGpsCoords] = React.useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLocating, setIsLocating] = React.useState(false);

  const refreshLocation = React.useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  React.useEffect(() => {
    if (open && isVisitStage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refreshLocation();
    }
  }, [open, isVisitStage, refreshLocation]);

  const distanceToClient = React.useMemo(() => {
    if (!gpsCoords) return 38;
    const clientLat = currentPelanggan?.latitude;
    const clientLng = currentPelanggan?.longitude;
    if (clientLat == null || clientLng == null) return 38;
    return calculateHaversineDistance(
      gpsCoords.latitude,
      gpsCoords.longitude,
      clientLat,
      clientLng,
    );
  }, [gpsCoords, currentPelanggan]);

  const radiusLimit = currentPelanggan?.radius_kunjungan ?? 50;
  const isWithinRadius = distanceToClient <= radiusLimit;

  const koordinatGps = React.useMemo(() => {
    if (gpsCoords) {
      return `${gpsCoords.latitude}, ${gpsCoords.longitude}`;
    }
    return isLocating ? 'Mencari sinyal GPS...' : '-6.2088, 106.8456';
  }, [gpsCoords, isLocating]);

  const statusRadius = React.useMemo(() => {
    if (isLocating) return 'Mengecek radius...';
    return isWithinRadius
      ? `Dalam Radius (${distanceToClient}m)`
      : `Luar Radius (${distanceToClient}m)`;
  }, [isLocating, isWithinRadius, distanceToClient]);

  const gpsData = React.useMemo(() => {
    const lat = gpsCoords ? gpsCoords.latitude : -6.2088;
    const lng = gpsCoords ? gpsCoords.longitude : 106.8456;
    return {
      latitude: lat,
      longitude: lng,
      jarak_klien: distanceToClient,
      dalam_radius: isWithinRadius,
    };
  }, [gpsCoords, distanceToClient, isWithinRadius]);

  return {
    gpsCoords,
    isLocating,
    refreshLocation,
    distanceToClient,
    isWithinRadius,
    koordinatGps,
    statusRadius,
    gpsData,
  };
}

