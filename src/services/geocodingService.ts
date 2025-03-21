import type { GeocodingResult } from "../types/geocoding.types";
export type { GeocodingResult };

const API_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE_GEOCODING_ENDPOINT =
  "https://nominatim.openstreetmap.org/reverse";

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
 * Get location information from coordinates using Nominatim API
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeocodingResult | null> {
  try {
    const url = new URL(REVERSE_GEOCODING_ENDPOINT);
    url.searchParams.append("lat", latitude.toString());
    url.searchParams.append("lon", longitude.toString());
    url.searchParams.append("format", "json");
    url.searchParams.append("zoom", "10"); // City level zoom
    url.searchParams.append("addressdetails", "1");

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "Weather App (https://github.com/yourusername/weather-app)", // Required by Nominatim ToS
      },
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding error: ${response.status}`);
    }

    const data = await response.json();

    // Convert Nominatim response format to our GeocodingResult format
    return {
      id: parseInt(data.place_id), // Nominatim place_id as our id
      name:
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.municipality ||
        data.name,
      country: data.address.country,
      admin1: data.address.state || data.address.province,
      admin2: data.address.county || data.address.district,
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lon),
      timezone: "auto", // We don't get timezone from Nominatim
    };
  } catch (error) {
    console.error("Failed to reverse geocode:", error);
    return null;
  }
}
