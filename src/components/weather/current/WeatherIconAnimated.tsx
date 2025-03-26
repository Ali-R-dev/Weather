import React from "react";
import { motion } from "framer-motion";
import WeatherIcon from "../shared/WeatherIcon";

interface WeatherIconAnimatedProps {
  icon: string;
}

const WeatherIconAnimated: React.FC<WeatherIconAnimatedProps> = ({ icon }) => {
  const getBackgroundColor = () => {
    if (icon.includes("sun")) return "#FCD34D";
    if (icon.includes("rain")) return "#60A5FA";
    if (icon.includes("snow")) return "#E5E7EB";
    if (icon.includes("lightning")) return "#F59E0B";
    return "#F3F4F6";
  };

  return (
    <motion.div
      key="weather-icon"
      className="relative text-6xl sm:text-7xl"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.7,
        delay: 0.4,
        type: "spring",
        stiffness: 80,
      }}
    >
      <motion.div
        className="absolute inset-0 blur-2xl opacity-20 scale-125"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundColor: getBackgroundColor(),
        }}
      />

      <motion.div
        animate={{
          y: [0, -5, 0],
          scale: icon.includes("sun") ? [1, 1.05, 1] : [1, 1, 1],
          rotate: icon.includes("wind") ? [0, 3, 0, -3, 0] : 0,
        }}
        transition={{
          duration: icon.includes("sun") ? 6 : 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <WeatherIcon type={icon} size="xl" />
      </motion.div>
    </motion.div>
  );
};

export default WeatherIconAnimated;
