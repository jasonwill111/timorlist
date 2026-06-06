/**
 * Nominatim Geocoding Utility
 *
 * Centralized geocoding module for OpenStreetMap Nominatim API.
 * Client-side compatible - uses only standard browser APIs (fetch, Promise, Date).
 *
 * Usage in Astro <script> blocks:
 *   import { geocodeAddress } from '@/lib/geo';
 *   const coords = await geocodeAddress('Dili, Timor-Leste');
 */
export type GeocodeResult = { lat: number; lng: number } | null;
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';
export const DEBOUNCE_MS = 1100;

type TimerHandle = ReturnType<typeof setTimeout>;

// Debounce state
let _lastCallTime = 0;
let _pendingTimeout: TimerHandle | null = null;
let _pendingResolver: ((value: GeocodeResult) => void) | null = null;

/** Reset debounce state — for testing only */
export function __resetDebounce() {
  _lastCallTime = 0;
  if (_pendingTimeout !== null) {
    clearTimeout(_pendingTimeout);
    _pendingTimeout = null;
  }
  _pendingResolver = null;
}

/**
 * Validate that latitude and longitude are within valid ranges.
 * Latitude must be between -90 and 90.
 * Longitude must be between -180 and 180.
 */
export function validateCoordinates(lat: number, lng: number): boolean {
  if (isNaN(lat) || isNaN(lng)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
}

/**
 * Calculate distance between two points using Haversine formula.
 * Returns distance in kilometers.
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Geocode an address string to lat/lng using OpenStreetMap Nominatim.
 * Debounces rapid calls within DEBOUNCE_MS (1100ms).
 * When two calls are made within the debounce window, the second call
 * waits for the debounce to expire and returns the same result as the first.
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const now = Date.now();
  const elapsed = now - _lastCallTime;

  if (elapsed < DEBOUNCE_MS) {
    // Within debounce window — cancel any existing pending request
    if (_pendingTimeout !== null) {
      clearTimeout(_pendingTimeout);
      _pendingTimeout = null;
      _pendingResolver = null;
    }
    // Schedule fresh request after debounce window
    return new Promise<GeocodeResult>((resolve) => {
      _pendingResolver = resolve;
      _pendingTimeout = setTimeout(() => {
        _pendingTimeout = null;
        _pendingResolver = null;
        _lastCallTime = Date.now();
        resolve(geocode(address));
      }, DEBOUNCE_MS - elapsed);
    });
  }

  // Outside debounce window — fire immediately
  _lastCallTime = now;
  return geocode(address);
}

async function geocode(address: string): Promise<GeocodeResult> {
  const url = `${NOMINATIM_BASE}?format=json&q=${encodeURIComponent(address + ', Timor-Leste')}`;
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': 'TimorUp/1.0' },
    });
  } catch {
    return null;
  }
  if (!response.ok) {
    return null;
  }
  let results: Array<{ lat: string; lon: string }>;
  try {
    results = await response.json();
  } catch {
    return null;
  }
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }
  const first = results[0]!;
  return {
    lat: parseFloat(first.lat),
    lng: parseFloat(first.lon),
  };
}
