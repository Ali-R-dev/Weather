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

  const precipIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4"
    >
      <path
        fillRule="evenodd"
        d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
        clipRule="evenodd"
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
