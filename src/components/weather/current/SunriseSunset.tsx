import React from "react";
import { formatTimeWithFormat } from "../../../utils/formatting";
import { TimeFormat } from "../../../context/SettingsContext";
import { motion } from "framer-motion";

interface SunriseSunsetProps {
  sunrise: string;
  sunset: string;
  timeFormat: TimeFormat;
}

const SunriseSunset: React.FC<SunriseSunsetProps> = ({
  sunrise,
  sunset,
  timeFormat,
}) => {
  // Calculate day length in hours and minutes
  const sunriseDate = new Date(sunrise);
  const sunsetDate = new Date(sunset);
  const dayLengthMs = sunsetDate.getTime() - sunriseDate.getTime();
  const dayLengthHours = Math.floor(dayLengthMs / (1000 * 60 * 60));
  const dayLengthMinutes = Math.floor(
    (dayLengthMs % (1000 * 60 * 60)) / (1000 * 60)
  );

  // Calculate current progress through the day
  const now = new Date();
  let dayProgress = 0;

  if (now >= sunriseDate && now <= sunsetDate) {
    dayProgress = ((now.getTime() - sunriseDate.getTime()) / dayLengthMs) * 100;
  } else if (now > sunsetDate) {
    dayProgress = 100;
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/20 shadow-lg"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="text-xs font-medium text-white/90 uppercase tracking-wide">
          Day Length
        </div>
        <div className="text-sm font-medium">
          {dayLengthHours}h {dayLengthMinutes}m
        </div>
      </div>

      {/* Day progress bar */}
      <div className="relative h-16 mb-4">
        {/* Arc background */}
        <div className="absolute inset-x-0 h-12 bottom-0 overflow-hidden">
          <div className="w-full h-24 rounded-full bg-white/5 translate-y-12"></div>
        </div>

        {/* Sunrise indicator */}
        <div className="absolute bottom-0 left-0 flex flex-col items-center">
          <div className="bg-gradient-to-b from-yellow-400 to-orange-400 w-3 h-3 rounded-full"></div>
          <div className="h-5 w-px bg-white/20 my-1"></div>
          <div className="text-xs font-medium text-white/80">
            {formatTimeWithFormat(sunrise, timeFormat)}
          </div>
        </div>

        {/* Sunset indicator */}
        <div className="absolute bottom-0 right-0 flex flex-col items-center">
          <div className="bg-gradient-to-b from-orange-400 to-purple-500 w-3 h-3 rounded-full"></div>
          <div className="h-5 w-px bg-white/20 my-1"></div>
          <div className="text-xs font-medium text-white/80">
            {formatTimeWithFormat(sunset, timeFormat)}
          </div>
        </div>

        {/* Sun progress */}
        <div
          className="absolute bottom-0"
          style={{ left: `${dayProgress}%`, transform: "translateX(-50%)" }}
        >
          <div className="relative">
            {dayProgress > 0 && dayProgress < 100 && (
              <>
                <div className="absolute -inset-2 rounded-full bg-yellow-400/20 animate-pulse"></div>
                <div className="absolute -inset-1 rounded-full bg-yellow-400/30"></div>
              </>
            )}
            <div
              className={`w-5 h-5 rounded-full ${
                dayProgress > 0 && dayProgress < 100
                  ? "bg-gradient-to-r from-yellow-300 to-orange-300"
                  : "bg-gray-500"
              }`}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 mr-1 text-yellow-300"
          >
            <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
          </svg>
          <span className="font-medium">Sunrise</span>
        </div>

        <div className="flex items-center">
          <span className="font-medium">Sunset</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 ml-1 text-purple-300"
          >
            <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default SunriseSunset;
