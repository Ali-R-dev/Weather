import React from "react";
// Keep original CSS for animations
import "./WeatherEffects.css";
// Use CSS modules for component styles
import styles from "./WeatherEffects.module.css";

export const RainEffect = ({ intensity = "medium", isDay = true }) => {
  return (
    <div className={styles.weatherScene}>
      <div
        className={`${styles.rainContainer} ${
          isDay ? "" : "night"
        } ${intensity}`}
      >
        <div className={styles.rain}>{/* ...existing code... */}</div>
        <div className={`${styles.rain} ${styles.backRow}`}>
          {/* ...existing code... */}
        </div>
      </div>
    </div>
  );
};

export const SnowEffect = ({ intensity = "medium", isDay = true }) => {
  return (
    <div className={styles.weatherScene}>
      <div
        className={`${styles.snowflakes} ${isDay ? "" : "night"} ${intensity}`}
      >
        {/* ...existing code... */}
      </div>
    </div>
  );
};

export const FogEffect = ({ intensity = "medium", isDay = true }) => {
  return (
    <div className={styles.weatherScene}>
      <div
        className={`${styles.fogContainer} ${
          isDay ? "" : "night"
        } ${intensity}`}
      >
        {/* ...existing code with appropriate style classes... */}
      </div>
    </div>
  );
};

export const SunnyEffect = () => {
  return (
    <div className={styles.weatherScene}>
      <div className={styles.sunnyContainer}>
        <div className={styles.sunRays}></div>
        {/* ...existing code... */}
      </div>
    </div>
  );
};

export const NightClearEffect = () => {
  return (
    <div className={styles.weatherScene}>
      <div className={styles.nightClearContainer}>
        {/* Stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className={styles.star}
            style={
              {
                // ...existing style...
              }
            }
          />
        ))}
      </div>
    </div>
  );
};

export const CloudyEffect = ({ isDay = true }) => {
  return (
    <div className={styles.weatherScene}>
      <div className={`${styles.cloudyContainer} ${isDay ? "" : "night"}`}>
        {/* ...existing code with appropriate style classes... */}
      </div>
    </div>
  );
};

export const StormyEffect = ({ isDay = true }) => {
  return (
    <div className={styles.weatherScene}>
      <div className={`${styles.stormyContainer} ${isDay ? "" : "night"}`}>
        {/* ...existing code... */}
        <div className={styles.lightningFlash}></div>
      </div>
    </div>
  );
};
