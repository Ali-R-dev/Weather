import React from "react";
import { motion } from "framer-motion";
import { TimeFormat } from "../../../context/SettingsContext";
import { formatTimeWithFormat } from "../../../utils/formatting";
import styles from "./SunriseSunset.module.css";

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${styles.container} flex flex-col items-center`}
    >
      <div className="flex justify-between items-center max-w-sm min-w-sm mx-auto mb-3">
        <div className="text-xs font-medium text-white/90 uppercase tracking-wide">
          Day Length
        </div>
        <div className="text-sm font-medium">
          {dayLengthHours}h {dayLengthMinutes}m
        </div>
      </div>

      {/* Day progress bar */}
      <div className="relative mb-5 mt-2 max-w-lg mx-auto" style={{minHeight: '3.5rem'}}>
        {/* Night background */}
        <div className={styles.nightBar}></div>
        {/* Day segment */}
        {(() => {
          // Calculate percent for sunrise and sunset for left and width
          const sunriseMinutes = sunriseDate.getHours() * 60 + sunriseDate.getMinutes();
          const sunsetMinutes = sunsetDate.getHours() * 60 + sunsetDate.getMinutes();
          const sunrisePercent = sunriseMinutes / 1440 * 100;
          const sunsetPercent = sunsetMinutes / 1440 * 100;
          const dayWidthPercent = sunsetPercent - sunrisePercent;
          return (
            <div
              className={styles.dayBar}
              style={{
                left: `${sunrisePercent}%`,
                width: `${dayWidthPercent}%`
              }}
            ></div>
          );
        })()}
        {/* Sun indicator only when sun is up */}
        {(now >= sunriseDate && now <= sunsetDate) && (
          <div
            className="absolute top-1/2 z-20 -translate-y-1/2"
            style={{ left: `calc(${dayProgress}% - 0.75rem)` }}
          >
            <span className={styles.sunPulse + " block w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-400 border-2 border-yellow-400"} aria-label="Current sun position" role="img"></span>
          </div>
        )}
        {/* Sunrise icon */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center z-30" style={{transform: 'translateY(-130%)'}}>
          <span role="img" aria-label="Sunrise" className="text-yellow-300 text-xl">🌅</span>
          <span className="text-xs text-yellow-100 mt-1">{formatTimeWithFormat(sunrise, timeFormat)}</span>
        </div>
        {/* Sunset icon */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center z-30" style={{transform: 'translateY(-130%)'}}>
          <span role="img" aria-label="Sunset" className="text-indigo-200 text-xl">🌇</span>
          <span className="text-xs text-indigo-100 mt-1">{formatTimeWithFormat(sunset, timeFormat)}</span>
        </div>
      </div>

      <div className={styles.timeLabels + ' max-w-lg mx-auto'}>
        <div className={styles.sunriseLabel}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={styles.sunriseIcon}
          >
            <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
          </svg>
          <span className={styles.timeLabel}>Sunrise</span>
        </div>

        <div className={styles.sunsetLabel}>
          <span className={styles.timeLabel}>Sunset</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={styles.sunsetIcon}
          >
            <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default SunriseSunset;
