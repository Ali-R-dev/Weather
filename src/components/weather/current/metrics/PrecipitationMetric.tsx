import React from "react";
import MetricItem from "./MetricItem";
import { motion } from "framer-motion";

interface PrecipitationMetricProps {
  precipitation: number;
  precipitationProbability?: number;
  animationDelay?: number;
}

const PrecipitationMetric: React.FC<PrecipitationMetricProps> = ({
  precipitation,
  precipitationProbability,
  animationDelay = 0.4,
}) => {
  const precipitationText =
    precipitation > 0
      ? precipitation < 1
        ? "Light"
        : precipitation < 10
        ? "Moderate"
        : "Heavy"
      : "None";

  // Get color based on precipitation intensity
  const getPrecipColor = () => {
    if (precipitation === 0) return "#94A3B8"; // gray-400
    if (precipitation < 1) return "#60A5FA"; // blue-400
    if (precipitation < 10) return "#3B82F6"; // blue-500
    return "#2563EB"; // blue-600
  };

  // Enhanced interactive precipitation icon
  const precipIcon = (
    <div className="relative w-8 h-8">
      {/* Cloud with dynamic raindrops */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Cloud body */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#94A3B8"
          className="w-7 h-7 absolute"
        >
          <path d="M7.75 4.5a5.25 5.25 0 0110.305 1.5H18.5A3.5 3.5 0 0118.5 13H5.5a3.5 3.5 0 010-7h.445A5.25 5.25 0 017.75 4.5z" />
        </svg>

        {/* Animated raindrops - only show if precipitation > 0 */}
        {precipitation > 0 && (
          <div className="absolute w-full h-full">
            {[...Array(Math.min(Math.ceil(precipitation), 3))].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${25 + i * 20}%`,
                  top: "65%",
                  width: "2px",
                  height: "5px",
                  borderRadius: "0 0 2px 2px",
                  background: getPrecipColor(),
                }}
                animate={{
                  y: [0, 12, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Enhanced subtitle with probability gauge
  const enhancedSubtitle = (
    <div className="flex items-center justify-between">
      <div className="text-xs">{precipitationText}</div>

      {precipitationProbability !== undefined && (
        <div
          className="text-xs py-0.5 px-1.5 rounded-sm"
          style={{
            backgroundColor: `${getPrecipColor()}20`,
            color: getPrecipColor(),
          }}
        >
          {precipitationProbability}%
        </div>
      )}
    </div>
  );

  return (
    <MetricItem
      icon={precipIcon}
      title="Precipitation"
      value={`${precipitation.toFixed(1)} mm`}
      subtitle={enhancedSubtitle}
      animationDelay={animationDelay}
    />
  );
};

export default PrecipitationMetric;
