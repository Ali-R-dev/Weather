import React from "react";
import { formatDay } from "../../../utils/formatting";
import HourlyForecastItem from "./HourlyForecastItem";
import styles from "./HourlyForecast.module.css";
import { HourlyWeather } from "../../../types/weather.types";

interface HourlySectionProps {
  day: string;
  hours: string[];
  hourlyData: HourlyWeather;
  currentTimeIndex: number;
}

const HourlySection: React.FC<HourlySectionProps> = ({
  day,
  hours,
  hourlyData,
  currentTimeIndex,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-white/70 mb-2">
        {formatDay(day)}
      </h3>
      <div className={`${styles.container} ${styles.hideScrollbar}`}>
        <div className={styles.hourlyList}>
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
    </div>
  );
};

export default HourlySection;
