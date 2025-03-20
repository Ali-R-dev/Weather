import React from "react";
import { motion } from "framer-motion";
import WeatherIcon from "../shared/WeatherIcon";
import { getWeatherInfo } from "../../../utils/weatherCodeMap";
import { formatHour } from "../../../utils/formatting";
import { useSettings } from "../../../context/SettingsContext";
import { AppConfig } from "../../../config/appConfig";

interface HourlyForecastItemProps {
  time: string;
  temperature: number; // Temperature is in Celsius from the API
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

  // Temperature is already in Celsius from the API
  const tempCelsius = temperature;

  // Convert for display if needed
  const displayTemp =
    settings.units.temperature === "celsius"
      ? temperature
      : AppConfig.utils.convertTemperature(temperature, "fahrenheit");

  // Use Celsius values for color determination since temperature is already in Celsius
  const getTempColor = () => {
    if (tempCelsius >= 30) return "text-red-400";
    if (tempCelsius >= 20) return "text-orange-400";
    if (tempCelsius >= 10) return "text-yellow-300";
    if (tempCelsius >= 0) return "text-blue-300";
    return "text-blue-400";
  };

  return (
    <motion.div
      className={`
        flex flex-col items-center min-w-[65px] flex-shrink-0 py-2.5 px-2 rounded-xl 
        ${
          isCurrentHour
            ? "bg-white/20 border-l-2 border-l-white border-white/10"
            : "bg-white/5 border border-white/10"
        }
      `}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Time display */}
      <div className="font-medium text-xs text-white/90 mb-1">
        {isCurrentHour ? (
          <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-white text-[10px] font-bold">
            NOW
          </span>
        ) : (
          formatHour(time)
        )}
      </div>

      {/* Weather icon */}
      <div className="my-1.5">
        <WeatherIcon type={weatherInfo.icon} />
      </div>

      {/* Temperature */}
      <div className={`font-bold text-lg ${getTempColor()}`}>
        {Math.round(displayTemp)}°
      </div>

      {/* Precipitation probability */}
      {hasPrecip && (
        <div className="text-xs text-blue-200 mt-1">
          {precipitationProbability}%
        </div>
      )}
    </motion.div>
  );
};

export default HourlyForecastItem;
