import { useEffect } from "react";
import { getWeatherInfo } from "../../utils/weatherCodeMap";
import { WeatherData } from "../../types/weather.types";
import { formatDate } from "../../utils/dateUtils";
import { useWeather } from "../../context/WeatherContext";
import { useTheme } from "../../context/ThemeContext";

interface CurrentWeatherProps {
  data: WeatherData;
}

export default function CurrentWeather({ data }: CurrentWeatherProps) {
  const { currentLocation } = useWeather();
  const { applyTheme } = useTheme();
  const weatherInfo = getWeatherInfo(data.current.weather_code);
  const isNight = data.current.is_day !== 1;

  // Apply theme based on current weather and time of day
  useEffect(() => {
    applyTheme(data.current.weather_code, data.current.is_day === 1);
  }, [data.current.weather_code, data.current.is_day, applyTheme]);

  return (
    <div className="text-white">
      {/* Location name & date */}
      <div className="mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          {currentLocation?.name || "Current Location"}
        </h1>
        <div className="opacity-80 text-sm sm:text-base mt-1 flex items-center flex-wrap">
          {currentLocation?.country && (
            <span className="font-medium mr-2">{currentLocation.country}</span>
          )}
          <span>{formatDate(new Date().toISOString())}</span>
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
            </svg>
          ) : null}
        </div>
      </div>
    </div>
  );
}
