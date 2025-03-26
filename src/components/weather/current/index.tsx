import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WeatherData } from "../../../types/weather.types";
import { getWeatherInfo } from "../../../utils/weatherCodeMap";
import { useWeather } from "../../../context/WeatherContext";
import { useTheme } from "../../../context/ThemeContext";
import { useSettings } from "../../../context/SettingsContext";
import {
  convertTemperature,
  convertWindSpeed,
} from "../../../utils/unitConversion";

import WeatherHeader from "./WeatherHeader";
import TemperatureDisplay from "./TemperatureDisplay";
import MetricsGrid from "./MetricsGrid";
import DetailPanel from "./DetailPanel";
import SunriseSunset from "./SunriseSunset";
import ExpandToggle from "../../ui/ExpandToggle";
import styles from "./CurrentWeather.module.css";

interface CurrentWeatherProps {
  data: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  const { currentLocation } = useWeather();
  const { applyTheme } = useTheme();
  const { settings } = useSettings();
  const [showDetails, setShowDetails] = useState(false);

  const weatherInfo = getWeatherInfo(data.current.weather_code);

  // Format temperature according to user settings
  const temperature =
    settings.units.temperature === "celsius"
      ? data.current.temperature_2m
      : convertTemperature(data.current.temperature_2m, "fahrenheit");

  const feelsLike =
    settings.units.temperature === "celsius"
      ? data.current.apparent_temperature
      : convertTemperature(data.current.apparent_temperature, "fahrenheit");

  const windSpeed =
    settings.units.wind === "kph"
      ? data.current.wind_speed_10m
      : convertWindSpeed(data.current.wind_speed_10m, "mph");

  // Apply theme based on current weather and time of day
  useEffect(() => {
    applyTheme(data.current.weather_code, data.current.is_day === 1);
  }, [data.current.weather_code, data.current.is_day, applyTheme]);

  return (
    <div className="text-white">
      <WeatherHeader
        locationName={currentLocation?.name || data.location?.name}
        region={currentLocation?.admin1}
        country={currentLocation?.country}
        timezone={data.timezone}
        timeFormat={settings.timeFormat}
      />

      <TemperatureDisplay
        temperature={temperature}
        feelsLike={feelsLike}
        weatherInfo={weatherInfo}
        humidity={data.current.relative_humidity_2m}
        temperatureUnit={settings.units.temperature}
      />

      <MetricsGrid
        humidity={data.current.relative_humidity_2m}
        windSpeed={windSpeed}
        windDirection={data.current.wind_direction_10m}
        precipitation={data.current.precipitation}
        uvIndex={data.current.uv_index}
        precipitationProbability={data.daily?.precipitation_probability_max[0]}
        windUnit={settings.units.wind}
      />

      {/* Toggle for extended details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-3 flex justify-center"
      >
        <ExpandToggle
          expanded={showDetails}
          onToggle={() => setShowDetails(!showDetails)}
        />
      </motion.div>

      <DetailPanel show={showDetails}>
        {/* Sunrise/Sunset (if available) */}
        {data.daily?.sunrise && data.daily?.sunset && (
          <SunriseSunset
            sunrise={data.daily.sunrise[0]}
            sunset={data.daily.sunset[0]}
            timeFormat={settings.timeFormat}
          />
        )}

        {/* Additional weather details in cards */}
        {data.current.pressure && (
          <div className={styles.detailCard}>
            <div className={styles.detailLabel}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={styles.detailIcon}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5z"
                  clipRule="evenodd"
                />
              </svg>
              Air Pressure
            </div>
            <div className="flex items-center">
              <span className={styles.detailValue}>
                {data.current.pressure}
              </span>
              <span className={styles.detailUnit}>hPa</span>
            </div>
            <div className="text-xs text-white/60 mt-1">
              {data.current.pressure > 1013
                ? "High pressure - Generally fair weather"
                : "Low pressure - Potential for precipitation"}
            </div>
          </div>
        )}
      </DetailPanel>
    </div>
  );
};

export default CurrentWeather;
