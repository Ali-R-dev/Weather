import React from 'react';
import { useTranslation } from 'react-i18next';
import MetricItem from './MetricItem';
import { motion } from 'framer-motion';

interface HumidityMetricProps {
  humidity: number;
  animationDelay?: number;
}

const HumidityMetric: React.FC<HumidityMetricProps> = ({ humidity, animationDelay = 0.2 }) => {
  const { t } = useTranslation();

  // Determine humidity level text
  const getHumidityLevel = () => {
    if (humidity < 30) return t('humidity_dry');
    if (humidity < 50) return t('humidity_comfortable');
    if (humidity < 70) return t('humidity_moderate');
    return t('humidity_humid');
  };

  // Get color based on humidity level
  const getHumidityColor = () => {
    if (humidity < 30) return '#F87171'; // red-400 (dry)
    if (humidity < 50) return '#10B981'; // green-500 (comfortable)
    if (humidity < 70) return '#60A5FA'; // blue-400 (moderate)
    return '#3B82F6'; // blue-500 (humid)
  };

  // Creative humidity icon with water level visual
  const humidityIcon = (
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Drop outline */}
        <div className="w-7 h-7 rounded-b-full transform rotate-45 border-2 border-white/60 flex items-center justify-center overflow-hidden">
          {/* Fill level based on humidity */}
          <motion.div
            className="absolute bottom-0 left-0 w-full"
            style={{
              height: `${humidity}%`,
              background: `linear-gradient(to top, ${getHumidityColor()}, ${getHumidityColor()}90)`,
            }}
            initial={{ height: 0 }}
            animate={{ height: `${humidity}%` }}
            transition={{ duration: 1, delay: animationDelay }}
          />

          {/* Ripple effect */}
          {humidity > 30 && (
            <motion.div
              className="absolute w-3 h-0.5 bg-white/50 rounded-full"
              style={{ bottom: `${20 + Math.random() * 10}%` }}
              animate={{
                scaleX: [0.5, 1.2, 0.5],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'mirror',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );

  // Enhanced subtitle with comfort indicator
  const enhancedSubtitle = (
    <div className="flex items-center justify-between">
      <div className="text-xs pe-2">{getHumidityLevel()}</div>

      {/* Humidity comfort gauge */}
      <div className="relative w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-red-400 via-green-400 to-blue-500" />

        {/* Current humidity marker */}
        <div
          className="absolute top-0 w-1.5 h-1.5 rounded-full bg-white"
          style={{ left: `calc(${Math.min(humidity, 100)}% - 3px)` }}
        />
      </div>
    </div>
  );

  return (
    <MetricItem
      icon={humidityIcon}
      title={t('humidity')}
      value={`${humidity}%`}
      subtitle={enhancedSubtitle}
      animationDelay={animationDelay}
    />
  );
};

export default HumidityMetric;
