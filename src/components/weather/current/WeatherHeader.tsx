import React from "react";
import { motion } from "framer-motion";
import { formatLocalTime } from "../../../utils/formatting";
import { TimeFormat } from "../../../context/SettingsContext";

interface WeatherHeaderProps {
  locationName: string | undefined;
  region?: string;
  country?: string;
  timezone?: string;
  timeFormat: TimeFormat;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  locationName,
  region,
  country,
  timezone,
  timeFormat,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-7"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
        <div className="flex-1">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              {locationName || "Weather"}
            </span>
          </motion.h1>

          <motion.div
            className="flex items-center flex-wrap mt-1.5 text-sm sm:text-base text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {region && (
              <span className="font-medium text-white/90 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mr-1 h-4 w-4 text-white/60"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {region}
              </span>
            )}
            {region && country && <span className="mx-2 text-white/40">•</span>}
            {country && <span className="text-white/70">{country}</span>}
          </motion.div>
        </div>

        <motion.div
          className="text-xl sm:text-2xl font-light mt-2 sm:mt-0 flex items-center backdrop-blur-sm px-3 py-1 rounded-full bg-white/5 border border-white/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-white/70"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">
            {formatLocalTime(timezone, timeFormat)}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WeatherHeader;
