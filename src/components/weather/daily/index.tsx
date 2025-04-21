import React from 'react';
import DayItem from './DayItem';
import { formatDate } from '../../../utils/formatting';

interface DailyForecastProps {
  dailyData?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
  };
}

const DailyForecast: React.FC<DailyForecastProps> = ({ dailyData }) => {
  // Handle loading state
  if (!dailyData) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-white/70">
        <p>Loading forecast data...</p>
      </div>
    );
  }

  // Handle missing or invalid data
  if (!dailyData.time?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-white/70">
        <p>No forecast data available</p>
      </div>
    );
  }

  const today = formatDate(new Date().toISOString());

  return (
    <section
      className="flex flex-col gap-2 w-full max-w-lg mx-auto px-1 sm:px-0 mt-4"
      role="region"
      aria-label="Daily weather forecast"
      tabIndex={0}
    >
      <h2 className="sr-only" id="daily-forecast-heading">
        Daily Forecast
      </h2>
      <div
        className="flex flex-col gap-2 w-full"
        role="list"
        aria-labelledby="daily-forecast-heading"
      >
        {dailyData.time.map((time, index) => {
          // Validate data for each item
          const maxTemp = dailyData.temperature_2m_max?.[index];
          const minTemp = dailyData.temperature_2m_min?.[index];
          const weatherCode = dailyData.weather_code?.[index];
          const precipProb = dailyData.precipitation_probability_max?.[index];

          // Skip invalid entries
          if (
            maxTemp === undefined ||
            minTemp === undefined ||
            weatherCode === undefined ||
            precipProb === undefined
          ) {
            return null;
          }

          return (
            <DayItem
              key={time}
              day={time}
              maxTemp={maxTemp}
              minTemp={minTemp}
              weatherCode={weatherCode}
              precipProbability={precipProb}
              isToday={formatDate(time) === today}
              tabIndex={0}
              role="listitem"
              aria-label={`Forecast for ${formatDate(time)}: ${maxTemp}° / ${minTemp}°`}
            />
          );
        })}
      </div>
    </section>
  );
};

export default DailyForecast;
