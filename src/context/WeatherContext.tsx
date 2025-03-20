import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
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
  setLocation: (location: LocationInfo) => void;
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

  const fetchWeather = useCallback(
    async (latitude: number, longitude: number) => {
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

        // If location doesn't have a name yet, try to get it
        if (!currentLocation?.name) {
          const locationInfo = await reverseGeocode(latitude, longitude);
          if (locationInfo) {
            data.location = {
              name: locationInfo.name,
              region: locationInfo.admin1,
              country: locationInfo.country,
            };
            setCurrentLocation({
              latitude,
              longitude,
              name: locationInfo.name,
              country: locationInfo.country,
              admin1: locationInfo.admin1,
              admin2: locationInfo.admin2,
            });
          }
        }

        // Cache the data
        try {
          localStorage.setItem("weatherCache", JSON.stringify(data));
          localStorage.setItem(
            "cachedLocation",
            JSON.stringify(currentLocation || { latitude, longitude })
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

        if (retryCount < 3) {
          const retryDelay = Math.pow(2, retryCount) * 1000;
          console.log(`Retrying in ${retryDelay}ms...`);
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            fetchWeather(latitude, longitude);
          }, retryDelay);
        }
      } finally {
        setLoading(false);
      }
    },
    [currentLocation, retryCount]
  );

  const setLocation = useCallback(
    (location: LocationInfo) => {
      setCurrentLocation(location);
      fetchWeather(location.latitude, location.longitude);
    },
    [fetchWeather]
  );

  // Fallback logic: if no currentLocation is set,
  // then try defaultLocation, then any saved location, else use IP geolocation.
  useEffect(() => {
    if (!currentLocation) {
      if (defaultLocation) {
        setLocation(defaultLocation);
      } else if (savedLocations.length > 0) {
        setLocation(savedLocations[0]);
      } else {
        // Fallback to IP geolocation
        fetch(API_ENDPOINTS.IP_GEOLOCATION)
          .then((res) => {
            if (!res.ok) throw new Error("IP Geolocation failed");
            return res.json();
          })
          .then((ipData) => {
            setLocation({
              latitude: parseFloat(ipData.latitude),
              longitude: parseFloat(ipData.longitude),
            });
          })
          .catch((error) => {
            console.error("IP geolocation error:", error);
            // Fallback to a default location (e.g., New York City)
            setLocation({
              latitude: 40.7128,
              longitude: -74.006,
              name: "New York City",
              country: "United States",
              admin1: "New York",
            });
          });
      }
    }
  }, [currentLocation, defaultLocation, savedLocations, setLocation]);

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
