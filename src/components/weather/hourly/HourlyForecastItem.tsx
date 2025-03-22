import React, { memo, useMemo } from "react";
import WeatherIcon from "../shared/WeatherIcon";
import { getWeatherInfo } from "../../../utils/weatherCodeMap";
import { formatHour } from "../../../utils/formatting";
import { useSettings } from "../../../context/SettingsContext";
import { AppConfig } from "../../../config/appConfig";

interface HourlyForecastItemProps {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  isCurrentHour?: boolean;
}

const HourlyForecastItem: React.FC<HourlyForecastItemProps> = ({
  time,
  temperature,
  weatherCode,
  precipitationProbability,
  isCurrentHour = false,
}) => {
  const { settings } = useSettings();
  const weatherInfo = useMemo(() => getWeatherInfo(weatherCode), [weatherCode]);
  const hasPrecip = precipitationProbability > 0;

  const tempCelsius = temperature;
  const displayTemp = useMemo(() => {
    return settings.units.temperature === "celsius"
      ? temperature
      : AppConfig.utils.convertTemperature(temperature, "fahrenheit");
  }, [temperature, settings.units.temperature]);

  // Enhanced temperature color logic
  const tempColor = useMemo(() => {
    if (tempCelsius >= 35) return "text-red-500"; // Extreme heat
    if (tempCelsius >= 30) return "text-red-400"; // Very hot
    if (tempCelsius >= 25) return "text-orange-400"; // Hot
    if (tempCelsius >= 20) return "text-orange-300"; // Warm
    if (tempCelsius >= 15) return "text-yellow-300"; // Mild
    if (tempCelsius >= 10) return "text-green-300"; // Cool
    if (tempCelsius >= 5) return "text-blue-300"; // Cold
    if (tempCelsius >= 0) return "text-blue-400"; // Very cold
    if (tempCelsius >= -5) return "text-indigo-400"; // Freezing
    return "text-indigo-500"; // Extreme cold
  }, [tempCelsius]);

  // Get weather-specific gradient
  const weatherGradient = useMemo(() => {
    const icon = weatherInfo.icon;
    if (icon.includes("sun")) return "from-yellow-400/20 to-orange-500/20";
    if (icon.includes("cloud")) return "from-blue-300/20 to-gray-400/20";
    if (icon.includes("rain")) return "from-blue-400/20 to-blue-600/20";
    if (icon.includes("snow")) return "from-blue-100/20 to-blue-300/20";
    if (icon.includes("fog")) return "from-gray-300/20 to-gray-500/20";
    if (icon.includes("thunder")) return "from-yellow-400/20 to-purple-500/20";
    return "from-blue-400/20 to-indigo-500/20";
  }, [weatherInfo.icon]);

  // Glow effect background color
  const glowColor = useMemo(() => {
    if (weatherInfo.icon.includes("sun")) return "rgba(252, 211, 77, 0.3)";
    if (weatherInfo.icon.includes("rain")) return "rgba(96, 165, 250, 0.2)";
    return "rgba(255, 255, 255, 0.1)";
  }, [weatherInfo.icon]);

  return (
    <div
      className={`
        relative flex flex-col items-center min-w-[75px] flex-shrink-0 py-3 px-2.5 rounded-xl 
        backdrop-blur-sm
        ${
          isCurrentHour
            ? "bg-gradient-to-b from-white/25 to-white/15 border-2 border-white/30 shadow-lg"
            : "bg-gradient-to-b from-white/10 to-white/5 border border-white/10"
        }
      `}
    >
      {/* Weather-specific gradient overlay */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-b ${weatherGradient} opacity-${
          isCurrentHour ? "50" : "30"
        }`}
      />

      {/* Time display */}
      <div className="relative font-medium text-xs text-white/90 mb-1.5">
        {isCurrentHour ? (
          <span className="px-2 py-0.5 bg-white/30 rounded-full text-white text-[10px] font-bold tracking-wide">
            NOW
          </span>
        ) : (
          <span className="font-semibold">{formatHour(time)}</span>
        )}
      </div>

      {/* Weather icon - static version */}
      <div className="relative my-1.5">
        <WeatherIcon type={weatherInfo.icon} />
        {/* Glow effect */}
        <div
          className="absolute inset-0 -z-10 blur-md opacity-30"
          style={{
            backgroundColor: glowColor,
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Temperature with dynamic color */}
      <div className={`relative font-bold text-lg ${tempColor}`}>
        {Math.round(displayTemp)}°
      </div>

      {/* Precipitation probability - simplified */}
      {hasPrecip && (
        <div className="relative mt-2 flex flex-col items-center">
          <div className="h-1.5 w-12 bg-blue-900/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-300 to-blue-500"
              style={{ width: `${precipitationProbability}%` }}
            />
          </div>
          <span className="text-[10px] font-medium text-blue-200 mt-1">
            {precipitationProbability}%
          </span>
        </div>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(HourlyForecastItem);
