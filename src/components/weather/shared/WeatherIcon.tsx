import React from "react";
import { motion } from "framer-motion";
import styles from "./WeatherIcon.module.css";
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
  const getIconColorClass = (): string => {
    if (type.includes("sun")) return styles.sunny;
    if (type.includes("cloud") && !type.includes("night")) return styles.cloudy;
    if (type.includes("rain")) return styles.rainy;
    if (type.includes("snow")) return styles.snowy;
    if (type.includes("thunder") || type.includes("lightning"))
      return styles.stormy;
    if (type.includes("fog")) return styles.foggy;
    if (type.includes("night") || type.includes("moon"))
      return styles.clearNight;
    if (type === "partly-cloudy-day") return styles.partlyCloudy;
    if (type === "partly-cloudy-night") return styles.partlyCloudyNight;
    return "";
  };

  // Get glow effect styling
  const getGlowStyle = () => {
    if (!withGlow) return {};

    if (type.includes("sun"))
      return { filter: "0 0 20px rgba(250, 204, 21, 0.5)" };
    if (type.includes("cloud-rain"))
      return { filter: "0 0 20px rgba(96, 165, 250, 0.3)" };
    if (type.includes("cloud-snow"))
      return { filter: "0 0 20px rgba(226, 232, 240, 0.3)" };
    if (type.includes("cloud-lightning"))
      return { filter: "0 0 20px rgba(250, 204, 21, 0.4)" };

    return { filter: "0 0 20px rgba(255, 255, 255, 0.3)" };
  };

  // Combine classes
  const iconClass = `${
    styles.icon
  } ${getIconSizeClass()} ${getIconColorClass()} ${
    animated ? styles.animated : ""
  } ${className}`;

  // Render the icon with animation wrapper if needed
  const renderIcon = () => {
    // Default icon (cloud) when type not found
    const iconSvg = (
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

    if (animated || withGlow) {
      return (
        <motion.div
          animate={animated ? { y: [0, -4, 0] } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={getGlowStyle()}
        >
          {iconSvg}
        </motion.div>
      );
    }

    return iconSvg;
  };

  return renderIcon();
};

export default WeatherIcon;
