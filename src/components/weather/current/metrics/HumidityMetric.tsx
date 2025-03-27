import React from "react";
import MetricItem from "./MetricItem";

interface HumidityMetricProps {
  humidity: number;
  animationDelay?: number;
}

const HumidityMetric: React.FC<HumidityMetricProps> = ({
  humidity,
  animationDelay = 0.2,
}) => {
  // Determine humidity level text
  const getHumidityLevel = () => {
    if (humidity < 30) return "Dry";
    if (humidity < 50) return "Comfortable";
    if (humidity < 70) return "Moderate";
    return "Humid";
  };

  const humidityIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="#60A5FA"
      className="w-5 h-5"
    >
      <path d="M12 21.5c-3.9 0-7-3.1-7-7 0-3.7 6-12.5 7-12.5s7 8.8 7 12.5c0 3.9-3.1 7-7 7z" />
    </svg>
  );

  return (
    <MetricItem
      icon={humidityIcon}
      title="Humidity"
      value={`${humidity}%`}
      subtitle={getHumidityLevel()}
      animationDelay={animationDelay}
    />
  );
};

export default HumidityMetric;
