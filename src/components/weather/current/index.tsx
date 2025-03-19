import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WeatherData } from "../../../types/weather.types";
import { getWeatherInfo } from "../../../utils/weatherCodeMap";
import { useWeather } from "../../../context/WeatherContext";
import { useTheme } from "../../../context/ThemeContext";

import WeatherHeader from "./WeatherHeader";
import TemperatureDisplay from "./TemperatureDisplay";
import MetricsGrid from "./MetricsGrid";
import DetailPanel from "./DetailPanel";
import SunriseSunset from "./SunriseSunset";
import ExpandToggle from "../../ui/ExpandToggle";

interface CurrentWeatherProps {
  data: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  const { currentLocation } = useWeather();
  const { applyTheme } = useTheme();
  const [showDetails, setShowDetails] = useState(false);

  const weatherInfo = getWeatherInfo(data.current.weather_code);

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
      />

      <TemperatureDisplay
        temperature={data.current.temperature_2m}
        feelsLike={data.current.apparent_temperature}
        weatherInfo={weatherInfo}
        humidity={data.current.relative_humidity_2m}
      />

      <MetricsGrid
        humidity={data.current.relative_humidity_2m}
        windSpeed={data.current.wind_speed_10m}
        windDirection={data.current.wind_direction_10m}
        precipitation={data.current.precipitation}
        uvIndex={data.current.uv_index}
        precipitationProbability={data.daily?.precipitation_probability_max[0]}
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
          />
        )}

        {/* Additional panels can be added here */}
        {data.current.pressure && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">Air Pressure</div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 mr-1 text-green-300"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base font-medium">
                {data.current.pressure} hPa
              </span>
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
