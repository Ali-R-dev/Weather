import React from "react";
import WeatherIcon from "../shared/WeatherIcon";
import { getWeatherInfo } from "../../../utils/weatherCodeMap";
import { formatHour } from "../../../utils/formatting";

interface HourlyForecastItemProps {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  isCurrentHour?: boolean;
}

const HourlyForecastItem: React.FC<HourlyForecastItemProps> = ({
  time,
  temperature,
  weatherCode,
  precipitationProbability,
  isCurrentHour = false,
}) => {
  const weatherInfo = getWeatherInfo(weatherCode);
  const hasPrecip = precipitationProbability > 0;

  return (
    <div
      className={`flex flex-col items-center min-w-[68px] flex-shrink-0 py-3 px-2 rounded-2xl transition-all ${
        isCurrentHour
          ? "bg-white/20 border border-white/20"
          : "bg-white/5 hover:bg-white/10"
      }`}
    >
      {/* Time display */}
      <div className="font-medium text-xs uppercase tracking-wide text-white/80 mb-1">
        {isCurrentHour ? "Now" : formatHour(time)}
      </div>

      {/* Weather icon - simplified and more modern */}
      <div
        className={`my-2 flex items-center justify-center h-10 ${
          isCurrentHour ? "animate-pulse" : ""
        }`}
      >
        <WeatherIcon type={weatherInfo.icon} />
      </div>

      {/* Temperature with bolder styling */}
      <div className="font-semibold text-lg text-white">
        {Math.round(temperature)}°
      </div>

      {/* Precipitation probability with improved pill design */}
      {hasPrecip && (
        <div
          className={`
            mt-2 flex items-center justify-center
            ${
              precipitationProbability > 50
                ? "text-blue-200"
                : "text-blue-100/70"
            }`}
        >
          <svg
            className="w-3 h-3 mr-0.5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M11.28 15.63C11.28 17.73 9.57 19.44 7.47 19.44C5.38 19.44 3.67 17.73 3.67 15.63C3.67 14 6 11.37 7.47 10.03C8.93 11.37 11.28 14 11.28 15.63Z" />
          </svg>
          <span className="text-xs font-medium">
            {precipitationProbability}%
          </span>
        </div>
      )}
    </div>
  );
};

export default HourlyForecastItem;
