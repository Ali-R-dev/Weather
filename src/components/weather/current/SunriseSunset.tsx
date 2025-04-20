import React from "react";
import { motion } from "framer-motion";
import { TimeFormat } from "../../../context/SettingsContext";
import { formatTimeWithFormat } from "../../../utils/formatting";
import styles from "./SunriseSunset.module.css";
import SunIcon from "../shared/WeatherIcon/icons/SunIcon";
import MoonIcon from "../shared/WeatherIcon/icons/MoonIcon";

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
  const isDay = now >= sunriseDate && now <= sunsetDate;

  if (isDay) {
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
        <div className="text-sm font-semibold bg-white/10 px-3 py-1 rounded-full border border-yellow-200/30 text-yellow-100 shadow">
          {dayLengthHours}h {dayLengthMinutes}m
        </div>
      </div>

      {/* Day/Night progress bar with sun/moon indicator */}
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
                width: `${dayWidthPercent}%`,
                boxShadow: '0 0 24px 6px #fde68a88, 0 0 0px 0px #fff0',
                border: '2px solid #fde68a88'
              }}
            ></div>
          );
        })()}
        {/* Sun or Moon indicator */}
        <div
          className="absolute top-1/2 z-30 -translate-y-1/2"
          style={{ left: `calc(${dayProgress}% - 1.2rem)` }}
        >
          {isDay ? (
            <span className={styles.sunPulse + " flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-400 border-2 border-yellow-400 shadow-lg"} aria-label="Current sun position" role="img">
              <SunIcon className="w-6 h-6 text-yellow-400" type="sun" />
            </span>
          ) : (
            <span className={styles.moonPulse + " flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-300 via-indigo-400 to-blue-400 border-2 border-indigo-300 shadow-lg"} aria-label="Current moon position" role="img">
              <MoonIcon className="w-6 h-6 text-indigo-200" type="moon" />
            </span>
          )}
        </div>
        {/* Sunrise icon */}
        <div className="absolute left-0 top-1/2 flex flex-col items-center z-30" style={{transform: 'translateY(-135%)'}}>
          <SunIcon className="w-6 h-6 text-yellow-200 drop-shadow" type="sun" />
          <span className="text-xs text-yellow-100 mt-1 font-semibold tracking-wide">{formatTimeWithFormat(sunrise, timeFormat)}</span>
        </div>
        {/* Sunset icon */}
        <div className="absolute right-0 top-1/2 flex flex-col items-center z-30" style={{transform: 'translateY(-135%)'}}>
          <SunIcon className="w-6 h-6 text-indigo-200 drop-shadow rotate-180" type="sun" />
          <span className="text-xs text-indigo-100 mt-1 font-semibold tracking-wide">{formatTimeWithFormat(sunset, timeFormat)}</span>
        </div>
      </div>
      {/* Labels */}
      <div className={styles.timeLabels + ' max-w-lg mx-auto flex justify-between mt-2 w-full'}>
        <div className={styles.sunriseLabel + " flex flex-col items-center"}>
          <span className={styles.timeLabel + " text-yellow-200 font-semibold"}>Sunrise</span>
        </div>
        <div className={styles.sunsetLabel + " flex flex-col items-center"}>
          <span className={styles.timeLabel + " text-indigo-200 font-semibold"}>Sunset</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SunriseSunset;
