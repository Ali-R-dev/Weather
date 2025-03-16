import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { WeatherData } from "../types/weather.types";
// import { fetchWeatherData } from "../services/weatherService";

interface LocationInfo {
  latitude: number;
  longitude: number;
  name?: string;
  country?: string;
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

  const fetchWeather = useCallback(
    async (latitude: number, longitude: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,is_day,uv_index&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`
        );
        const data = await response.json();
        setWeatherData(data);
        setCurrentLocation({ latitude, longitude });
        setLastUpdated(new Date());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch weather data"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const setLocation = useCallback(
    (location: LocationInfo) => {
      setCurrentLocation(location);
      fetchWeather(location.latitude, location.longitude);
    },
    [fetchWeather]
  );

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
