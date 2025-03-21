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

  // Staggered animation for grid items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mb-4"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Humidity */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          }}
          className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-lg transition-all"
        >
          <div className="flex items-center mb-2">
            <div className="bg-blue-400/20 p-1.5 rounded-lg mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-blue-300"
              >
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
              </svg>
            </div>
            <div className="text-xs font-medium text-white/90 uppercase tracking-wide">
              Humidity
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">{humidity}%</span>
            <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  humidity > 80
                    ? "bg-blue-500"
                    : humidity > 60
                    ? "bg-blue-400"
                    : "bg-blue-300"
                }`}
                style={{ width: `${humidity}%` }}
              ></div>
            </div>
          </div>
          <div className="text-xs mt-1 text-white/70">
            {humidity > 80
              ? "High humidity"
              : humidity > 60
              ? "Moderate"
              : "Low humidity"}
          </div>
        </motion.div>

        {/* Wind */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          }}
          className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-lg transition-all"
        >
          <div className="flex items-center mb-2">
            <div className="bg-cyan-400/20 p-1.5 rounded-lg mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-cyan-300"
              >
                <path
                  fillRule="evenodd"
                  d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-xs font-medium text-white/90 uppercase tracking-wide">
              Wind
            </div>
          </div>
          <div className="text-2xl font-bold">
            {Math.round(windSpeed)} {windUnitLabel}
          </div>
          <div className="flex items-center text-xs text-white/70 mt-1">
            <div
              className="transform mr-1"
              style={{
                transform: `rotate(${windDirectionDegrees}deg)`,
                display: "inline-block",
              }}
            >
              ↑
            </div>
            {windDirectionStr} ({windDirectionDegrees}°)
          </div>
        </motion.div>

        {/* Precipitation */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          }}
          className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-lg transition-all"
        >
          <div className="flex items-center mb-2">
            <div className="bg-blue-400/20 p-1.5 rounded-lg mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-blue-300"
              >
                <path
                  fillRule="evenodd"
                  d="M12 6.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75v-7.5a.75.75 0 01.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-xs font-medium text-white/90 uppercase tracking-wide">
              Precipitation
            </div>
          </div>
          <div className="text-2xl font-bold">{precipitation} mm</div>
          {precipitationProbability !== undefined && (
            <div
              className={`text-xs mt-1 ${
                precipitationProbability > 70
                  ? "text-blue-300"
                  : precipitationProbability > 30
                  ? "text-white/70"
                  : "text-white/60"
              }`}
            >
              {precipitationProbability}% chance today
            </div>
          )}
        </motion.div>

        {/* UV Index */}
        {uvIndex !== undefined && (
          <motion.div
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
            }}
            className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-lg transition-all"
          >
            <div className="flex items-center mb-2">
              <div className="bg-yellow-400/20 p-1.5 rounded-lg mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-yellow-300"
                >
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              </div>
              <div className="text-xs font-medium text-white/90 uppercase tracking-wide">
                UV Index
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{Math.round(uvIndex)}</span>
              <span
                className={`text-xs py-1 px-2 rounded-full ${uvInfo?.color} bg-white/10 font-medium`}
              >
                {uvInfo?.label}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${
                  uvIndex >= 8
                    ? "bg-red-500"
                    : uvIndex >= 6
                    ? "bg-orange-500"
                    : uvIndex >= 3
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(100, (uvIndex / 11) * 100)}%` }}
              ></div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MetricsGrid;
