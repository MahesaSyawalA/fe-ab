import * as React from 'react';
import type { Pelanggan } from '@/types/customer.types';

const STAGE_GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

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

function getStageGeoErrorMessage(error: GeolocationPositionError): string {
  if (error.code === error.PERMISSION_DENIED) {
    return 'Izin lokasi ditolak';
  }
  if (error.code === error.POSITION_UNAVAILABLE) {
    return 'Sinyal GPS tidak tersedia';
  }
  if (error.code === error.TIMEOUT) {
    return 'Timeout mencari GPS';
  }
  return 'Gagal mengambil lokasi GPS';
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
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const watchIdRef = React.useRef<number | null>(null);

  const stopWatching = React.useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const refreshLocation = React.useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('GPS tidak didukung perangkat');
      setIsLocating(false);
      return;
    }

    stopWatching();
    setLocationError(null);
    setIsLocating(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setGpsCoords({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        });
        setLocationError(null);
        setIsLocating(false);
      },
      (err) => {
        setLocationError(getStageGeoErrorMessage(err));
        setIsLocating(false);
      },
      STAGE_GEOLOCATION_OPTIONS,
    );
  }, [stopWatching]);

  React.useEffect(() => {
    if (open && isVisitStage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refreshLocation();
    } else {
      stopWatching();
    }
    return stopWatching;
  }, [open, isVisitStage, refreshLocation, stopWatching]);

  const distanceToClient = React.useMemo(() => {
    if (!gpsCoords) return null;
    const clientLat = currentPelanggan?.latitude;
    const clientLng = currentPelanggan?.longitude;
    if (clientLat == null || clientLng == null) return null;
    return calculateHaversineDistance(
      gpsCoords.latitude,
      gpsCoords.longitude,
      clientLat,
      clientLng,
    );
  }, [gpsCoords, currentPelanggan]);

  const radiusLimit = currentPelanggan?.radius_kunjungan ?? 50;
  const isWithinRadius = distanceToClient !== null && distanceToClient <= radiusLimit;

  const koordinatGps = React.useMemo(() => {
    if (gpsCoords) {
      return `${gpsCoords.latitude}, ${gpsCoords.longitude}`;
    }
    if (isLocating) return 'Mencari sinyal GPS...';
    return locationError || 'Lokasi GPS belum tersedia';
  }, [gpsCoords, isLocating, locationError]);

  const statusRadius = React.useMemo(() => {
    if (isLocating) return 'Mengecek radius...';
    if (!gpsCoords) return locationError ? 'GPS Gagal' : 'Menunggu GPS';
    if (distanceToClient === null) return 'Koordinat outlet belum diset';
    return isWithinRadius
      ? `Dalam Radius (${distanceToClient}m)`
      : `Luar Radius (${distanceToClient}m)`;
  }, [isLocating, gpsCoords, locationError, distanceToClient, isWithinRadius]);

  const gpsData = React.useMemo(() => {
    if (!gpsCoords || distanceToClient === null) return undefined;
    return {
      latitude: gpsCoords.latitude,
      longitude: gpsCoords.longitude,
      jarak_klien: distanceToClient,
      dalam_radius: isWithinRadius,
    };
  }, [gpsCoords, distanceToClient, isWithinRadius]);

  return {
    gpsCoords,
    isLocating,
    locationError,
    refreshLocation,
    distanceToClient,
    isWithinRadius,
    koordinatGps,
    statusRadius,
    gpsData,
  };
}
