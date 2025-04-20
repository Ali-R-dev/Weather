import React from "react";
import styles from "./WeatherIcon.module.css";
import SunIcon from "./WeatherIcon/icons/SunIcon";
import MoonIcon from "./WeatherIcon/icons/MoonIcon";
import { IconSize } from "./WeatherIcon/icons/IconTypes";
import { clsx } from "./clsx";

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
  const renderIcon = () => {
    const iconClass = clsx(baseClass, getIconColorClass(type));
    switch (type) {
      case "sun":
      case "clear":
      case "clear-day":
        return <SunIcon className={iconClass} type={type} />;
      case "moon":
      case "clear-night":
        return <MoonIcon className={iconClass} type={type} />;
      case "cloud":
      case "cloudy":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={iconClass}
            role="img"
            aria-label="Cloudy"
          >
            <path d="M19 18a4 4 0 100-8 5.5 5.5 0 00-10.9 1.5A4.5 4.5 0 006 21h13a3 3 0 000-6z" />
          </svg>
        );
      case "partly-cloudy":
      case "partly-cloudy-day":
      case "cloud-sun": {
        // Sun should peek out from behind the cloud, offset for best visual balance
        // Sun is partially visible, not hidden, with a soft glow
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
        return (
          <span
            className="relative inline-block"
            role="img"
            aria-label="Partly cloudy"
            style={{ width: compositeSize.container, height: compositeSize.container, display: 'inline-block' }}
          >
            {/* Sun peeking out from behind cloud, visually balanced */}
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
            aria-label="Partly cloudy night"
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
      case "cloud-rain":
      case "rain":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={iconClass}
            role="img"
            aria-label="Rain"
          >
            <path d="M19 18a4 4 0 100-8 5.5 5.5 0 00-10.9 1.5A4.5 4.5 0 006 21h13a3 3 0 000-6z" />
            <line x1="8" y1="22" x2="8" y2="18" stroke="#60A5FA" strokeWidth="2" />
            <line x1="12" y1="22" x2="12" y2="18" stroke="#60A5FA" strokeWidth="2" />
            <line x1="16" y1="22" x2="16" y2="18" stroke="#60A5FA" strokeWidth="2" />
          </svg>
        );
      case "cloud-snow":
      case "snow":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={iconClass}
            role="img"
            aria-label="Snow"
          >
            <path d="M19 18a4 4 0 100-8 5.5 5.5 0 00-10.9 1.5A4.5 4.5 0 006 21h13a3 3 0 000-6z" />
            <circle cx="8" cy="21" r="1" fill="#E5E7EB" />
            <circle cx="12" cy="21" r="1" fill="#E5E7EB" />
            <circle cx="16" cy="21" r="1" fill="#E5E7EB" />
          </svg>
        );
      case "cloud-lightning":
      case "thunderstorm":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={iconClass}
            role="img"
            aria-label="Thunderstorm"
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
            role="img"
            aria-label="Fog"
          >
            <path d="M19 18a4 4 0 100-8 5.5 5.5 0 00-10.9 1.5A4.5 4.5 0 006 21h13a3 3 0 000-6z" />
            <line x1="6" y1="22" x2="18" y2="22" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="6" y1="20" x2="18" y2="20" stroke="#CBD5E1" strokeWidth="2" />
          </svg>
        );
      default:
        // Fallback to a neutral gray cloud icon, never yellow
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={clsx(baseClass, styles.cloudy)}
            role="img"
            aria-label="Cloud"
          >
            <path
              fillRule="evenodd"
              d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return renderIcon();
};

export default WeatherIcon;
