import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getWeatherInfo } from "../../utils/weatherCodeMap";
import { WeatherData } from "../../types/weather.types";
import { useWeather } from "../../context/WeatherContext";
import { useTheme } from "../../context/ThemeContext";

interface PremiumCurrentWeatherProps {
  data: WeatherData;
}

// Helper function to get UV index label and color
const getUVIndexInfo = (uvIndex: number) => {
  if (uvIndex <= 2) return { label: "Low", color: "text-green-400" };
  if (uvIndex <= 5) return { label: "Moderate", color: "text-yellow-400" };
  if (uvIndex <= 7) return { label: "High", color: "text-orange-400" };
  if (uvIndex <= 10) return { label: "Very High", color: "text-red-500" };
  return { label: "Extreme", color: "text-purple-500" };
};

// Helper to format wind direction
const getWindDirection = (degrees: number) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

// Calculate comfort level based on temperature and humidity
const getComfortLevel = (temperature: number, humidity: number) => {
  if (temperature > 30 && humidity > 70)
    return { level: "Uncomfortable", color: "text-red-500" };
  if (temperature > 28 && humidity > 60)
    return { level: "Warm", color: "text-orange-400" };
  if (temperature < 5) return { level: "Cold", color: "text-blue-400" };
  return { level: "Comfortable", color: "text-green-400" };
};

