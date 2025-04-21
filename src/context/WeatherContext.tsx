import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { WeatherData } from '../types/weather.types';
import { useLocation } from './LocationContext'; // Use the location context
import { LocationInfo } from '../services/LocationService'; // Import LocationInfo
import { fetchWeatherData, WeatherCacheService } from '../services/weatherService';

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

const RETRY_DELAY = 2000;
const MAX_RETRIES = 2;

export function WeatherProvider({ children }: { children: ReactNode }) {
  // Get location data from LocationContext
  const { currentLocation, isInitialized } = useLocation();

  // Weather-specific state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Listen for location changes and fetch weather data
  useEffect(() => {
    if (!currentLocation || !isInitialized) {
      return;
    }

    fetchWeatherForLocation(currentLocation);
  }, [currentLocation, isInitialized]);

  // Listen for online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (currentLocation) {
        fetchWeatherForLocation(currentLocation);
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      // Try to load cached data when going offline
      if (!weatherData) {
        loadFromCache();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentLocation, weatherData]);

  // Fetch weather for a location
  const fetchWeatherForLocation = useCallback(
    async (location: LocationInfo) => {
      if (!navigator.onLine) {
        setError("You're offline. Showing cached data if available.");
        loadFromCache();
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(
          `WeatherContext: Fetching weather for ${location.name || 'unnamed'} (${
            location.latitude
          }, ${location.longitude})`
        );

        const data = await fetchWeatherData({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        // Add location data to weather data
        if (location.name) {
          data.location = {
            name: location.name,
            region: location.admin1 || '',
            country: location.country || '',
          };
        }

        // Cache the weather data
        WeatherCacheService.saveToCache(data, location);

        setWeatherData(data);
        setLastUpdated(new Date());
        setRetryCount(0);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch weather data';
        setError(errorMsg);

        // Retry logic
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            fetchWeatherForLocation(location);
          }, RETRY_DELAY);
        } else {
          // Try to load from cache as fallback
          loadFromCache();
        }
      } finally {
        setLoading(false);
      }
    },
    [retryCount]
  );

  // Load weather data from cache
  const loadFromCache = useCallback(() => {
    const { data, location, timestamp } = WeatherCacheService.getFromCache();

    if (data && location && timestamp) {
      console.log(`WeatherContext: Loaded cached data from ${timestamp.toLocaleString()}`);
      setWeatherData(data);
      setLastUpdated(timestamp);

      if (isOffline) {
        setError("You're offline. Showing cached data.");
      }

      return true;
    }

    console.log('WeatherContext: No valid cache found');
    return false;
  }, [isOffline]);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        loading: loading && !weatherData,
        error,
        lastUpdated,
        isOffline,
        currentLocation, // Add this to the context value
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
