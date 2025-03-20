import React from "react";
import { motion } from "framer-motion";
import WeatherIcon from "../shared/WeatherIcon";
import { getWeatherInfo } from "../../../utils/weatherCodeMap";
import { formatHour } from "../../../utils/formatting";

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
  const weatherInfo = getWeatherInfo(weatherCode);
  const hasPrecip = precipitationProbability > 0;

  // Clean temperature color based on range
  const getTempColor = () => {
    if (temperature >= 30) return "text-red-400";
    if (temperature >= 20) return "text-orange-400";
    if (temperature >= 10) return "text-yellow-300";
    if (temperature >= 0) return "text-blue-300";
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
        {Math.round(temperature)}°
      </div>

      {/* Precipitation probability - simple but effective */}
      {hasPrecip && (
        <div className="mt-1 flex items-center">
          <svg
            className="w-3 h-3 text-blue-300"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M11.28 15.63C11.28 17.73 9.57 19.44 7.47 19.44C5.38 19.44 3.67 17.73 3.67 15.63C3.67 14 6 11.37 7.47 10.03C8.93 11.37 11.28 14 11.28 15.63Z" />
          </svg>
          <span
            className={`
            text-xs font-medium ml-0.5
            ${
              precipitationProbability > 50
                ? "text-blue-300"
                : "text-blue-200/80"
            }
          `}
          >
            {precipitationProbability}%
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default HourlyForecastItem;
