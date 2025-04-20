import React from "react";
import styles from "./WeatherIcon.module.css";
import SunIcon from "./WeatherIcon/icons/SunIcon";
import MoonIcon from "./WeatherIcon/icons/MoonIcon";
import { IconSize } from "./WeatherIcon/icons/IconTypes";
import { clsx } from "./clsx";
import { motion } from 'framer-motion';

interface WeatherIconProps {
  type: string;
  size?: IconSize;
  className?: string;
  animated?: boolean;
  // withGlow?: boolean; // Remove if not used
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
  type,
  size = "medium",
  className = "",
  animated = false,
}) => {
  // Debug: Log the icon type to trace yellow cloud bugs
  console.log("WeatherIcon type: ", type);

  // Get base class for icon size
  const getIconSizeClass = (): string => {
    switch (size) {
      case "small":
        return styles.small;
      case "medium":
        return styles.medium;
      case "large":
        return styles.large;
      case "xlarge":
        return styles.xlarge;
      default:
        return styles.medium;
    }
  };

  // Get icon color class based on type
  const getIconColorClass = (type: string): string => {
    if (type === "sun" || type === "clear" || type === "clear-day") return styles.sunny;
    if (type === "moon" || type === "clear-night") return styles.clearNight;
    if (type.includes("cloud") && !type.includes("night") && !type.includes("sun")) return styles.cloudy;
    if (type === "cloud-sun" || type === "partly-cloudy" || type === "partly-cloudy-day") return styles.partlyCloudy;
    if (type === "cloud-moon" || type === "partly-cloudy-night") return styles.partlyCloudyNight;
    if (type.includes("rain")) return styles.rainy;
    if (type.includes("snow")) return styles.snowy;
    if (type.includes("thunder") || type.includes("lightning")) return styles.stormy;
    if (type.includes("fog")) return styles.foggy;
    return "";
  };

  const baseClass = clsx(styles.icon, getIconSizeClass(), animated && styles.animated, className);

  // Render the appropriate icon based on the type
  const renderIcon = (iconType: string) => {
    const iconClass = clsx(baseClass, getIconColorClass(iconType));
    const ariaLabel = (() => {
      switch (iconType) {
        case "sun":
        case "clear":
        case "clear-day":
          return "Sunny";
        case "moon":
        case "clear-night":
          return "Clear night";
        case "cloud":
        case "cloudy":
          return "Cloudy";
        case "partly-cloudy":
        case "partly-cloudy-day":
        case "cloud-sun":
          return "Partly cloudy";
        case "partly-cloudy-night":
        case "cloud-moon":
          return "Partly cloudy night";
        case "rain":
        case "cloud-rain":
          return "Rain";
        case "snow":
        case "cloud-snow":
          return "Snow";
        case "cloud-lightning":
        case "thunderstorm":
          return "Thunderstorm";
        case "fog":
        case "cloud-fog":
          return "Foggy";
        case "wind":
          return "Windy";
        case "hail":
          return "Hail";
        default:
          return "Weather icon";
      }
    })();
    switch (iconType) {
      case "sun":
      case "clear":
      case "clear-day":
        return <SunIcon className={iconClass} type={iconType} aria-label={ariaLabel} role="img" />;
      case "moon":
      case "clear-night":
        return <MoonIcon className={iconClass} type={iconType} aria-label={ariaLabel} role="img" />;
      case "cloud":
      case "cloudy":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={iconClass}
            aria-label={ariaLabel}
            role="img"
            style={{ width: '100%', height: '100%' }}
          >
            <path d="M19 18a4 4 0 100-8 5.5 5.5 0 00-10.9 1.5A4.5 4.5 0 006 21h13a3 3 0 000-6z" />
          </svg>
        );
      case "partly-cloudy":
      case "partly-cloudy-day":
      case "cloud-sun": {
        // Sun and cloud are animated for a lively effect
        const sizeMap = {
          small: { container: '1.75rem', sun: '1.1rem', cloud: '1.25rem', sunLeft: '8%', sunTop: '10%', cloudLeft: '24%', cloudTop: '8%' },
          medium: { container: '2.75rem', sun: '1.7rem', cloud: '2rem', sunLeft: '12%', sunTop: '13%', cloudLeft: '29%', cloudTop: '8%' },
          large: { container: '3.5rem', sun: '2.2rem', cloud: '2.7rem', sunLeft: '15%', sunTop: '16%', cloudLeft: '33%', cloudTop: '10%' },
          xlarge: { container: '5rem', sun: '3rem', cloud: '3.8rem', sunLeft: '19%', sunTop: '18%', cloudLeft: '37%', cloudTop: '12%' }
        };
        let key: keyof typeof sizeMap = 'medium';
        if (getIconSizeClass() === styles.small) key = 'small';
        else if (getIconSizeClass() === styles.large) key = 'large';
        else if (getIconSizeClass() === styles.xlarge) key = 'xlarge';
        const compositeSize = sizeMap[key];
        // Use Framer Motion for cloud drift animation
        return (
          <span
            className="relative inline-block"
            role="img"
            aria-label={ariaLabel}
            style={{ width: compositeSize.container, height: compositeSize.container, display: 'inline-block' }}
          >
            {/* Sun peeking out from behind cloud, visually balanced, animated rays */}
            <span
              style={{
                position: 'absolute',
                left: compositeSize.sunLeft,
                top: compositeSize.sunTop,
                zIndex: 0,
                width: compositeSize.sun,
                height: compositeSize.sun,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.97,
                filter: 'drop-shadow(0 0 8px #ffe066) drop-shadow(0 0 16px #ffe06666)'
              }}
            >
              <SunIcon className={clsx(baseClass, styles.sunny)} type="sun" />
            </span>
            {/* Animated drifting cloud */}
            <motion.span
              style={{
                position: 'absolute',
                left: compositeSize.cloudLeft,
                top: compositeSize.cloudTop,
                zIndex: 1,
                width: compositeSize.cloud,
                height: compositeSize.cloud,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 1px 2px #d1d5db66)'
              }}
              initial={{ x: 0 }}
              animate={{ x: [0, 4, 0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={clsx(iconClass, styles.cloudy)}
                aria-label="Cloud"
                style={{ width: '100%', height: '100%' }}
              >
                <path d="M19 18a4 4 0 100-8 5.5 5.5 0 00-10.9 1.5A4.5 4.5 0 006 21h13a3 3 0 000-6z" />
              </svg>
            </motion.span>
          </span>
        );
      }
      case "partly-cloudy-night":
      case "cloud-moon": {
        // Improved composite icon sizing and overlap for best UI/UX
        const sizeMap = {
          small: { container: '1.75rem', moon: '0.8rem', cloud: '1.25rem', moonLeft: '2%', moonTop: '18%', cloudLeft: '28%', cloudTop: '8%' },
          medium: { container: '2.75rem', moon: '1.1rem', cloud: '2rem', moonLeft: '4%', moonTop: '20%', cloudLeft: '32%', cloudTop: '8%' },
          large: { container: '3.5rem', moon: '1.5rem', cloud: '2.7rem', moonLeft: '6%', moonTop: '22%', cloudLeft: '34%', cloudTop: '10%' },
          xlarge: { container: '5rem', moon: '2.1rem', cloud: '3.8rem', moonLeft: '8%', moonTop: '24%', cloudLeft: '36%', cloudTop: '12%' }
        };
        let key: keyof typeof sizeMap = 'medium';
        if (getIconSizeClass() === styles.small) key = 'small';
        else if (getIconSizeClass() === styles.large) key = 'large';
        else if (getIconSizeClass() === styles.xlarge) key = 'xlarge';
        const compositeSize = sizeMap[key];
        return (
          <span
            className="relative inline-block"
            role="img"
            aria-label={ariaLabel}
            style={{ width: compositeSize.container, height: compositeSize.container, display: 'inline-block' }}
          >
            <span
              style={{
                position: 'absolute',
                left: compositeSize.moonLeft,
                top: compositeSize.moonTop,
                zIndex: 0,
                width: compositeSize.moon,
                height: compositeSize.moon,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.93
              }}
            >
              <MoonIcon className={clsx(baseClass, styles.clearNight)} type="moon" />
            </span>
            <span
              style={{
                position: 'absolute',
                left: compositeSize.cloudLeft,
                top: compositeSize.cloudTop,
                zIndex: 1,
                width: compositeSize.cloud,
                height: compositeSize.cloud,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 1px 2px #d1d5db66)'
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={clsx(iconClass, styles.cloudy)}
                aria-label="Cloud"
                style={{ width: '100%', height: '100%' }}
              >
                <path d="M19 18a4 4 0 100-8 5.5 5.5 0 00-10.9 1.5A4.5 4.5 0 006 21h13a3 3 0 000-6z" />
              </svg>
            </span>
          </span>
        );
      }
      case "rain":
      case "cloud-rain": {
        // Animated rain drops falling from cloud
        const sizeMap = {
          small: { container: '1.75rem', cloud: '1.3rem', drop: '0.18rem', cloudLeft: '18%', cloudTop: '8%', dropLeft: '38%', dropTop: '60%' },
          medium: { container: '2.75rem', cloud: '2.1rem', drop: '0.28rem', cloudLeft: '23%', cloudTop: '8%', dropLeft: '43%', dropTop: '61%' },
          large: { container: '3.5rem', cloud: '2.7rem', drop: '0.36rem', cloudLeft: '27%', cloudTop: '10%', dropLeft: '47%', dropTop: '62%' },
          xlarge: { container: '5rem', cloud: '3.8rem', drop: '0.52rem', cloudLeft: '32%', cloudTop: '12%', dropLeft: '52%', dropTop: '63%' }
        };
        let key: keyof typeof sizeMap = 'medium';
        if (getIconSizeClass() === styles.small) key = 'small';
        else if (getIconSizeClass() === styles.large) key = 'large';
        else if (getIconSizeClass() === styles.xlarge) key = 'xlarge';
        const compositeSize = sizeMap[key];
        return (
          <span
            className="relative inline-block"
            role="img"
            aria-label={ariaLabel}
            style={{ width: compositeSize.container, height: compositeSize.container, display: 'inline-block' }}
          >
            {/* Cloud */}
            <span
              style={{
                position: 'absolute',
                left: compositeSize.cloudLeft,
                top: compositeSize.cloudTop,
                zIndex: 1,
                width: compositeSize.cloud,
                height: compositeSize.cloud,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 1px 2px #d1d5db66)'
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={clsx(iconClass, styles.cloudy)}
                aria-label="Cloud"
                style={{ width: '100%', height: '100%' }}
              >
                <path d="M19 18a4 4 0 100-8 5.5 5.5 0 00-10.9 1.5A4.5 4.5 0 006 21h13a3 3 0 000-6z" />
              </svg>
            </span>
            {/* Animated rain drops */}
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                style={{
                  position: 'absolute',
                  left: `calc(${compositeSize.dropLeft} + ${i * 0.4}rem)`,
                  top: compositeSize.dropTop,
                  zIndex: 0,
                  width: compositeSize.drop,
                  height: `calc(${compositeSize.drop} * 2.5)`,
                  display: 'block',
                  borderRadius: '50%',
                  background: 'linear-gradient(to bottom, #60A5FA 60%, #2563eb 100%)',
                  opacity: 0.7 - i * 0.15
                }}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: [0, 14, 0], opacity: [0.7 - i * 0.15, 1, 0.7 - i * 0.15] }}
                transition={{ duration: 1.2 + i * 0.25, repeat: Infinity, delay: i * 0.16, repeatType: 'loop', ease: 'easeInOut' }}
              />
            ))}
          </span>
        );
      }
      case "snow":
      case "cloud-snow": {
        // Animated snowflakes falling from cloud
        const sizeMap = {
          small: { container: '1.75rem', cloud: '1.3rem', flake: '0.18rem', cloudLeft: '18%', cloudTop: '8%', flakeLeft: '38%', flakeTop: '60%' },
          medium: { container: '2.75rem', cloud: '2.1rem', flake: '0.28rem', cloudLeft: '23%', cloudTop: '8%', flakeLeft: '43%', flakeTop: '61%' },
          large: { container: '3.5rem', cloud: '2.7rem', flake: '0.36rem', cloudLeft: '27%', cloudTop: '10%', flakeLeft: '47%', flakeTop: '62%' },
          xlarge: { container: '5rem', cloud: '3.8rem', flake: '0.52rem', cloudLeft: '32%', cloudTop: '12%', flakeLeft: '52%', flakeTop: '63%' }
        };
        let key: keyof typeof sizeMap = 'medium';
        if (getIconSizeClass() === styles.small) key = 'small';
        else if (getIconSizeClass() === styles.large) key = 'large';
        else if (getIconSizeClass() === styles.xlarge) key = 'xlarge';
        const compositeSize = sizeMap[key];
        return (
          <span
            className="relative inline-block"
            role="img"
            aria-label={ariaLabel}
            style={{ width: compositeSize.container, height: compositeSize.container, display: 'inline-block' }}
          >
            {/* Cloud */}
            <span
              style={{
                position: 'absolute',
                left: compositeSize.cloudLeft,
                top: compositeSize.cloudTop,
                zIndex: 1,
                width: compositeSize.cloud,
                height: compositeSize.cloud,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 1px 2px #d1d5db66)'
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={clsx(iconClass, styles.cloudy)}
                aria-label="Cloud"
                style={{ width: '100%', height: '100%' }}
              >
                <path d="M19 18a4 4 0 100-8 5.5 5.5 0 00-10.9 1.5A4.5 4.5 0 006 21h13a3 3 0 000-6z" />
              </svg>
            </span>
            {/* Animated snowflakes */}
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                style={{
                  position: 'absolute',
                  left: `calc(${compositeSize.flakeLeft} + ${i * 0.4}rem)`,
                  top: compositeSize.flakeTop,
                  zIndex: 0,
                  width: compositeSize.flake,
                  height: compositeSize.flake,
                  display: 'block',
                  borderRadius: '50%',
                  background: 'linear-gradient(to bottom, #f9fafb 60%, #dbeafe 100%)',
                  opacity: 0.7 - i * 0.15
                }}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: [0, 14, 0], opacity: [0.7 - i * 0.15, 1, 0.7 - i * 0.15], x: [0, i === 1 ? 2 : -2, 0] }}
                transition={{ duration: 1.8 + i * 0.3, repeat: Infinity, delay: i * 0.16, repeatType: 'loop', ease: 'easeInOut' }}
              />
            ))}
          </span>
        );
      }
      case "cloud-lightning":
      case "thunderstorm":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={iconClass}
            aria-label={ariaLabel}
            role="img"
          >
            <path d="M19 18a4 4 0 100-8 5.5 5.5 0 00-10.9 1.5A4.5 4.5 0 006 21h13a3 3 0 000-6z" />
            <polygon points="13,21 11,21 12,18 10,18 13,13 12,16 14,16" fill="#F59E0B" />
          </svg>
        );
      case "cloud-fog":
      case "fog":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={iconClass}
            aria-label={ariaLabel}
            role="img"
          >
            <path d="M19 18a4 4 0 100-8 5.5 5.5 0 00-10.9 1.5A4.5 4.5 0 006 21h13a3 3 0 000-6z" />
            <line x1="6" y1="22" x2="18" y2="22" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="6" y1="20" x2="18" y2="20" stroke="#CBD5E1" strokeWidth="2" />
          </svg>
        );
      default:
        // Fallback to a neutral gray cloud icon, never yellow
        return (
          <span role="img" aria-label={ariaLabel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={clsx(baseClass, styles.cloudy)}
              style={{ width: '100%', height: '100%' }}
            >
              <path
                fillRule="evenodd"
                d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        );
    }
  };

  const [prevType, setPrevType] = React.useState(type);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    if (type !== prevType) {
      setIsTransitioning(true);
      const timeout = setTimeout(() => {
        setPrevType(type);
        setIsTransitioning(false);
      }, 350); // Duration matches fade-out
      return () => clearTimeout(timeout);
    }
  }, [type, prevType]);

  return (
    <span
      className={className}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      {/* Previous icon fading out */}
      {isTransitioning && (
        <motion.span
          key={prevType}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {renderIcon(prevType)}
        </motion.span>
      )}
      {/* Current icon fading in */}
      <motion.span
        key={type}
        initial={{ opacity: isTransitioning ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        style={{ position: isTransitioning ? 'absolute' : 'relative', inset: 0 }}
      >
        {renderIcon(type)}
      </motion.span>
    </span>
  );
};

export default WeatherIcon;
