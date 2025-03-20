import type { GeocodingResult } from "../types/geocoding.types";
export type { GeocodingResult };

const API_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";

interface GeocodingParams {
  name?: string;
  count?: number;
  language?: string;
  format?: string;
}

/**
 * Search for locations by name using Open-Meteo Geocoding API
 */
export async function searchLocations(
  query: string,
  params: Partial<GeocodingParams> = {}
): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) return [];

  const url = new URL(API_ENDPOINT);
  url.searchParams.append("name", query);
  url.searchParams.append("count", (params.count || 10).toString());
  url.searchParams.append("language", params.language || "en");
  url.searchParams.append("format", params.format || "json");

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Failed to search locations:", error);
    return [];
  }
}

/**
 * Get location information from coordinates using Open-Meteo Geocoding API
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeocodingResult | null> {
  try {
    const coordinates = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    const url = new URL(API_ENDPOINT);
    url.searchParams.append("name", coordinates);
    url.searchParams.append("count", "1");
    url.searchParams.append("language", "en");
    url.searchParams.append("format", "json");

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Reverse geocoding error: ${response.status}`);
    }

    const data = await response.json();
    return data.results?.[0] || null;
  } catch (error) {
    console.error("Failed to reverse geocode:", error);
    return null;
  }
}
