import React from "react";
import { motion } from "framer-motion";
import { getComfortLevel } from "../../../utils/weather";
import { TemperatureUnit } from "../../../context/SettingsContext";
import WeatherIcon from "../shared/WeatherIcon";

interface TemperatureDisplayProps {
  temperature: number;
  feelsLike: number;
  weatherInfo: {
    label: string;
    icon: string;
  };
  humidity: number;
  temperatureUnit: TemperatureUnit;
}

const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({
  temperature,
  feelsLike,
  weatherInfo,
  humidity,
  temperatureUnit,
}) => {
  const comfortLevel = getComfortLevel(temperature, humidity);
  const unitSymbol = temperatureUnit === "celsius" ? "°C" : "°F";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="flex items-center justify-between mb-6"
    >
      {/* Temperature section */}
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
            {Math.round(temperature)}
          </span>
          <span className="text-3xl sm:text-4xl font-light mt-1">
            {unitSymbol}
          </span>
        </motion.div>

        <div className="text-base sm:text-lg opacity-90 mt-1">
          Feels like {Math.round(feelsLike)}°
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
        <div className="relative">
          <WeatherIcon type={weatherInfo.icon} size="lg" />
          <div
            className="absolute inset-0 blur-xl opacity-20 rounded-full"
            style={{
              backgroundColor: weatherInfo.icon.includes("sun")
                ? "#FCD34D"
                : weatherInfo.icon.includes("rain")
                ? "#93C5FD"
                : weatherInfo.icon.includes("snow")
                ? "#E5E7EB"
                : weatherInfo.icon.includes("lightning")
                ? "#FCD34D"
                : "#F3F4F6",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TemperatureDisplay;
