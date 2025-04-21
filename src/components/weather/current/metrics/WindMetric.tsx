import React from 'react';
import MetricItem from './MetricItem';
import { motion } from 'framer-motion';

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
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round((degrees % 360) / 45) % 8;
    return directions[index];
  };

  // Get color for wind speed
  const getWindSpeedColor = () => {
    if (windSpeed < 5) return '#10B981'; // Light - green
    if (windSpeed < 15) return '#60A5FA'; // Moderate - blue
    if (windSpeed < 25) return '#FBBF24'; // Strong - amber
    if (windSpeed < 35) return '#F97316'; // Very strong - orange
    return '#EF4444'; // Severe - red
  };

  // Wind speed category label
  const getWindSpeedLabel = () => {
    if (windSpeed < 5) return 'Light';
    if (windSpeed < 15) return 'Moderate';
    if (windSpeed < 25) return 'Strong';
    if (windSpeed < 35) return 'Very Strong';
    return 'Severe';
  };

  // Create an integrated wind icon with direction visualization
  const enhancedWindIcon = (
    <div className="relative">
      {/* Base compass circle */}
      <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
        {/* Tiny compass markers */}
        <div className="absolute h-0.5 w-0.5 bg-white/40 top-0.5 left-1/2 transform -translate-x-1/2"></div>
        <div className="absolute h-0.5 w-0.5 bg-white/40 bottom-0.5 left-1/2 transform -translate-x-1/2"></div>
        <div className="absolute w-0.5 h-0.5 bg-white/40 left-0.5 top-1/2 transform -translate-y-1/2"></div>
        <div className="absolute w-0.5 h-0.5 bg-white/40 right-0.5 top-1/2 transform -translate-y-1/2"></div>

        {/* Dynamic wind direction arrow */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ rotate: 0 }}
          animate={{ rotate: windDirection }}
          transition={{ duration: 1 }}
        >
          <div
            className="relative w-full h-0.5 flex items-center"
            style={{ transformOrigin: 'center' }}
          >
            <div
              className="absolute left-1/2 w-1/2 h-full rounded-full"
              style={{
                background: `linear-gradient(to right, transparent, ${getWindSpeedColor()})`,
                transform: 'translateX(-25%)',
              }}
            ></div>
            {/* Arrow head */}
            <div
              className="absolute right-0.5"
              style={{
                width: 0,
                height: 0,
                borderTop: '2px solid transparent',
                borderBottom: '2px solid transparent',
                borderLeft: `4px solid ${getWindSpeedColor()}`,
              }}
            ></div>
          </div>
        </motion.div>
      </div>

      {/* Speed indicator dot */}
      <div
        className="absolute -right-0.5 -top-0.5 w-2 h-2 rounded-full"
        style={{ backgroundColor: getWindSpeedColor() }}
      ></div>
    </div>
  );

  // Create a compact, inline subtitle
  const compactSubtitle = (
    <div className="flex items-center justify-between">
      <div className="flex items-center text-xs pe-1">
        <span>From {getWindDirection(windDirection)}</span>

        {/* Tiny direction arrow */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 ml-1.5"
          style={{ transform: `rotate(${windDirection}deg)` }}
        >
          <path d="M12 2L19 9H5L12 2Z" fill="currentColor" />
        </svg>
      </div>

      <span
        className="text-xs px-1.5 py-0.5 rounded-sm ml-auto"
        style={{
          backgroundColor: `${getWindSpeedColor()}30`,
          color: getWindSpeedColor(),
        }}
      >
        {getWindSpeedLabel()}
      </span>
    </div>
  );

  return (
    <MetricItem
      icon={enhancedWindIcon}
      title="Wind"
      value={`${windSpeed.toFixed(1)} ${windUnit}`}
      subtitle={compactSubtitle}
      animationDelay={animationDelay}
    />
  );
};

export default WindMetric;
