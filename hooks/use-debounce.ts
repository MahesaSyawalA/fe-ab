import * as React from 'react';

/**
 * Custom hook untuk men-debounce nilai primitif atau objek.
 * @param value Nilai yang ingin di-debounce
 * @param delay Durasi jeda dalam milidetik (default: 400ms)
 * @returns Nilai yang telah di-debounce
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

