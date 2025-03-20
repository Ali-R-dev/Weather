import { TemperatureUnit, WindUnit } from "../context/SettingsContext";

/**
 * Convert temperature between Celsius and Fahrenheit
 */
export function convertTemperature(
  temperature: number,
  unit: TemperatureUnit
): number {
  if (unit === "celsius") {
    return temperature;
  } else {
    return (temperature * 9) / 5 + 32;
  }
}

/**
 * Format temperature for display with appropriate unit symbol
 */
export function formatTemperature(
  temperature: number,
  unit: TemperatureUnit
): string {
  const convertedTemp = convertTemperature(temperature, unit);
  const roundedTemp = Math.round(convertedTemp);
  return `${roundedTemp}°${unit === "celsius" ? "C" : "F"}`;
}

/**
 * Convert wind speed between km/h and mph
 */
export function convertWindSpeed(speedKmh: number, unit: WindUnit): number {
  if (unit === "kph") {
    return speedKmh;
  } else {
    return speedKmh * 0.621371;
  }
}

/**
 * Format wind speed for display with appropriate unit
 */
export function formatWindSpeed(speedKmh: number, unit: WindUnit): string {
  const convertedSpeed = convertWindSpeed(speedKmh, unit);
  const roundedSpeed = Math.round(convertedSpeed);
  return `${roundedSpeed} ${unit === "kph" ? "km/h" : "mph"}`;
}
