import React from "react";
import { motion } from "framer-motion";
import styles from "./WeatherIcon.module.css";
import SunIcon from "./WeatherIcon/icons/SunIcon";
import MoonIcon from "./WeatherIcon/icons/MoonIcon";
import { IconSize } from "./WeatherIcon/icons/IconTypes";

interface WeatherIconProps {
  type: string;
  size?: IconSize;
  className?: string;
  animated?: boolean;
  withGlow?: boolean;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
  type,
  size = "medium",
  className = "",
  animated = false,
  withGlow = false,
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

  const baseClass = `${styles.icon} ${getIconSizeClass()} ${animated ? styles.animated : ""} ${className}`;

  // Render the appropriate icon based on the type
  const renderIcon = () => {
    const iconClass = `${baseClass} ${getIconColorClass(type)}`;
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
          >
            <path d="M19 18a4 4 0 100-8 5.5 5.5 0 00-10.9 1.5A4.5 4.5 0 006 21h13a3 3 0 000-6z" />
          </svg>
        );
      case "partly-cloudy":
      case "partly-cloudy-day":
      case "cloud-sun":
        return (
          <span className="relative inline-block">
            {/* Sun should always be yellow */}
            <SunIcon className={baseClass + " " + styles.sunny + " absolute left-1 top-1 z-0"} type="sun" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={iconClass + " relative z-10 " + styles.cloudy}
              style={{ marginLeft: "16px" }}
            >
              <path d="M19 18a4 4 0 100-8 5.5 5.5 0 00-10.9 1.5A4.5 4.5 0 006 21h13a3 3 0 000-6z" />
            </svg>
          </span>
        );
      case "partly-cloudy-night":
      case "cloud-moon":
        return (
          <span className="relative inline-block">
            <MoonIcon className={iconClass + " absolute left-1 top-1 z-0"} type="moon" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={iconClass + " relative z-10"}
              style={{ marginLeft: "16px" }}
            >
              <path d="M19 18a4 4 0 100-8 5.5 5.5 0 00-10.9 1.5A4.5 4.5 0 006 21h13a3 3 0 000-6z" />
            </svg>
          </span>
        );
      case "cloud-rain":
      case "rain":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={iconClass}
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
            className={`${baseClass} ${styles.cloudy}`}
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
