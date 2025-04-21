import React from 'react';
import MetricItem from './MetricItem';
import { motion } from 'framer-motion';

interface UVIndexMetricProps {
  uvIndex: number;
  animationDelay?: number;
}

const UVIndexMetric: React.FC<UVIndexMetricProps> = ({ uvIndex, animationDelay = 0.5 }) => {
  // Get UV index level and recommendations
  const getUVLevel = () => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  // Get color based on UV Index
  const getUVColor = () => {
    if (uvIndex <= 2) return '#10B981'; // green-500
    if (uvIndex <= 5) return '#FBBF24'; // amber-400
    if (uvIndex <= 7) return '#F59E0B'; // amber-500
    if (uvIndex <= 10) return '#EF4444'; // red-500
    return '#8B5CF6'; // purple-500
  };

  // Enhanced creative UV icon - without rotation
  const uvIcon = (
    <div className="relative w-8 h-8">
      {/* Base sun shape - static, no rotation */}
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(${getUVColor()}80 0%, ${getUVColor()}10 ${Math.min(
            uvIndex * 9,
            100
          )}%, transparent ${Math.min(uvIndex * 9, 100)}%)`,
          border: `1.5px solid ${getUVColor()}60`,
        }}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: getUVColor() }}
        >
          <span className="text-[10px] font-semibold text-white">{Math.round(uvIndex)}</span>
        </div>
      </div>
    </div>
  );

  // Enhanced subtitle with visual indicator
  const enhancedSubtitle = (
    <div className="flex items-center justify-between">
      <div className="text-xs pe-2">{getUVLevel()}</div>

      {/* UV level gauge */}
      <div className="relative w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: `${Math.min((uvIndex / 12) * 100, 100)}%`,
            background: `linear-gradient(to right, #10B981, #FBBF24, #F59E0B, #EF4444, #8B5CF6)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((uvIndex / 12) * 100, 100)}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );

  return (
    <MetricItem
      icon={uvIcon}
      title="UV Index"
      value={uvIndex.toFixed(1)}
      subtitle={enhancedSubtitle}
      animationDelay={animationDelay}
    />
  );
};

export default UVIndexMetric;
