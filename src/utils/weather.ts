import { TemperatureUnit } from "../context/SettingsContext";
import { AppConfig } from "../config/appConfig";

/**
 * Get information about UV index
 */
export const getUVIndexInfo = (uvIndex: number) => {
  if (uvIndex <= 2) return { label: "Low", color: "text-green-400" };
  if (uvIndex <= 5) return { label: "Moderate", color: "text-yellow-400" };
  if (uvIndex <= 7) return { label: "High", color: "text-orange-400" };
  if (uvIndex <= 10) return { label: "Very High", color: "text-red-500" };
  return { label: "Extreme", color: "text-purple-500" };
};

/**
 * Get wind direction from degrees
 */
export const getWindDirection = (degrees: number) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

/**
 * Calculate comfort level based on temperature and humidity
 */
export const getComfortLevel = (
  temperature: number,
  humidity: number,
  unit: TemperatureUnit = "celsius"
) => {
  return AppConfig.getComfortLevel(temperature, humidity, unit);
};
