/* DayItem.tsx - Enhanced */
import React from "react";
import { motion } from "framer-motion";
import WeatherIcon from "../shared/WeatherIcon";
import { getWeatherInfo } from "../../../utils/weatherCodeMap";
import { formatDay, formatDate } from "../../../utils/formatting";
import { useSettings } from "../../../context/SettingsContext";
import { AppConfig } from "../../../config/appConfig";

interface DayItemProps {
  day: string;
  maxTemp: number; // Temperature in Celsius from API
  minTemp: number; // Temperature in Celsius from API
  weatherCode: number;
  precipProbability: number;
  isToday: boolean;
}

const DayItem: React.FC<DayItemProps> = ({
  day,
  maxTemp,
  minTemp,
  weatherCode,
  precipProbability,
  isToday,
}) => {
  const weatherInfo = getWeatherInfo(weatherCode);
  const hasPrecip = precipProbability > 0;
  const { settings } = useSettings();

  // Convert temperatures for display if needed (they come in Celsius)
  const displayMaxTemp =
    settings.units.temperature === "celsius"
      ? maxTemp
      : AppConfig.utils.convertTemperature(maxTemp, "fahrenheit");

  const displayMinTemp =
    settings.units.temperature === "celsius"
      ? minTemp
      : AppConfig.utils.convertTemperature(minTemp, "fahrenheit");

  // Calculate temperature difference using converted temperatures
  const tempDiff = displayMaxTemp - displayMinTemp;
  // Adjust temperature range based on unit
  const tempRange = settings.units.temperature === "celsius" ? 40 : 72; // 40°C ≈ 72°F
  const rangeWidth = Math.min(100, (tempDiff / tempRange) * 100);

  // Use original Celsius temperatures for color determination
  const maxTempCelsius = maxTemp; // Already in Celsius from API

  // Determine weather-specific accent colors
  const getWeatherAccent = () => {
    const icon = weatherInfo.icon;
    if (icon.includes("sun")) return "from-yellow-400 to-orange-400";
    if (icon.includes("cloud")) return "from-blue-300 to-gray-400";
    if (icon.includes("rain")) return "from-blue-400 to-blue-600";
    if (icon.includes("snow")) return "from-blue-100 to-blue-300";
    if (icon.includes("fog")) return "from-gray-300 to-gray-500";
    if (icon.includes("thunder")) return "from-yellow-400 to-purple-500";
    return "from-blue-400 to-indigo-500";
  };

  return (
    <motion.div
      className={`relative overflow-hidden flex items-center p-3 rounded-xl transition-all ${
        isToday
          ? "bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-sm border border-white/20 shadow-lg"
          : "bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-white/20"
      }`}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Visual accent based on weather */}
      <div
        className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${getWeatherAccent()}`}
        style={{ opacity: isToday ? 1 : 0.7 }}
      />

      {/* Today indicator */}
      {isToday && (
        <div className="absolute right-3 top-3">
          <div className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
            <span className="text-xs font-semibold text-white">Today</span>
          </div>
        </div>
      )}

      {/* Day of week and date */}
      <div className="flex flex-col pl-2 w-[70px]">
        <div className="font-medium text-sm text-white">
          {isToday ? "Today" : formatDay(day)}
        </div>
        <div className="text-xs text-white/70 font-medium">
          {formatDate(day)}
        </div>
      </div>

      {/* Weather condition icon with subtle animation */}
      <div className="ml-2 mr-4">
        <motion.div
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
          {/* Subtle glow effect behind icon */}
          <div
            className="absolute inset-0 -z-10 blur-md opacity-30"
            style={{
              backgroundColor: weatherInfo.icon.includes("sun")
                ? "rgba(252, 211, 77, 0.3)"
                : weatherInfo.icon.includes("rain")
                ? "rgba(96, 165, 250, 0.2)"
                : weatherInfo.icon.includes("snow")
                ? "rgba(241, 245, 249, 0.2)"
                : "rgba(255, 255, 255, 0.1)",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </motion.div>
      </div>

      {/* Weather condition text */}
      <div className="flex-grow">
        <span className="text-sm font-medium text-white">
          {weatherInfo.label}
        </span>
        {hasPrecip && (
          <div className="flex items-center mt-1">
            <div className="relative h-1.5 w-full max-w-[100px] bg-blue-900/20 rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-300 to-blue-500"
                style={{ width: `${precipProbability}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${precipProbability}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            <span className="text-xs font-medium text-blue-200 ml-2">
              {precipProbability}%
            </span>
          </div>
        )}
      </div>

      {/* Temperature range with visual indicator */}
      <div className="flex flex-col items-end space-y-1.5 ml-2">
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="font-bold text-sm">
            {Math.round(displayMaxTemp)}°
          </span>
          <span className="text-sm text-white/70">
            {Math.round(displayMinTemp)}°
          </span>
        </div>

        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              maxTempCelsius > 30
                ? "bg-gradient-to-r from-orange-300 to-red-500"
                : maxTempCelsius > 20
                ? "bg-gradient-to-r from-yellow-300 to-orange-400"
                : maxTempCelsius > 10
                ? "bg-gradient-to-r from-green-300 to-green-500"
                : maxTempCelsius > 0
                ? "bg-gradient-to-r from-blue-300 to-indigo-500"
                : "bg-gradient-to-r from-blue-300 to-blue-600"
            }`}
            style={{ width: `${rangeWidth}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DayItem;
