import React from "react";
import MetricItem from "./MetricItem";

interface UVIndexMetricProps {
  uvIndex: number;
  animationDelay?: number;
}

const UVIndexMetric: React.FC<UVIndexMetricProps> = ({
  uvIndex,
  animationDelay = 0.5,
}) => {
  // Get UV index level and recommendations
  const getUVLevel = () => {
    if (uvIndex <= 2) return "Low";
    if (uvIndex <= 5) return "Moderate";
    if (uvIndex <= 7) return "High";
    if (uvIndex <= 10) return "Very High";
    return "Extreme";
  };

  // Get color based on UV Index
  const getUVColor = () => {
    if (uvIndex <= 2) return "#10B981"; // green-500
    if (uvIndex <= 5) return "#FBBF24"; // amber-400
    if (uvIndex <= 7) return "#F59E0B"; // amber-500
    if (uvIndex <= 10) return "#EF4444"; // red-500
    return "#8B5CF6"; // purple-500
  };

  const uvColor = getUVColor();

  // Simple UV icon - just a basic sun
  const uvIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={uvColor}
      className="w-5 h-5"
    >
      <circle cx="12" cy="12" r="5" />
      <path
        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        stroke={uvColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <MetricItem
      icon={uvIcon}
      title="UV Index"
      value={uvIndex.toFixed(1)}
      subtitle={getUVLevel()}
      animationDelay={animationDelay}
    />
  );
};

export default UVIndexMetric;
