import React from "react";
import WeatherIcon from "../shared/WeatherIcon";
import { getWeatherInfo } from "../../../utils/weatherCodeMap";
import { formatDay, formatDate } from "../../../utils/formatting";

interface DayItemProps {
  day: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipProbability: number;
  isToday: boolean;
}

const DayItem: React.FC<DayItemProps> = ({
  day,
  maxTemp,
  minTemp,
  weatherCode,
  precipProbability,
  isToday,
}) => {
  const weatherInfo = getWeatherInfo(weatherCode);
  const hasPrecip = precipProbability > 0;

  return (
    <div
      className={`flex items-center p-2.5 rounded-xl transition-all ${
        isToday ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
      }`}
    >
      {/* Day of week and date */}
      <div className="flex flex-col w-[70px]">
        <div className="font-medium text-sm text-white">
          {isToday ? "Today" : formatDay(day)}
        </div>
        <div className="text-xs text-white/60">{formatDate(day)}</div>
      </div>

      {/* Weather condition icon */}
      <div className="ml-1 mr-3">
        <WeatherIcon type={weatherInfo.icon} />
      </div>

      {/* Weather condition text */}
      <div className="flex-grow">
        <span className="text-sm text-white/90">{weatherInfo.label}</span>
        {hasPrecip && (
          <div className="flex items-center mt-0.5">
            <svg
              className="w-3 h-3 text-blue-300/80"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.28 15.63C11.28 17.73 9.57 19.44 7.47 19.44C5.38 19.44 3.67 17.73 3.67 15.63C3.67 14 6 11.37 7.47 10.03C8.93 11.37 11.28 14 11.28 15.63Z" />
            </svg>
            <span className="text-xs text-blue-100/70 ml-1">
              {precipProbability}%
            </span>
          </div>
        )}
      </div>

      {/* Temperature range */}
      <div className="flex items-center space-x-1.5 whitespace-nowrap">
        <span className="font-medium text-sm">{Math.round(maxTemp)}°</span>
        <span className="h-0.5 w-2 bg-white/30 rounded-full"></span>
        <span className="text-sm text-white/60">{Math.round(minTemp)}°</span>
      </div>
    </div>
  );
};

export default DayItem;
