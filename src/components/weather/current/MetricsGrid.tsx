import React from "react";
import { motion } from "framer-motion";
import { getUVIndexInfo, getWindDirection } from "../../../utils/weather";
import { WindUnit } from "../../../context/SettingsContext";

interface MetricsGridProps {
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  uvIndex?: number;
  precipitationProbability?: number;
  windUnit: WindUnit;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({
  humidity,
  windSpeed,
  windDirection: windDirectionDegrees,
  precipitation,
  uvIndex,
  precipitationProbability,
  windUnit,
}) => {
  const windDirectionStr = getWindDirection(windDirectionDegrees);
  const uvInfo = uvIndex !== undefined ? getUVIndexInfo(uvIndex) : null;
  const windUnitLabel = windUnit === "kph" ? "km/h" : "mph";

  return (
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
                d="M12.556 17.329l4.183 4.182a3.375 3.375 0 004.773-4.773l-3.306-3.305a6.803 6.803 0 01-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 00-.167.063l-3.086 3.748zm3.414-1.36a.75.75 0 011.06 0l1.875 1.876a.75.75 0 11-1.06 1.06L15.97 17.03a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-xs text-white/80">Humidity</div>
          </div>
          <div className="text-lg font-medium flex justify-between items-end">
            <span>{humidity}%</span>
            <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full"
                style={{ width: `${humidity}%` }}
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
            {Math.round(windSpeed)} {windUnitLabel}
            <div className="text-xs text-white/70 mt-0.5">
              Direction: {windDirectionStr} ({windDirectionDegrees}°)
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
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.125 9.75a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0v-4.5zm4.125-2.25a.75.75 0 00-.75.75v6a.75.75 0 001.5 0v-6a.75.75 0 00-.75-.75zm3.75 3.75a.75.75 0 011.5 0v2.25a.75.75 0 01-1.5 0v-2.25z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-xs text-white/80">Precipitation</div>
          </div>
          <div className="text-lg font-medium">
            {precipitation} mm
            {precipitationProbability !== undefined &&
              precipitationProbability > 0 && (
                <div className="text-xs text-white/70 mt-0.5">
                  {precipitationProbability}% chance today
                </div>
              )}
          </div>
        </motion.div>

        {/* UV Index */}
        {uvIndex !== undefined && (
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
              <div className="flex justify-between items-end">
                <span>{Math.round(uvIndex)}</span>
                <span className={`text-xs ${uvInfo?.color}`}>
                  {uvInfo?.label}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MetricsGrid;
