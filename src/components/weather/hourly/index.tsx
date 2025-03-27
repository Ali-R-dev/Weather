import React, { useState, useEffect } from "react";
import { HourlyWeather } from "../../../types/weather.types";
import {
  groupHoursByDay,
  findCurrentTimeIndex,
} from "../../../utils/formatting";
import TemperatureGraph from "./TemperatureGraph";
import HourlySection from "./HourlySection";
import HourlyForecastSummary from "./HourlyForecastSummary";
import ViewToggle from "./ViewToggle";

interface HourlyForecastProps {
  hourlyData: HourlyWeather;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData }) => {
  const [expandedView, setExpandedView] = useState<boolean>(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState<number>(0);

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
      <HourlyForecastSummary highTemp={highTemp} lowTemp={lowTemp} />

      <TemperatureGraph
        temperatures={displayTemps}
        times={displayHours}
        currentTimeIndex={currentTimeIndex}
      />

      {/* Day sections */}
      <div className="mt-4">
        {Object.entries(groupedHours).map(([day, hours]) => (
          <HourlySection
            key={day}
            day={day}
            hours={hours}
            hourlyData={hourlyData}
            currentTimeIndex={currentTimeIndex}
          />
        ))}
      </div>

      <ViewToggle
        expandedView={expandedView}
        toggleView={() => setExpandedView(!expandedView)}
      />
    </div>
  );
};

export default HourlyForecast;
