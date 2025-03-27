import React from "react";
import { motion } from "framer-motion";
import { TimeFormat } from "../../../../context/SettingsContext";
import { formatTimeWithFormat } from "../../../../utils/formatting";
import styles from "./styles.module.css";

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
      className={styles.container}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Day Length</h3>
        <div className={styles.dayLength}>
          {dayLengthHours}h {dayLengthMinutes}m
        </div>
      </div>

      {/* Day progress bar container */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressContainer}>
          {/* Progress track */}
          <div
            className={styles.progressBar}
            style={{ width: `${dayProgress}%` }}
          ></div>

          {/* Time markers */}
          <div className={styles.timeMarkers}>
            <div className={styles.sunriseMarker}></div>
            <div className={styles.noonMarker}></div>
            <div className={styles.sunsetMarker}></div>
          </div>

          {/* Sunrise indicator */}
          <div className={styles.sunriseIndicator}>
            <div className={styles.timeIndicator}></div>
            <div className={styles.verticalLine}></div>
            <div className={styles.timeText}>
              {formatTimeWithFormat(sunrise, timeFormat)}
            </div>
          </div>

          {/* Sunset indicator */}
          <div className={styles.sunsetIndicator}>
            <div
              className={`${styles.timeIndicator} ${styles.sunsetTimeIndicator}`}
            ></div>
            <div className={styles.verticalLine}></div>
            <div className={styles.timeText}>
              {formatTimeWithFormat(sunset, timeFormat)}
            </div>
          </div>

          {/* Sun position indicator */}
          <div
            className={styles.sunIndicator}
            style={{ left: `${dayProgress}%` }}
          >
            <div className={styles.sunWrapper}>
              {dayProgress > 0 && dayProgress < 100 && (
                <>
                  <div className={styles.sunGlow}></div>
                  <div className={styles.sunInnerGlow}></div>
                </>
              )}
              <div
                className={`${styles.sunCircle} ${
                  dayProgress > 0 && dayProgress < 100
                    ? styles.activeSun
                    : styles.inactiveSun
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.timeLabels}>
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

      {dayProgress > 0 && dayProgress < 100 ? (
        <div className={styles.statusIndicator}>
          <div className={styles.sunIsUp}>☀️ Sun is currently up</div>
        </div>
      ) : dayProgress === 0 ? (
        <div className={styles.statusIndicator}>
          <div className={styles.sunIsDown}>🌙 Before sunrise</div>
        </div>
      ) : (
        <div className={styles.statusIndicator}>
          <div className={styles.sunIsDown}>🌙 After sunset</div>
        </div>
      )}
    </motion.div>
  );
};

export default SunriseSunset;
