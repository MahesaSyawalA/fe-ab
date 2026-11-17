import * as React from 'react';
import { toast } from '@heroui/react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

const ACCURACY_THRESHOLD_METERS = 30;
const WATCH_SETTLE_MS = 4000;

function formatGeolocationError(error: GeolocationPositionError): string {
  if (error.code === error.PERMISSION_DENIED) {
    return 'Izin akses lokasi ditolak. Aktifkan izin lokasi pada browser Anda.';
  }
  if (error.code === error.POSITION_UNAVAILABLE) {
    return 'Sinyal GPS atau lokasi tidak tersedia saat ini.';
  }
  if (error.code === error.TIMEOUT) {
    return 'Waktu pencarian lokasi GPS habis. Pastikan GPS aktif dan coba lagi.';
  }
  return 'Gagal mengambil lokasi saat ini.';
}

export function useCurrentLocation(onLocated: (coords: Coordinates) => void) {
  const [isLocating, setIsLocating] = React.useState(false);
  const [locationError, setLocationError] = React.useState<string | null>(null);

  const watchIdRef = React.useRef<number | null>(null);
  const settleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const bestPositionRef = React.useRef<GeolocationPosition | null>(null);
  const onLocatedRef = React.useRef(onLocated);

  React.useEffect(() => {
    onLocatedRef.current = onLocated;
  }, [onLocated]);

  const stopWatching = React.useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (settleTimerRef.current !== null) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  const applyPosition = React.useCallback(
    (pos: GeolocationPosition) => {
      stopWatching();
      bestPositionRef.current = null;
      setLocationError(null);
      setIsLocating(false);
      onLocatedRef.current({
        latitude: Number(pos.coords.latitude.toFixed(6)),
        longitude: Number(pos.coords.longitude.toFixed(6)),
      });
    },
    [stopWatching],
  );

  React.useEffect(() => stopWatching, [stopWatching]);

  const locate = React.useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      const msg = 'Browser atau perangkat ini tidak mendukung Geolocation.';
      setLocationError(msg);
      toast.danger('GPS Tidak Didukung', {
        description: React.createElement(
          'span',
          { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
          msg,
        ),
      });
      return;
    }

    stopWatching();
    bestPositionRef.current = null;
    setLocationError(null);
    setIsLocating(true);

    settleTimerRef.current = setTimeout(() => {
      if (bestPositionRef.current) {
        applyPosition(bestPositionRef.current);
      } else {
        stopWatching();
        setIsLocating(false);
        const msg = 'Waktu pencarian lokasi GPS habis. Pastikan GPS aktif dan coba lagi.';
        setLocationError(msg);
        toast.danger('Gagal Mengambil Lokasi', {
          description: React.createElement(
            'span',
            { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
            msg,
          ),
        });
      }
    }, WATCH_SETTLE_MS);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const currentBest = bestPositionRef.current;
        if (!currentBest || pos.coords.accuracy < currentBest.coords.accuracy) {
          bestPositionRef.current = pos;
        }
        if (pos.coords.accuracy <= ACCURACY_THRESHOLD_METERS) {
          applyPosition(pos);
        }
      },
      (err) => {
        if (bestPositionRef.current && err.code !== err.PERMISSION_DENIED) {
          applyPosition(bestPositionRef.current);
          return;
        }
        stopWatching();
        bestPositionRef.current = null;
        setIsLocating(false);
        const msg = formatGeolocationError(err);
        setLocationError(msg);
        toast.danger('Gagal Mengambil Lokasi', {
          description: React.createElement(
            'span',
            { className: 'text-xs sm:text-sm text-secondary-foreground leading-relaxed' },
            msg,
          ),
        });
      },
      GEOLOCATION_OPTIONS,
    );
  }, [applyPosition, stopWatching]);

  return { isLocating, locationError, locate };
}
