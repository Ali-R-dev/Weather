import React from "react";
import { WeatherIconProps } from "./IconTypes";
import { motion } from "framer-motion";

const SunIcon: React.FC<WeatherIconProps> = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={{ position: 'relative' }}
      role={props['role']}
      aria-label={props['aria-label']}
    >
      {/* Animated sun rays */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45);
        return (
          <motion.line
            key={i}
            x1={12}
            y1={2}
            x2={12}
            y2={4}
            stroke="#ffe066"
            strokeWidth={1.2}
            strokeLinecap="round"
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '12px 12px',
              opacity: 0.8,
            }}
            initial={{
              scaleY: 1,
              opacity: 0.8,
            }}
            animate={{
              scaleY: [1, 1.25, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: i * 0.15,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        );
      })}
      {/* Sun body */}
      <circle cx={12} cy={12} r={4.5} fill="#fbbf24" />
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
  );
};

export default SunIcon;
