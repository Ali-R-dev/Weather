import { TemperatureUnit, WindUnit } from "../context/SettingsContext";
import { AppConfig } from "../config/appConfig";

/**
 * Convert temperature between Celsius and Fahrenheit
 */
export function convertTemperature(
  temperature: number,
  unit: TemperatureUnit
): number {
  return AppConfig.utils.convertTemperature(temperature, unit);
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
  return `${roundedTemp}${AppConfig.utils.getUnitSymbol("temperature", unit)}`;
}

/**
 * Convert wind speed between km/h and mph
 */
export function convertWindSpeed(speedKmh: number, unit: WindUnit): number {
  return AppConfig.utils.convertWindSpeed(speedKmh, unit);
}

/**
 * Format wind speed for display with appropriate unit
 */
export function formatWindSpeed(speedKmh: number, unit: WindUnit): string {
  const convertedSpeed = convertWindSpeed(speedKmh, unit);
  const roundedSpeed = Math.round(convertedSpeed);
  return `${roundedSpeed} ${AppConfig.utils.getUnitSymbol("wind", unit)}`;
}
