import React from "react";
import MetricItem from "./MetricItem";

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

  // New, clearer precipitation icon
  const precipIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="#60A5FA"
      className="w-6 h-6" // Slightly larger
    >
      <path d="M7.75 4.5a5.25 5.25 0 0 1 10.305 1.5H18.5A3.5 3.5 0 0 1 18.5 13H5.5a3.5 3.5 0 0 1 0-7h.445A5.25 5.25 0 0 1 7.75 4.5Z" />
      <path
        d="M8.5 15l1.5 3M12 14l1.5 3M15.5 15l1.5 3"
        strokeWidth="1.5"
        stroke="#60A5FA"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <MetricItem
      icon={precipIcon}
      title="Precipitation"
      value={`${precipitation.toFixed(1)} mm`}
      subtitle={
        precipitationProbability
          ? `${precipitationProbability}% chance • ${precipitationText}`
          : precipitationText
      }
      animationDelay={animationDelay}
    />
  );
};

export default PrecipitationMetric;
