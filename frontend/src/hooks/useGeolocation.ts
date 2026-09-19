'use client';

import { useState, useCallback } from 'react';

export interface LocationData {
  city: string;
  state: string;
  postalCode: string;
  street: string;
  suburb: string;
  country: string;
  displayName: string;
}

interface GeolocationState {
  locationData: LocationData | null;
  isLocating: boolean;
  error: string | null;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

async function reverseGeocode(lat: number, lon: number): Promise<LocationData> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    format: 'json',
    addressdetails: '1',
  });

  const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'AttarDepot/1.0 (attar-depot.com)',
    },
  });

  if (!res.ok) throw new Error('Geocoding service unavailable. Please enter address manually.');

  const data = await res.json();
  const addr = data.address || {};

  return {
    city: addr.city || addr.town || addr.village || addr.county || '',
    state: addr.state || '',
    postalCode: addr.postcode || '',
    street: [addr.house_number, addr.road, addr.neighbourhood]
      .filter(Boolean)
      .join(', '),
    suburb: addr.suburb || addr.neighbourhood || '',
    country: addr.country || 'India',
    displayName: [
      addr.city || addr.town || addr.village || '',
      addr.state || '',
    ]
      .filter(Boolean)
      .join(', '),
  };
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    locationData: null,
    isLocating: false,
    error: null,
  });

  const fetchLocation = useCallback((): Promise<LocationData | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setState((prev) => ({
          ...prev,
          error: 'Geolocation is not supported by your browser.',
        }));
        resolve(null);
        return;
      }

      setState({ locationData: null, isLocating: true, error: null });

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const locationData = await reverseGeocode(latitude, longitude);
            setState({ locationData, isLocating: false, error: null });
            resolve(locationData);
          } catch (err: any) {
            const msg = err.message || 'Failed to fetch location. Please enter address manually.';
            setState({ locationData: null, isLocating: false, error: msg });
            resolve(null);
          }
        },
        (err) => {
          let msg = 'Unable to retrieve your location.';
          if (err.code === 1) msg = 'Location access denied. Please allow location permission and try again.';
          else if (err.code === 2) msg = 'Location unavailable. Please enter address manually.';
          else if (err.code === 3) msg = 'Location request timed out. Please try again.';
          setState({ locationData: null, isLocating: false, error: msg });
          resolve(null);
        },
        { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false }
      );
    });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    fetchLocation,
    isLocating: state.isLocating,
    locationData: state.locationData,
    error: state.error,
    clearError,
  };
}

/**
 * Lightweight city-only detection for Navbar badge.
 * Uses cached result in sessionStorage to avoid repeated API calls.
 */
export async function detectCityForNavbar(): Promise<string | null> {
  const cached = sessionStorage.getItem('attar_user_city');
  if (cached) return cached;

  if (!navigator.geolocation) return null;

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          const city = data.city || data.suburb || null;
          if (city) sessionStorage.setItem('attar_user_city', city);
          resolve(city);
        } catch {
          resolve(null);
        }
      },
      () => resolve(null),
      { timeout: 8000, maximumAge: 300000, enableHighAccuracy: false }
    );
  });
}
