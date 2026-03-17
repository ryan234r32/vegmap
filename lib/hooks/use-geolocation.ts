"use client";

import { useState, useCallback } from "react";

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback(() => {
    // Check HTTPS (geolocation requires secure context)
    if (typeof window !== "undefined" && window.location.protocol === "http:" && window.location.hostname !== "localhost") {
      setState((prev) => ({
        ...prev,
        error: "Location requires a secure connection (HTTPS)",
      }));
      return;
    }

    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Your browser does not support location services",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        let message: string;
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = "Location access denied. Please enable location in your browser settings.";
            break;
          case err.POSITION_UNAVAILABLE:
            message = "Unable to determine your location. Please try again.";
            break;
          case err.TIMEOUT:
            message = "Location request timed out. Please try again.";
            break;
          default:
            message = "Could not get your location. Please try again.";
        }
        setState((prev) => ({
          ...prev,
          error: message,
          loading: false,
        }));
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    );
  }, []);

  return { ...state, requestLocation };
}
