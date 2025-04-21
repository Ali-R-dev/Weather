import { createContext, useContext, ReactNode } from 'react';
import {
  useLocationService,
  LocationInfo,
  SavedLocation,
  LocationSource,
} from '../services/LocationService';

// Define the shape of our context
interface LocationContextType {
  // Current state
  currentLocation: LocationInfo | null;
  defaultLocation: SavedLocation | null;
  savedLocations: SavedLocation[];
  recentLocations: SavedLocation[];
  locationSource: LocationSource | null;
  isInitialized: boolean;

  // Actions
  setLocation: (location: LocationInfo, source?: LocationSource) => Promise<void>;
  setDefaultLocation: (locationId: number) => void;
  saveLocation: (location: SavedLocation) => void;
  removeLocation: (locationId: number) => void;
  removeFromRecentLocations: (locationId: number) => void;
  getGeolocation: () => Promise<LocationInfo>;
}

// Create context with undefined default value
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Provider component
export function LocationProvider({ children }: { children: ReactNode }) {
  // Use the hook from LocationService directly
  const locationState = useLocationService();

  return <LocationContext.Provider value={locationState}>{children}</LocationContext.Provider>;
}

// Consumer hook
export function useLocation(): LocationContextType {
  const context = useContext(LocationContext);

  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }

  return context;
}
