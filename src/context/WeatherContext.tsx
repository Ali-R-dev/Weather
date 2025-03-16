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
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationInfo | null>(
    null
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { defaultLocation, savedLocations } = useSavedLocations();

  const fetchWeather = useCallback(
    async (latitude: number, longitude: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,is_day,uv_index&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`
        );

        // Get the weather data
        const data = await response.json();

        // If location doesn't have a name yet, try to get it with reverse geocoding
        if (!currentLocation?.name) {
          try {
            const geoResponse = await fetch(
              `https://api.open-meteo.com/v1/geocoding-reverse?latitude=${latitude}&longitude=${longitude}&format=json`
            );
            const geoData = await geoResponse.json();

            if (geoData && geoData.results && geoData.results.length > 0) {
              const locationInfo = geoData.results[0];

              // Add location info to the data
              data.location = {
                name: locationInfo.name,
                region: locationInfo.admin1,
                country: locationInfo.country,
              };

              // Update currentLocation with full details
              setCurrentLocation({
                latitude,
                longitude,
                name: locationInfo.name,
                country: locationInfo.country,
                admin1: locationInfo.admin1,
                admin2: locationInfo.admin2,
              });
            }
          } catch (error) {
            console.error("Error getting location name:", error);
          }
        }

        setWeatherData(data);
        setLastUpdated(new Date());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch weather data"
        );
      } finally {
        setLoading(false);
      }
    },
    [currentLocation]
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
        // Fallback to user's IP geolocation
        fetch("https://ipapi.co/json/")
          .then((res) => res.json())
          .then((ipData) => {
            setLocation({
              latitude: ipData.latitude,
              longitude: ipData.longitude,
              name: ipData.city,
              country: ipData.country_name,
              admin1: ipData.region,
            });
          })
          .catch((err) => console.error("IP geolocation error:", err));
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
