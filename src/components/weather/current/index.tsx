import React, { useState, useEffect } from "react";
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
import WeatherAdditionalInfo from "./WeatherAdditionalInfo";
import WeatherDetailsToggle from "./WeatherDetailsToggle";

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

      <WeatherDetailsToggle
        expanded={showDetails}
        onToggle={() => setShowDetails(!showDetails)}
      />

      <DetailPanel show={showDetails}>
        {/* Sunrise/Sunset (if available) */}
        {data.daily?.sunrise && data.daily?.sunset && (
          <SunriseSunset
            sunrise={data.daily.sunrise[0]}
            sunset={data.daily.sunset[0]}
            timeFormat={settings.timeFormat}
          />
        )}

        {/* Additional weather details */}
        <WeatherAdditionalInfo pressure={data.current.pressure} />
      </DetailPanel>
    </div>
  );
};

export default CurrentWeather;
