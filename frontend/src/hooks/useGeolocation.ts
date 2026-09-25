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
  latitude?: number;
  longitude?: number;
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
    latitude: lat,
    longitude: lon,
  };
}

/**
 * IP-based geolocation fallback for desktop devices or when browser GPS permission is denied.
 */
async function fetchIpLocation(): Promise<LocationData | null> {
  // Strategy 1: ipwho.is (fast, HTTPS, provides lat, lon, city, region, postal)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const d = await res.json();
      if (d.success !== false && (d.city || d.region)) {
        if (d.latitude && d.longitude) {
          try {
            const detailed = await reverseGeocode(d.latitude, d.longitude);
            if (detailed.city || detailed.state) {
              return detailed;
            }
          } catch {}
        }
        return {
          city: d.city || '',
          state: d.region || '',
          postalCode: d.postal || '',
          street: '',
          suburb: '',
          country: d.country || 'India',
          displayName: [d.city, d.region].filter(Boolean).join(', '),
          latitude: d.latitude ? Number(d.latitude) : undefined,
          longitude: d.longitude ? Number(d.longitude) : undefined,
        };
      }
    }
  } catch {}

  // Strategy 2: freeipapi.com
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://freeipapi.com/api/json', { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const d = await res.json();
      if (d.cityName || d.regionName) {
        if (d.latitude && d.longitude) {
          try {
            const detailed = await reverseGeocode(d.latitude, d.longitude);
            if (detailed.city || detailed.state) {
              return detailed;
            }
          } catch {}
        }
        return {
          city: d.cityName || '',
          state: d.regionName || '',
          postalCode: d.zipCode || '',
          street: '',
          suburb: '',
          country: d.countryName || 'India',
          displayName: [d.cityName, d.regionName].filter(Boolean).join(', '),
          latitude: d.latitude ? Number(d.latitude) : undefined,
          longitude: d.longitude ? Number(d.longitude) : undefined,
        };
      }
    }
  } catch {}

  // Strategy 3: ipapi.co
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://ipapi.co/json/', {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      const d = await res.json();
      if (d.city || d.region) {
        return {
          city: d.city || '',
          state: d.region || '',
          postalCode: d.postal || '',
          street: '',
          suburb: '',
          country: d.country_name || 'India',
          displayName: [d.city, d.region].filter(Boolean).join(', '),
          latitude: d.latitude ? Number(d.latitude) : undefined,
          longitude: d.longitude ? Number(d.longitude) : undefined,
        };
      }
    }
  } catch {}

  return null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    locationData: null,
    isLocating: false,
    error: null,
  });

  const fetchLocation = useCallback((): Promise<LocationData | null> => {
    return new Promise((resolve) => {
      setState({ locationData: null, isLocating: true, error: null });

      const fallbackToIp = async () => {
        try {
          const ipData = await fetchIpLocation();
          if (ipData) {
            setState({ locationData: ipData, isLocating: false, error: null });
            resolve(ipData);
            return;
          }
        } catch {}

        setState({ locationData: null, isLocating: false, error: null });
        resolve(null);
      };

      if (typeof window === 'undefined' || !navigator?.geolocation) {
        fallbackToIp();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const locationData = await reverseGeocode(latitude, longitude);
            setState({ locationData, isLocating: false, error: null });
            resolve(locationData);
          } catch {
            await fallbackToIp();
          }
        },
        async () => {
          // If browser location permission is denied or unavailable, seamlessly fallback to IP
          await fallbackToIp();
        },
        { timeout: 5000, maximumAge: 60000, enableHighAccuracy: false }
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
  if (typeof window === 'undefined') return null;

  try {
    const cached = sessionStorage.getItem('attar_user_city');
    if (cached) return cached;
  } catch {}

  try {
    const ipData = await fetchIpLocation();
    const city = ipData?.city || null;
    if (city) {
      try {
        sessionStorage.setItem('attar_user_city', city);
      } catch {}
      return city;
    }
  } catch {}

  return null;
}
