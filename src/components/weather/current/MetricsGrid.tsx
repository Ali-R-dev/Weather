import React from 'react';
import HumidityMetric from './metrics/HumidityMetric';
import WindMetric from './metrics/WindMetric';
import PrecipitationMetric from './metrics/PrecipitationMetric';
import UVIndexMetric from './metrics/UVIndexMetric';
import { WindUnit } from '../../../context/SettingsContext';

interface MetricsGridProps {
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  uvIndex: number;
  precipitationProbability?: number;
  windUnit: WindUnit;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({
  humidity,
  windSpeed,
  windDirection,
  precipitation,
  uvIndex,
  precipitationProbability,
  windUnit,
}) => {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full"
      role="list"
      aria-label="Current weather metrics"
    >
      <HumidityMetric humidity={humidity} animationDelay={0.05} />

      <WindMetric
        windSpeed={windSpeed}
        windDirection={windDirection}
        windUnit={windUnit}
        animationDelay={0.05}
      />

      <PrecipitationMetric
        precipitation={precipitation}
        precipitationProbability={precipitationProbability}
        animationDelay={0.05}
      />

      <UVIndexMetric uvIndex={uvIndex} animationDelay={0.05} />
    </div>
  );
};

export default MetricsGrid;
