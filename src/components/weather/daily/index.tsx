import React, { useMemo } from "react";
import { DailyWeather } from "../../../types/weather.types";
import DayItem from "./DayItem";
import { formatDate } from "../../../utils/formatting";

interface DailyForecastProps {
  dailyData: DailyWeather;
}

const DailyForecast: React.FC<DailyForecastProps> = ({ dailyData }) => {
  // Memoize min/max temperature calculations
  const { maxTemp, minTemp } = useMemo(() => {
    // Calculate temperature extremes across the forecast period
    const maxTemp = Math.max(...dailyData.temperature_2m_max);
    const minTemp = Math.min(...dailyData.temperature_2m_min);

    return {
      maxTemp: Math.round(maxTemp),
      minTemp: Math.round(minTemp),
    };
  }, [dailyData.temperature_2m_max, dailyData.temperature_2m_min]);

  const today = formatDate(new Date().toISOString());

  return (
    <div className="h-full">
      {/* Section header with forecast info */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">7-Day Forecast</h2>
        <div className="text-sm text-white/80">
          <span>
            {minTemp}° - {maxTemp}°
          </span>
        </div>
      </div>

      {/* Daily forecast items */}
      <div
        className="grid gap-3 pb-2"
        style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" }}
      >
        {dailyData.time.map((time, index) => (
          <DayItem
            key={time}
            day={time}
            maxTemp={dailyData.temperature_2m_max[index]}
            minTemp={dailyData.temperature_2m_min[index]}
            weatherCode={dailyData.weather_code[index]}
            precipProbability={dailyData.precipitation_probability_max[index]}
            isToday={formatDate(time) === today}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(DailyForecast);
