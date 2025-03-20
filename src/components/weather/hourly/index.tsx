import React, { useState, useEffect } from "react";
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
  // const [showGraph, setShowGraph] = useState(false);
  // const scrollContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>(
  //   {}
  // );

  // Show a variable number of hours based on expandedView state
  const displayHours: string[] = expandedView
    ? hourlyData.time.slice(0, 48) // Show two days if expanded
    : hourlyData.time.slice(0, 24); // Show one day by default

  const displayTemps: number[] = hourlyData.temperature_2m.slice(
    0,
    expandedView ? 48 : 24
  );

  // Find the current time index when data changes
  useEffect(() => {
    if (hourlyData && hourlyData.time && hourlyData.time.length > 0) {
      const index = findCurrentTimeIndex(displayHours);
      setCurrentTimeIndex(index);

      // Fixed version - only scroll horizontally
      setTimeout(() => {
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

            // Only adjust horizontal scroll, not page position
            container.scrollLeft += scrollOffset;
          }
        }
      }, 500);
    }
  }, [hourlyData, displayHours]);

  // Group hours by day for UI organization
  const groupedHours = groupHoursByDay(displayHours);

  // Calculate highest and lowest temperatures
  const highTemp = Math.round(Math.max(...displayTemps));
  const lowTemp = Math.round(Math.min(...displayTemps));

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

            {/* Clean, scrollable hours container */}
            <div className="flex overflow-x-auto py-1 space-x-2 hide-scrollbar">
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
          onClick={() => setExpandedView(!expandedView)}
          className="px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium text-white hover:bg-white/15 transition-all"
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
