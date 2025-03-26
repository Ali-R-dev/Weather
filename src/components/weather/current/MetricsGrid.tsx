import React from "react";
import HumidityMetric from "./metrics/HumidityMetric";
import WindMetric from "./metrics/WindMetric";
import PrecipitationMetric from "./metrics/PrecipitationMetric";
import UVIndexMetric from "./metrics/UVIndexMetric";
import { WindUnit } from "../../../context/SettingsContext";

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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <HumidityMetric humidity={humidity} animationDelay={0.2} />

      <WindMetric
        windSpeed={windSpeed}
        windDirection={windDirection}
        windUnit={windUnit}
        animationDelay={0.3}
      />

      <PrecipitationMetric
        precipitation={precipitation}
        precipitationProbability={precipitationProbability}
        animationDelay={0.4}
      />

      <UVIndexMetric uvIndex={uvIndex} animationDelay={0.5} />
    </div>
  );
};

export default MetricsGrid;
