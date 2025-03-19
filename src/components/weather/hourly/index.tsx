import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HourlyWeather } from "../../../types/weather.types";
import {
  formatDay,
  groupHoursByDay,
  findCurrentTimeIndex,
} from "../../../utils/formatting";
import TemperatureGraph from "./TemperatureGraph";
import HourlyForecastItem from "./HourlyForecastItem";
import ExpandToggle from "../../ui/ExpandToggle";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Find the current time index when data changes
  useEffect(() => {
    if (hourlyData && hourlyData.time && hourlyData.time.length > 0) {
      const index = findCurrentTimeIndex(displayHours);
      setCurrentTimeIndex(index);
    }
  }, [hourlyData, displayHours]);

  // Group hours by day for UI organization
  const groupedHours = groupHoursByDay(displayHours);

  return (
    <div className="h-full">
      {/* Temperature graph */}
      <TemperatureGraph
        temperatures={displayTemps}
        times={displayHours}
        currentTimeIndex={currentTimeIndex}
      />

      {/* Day headers and hourly forecast */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {Object.entries(groupedHours).map(([day, hours], dayIndex) => (
          <div key={day} className="mb-4">
            {/* Day header */}
            <motion.div
              variants={itemVariants}
              className="sticky top-0 z-20 mb-2 py-1 pl-2 backdrop-blur-md bg-black/30 rounded-lg text-white font-medium text-xs uppercase"
            >
              {dayIndex === 0 ? "Today" : formatDay(hours[0])} -{" "}
              {new Date(day).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </motion.div>

            {/* Scrollable hours container */}
            <div className="flex overflow-x-auto py-1 space-x-3 hide-scrollbar">
              {hours.map((time) => {
                const index = hourlyData.time.indexOf(time);
                const isCurrentHour = index === currentTimeIndex;

                return (
                  <motion.div key={time} variants={itemVariants}>
                    <HourlyForecastItem
                      time={time}
                      temperature={hourlyData.temperature_2m[index]}
                      weatherCode={hourlyData.weather_code[index]}
                      precipitationProbability={
                        hourlyData.precipitation_probability[index]
                      }
                      isCurrentHour={isCurrentHour}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Toggle button for expanded view */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-3 flex justify-center"
      >
        <ExpandToggle
          expanded={expandedView}
          onToggle={() => setExpandedView(!expandedView)}
          showLabel="Show 48 hours"
          hideLabel="Show less"
        />
      </motion.div>
    </div>
  );
};

export default HourlyForecast;
