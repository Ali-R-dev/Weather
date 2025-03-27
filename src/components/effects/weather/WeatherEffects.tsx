import "./WeatherEffects.css";
import styles from "./WeatherEffects.module.css";

export const RainEffect = ({ intensity = "medium", isDay = true }) => {
  return (
    <div className={styles.weatherScene}>
      <div
        className={`${styles.rainContainer} ${
          intensity === "light" ? styles.light : ""
        } ${intensity === "heavy" ? styles.heavy : ""} ${
          !isDay ? styles.night : ""
        }`}
      >
        {/* Generate raindrops */}
        {Array.from({
          length:
            intensity === "heavy" ? 100 : intensity === "medium" ? 70 : 40,
        }).map((_, i) => (
          <div
            key={`raindrop-${i}`}
            className={styles.drop}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 0.3}s`,
            }}
          >
            <div className={styles.stem}></div>
            <div className={styles.splat}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SnowEffect = ({ intensity = "medium", isDay = true }) => {
  return (
    <div className={styles.weatherScene}>
      <div
        className={`${styles.snowContainer} ${
          intensity === "light" ? styles.light : ""
        } ${intensity === "heavy" ? styles.heavy : ""} ${
          !isDay ? styles.night : ""
        }`}
      >
        {/* Generate snowflakes */}
        {Array.from({
          length:
            intensity === "heavy" ? 100 : intensity === "medium" ? 70 : 40,
        }).map((_, i) => (
          <div
            key={`snowflake-${i}`}
            className={styles.snowflake}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              opacity: 0.7 + Math.random() * 0.3,
              fontSize: `${8 + Math.random() * 10}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>
    </div>
  );
};

export const FogEffect = ({ isDay = true }) => {
  return (
    <div className={styles.weatherScene}>
      <div className={`${styles.fogContainer} ${!isDay ? styles.night : ""}`}>
        {/* Generate fog layers */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`fog-${i}`}
            className={styles.fogLayer}
            style={{
              opacity: 0.3 + i * 0.1,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 5}s`,
              top: `${10 + i * 20}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const SunnyEffect = () => {
  return (
    <div className={styles.weatherScene}>
      <div className={styles.sunContainer}>
        <div className={styles.sun}>
          <div className={styles.sunCore}></div>
          <div
            className={styles.sunRay}
            style={{ transform: "rotate(0deg)" }}
          ></div>
          <div
            className={styles.sunRay}
            style={{ transform: "rotate(45deg)" }}
          ></div>
          <div
            className={styles.sunRay}
            style={{ transform: "rotate(90deg)" }}
          ></div>
          <div
            className={styles.sunRay}
            style={{ transform: "rotate(135deg)" }}
          ></div>
        </div>
        <div className={styles.sunGlow}></div>
      </div>
    </div>
  );
};

export const NightClearEffect = () => {
  return (
    <div className={styles.weatherScene}>
      <div className={styles.nightSkyContainer}>
        {/* Generate stars */}
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className={styles.star}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3 + Math.random() * 0.7,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
            }}
          />
        ))}
        <div className={styles.moon}></div>
      </div>
    </div>
  );
};

export const CloudyEffect = ({ isDay = true }) => {
  return (
    <>
      <div className={styles.weatherScene}></div>
      <div className={`${styles.cloudContainer} ${!isDay ? styles.night : ""}`}>
        {/* Generate clouds */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`cloud-${i}`}
            className={styles.cloud}
            style={{
              left: `${i * 20 - 10}%`,
              top: `${20 + i * 10}%`,
              opacity: 0.7 + i * 0.05,
              transform: `scale(${0.8 + i * 0.2})`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + i * 10}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export const StormyEffect = ({ isDay = true }) => {
  return (
    <>
      <div className={styles.weatherScene}></div>
      <div className={`${styles.stormContainer} ${!isDay ? styles.night : ""}`}>
        {/* Generate storm clouds */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`storm-cloud-${i}`}
            className={styles.stormCloud}
            style={{
              left: `${i * 20 - 10}%`,
              top: `${15 + i * 8}%`,
              opacity: 0.7 + i * 0.05,
              transform: `scale(${0.8 + i * 0.2})`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 10}s`,
            }}
          />
        ))}

        {/* Lightning flashes */}
        <div className={styles.lightning}></div>
      </div>
    </>
  );
};
