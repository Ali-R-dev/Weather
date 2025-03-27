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
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      style={{ transform: `rotate(${windDirection}deg)` }}
    >
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
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
