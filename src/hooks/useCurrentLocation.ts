import { useEffect, useState } from "react";

export function useCurrentLocation(
  { onRender = false }: { onRender: boolean } | undefined = { onRender: false }
) {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  function handleError(error: Error) {
    setError(error as unknown as Error);
    setCurrentLocation(null);
    setLoading(false);
  }

  function handleGetCurrentLocation() {
    try {
      setLoading(true);

      if (!navigator.geolocation) {
        setError(new Error("NOT_SUPPORTED"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          setError(null);
          setLoading(false);
        },
        (error) => handleError(error as unknown as Error)
      );
    } catch (error) {
      handleError(error as Error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (onRender) handleGetCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRender]);

  return {
    currentLocation,
    error,
    loading,
    getCurrentLocation: handleGetCurrentLocation,
  };
}
