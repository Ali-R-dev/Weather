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
  // Pass the temperature unit to getComfortLevel
  const comfortLevel = getComfortLevel(temperature, humidity, temperatureUnit);
  const unitSymbol = temperatureUnit === "celsius" ? "°C" : "°F";

  // Calculate temperature difference
  const tempDiff = Math.round(temperature - feelsLike);
  const tempDiffText =
    tempDiff > 0
      ? `Feels ${Math.abs(tempDiff)}° colder`
      : tempDiff < 0
      ? `Feels ${Math.abs(tempDiff)}° warmer`
      : "Feels accurate";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="flex items-center justify-between mb-8"
    >
      {/* Temperature section with enhanced animation and styling */}
      <div>
        <motion.div
          className="flex items-start"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.3,
            type: "spring",
            stiffness: 100,
          }}
        >
          <span className="text-7xl sm:text-8xl font-bold tracking-tighter bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
            {Math.round(temperature)}
          </span>
          <span className="text-3xl sm:text-4xl font-light mt-2 text-white/90">
            {unitSymbol}
          </span>
        </motion.div>

        <motion.div
          className="text-base sm:text-lg text-white/80 mt-1 flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="mr-1">{Math.round(feelsLike)}°</span>
          <span className="text-sm text-white/60">{tempDiffText}</span>
        </motion.div>

        <motion.div
          className="mt-3 flex items-center"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <span className="text-xl sm:text-2xl font-medium mr-3">
            {weatherInfo.label}
          </span>
          <span
            className={`text-sm px-3 py-0.5 rounded-full ${comfortLevel.color} bg-white/10 backdrop-blur-sm border border-white/10`}
          >
            {comfortLevel.level}
          </span>
        </motion.div>
      </div>

      {/* Enhanced weather icon with animations and effects */}
      <motion.div
        key="weather-icon"
        className="relative text-6xl sm:text-7xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.4,
          type: "spring",
          stiffness: 80,
        }}
      >
        <motion.div
          className="absolute inset-0 blur-2xl opacity-20 scale-125"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundColor: weatherInfo.icon.includes("sun")
              ? "#FCD34D"
              : weatherInfo.icon.includes("rain")
              ? "#60A5FA"
              : weatherInfo.icon.includes("snow")
              ? "#E5E7EB"
              : weatherInfo.icon.includes("lightning")
              ? "#F59E0B"
              : "#F3F4F6",
          }}
        />

        <motion.div
          animate={{
            y: [0, -5, 0],
            scale: weatherInfo.icon.includes("sun") ? [1, 1.05, 1] : [1, 1, 1],
            rotate: weatherInfo.icon.includes("wind") ? [0, 3, 0, -3, 0] : 0,
          }}
          transition={{
            duration: weatherInfo.icon.includes("sun") ? 6 : 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <WeatherIcon type={weatherInfo.icon} size="xl" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TemperatureDisplay;
