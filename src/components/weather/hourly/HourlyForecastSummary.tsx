import React from "react";

interface HourlyForecastSummaryProps {
  highTemp: number;
  lowTemp: number;
}

const HourlyForecastSummary: React.FC<HourlyForecastSummaryProps> = ({
  highTemp,
  lowTemp,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-white">Hourly Forecast</h2>
      <div className="text-sm text-white/80">
        <span>
          {lowTemp}° - {highTemp}°
        </span>
      </div>
    </div>
  );
};

export default HourlyForecastSummary;
