import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { WeatherData } from "../types/weather.types";
import useSavedLocations from "../hooks/useSavedLocations"; // import saved locations hook
import { reverseGeocode } from "../services/geocodingService";

// API endpoints as constants
const API_ENDPOINTS = {
  WEATHER: "https://api.open-meteo.com/v1/forecast",
  IP_GEOLOCATION: "https://get.geojs.io/v1/ip/geo.json",
} as const;

interface LocationInfo {
  latitude: number;
  longitude: number;
  name?: string;
  country?: string;
  admin1?: string; // State/province
  admin2?: string; // County/district
}

interface WeatherContextType {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  fetchWeather: (latitude: number, longitude: number) => Promise<void>;
  setLocation: (location: LocationInfo, fetchWeatherData?: boolean) => void;
  currentLocation: LocationInfo | null;
  lastUpdated: Date | null;
  isOffline: boolean;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Helper function to build weather API URL
const buildWeatherUrl = (latitude: number, longitude: number): string => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,is_day,uv_index",
    hourly: "temperature_2m,precipitation_probability,weather_code",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max",
    timezone: "auto",
  });
  return `${API_ENDPOINTS.WEATHER}?${params.toString()}`;
};

const RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 2;

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationInfo | null>(
    null
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const { defaultLocation, savedLocations } = useSavedLocations();
  const hasInitialized = useRef(false);
  const fetchTimeoutRef = useRef<number | undefined>(undefined);
  const currentLocationRef = useRef<LocationInfo | null>(null);

  // Update ref when currentLocation changes
  useEffect(() => {
    currentLocationRef.current = currentLocation;
  }, [currentLocation]);

  const fetchWeather = useCallback(
    async (latitude: number, longitude: number) => {
      // Clear any pending fetch timeout
      if (fetchTimeoutRef.current) {
        window.clearTimeout(fetchTimeoutRef.current);
      }

      setLoading(true);
      setError(null);

      try {
        if (!navigator.onLine) {
          throw new Error(
            "You're offline. Check your connection and try again."
          );
        }

        // Fetch weather data
        const response = await fetch(buildWeatherUrl(latitude, longitude));
        if (!response.ok) {
          throw new Error(`Weather service error: ${response.status}`);
        }

        const data = await response.json();

        // Only try to get location name if we don't already have it for these coordinates
        const current = currentLocationRef.current;
        if (
          !current?.name ||
          current.latitude !== latitude ||
          current.longitude !== longitude
        ) {
          const locationInfo = await reverseGeocode(latitude, longitude);
          if (locationInfo) {
            const newLocation = {
              latitude,
              longitude,
              name: locationInfo.name,
              country: locationInfo.country,
              admin1: locationInfo.admin1,
              admin2: locationInfo.admin2,
            };
            setCurrentLocation(newLocation);
            data.location = {
              name: locationInfo.name,
              region: locationInfo.admin1,
              country: locationInfo.country,
            };
          }
        }

        // Cache the data
        try {
          localStorage.setItem("weatherCache", JSON.stringify(data));
          localStorage.setItem(
            "cachedLocation",
            JSON.stringify(
              currentLocationRef.current || { latitude, longitude }
            )
          );
          localStorage.setItem(
            "cacheTimestamp",
            JSON.stringify(new Date().toISOString())
          );
        } catch (e) {
          console.warn("Failed to cache weather data:", e);
        }

        setWeatherData(data);
        setLastUpdated(new Date());
        setRetryCount(0);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to fetch weather data";
        setError(errorMsg);

        // Only retry if we haven't exceeded MAX_RETRIES
        if (retryCount < MAX_RETRIES) {
          fetchTimeoutRef.current = window.setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            fetchWeather(latitude, longitude);
          }, RETRY_DELAY);
        }
      } finally {
        setLoading(false);
      }
    },
    [retryCount] // Removed currentLocation dependency
  );

  const setLocation = useCallback(
    (location: LocationInfo, fetchWeatherData = false) => {
      // Check if the location is actually different
      const current = currentLocationRef.current;
      if (
        current?.latitude === location.latitude &&
        current?.longitude === location.longitude
      ) {
        // If coordinates are the same but we're getting more info (like name), just update the location
        if (!current.name && location.name) {
          setCurrentLocation(location);
        }
        return;
      }

      setCurrentLocation(location);
      if (fetchWeatherData) {
        fetchWeather(location.latitude, location.longitude);
      }
    },
    [fetchWeather]
  );

  // Function to request GPS location
  const requestGPSLocation = useCallback((): Promise<LocationInfo> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  // Function to get location from IP
  const getIPLocation = useCallback(async (): Promise<LocationInfo> => {
    const response = await fetch(API_ENDPOINTS.IP_GEOLOCATION);
    if (!response.ok) throw new Error("IP Geolocation failed");
    const ipData = await response.json();
    return {
      latitude: parseFloat(ipData.latitude),
      longitude: parseFloat(ipData.longitude),
    };
  }, []);

  // Initialize location with proper fallback chain
  useEffect(() => {
    const initializeLocation = async () => {
      // Skip if we already have a location or have already initialized
      if (currentLocation || hasInitialized.current) return;
      hasInitialized.current = true;

      try {
        // Try to load from cache first if offline
        if (!navigator.onLine) {
          const cachedLocation = localStorage.getItem("cachedLocation");
          if (cachedLocation) {
            const location = JSON.parse(cachedLocation);
            setCurrentLocation(location); // Don't call setLocation to avoid fetching weather when offline
            return;
          }
        }

        // 1. Check for default location from localStorage
        if (defaultLocation) {
          console.log("Using default location");
          setLocation(defaultLocation, true); // Fetch weather for default location
          return;
        }

        // 2. Check for saved locations
        if (savedLocations && savedLocations.length > 0) {
          console.log("Using first saved location");
          setLocation(savedLocations[0], true); // Fetch weather for first saved location
          return;
        }

        // 3. Check for last searched location in localStorage
        const lastSearched = localStorage.getItem("lastSearchedLocation");
        if (lastSearched) {
          try {
            console.log("Using last searched location");
            const lastLocation = JSON.parse(lastSearched);
            if (
              lastLocation &&
              lastLocation.latitude &&
              lastLocation.longitude
            ) {
              setLocation(lastLocation, true);
              return;
            }
          } catch (e) {
            console.warn("Failed to parse last searched location:", e);
          }
        }

        // 4. Try to get GPS location
        if (navigator.geolocation) {
          try {
            console.log("Requesting GPS location");
            const gpsLocation = await requestGPSLocation();
            setLocation(gpsLocation, true);
            return;
          } catch (error) {
            const gpsError =
              error instanceof Error ? error.message : "Unknown GPS error";
            console.log("GPS location failed:", gpsError);
          }
        }

        // 5. Fallback to IP geolocation
        try {
          console.log("Using IP geolocation");
          const ipLocation = await getIPLocation();
          setLocation(ipLocation, true);
        } catch (error) {
          console.error("IP geolocation failed:", error);
          // Final fallback to New York City
          setLocation(
            {
              latitude: 40.7128,
              longitude: -74.006,
              name: "New York City",
              country: "United States",
              admin1: "New York",
            },
            true
          );
        }
      } catch (error) {
        console.error("Location initialization error:", error);
        setError("Failed to initialize location");
      }
    };

    initializeLocation();
  }, [
    defaultLocation,
    savedLocations,
    setLocation,
    requestGPSLocation,
    getIPLocation,
  ]); // Removed currentLocation dependency

  // Listen for online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load cached weather data when offline
  useEffect(() => {
    if (isOffline && !weatherData) {
      try {
        const cachedData = localStorage.getItem("weatherCache");
        const cachedLocation = localStorage.getItem("cachedLocation");

        if (cachedData && cachedLocation) {
          setWeatherData(JSON.parse(cachedData));
          setCurrentLocation(JSON.parse(cachedLocation));
          setLastUpdated(
            new Date(
              JSON.parse(
                localStorage.getItem("cacheTimestamp") || Date.now().toString()
              )
            )
          );
          setError("You're offline. Showing cached data.");
        }
      } catch (err) {
        console.error("Failed to load cached weather data:", err);
      }
    }
  }, [isOffline, weatherData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        window.clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        loading,
        error,
        fetchWeather,
        setLocation,
        currentLocation,
        lastUpdated,
        isOffline,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
}