const PremiumCurrentWeather: React.FC<PremiumCurrentWeatherProps> = ({
  data,
}) => {
  const { currentLocation } = useWeather();
  const { applyTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDetails, setShowDetails] = useState(false);
  const weatherInfo = getWeatherInfo(data.current.weather_code);

  // UV index info
  const uvInfo = getUVIndexInfo(data.current.uv_index || 0);

  // Wind direction
  const windDirection = getWindDirection(data.current.wind_direction_10m);

  // Comfort level
  const comfortLevel = getComfortLevel(
    data.current.temperature_2m,
    data.current.relative_humidity_2m
  );

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        {/* Location and time section */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            {currentLocation?.name || data.location?.name || "Weather"}
          </h1>
          <div className="text-2xl font-light mt-1 sm:mt-0 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 text-white/70"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{formatLocalTime()}</span>
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
      </motion.div>

      {/* Main weather display with animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex items-center justify-between mb-6"
      >
        {/* Temperature with animation */}
        <div>
          <motion.div
            className="flex items-start"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              type: "spring",
              stiffness: 200,
            }}
          >
            <span className="text-6xl sm:text-7xl font-bold tracking-tighter bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
              {Math.round(data.current.temperature_2m)}
            </span>
            <span className="text-3xl sm:text-4xl font-light mt-1">°C</span>
          </motion.div>
          <div className="text-base sm:text-lg opacity-90 mt-1">
            Feels like {Math.round(data.current.apparent_temperature)}°
          </div>
          <motion.div
            className="text-lg sm:text-xl font-medium mt-2 flex items-center"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <span className="mr-2">{weatherInfo.label}</span>
            <span
              className={`text-sm px-2 py-0.5 rounded-full ${comfortLevel.color} bg-white/10`}
            >
              {comfortLevel.level}
            </span>
          </motion.div>
        </div>

        {/* Weather icon with animation */}
        <motion.div
          key="weather-icon"
          className="text-5xl sm:text-6xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.4,
            type: "spring",
            stiffness: 100,
          }}
        >
          {weatherInfo.icon === "sun" ? (
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-16 h-16 text-yellow-300 animate-pulse"
                style={{ animationDuration: "3s" }}
              >
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
              <div className="absolute inset-0 bg-yellow-300 blur-xl opacity-20 rounded-full"></div>
            </div>
          ) : weatherInfo.icon === "cloud" ? (
            <div className="relative">
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
              <div className="absolute inset-0 bg-white blur-xl opacity-10 rounded-full"></div>
            </div>
          ) : weatherInfo.icon === "cloud-rain" ? (
            <div className="relative">
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
              <div className="absolute inset-0 bg-blue-300 blur-xl opacity-10 rounded-full"></div>
            </div>
          ) : weatherInfo.icon === "cloud-snow" ? (
            <div className="relative">
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
              <div className="absolute inset-0 bg-blue-100 blur-xl opacity-10 rounded-full"></div>
            </div>
          ) : weatherInfo.icon === "cloud-lightning" ? (
            <div className="relative">
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
              <div className="absolute inset-0 bg-yellow-300 blur-xl opacity-10 rounded-full"></div>
            </div>
          ) : weatherInfo.icon === "cloud-fog" ? (
            <div className="relative">
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
              <div className="absolute inset-0 bg-gray-300 blur-xl opacity-10 rounded-full"></div>
            </div>
          ) : (
            <div className="relative">
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
              <div className="absolute inset-0 bg-white blur-xl opacity-10 rounded-full"></div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Weather details grid with enhanced visual design */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Humidity */}
          <motion.div
            key="humidity-card"
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 border border-white/20 shadow-lg transition-all hover:bg-white/15"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-1 text-blue-300"
              >
                <path
                  fillRule="evenodd"
                  d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z"
                  clipRule="evenodd"
                />
                <path d="M10.076 8.64l-2.201-2.2V4.874a.75.75 0 00-.364-.643l-3.75-2.25a.75.75 0 00-.916.113l-.75.75a.75.75 0 00-.113.916l2.25 3.75a.75.75 0 00.643.364h1.564l2.062 2.062 1.575-1.297z" />
                <path
                  fillRule="evenodd"
                  d="M12.556 17.329l4.183 4.182a3.375 3.375 0 004.773-4.773l-3.306-3.305a6.803 6.803 0 01-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 00-.167.063l-3.086 3.748zm3.414-1.36a.75.75 0 011.06 0l1.875 1.876a.75.75 0 11-1.06 1.06L15.97 17.03a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-xs text-white/80">Humidity</div>
            </div>
            <div className="text-lg font-medium flex justify-between items-end">
              <span>{data.current.relative_humidity_2m}%</span>
              <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full"
                  style={{ width: `${data.current.relative_humidity_2m}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Wind */}
          <motion.div
            key="wind-card"
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 border border-white/20 shadow-lg transition-all hover:bg-white/15"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-1 text-cyan-300"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-xs text-white/80">Wind</div>
            </div>
            <div className="text-lg font-medium">
              {Math.round(data.current.wind_speed_10m)} km/h
              <div className="text-xs text-white/70 mt-0.5">
                Direction: {windDirection} ({data.current.wind_direction_10m}°)
              </div>
            </div>
          </motion.div>

          {/* Precipitation */}
          <motion.div
            key="precipitation-card"
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 border border-white/20 shadow-lg transition-all hover:bg-white/15"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-1 text-blue-400"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-xs text-white/80">Precipitation</div>
            </div>
            <div className="text-lg font-medium">
              {data.current.precipitation} mm
              {data.daily?.precipitation_probability_max[0] > 0 && (
                <div className="text-xs text-white/70 mt-0.5">
                  {data.daily.precipitation_probability_max[0]}% chance today
                </div>
              )}
            </div>
          </motion.div>

          {/* UV Index */}
          <motion.div
            key="uv-index-card"
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 border border-white/20 shadow-lg transition-all hover:bg-white/15"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-1 text-yellow-300"
              >
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
              <div className="text-xs text-white/80">UV Index</div>
            </div>
            <div className="text-lg font-medium">
              {typeof data.current.uv_index === "number" ? (
                <div className="flex justify-between items-end">
                  <span>{Math.round(data.current.uv_index)}</span>
                  <span className={`text-xs ${uvInfo.color}`}>
                    {uvInfo.label}
                  </span>
                </div>
              ) : (
                "N/A"
              )}
            </div>
          </motion.div>
        </div>

        {/* Toggle for extended details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-3 flex justify-center"
        >
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-white/70 flex items-center hover:text-white transition-colors"
          >
            {showDetails ? "Hide details" : "More details"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-3 w-3 ml-1 transition-transform ${
                showDetails ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </motion.div>

        {/* Extended details panel */}
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Sunrise/Sunset (if available) */}
              {data.daily?.sunrise && data.daily?.sunset && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="text-xs text-white/70 mb-1">Day Length</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 mr-1 text-yellow-300"
                        >
                          <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
                        </svg>
                        <span className="text-sm">Sunrise:</span>
                      </div>
                      <div className="text-sm font-medium ml-5">
                        {new Date(data.daily.sunrise[0]).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 mr-1 text-purple-300"
                        >
                          <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
                        </svg>
                        <span className="text-sm">Sunset:</span>
                      </div>
                      <div className="text-sm font-medium ml-5">
                        {new Date(data.daily.sunset[0]).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pressure (if available) */}
              {data.current.pressure && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="text-xs text-white/70 mb-1">Air Pressure</div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-1 text-green-300"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-base font-medium">
                      {data.current.pressure} hPa
                    </span>
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    {data.current.pressure > 1013
                      ? "High pressure - Generally fair weather"
                      : "Low pressure - Potential for precipitation"}
                  </div>
                </div>
              )}

              {/* Visibility (if available) */}
              {data.current.visibility && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="text-xs text-white/70 mb-1">Visibility</div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-1 text-indigo-300"
                    >
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path
                        fillRule="evenodd"
                        d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-base font-medium">
                      {(data.current.visibility / 1000).toFixed(1)} km
                    </span>
                  </div>
                </div>
              )}

              {/* Cloud cover (if available) */}
              {typeof data.current.cloud_cover === "number" && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="text-xs text-white/70 mb-1">Cloud Cover</div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-1 text-gray-300"
                    >
                      <path d="M1 12.5A4.5 4.5 0 005.5 17H15a4 4 0 001.866-7.539 3.504 3.504 0 00-4.504-4.272A4.5 4.5 0 004.06 9.11 5.5 5.5 0 001 12.5z" />
                    </svg>
                    <span className="text-base font-medium">
                      {data.current.cloud_cover}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PremiumCurrentWeather;
