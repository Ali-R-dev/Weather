import React from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.css";
// Fix this import path to point to the correct location
import {
  WeatherIconProps,
  getGlowColor,
  getIconColorClass,
} from "../icons/IconTypes";

// Import individual icon components
import SunIcon from "../icons/SunIcon";
import MoonIcon from "../icons/MoonIcon";
// Import additional icons as needed

const WeatherIcon: React.FC<WeatherIconProps> = ({
  type,
  size = "medium",
  className = "",
  animated = false,
  withGlow = false,
}) => {
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

  // Combine classes
  const baseClass = `${styles.icon} ${getIconSizeClass()} ${
    animated ? styles.animated : ""
  } ${className}`;

  const IconWrapper = ({ children }: { children: React.ReactNode }) => {
    if (animated || withGlow) {
      return (
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
          style={{
            display: "inline-block",
            filter: getGlowColor(type, withGlow),
          }}
        >
          {children}
        </motion.div>
      );
    }

    return <>{children}</>;
  };

  // Render the appropriate icon based on the type
  const renderIcon = () => {
    const iconClass = `${baseClass} ${getIconColorClass(type)}`;

    switch (type) {
      case "sun":
      case "clear-day":
        return <SunIcon className={iconClass} type={type} />;

      case "moon":
      case "clear-night":
        return <MoonIcon className={iconClass} type={type} />;

      // Add cases for other icon types
      // case "cloud":
      // case "cloudy":
      //   return <CloudIcon className={iconClass} />;

      default:
        // Fallback to a generic cloud icon
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={iconClass}
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

  return <IconWrapper>{renderIcon()}</IconWrapper>;
};

export default WeatherIcon;
