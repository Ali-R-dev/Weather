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
      fill="currentColor"
      className="w-4 h-4"
    >
      <path
        fillRule="evenodd"
        d="M12.75 3.97a.75.75 0 01.75.75c0 1.08.9 1.97 2 1.97h3.25a.75.75 0 010 1.5H15.5c-.75 0-1.45.22-2.04.59a4.142 4.142 0 01-1.96.41h-.25a.1.1 0 00-.1.1v.4c0 .55.45 1 1 1h2.6c1.3 0 2.4 1.1 2.4 2.4 0 1.85-1.25 3.4-3.1 3.9H12A3.98 3.98 0 008.5 16c-.5 0-1.1.1-1.5.5-.4.4-.6.8-.6 1.5s.2 1.1.6 1.5c.4.4.9.5 1.5.5h.4c.55 0 1 .45 1 1s-.45 1-1 1h-.4c-1.2 0-2.3-.4-3.1-1.2-.8-.8-1.2-1.8-1.2-3s.4-2.2 1.2-3c.8-.8 1.9-1.2 3.1-1.2 1.6 0 3.2.8 4 2.3.6-.7 1.5-1.2 2.6-1.2h.25a.1.1 0 00.1-.1v-.4c0-1.85-1.25-3.4-3.1-3.9H10c-1.3 0-2.4-1.1-2.4-2.4 0-1.3 1.1-2.4 2.4-2.4h1.75c.69 0 1.25.56 1.25 1.25l0 .02z"
        clipRule="evenodd"
      />
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
