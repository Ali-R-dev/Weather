import React from "react";
import { motion } from "framer-motion";
import WeatherIcon from "../shared/WeatherIcon";
import { getWeatherInfo } from "../../../utils/weatherCodeMap";
import { formatHour } from "../../../utils/formatting";
import { useSettings } from "../../../context/SettingsContext";
import { AppConfig } from "../../../config/appConfig";

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
      className={`
        relative flex flex-col items-center min-w-[75px] flex-shrink-0 py-3 px-2.5 rounded-xl 
        backdrop-blur-sm transition-all duration-300
        ${
          isCurrentHour
            ? "bg-gradient-to-b from-white/25 to-white/15 border-2 border-white/30 shadow-lg"
            : "bg-gradient-to-b from-white/10 to-white/5 border border-white/10"
        }
      `}
    >
      {/* Weather-specific gradient overlay */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-b ${getWeatherGradient()} opacity-${
          isCurrentHour ? "50" : "30"
        }`}
      />

      {/* Time display */}
      <div className="relative font-medium text-xs text-white/90 mb-1.5">
        {isCurrentHour ? (
          <span className="px-2 py-0.5 bg-white/30 rounded-full text-white text-[10px] font-bold tracking-wide">
            NOW
          </span>
        ) : (
          <span className="font-semibold">{formatHour(time)}</span>
        )}
      </div>

      {/* Weather icon with subtle animation */}
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
          className="absolute inset-0 -z-10 blur-md opacity-30"
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

      {/* Temperature with dynamic color */}
      <div
        className={`relative font-bold text-lg ${getTempColor()} transition-colors duration-300`}
      >
        {Math.round(displayTemp)}°
      </div>

      {/* Precipitation probability with improved visualization */}
      {hasPrecip && (
        <div className="relative mt-2 flex flex-col items-center">
          <div className="h-1.5 w-12 bg-blue-900/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-300 to-blue-500"
              style={{ width: `${precipitationProbability}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${precipitationProbability}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
          <span className="text-[10px] font-medium text-blue-200 mt-1">
            {precipitationProbability}%
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default HourlyForecastItem;
