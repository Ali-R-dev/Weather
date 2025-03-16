import { useEffect, useState } from "react";
import { getWeatherInfo } from "../../utils/weatherCodeMap";
import { WeatherData } from "../../types/weather.types";
import { formatDate } from "../../utils/dateUtils";
import { useWeather } from "../../context/WeatherContext";
import { useTheme } from "../../context/ThemeContext";

interface CurrentWeatherProps {
  data: WeatherData;
}

// Helper function to get UV index label
const getUVIndexLabel = (uvIndex: number): string => {
  if (uvIndex <= 2) return "(Low)";
  if (uvIndex <= 5) return "(Moderate)";
  if (uvIndex <= 7) return "(High)";
  if (uvIndex <= 10) return "(Very High)";
  return "(Extreme)";
};

export default function CurrentWeather({ data }: CurrentWeatherProps) {
  const { currentLocation } = useWeather();
  const { applyTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const weatherInfo = getWeatherInfo(data.current.weather_code);

  // Apply theme based on current weather and time of day
  useEffect(() => {
    applyTheme(data.current.weather_code, data.current.is_day === 1);
  }, [data.current.weather_code, data.current.is_day, applyTheme]);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Format the current time for the location timezone
  const formatLocalTime = () => {
    try {
      if (!data.timezone) return "";

      return new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: data.timezone,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  return (
    <div className="text-white">
      {/* Location name, region, country & current time */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            {currentLocation?.name || data.location?.name || "Weather"}
          </h1>
          <div className="text-2xl font-light mt-1 sm:mt-0">
            {formatLocalTime()}
          </div>
        </div>

        <div className="opacity-80 text-sm sm:text-base mt-1 flex items-center flex-wrap">
          {currentLocation?.admin1 && (
            <span className="font-medium">{currentLocation.admin1}</span>
          )}
          {currentLocation?.admin1 && currentLocation?.country && (
            <span className="mx-1">•</span>
          )}
          {currentLocation?.country && <span>{currentLocation.country}</span>}
          {!currentLocation?.country &&
            !currentLocation?.admin1 &&
            data.location?.region && <span>{data.location.region}</span>}
        </div>
      </div>

      {/* Temperature and weather condition */}
      <div className="flex items-center justify-between">
        {/* Temperature */}
        <div>
          <div className="flex items-start">
            <span className="text-6xl sm:text-7xl font-bold tracking-tighter">
              {Math.round(data.current.temperature_2m)}
            </span>
            <span className="text-3xl sm:text-4xl font-light mt-1">°C</span>
          </div>
          <div className="text-base sm:text-lg opacity-90 mt-1">
            Feels like {Math.round(data.current.apparent_temperature)}°
          </div>
          <div className="text-lg sm:text-xl font-medium mt-2">
            {weatherInfo.label}
          </div>
        </div>

        {/* Weather icon */}
        <div className="text-5xl sm:text-6xl">
          {weatherInfo.icon === "sun" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16 text-yellow-300"
            >
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : weatherInfo.icon === "cloud" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16 text-gray-100"
            >
              <path
                fillRule="evenodd"
                d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
                clipRule="evenodd"
              />
            </svg>
          ) : weatherInfo.icon === "cloud-rain" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16 text-blue-300"
            >
              <path
                fillRule="evenodd"
                d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
                clipRule="evenodd"
              />
              <path d="M3.75 14.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75z" />
            </svg>
          ) : weatherInfo.icon === "cloud-snow" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16 text-blue-100"
            >
              <path
                fillRule="evenodd"
                d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
                clipRule="evenodd"
              />
              <path d="M3.75 15.75a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75v.008zm2.25-3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75v-.008zm3 3a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H9.75a.75.75 0 00-.75.75v.008zm2.25-3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" />
            </svg>
          ) : weatherInfo.icon === "cloud-lightning" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16 text-yellow-300"
            >
              <path
                fillRule="evenodd"
                d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                clipRule="evenodd"
              />
            </svg>
          ) : weatherInfo.icon === "cloud-fog" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16 text-gray-300"
            >
              <path
                fillRule="evenodd"
                d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
                clipRule="evenodd"
              />
              <path d="M3.75 12a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H4.5a.75.75 0 01-.75-.75zm0 4a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16 text-white/80"
            >
              <path
                fillRule="evenodd"
                d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Weather details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="text-xs opacity-70">Humidity</div>
          <div className="text-lg font-medium">
            {data.current.relative_humidity_2m}%
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="text-xs opacity-70">Wind</div>
          <div className="text-lg font-medium">
            {Math.round(data.current.wind_speed_10m)} km/h
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="text-xs opacity-70">Precipitation</div>
          <div className="text-lg font-medium">
            {data.current.precipitation} mm
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="text-xs opacity-70">UV Index</div>
          <div className="text-lg font-medium">
            {typeof data.current.uv_index === "number" ? (
              <>
                {Math.round(data.current.uv_index)}
                <span className="text-xs ml-1">
                  {getUVIndexLabel(data.current.uv_index)}
                </span>
              </>
            ) : (
              "N/A"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
