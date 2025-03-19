import React from "react";
import { motion } from "framer-motion";
import { formatLocalTime } from "../../../utils/formatting";

interface WeatherHeaderProps {
  locationName: string | undefined;
  region?: string;
  country?: string;
  timezone?: string;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  locationName,
  region,
  country,
  timezone,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          {locationName || "Weather"}
        </h1>
        <div className="text-2xl font-light mt-1 sm:mt-0 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1 text-white/70"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">{formatLocalTime(timezone)}</span>
        </div>
      </div>

      <div className="opacity-80 text-sm sm:text-base mt-1 flex items-center flex-wrap">
        {region && <span className="font-medium">{region}</span>}
        {region && country && <span className="mx-1">•</span>}
        {country && <span>{country}</span>}
      </div>
    </motion.div>
  );
};

export default WeatherHeader;
