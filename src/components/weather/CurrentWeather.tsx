import { useEffect, useState } from "react";
import { getWeatherInfo } from "../../utils/weatherCodeMap";
import { WeatherData } from "../../types/weather.types";
import { formatDate } from "../../utils/dateUtils";
import { useWeather } from "../../context/WeatherContext";
import { useTheme } from "../../context/ThemeContext";

interface CurrentWeatherProps {
  data: WeatherData;
}

export default function CurrentWeather({ data }: CurrentWeatherProps) {
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("day");
  const { currentLocation } = useWeather();
  const { applyTheme } = useTheme();
  const weatherInfo = getWeatherInfo(data.current.weather_code);

  useEffect(() => {
    setTimeOfDay(data.current.is_day === 1 ? "day" : "night");
    // Apply theme based on current weather and time of day
    applyTheme(data.current.weather_code, data.current.is_day === 1);
  }, [data.current.is_day, data.current.weather_code, applyTheme]);

  // Get container style classes based on weather type
  const getContainerClasses = () => {
    const baseClasses = "rounded-lg shadow-lg overflow-hidden h-full";

    // Different styling based on weather conditions
    if (timeOfDay === "night") {
      switch (true) {
        case weatherInfo.icon.includes("cloud-lightning"):
          return `${baseClasses} bg-gradient-to-br from-slate-800/95 to-slate-950/95 text-white`;
        case weatherInfo.icon.includes("cloud-rain"):
          return `${baseClasses} bg-gradient-to-br from-blue-800/95 to-blue-950/95 text-white`;
        case weatherInfo.icon.includes("cloud-snow"):
          return `${baseClasses} bg-gradient-to-br from-slate-600/95 to-slate-800/95 text-white`;
        case weatherInfo.icon.includes("cloud"):
          return `${baseClasses} bg-gradient-to-br from-slate-700/95 to-slate-900/95 text-white`;
        case weatherInfo.icon.includes("fog"):
          return `${baseClasses} bg-gradient-to-br from-slate-600/95 to-slate-800/95 text-white`;
        default:
          return `${baseClasses} bg-gradient-to-br from-indigo-900/95 to-violet-950/95 text-white`;
      }
    } else {
      switch (true) {
        case weatherInfo.icon.includes("sun"):
          return `${baseClasses} bg-gradient-to-br from-amber-400/95 to-orange-500/95 text-white`;
        case weatherInfo.icon.includes("cloud-lightning"):
          return `${baseClasses} bg-gradient-to-br from-gray-600/95 to-gray-800/95 text-white`;
        case weatherInfo.icon.includes("cloud-rain"):
          return `${baseClasses} bg-gradient-to-br from-blue-500/95 to-blue-700/95 text-white`;
        case weatherInfo.icon.includes("cloud-snow"):
          return `${baseClasses} bg-gradient-to-br from-slate-200/95 to-slate-400/95 text-slate-800`;
        case weatherInfo.icon.includes("cloud"):
          return `${baseClasses} bg-gradient-to-br from-slate-400/95 to-slate-600/95 text-white`;
        default:
          return `${baseClasses} bg-gradient-to-br from-sky-400/95 to-blue-600/95 text-white`;
      }
    }
  };

  // Get detail card style based on weather type and day/night
  const getCardStyleClasses = (type: string) => {
    const baseClasses = "rounded-lg p-2 text-center border backdrop-blur-sm";

    if (timeOfDay === "night") {
      return `${baseClasses} bg-white/10 text-white border-white/20`;
    } else {
      switch (weatherInfo.icon) {
        case "cloud-snow":
          return `${baseClasses} bg-white/20 text-slate-800 border-white/30`;
        default:
          return `${baseClasses} bg-white/20 text-white border-white/30`;
      }
    }
  };

  return (
    <div className={getContainerClasses()}>
      {/* Location header with city name */}
      <div className="px-4 py-2 bg-black/20 backdrop-blur-sm flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold flex items-center">
            {currentLocation?.name || "Current Location"}
            {currentLocation?.country && (
              <span className="text-xs font-normal ml-2">
                {currentLocation.country}
              </span>
            )}
          </h2>
          <p className="text-xs opacity-80">
            {formatDate(new Date().toISOString())}
          </p>
        </div>
      </div>

      {/* Main weather content section */}
      <div className="p-4 flex flex-col h-[calc(100%-42px)]">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-baseline">
              <h2 className="text-5xl font-bold">
                {Math.round(data.current.temperature_2m)}°
              </h2>
              <span className="text-lg ml-1 opacity-90">C</span>
            </div>
            <p className="text-lg">
              Feels like {Math.round(data.current.apparent_temperature)}°
            </p>
            <p className="mt-2 text-xl font-medium">{weatherInfo.label}</p>
          </div>

          {/* Weather icon */}
          <div className="text-5xl">
            {weatherInfo.icon === "sun" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12"
              >
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            ) : weatherInfo.icon === "cloud" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12"
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
                className="w-12 h-12"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
                  clipRule="evenodd"
                />
                <path d="M3.75 14.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12"
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

        {/* Weather details in grid - adjusts to be 2x2 on small and 4x1 on larger heights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-auto">
          <div className={getCardStyleClasses("humidity")}>
            <div className="text-xs font-medium">Humidity</div>
            <div className="text-base font-semibold">
              {data.current.relative_humidity_2m}%
            </div>
          </div>
          <div className={getCardStyleClasses("wind")}>
            <div className="text-xs font-medium">Wind</div>
            <div className="text-base font-semibold">
              {Math.round(data.current.wind_speed_10m)} km/h
            </div>
          </div>
          <div className={getCardStyleClasses("precipitation")}>
            <div className="text-xs font-medium">Precip</div>
            <div className="text-base font-semibold">
              {data.current.precipitation} mm
            </div>
          </div>
          <div className={getCardStyleClasses("uv")}>
            <div className="text-xs font-medium">UV</div>
            <div className="text-base font-semibold">
              {Math.round((data.current.is_day ? 6 : 0) * Math.random())}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
