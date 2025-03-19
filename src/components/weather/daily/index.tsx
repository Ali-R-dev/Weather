import React from "react";
import { motion } from "framer-motion";
import { DailyWeather } from "../../../types/weather.types";
import DayItem from "./DayItem";

interface DailyForecastProps {
  dailyData: DailyWeather;
}

const DailyForecast: React.FC<DailyForecastProps> = ({ dailyData }) => {
  return (
    <div className="h-full">
      <div className="space-y-3">
        {dailyData.time.map((day, index) => {
          const isToday = index === 0;

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;
