/**
 * Represents a location with coordinates and optional metadata
 */
export interface LocationInfo {
  latitude: number;
  longitude: number;
  name?: string;
  country?: string;
  admin1?: string; // State/province
  admin2?: string; // County/district
}
