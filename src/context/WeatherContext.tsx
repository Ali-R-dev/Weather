import { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WeatherData } from '../types/weather.types';
import { useLocation } from './LocationContext'; // Use the location context
import { LocationInfo } from '../services/LocationService'; // Import LocationInfo
import { fetchWeatherData } from '../services/weatherService';

// Define the shape of our weather context
interface WeatherContextType {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isOffline: boolean;
  currentLocation: LocationInfo | null; // Add this property
}

// Create the context with undefined default
const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const { currentLocation, isInitialized } = useLocation();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const query = useQuery<WeatherData, Error>({
    queryKey: ['weather', currentLocation?.latitude, currentLocation?.longitude],
    queryFn: () =>
      fetchWeatherData({
        latitude: currentLocation!.latitude,
        longitude: currentLocation!.longitude,
      }),
    enabled: Boolean(currentLocation && isInitialized),
    retry: 2,
    staleTime: 5 * 60 * 1000,
    onSuccess: () => setLastUpdated(new Date()),
  });

  return (
    <WeatherContext.Provider
      value={{
        weatherData: query.data ?? null,
        loading: query.isLoading,
        error: query.error ? query.error.message : null,
        lastUpdated,
        isOffline: !navigator.onLine,
        currentLocation,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

// Consumer hook
export function useWeather(): WeatherContextType {
  const context = useContext(WeatherContext);

  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }

  return context;
}
