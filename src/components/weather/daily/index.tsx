import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DailyWeather } from "../../../types/weather.types";
import DayItem from "./DayItem";

interface DailyForecastProps {
  dailyData: DailyWeather;
}

const DailyForecast: React.FC<DailyForecastProps> = ({ dailyData }) => {
  const [expandedDays, setExpandedDays] = useState<number | null>(null);
  const [showAllDays, setShowAllDays] = useState(false);

  // Calculate high and low for the week
  const allMaxTemps = dailyData.temperature_2m_max;
  const allMinTemps = dailyData.temperature_2m_min;
  const weekHigh = Math.round(Math.max(...allMaxTemps));
  const weekLow = Math.round(Math.min(...allMinTemps));

  // Only show first 5 days by default
  const visibleDays = showAllDays
    ? dailyData.time.length
    : Math.min(5, dailyData.time.length);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Section header with weekly summary */}
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {dailyData.time.length}-Day Forecast
          </h2>
          <p className="text-sm text-white/70 mt-1">
            Weekly range: {weekLow}° to {weekHigh}°
          </p>
        </div>
      </motion.div>

      {/* Day items with staggered animation */}
      <motion.div
        className="space-y-2.5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {dailyData.time.slice(0, visibleDays).map((day, index) => {
          const isToday = index === 0;

          return (
            <motion.div
              key={day}
              variants={itemVariants}
              whileTap={{ scale: 0.99 }}
              onClick={() =>
                setExpandedDays(expandedDays === index ? null : index)
              }
            >
              <DayItem
                day={day}
                maxTemp={dailyData.temperature_2m_max[index]}
                minTemp={dailyData.temperature_2m_min[index]}
                weatherCode={dailyData.weather_code[index]}
                precipProbability={
                  dailyData.precipitation_probability_max[index]
                }
                isToday={isToday}
              />

              {/* Expanded day details - you can add more detail here in the future */}
              <AnimatePresence>
                {expandedDays === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                      <div className="text-sm text-white/80">
                        Hourly forecast details could appear here
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Show more/less toggle */}
      {dailyData.time.length > 5 && (
        <motion.div
          className="mt-4 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => setShowAllDays(!showAllDays)}
            className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                      text-sm font-medium text-white hover:bg-white/15 transition-all
                      flex items-center space-x-1"
          >
            <span>{showAllDays ? "Show Less" : "Show All Days"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${
                showAllDays ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DailyForecast;
