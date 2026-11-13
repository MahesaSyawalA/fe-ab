import * as React from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function useCurrentLocation(onLocated: (coords: Coordinates) => void) {
  const [isLocating, setIsLocating] = React.useState(false);

  const locate = () => {
    if (!navigator.geolocation) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocated({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return { isLocating, locate };
}
