import React from "react";
import MetricItem from "./MetricItem";

interface WindMetricProps {
  windSpeed: number;
  windDirection: number;
  windUnit: string;
  animationDelay?: number;
}

const WindMetric: React.FC<WindMetricProps> = ({
  windSpeed,
  windDirection,
  windUnit,
  animationDelay = 0.3,
}) => {
  // Get wind direction as text (N, NE, E, etc.)
  const getWindDirection = (degrees: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round((degrees % 360) / 45) % 8;
    return directions[index];
  };

  const windIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4"
      style={{ transform: `rotate(${windDirection}deg)` }}
    >
      <path
        fillRule="evenodd"
        d="M11.47 4.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 01-1.06-1.06l3.75-3.75zm-3.75 9.75a.75.75 0 011.06 0L12 17.69l3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 010-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <MetricItem
      icon={windIcon}
      title="Wind"
      value={`${windSpeed.toFixed(1)} ${windUnit}`}
      subtitle={`Direction: ${getWindDirection(windDirection)}`}
      animationDelay={animationDelay}
    />
  );
};

export default WindMetric;
