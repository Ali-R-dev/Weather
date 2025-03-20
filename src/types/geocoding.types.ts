/**
 * Represents a location result from the Open-Meteo Geocoding API
 */
export type GeocodingResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/province
  admin2?: string; // County/district
  timezone?: string;
  population?: number;
  elevation?: number;
};
