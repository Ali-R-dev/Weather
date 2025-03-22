import React, { useState, useEffect, useCallback, useMemo } from "react";
import { HourlyWeather } from "../../../types/weather.types";
import {
  formatDay,
  groupHoursByDay,
  findCurrentTimeIndex,
} from "../../../utils/formatting";
import TemperatureGraph from "./TemperatureGraph";
import HourlyForecastItem from "./HourlyForecastItem";

interface HourlyForecastProps {
  hourlyData: HourlyWeather;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData }) => {
  const [expandedView, setExpandedView] = useState<boolean>(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState<number>(0);

  // Memoize displayHours and displayTemps to prevent recalculation
  const displayHours = useMemo(() => {
    return expandedView
      ? hourlyData.time.slice(0, 48) // Show two days if expanded
      : hourlyData.time.slice(0, 24); // Show one day by default
  }, [hourlyData.time, expandedView]);

  const displayTemps = useMemo(() => {
    return hourlyData.temperature_2m.slice(0, expandedView ? 48 : 24);
  }, [hourlyData.temperature_2m, expandedView]);

  // Memoize groupedHours to prevent recalculation
  const groupedHours = useMemo(() => {
    return groupHoursByDay(displayHours);
  }, [displayHours]);

  // Calculate highest and lowest temperatures
  const { highTemp, lowTemp } = useMemo(() => {
    return {
      highTemp: Math.round(Math.max(...displayTemps)),
      lowTemp: Math.round(Math.min(...displayTemps)),
    };
  }, [displayTemps]);

  // Memoize the toggle function
  const toggleExpandedView = useCallback(() => {
    setExpandedView((prev) => !prev);
  }, []);

  // Find the current time index when data changes
  useEffect(() => {
    if (hourlyData && hourlyData.time && hourlyData.time.length > 0) {
      const index = findCurrentTimeIndex(displayHours);
      setCurrentTimeIndex(index);

      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        const currentHourElement = document.getElementById(`hour-${index}`);
        if (currentHourElement) {
          const container = currentHourElement.closest(".overflow-x-auto");
          if (container) {
            const containerRect = container.getBoundingClientRect();
            const elementRect = currentHourElement.getBoundingClientRect();
            const scrollOffset =
              elementRect.left -
              containerRect.left +
              elementRect.width / 2 -
              containerRect.width / 2;

            // Use smooth scrolling for better performance
            container.scrollTo({
              left: container.scrollLeft + scrollOffset,
              behavior: "smooth",
            });
          }
        }
      });
    }
  }, [hourlyData, displayHours]);

  return (
    <div className="h-full">
      {/* Section header with forecast info */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Hourly Forecast</h2>
        <div className="text-sm text-white/80">
          <span>
            {lowTemp}° - {highTemp}°
          </span>
        </div>
      </div>

      {/* Temperature graph */}
      <TemperatureGraph
        temperatures={displayTemps}
        times={displayHours}
        currentTimeIndex={currentTimeIndex}
      />

      {/* Day headers and hourly forecast */}
      <div className="mt-4">
        {Object.entries(groupedHours).map(([day, hours], dayIndex) => (
          <div key={day} className="mb-4">
            {/* Day header */}
            <div className="sticky top-0 z-20 mb-2 py-1.5 px-3 bg-gradient-to-r from-gray-900/80 to-transparent backdrop-blur-sm rounded-lg flex items-center">
              <div className="w-1 h-4 rounded-full bg-white/50 mr-2"></div>
              <h3 className="text-white font-medium text-sm">
                {dayIndex === 0 ? "Today" : formatDay(hours[0])}
              </h3>
              <span className="text-xs text-white/60 ml-2">
                {new Date(day).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Clean, scrollable hours container with content-visibility */}
            <div
              className="flex overflow-x-auto py-1 space-x-2 hide-scrollbar"
              style={{
                contentVisibility: "auto",
                containIntrinsicSize: "0 200px",
              }}
            >
              {hours.map((time) => {
                const index = hourlyData.time.indexOf(time);
                const isCurrentHour = index === currentTimeIndex;

                return (
                  <div key={time} id={`hour-${index}`}>
                    <HourlyForecastItem
                      time={time}
                      temperature={hourlyData.temperature_2m[index]}
                      weatherCode={hourlyData.weather_code[index]}
                      precipitationProbability={
                        hourlyData.precipitation_probability[index]
                      }
                      isCurrentHour={isCurrentHour}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Toggle button for expanded view */}
      <div className="mt-3 flex justify-center">
        <button
          onClick={toggleExpandedView}
          className="px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium text-white hover:bg-white/15"
        >
          {expandedView ? "Show 24 Hours" : "Show 48 Hours"}
        </button>
      </div>

      {/* Hide scrollbar styling */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default HourlyForecast;
