import React from "react";
import { motion } from "framer-motion";
import WeatherIcon from "../shared/WeatherIcon";
import { getWeatherInfo } from "../../../utils/weatherCodeMap";
import { formatHour } from "../../../utils/formatting";
import { useSettings } from "../../../context/SettingsContext";
import { AppConfig } from "../../../config/appConfig";
import styles from "../hourly/HourlyForecast.module.css";

interface HourlyForecastItemProps {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  isCurrentHour?: boolean;
}

const HourlyForecastItem: React.FC<HourlyForecastItemProps> = ({
  time,
  temperature,
  weatherCode,
  precipitationProbability,
  isCurrentHour = false,
}) => {
  const { settings } = useSettings();
  const weatherInfo = getWeatherInfo(weatherCode);
  const hasPrecip = precipitationProbability > 0;

  const tempCelsius = temperature;
  const displayTemp =
    settings.units.temperature === "celsius"
      ? temperature
      : AppConfig.utils.convertTemperature(temperature, "fahrenheit");

  // Enhanced temperature color logic
  const getTempColor = () => {
    if (tempCelsius >= 35) return "text-red-500"; // Extreme heat
    if (tempCelsius >= 30) return "text-red-400"; // Very hot
    if (tempCelsius >= 25) return "text-orange-400"; // Hot
    if (tempCelsius >= 20) return "text-orange-300"; // Warm
    if (tempCelsius >= 15) return "text-yellow-300"; // Mild
    if (tempCelsius >= 10) return "text-green-300"; // Cool
    if (tempCelsius >= 5) return "text-blue-300"; // Cold
    if (tempCelsius >= 0) return "text-blue-400"; // Very cold
    if (tempCelsius >= -5) return "text-indigo-400"; // Freezing
    return "text-indigo-500"; // Extreme cold
  };

  // Get weather-specific gradient
  const getWeatherGradient = () => {
    const icon = weatherInfo.icon;
    if (icon.includes("sun")) return "from-yellow-400/20 to-orange-500/20";
    if (icon.includes("cloud")) return "from-blue-300/20 to-gray-400/20";
    if (icon.includes("rain")) return "from-blue-400/20 to-blue-600/20";
    if (icon.includes("snow")) return "from-blue-100/20 to-blue-300/20";
    if (icon.includes("fog")) return "from-gray-300/20 to-gray-500/20";
    if (icon.includes("thunder")) return "from-yellow-400/20 to-purple-500/20";
    return "from-blue-400/20 to-indigo-500/20";
  };

  return (
    <motion.div
      className={`${styles.hourlyItem} ${isCurrentHour ? styles.current : ""}`}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Time display */}
      <div className={styles.timeText}>
        {isCurrentHour ? (
          <span className="px-2 py-0.5 bg-white/30 rounded-full text-white text-[10px] font-bold tracking-wide">
            NOW
          </span>
        ) : (
          <span className="font-semibold">{formatHour(time)}</span>
        )}
      </div>

      {/* Weather icon */}
      <motion.div
        className="relative my-1.5"
        animate={{
          y: [0, 2, 0],
          rotate: weatherInfo.icon.includes("wind") ? [0, 2, 0, -2, 0] : 0,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <WeatherIcon type={weatherInfo.icon} />
        {/* Glow effect */}
        <div
          className="absolute inset-0 -z-10 blur-md opacity-30 scale-125"
          style={{
            backgroundColor: weatherInfo.icon.includes("sun")
              ? "rgba(252, 211, 77, 0.3)"
              : weatherInfo.icon.includes("rain")
              ? "rgba(96, 165, 250, 0.2)"
              : "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
          }}
        />
      </motion.div>

      {/* Temperature */}
      <div className={styles.temperature}>{Math.round(displayTemp)}°</div>

      {/* Precipitation probability */}
      {hasPrecip && (
        <div className={styles.precipChance}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.precipIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
            />
          </svg>
          <span>{precipitationProbability}%</span>
        </div>
      )}
    </motion.div>
  );
};

export default HourlyForecastItem;
