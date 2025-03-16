export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/province
  admin2?: string; // County/district
}

/**
 * Search for locations by name using Open-Meteo Geocoding API
 */
export async function searchLocations(
  query: string
): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) return [];

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.append("name", query);
  url.searchParams.append("count", "10");
  url.searchParams.append("language", "en");
  url.searchParams.append("format", "json");

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
