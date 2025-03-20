import {
  TemperatureUnit,
  WindUnit,
  TimeFormat,
} from "../context/SettingsContext";

/**
 * Central configuration for the Weather App
 */
export const AppConfig = {
  // Temperature thresholds (all in Celsius)
  temperature: {
    celsius: {
      hot: 30,
      warm: 26,
      chilly: 15,
      cold: 5,
      freezing: 0,
    },
    fahrenheit: {
      hot: 86, // 30°C
      warm: 79, // 26°C
      chilly: 59, // 15°C
      cold: 41, // 5°C
      freezing: 32, // 0°C
    },
  },

  // Utility functions for temperature conversion
  utils: {
    // Convert between Celsius and Fahrenheit
    convertTemperature: (value: number, toUnit: TemperatureUnit): number => {
      if (toUnit === "celsius") {
        // If target unit is Celsius, assume input is Fahrenheit
        return (value - 32) * (5 / 9);
      } else {
        // If target unit is Fahrenheit, assume input is Celsius
        return (value * 9) / 5 + 32;
      }
    },

    // Convert any temperature to Celsius for internal calculations
    toCelsius: (value: number, fromUnit: TemperatureUnit): number => {
      return fromUnit === "celsius" ? value : (value - 32) * (5 / 9);
    },

    getUnitSymbol: (
      type: "temperature" | "wind",
      unit: TemperatureUnit | WindUnit
    ): string => {
      if (type === "temperature") {
        return unit === "celsius" ? "°C" : "°F";
      } else {
        return unit === "kph" ? "km/h" : "mph";
      }
    },

    // Convert wind speed
    convertWindSpeed: (value: number, toUnit: WindUnit): number => {
      const config = AppConfig.units.wind;
      if (toUnit === "kph") {
        return value;
      } else {
        return value * config.mph.conversionFactor;
      }
    },
  },

  // Get comfort level based on temperature and humidity
  getComfortLevel: (
    temperature: number,
    humidity: number,
    unit: TemperatureUnit = "celsius"
  ) => {
    // Convert temperature to Celsius for internal calculations
    const tempCelsius = AppConfig.utils.toCelsius(temperature, unit);

    // Use Celsius thresholds for consistency
    const thresholds = AppConfig.temperature.celsius;

    if (tempCelsius > thresholds.hot && humidity > 70)
      return { level: "Uncomfortable", color: "text-red-500" };
    if (tempCelsius > thresholds.warm && humidity > 60)
      return { level: "Warm", color: "text-orange-400" };
    if (tempCelsius < thresholds.cold)
      return { level: "Cold", color: "text-blue-400" };
    if (tempCelsius < thresholds.chilly)
      return { level: "Cool", color: "text-cyan-400" };
    return { level: "Comfortable", color: "text-green-400" };
  },

  // Units configuration
  units: {
    temperature: {
      celsius: {
        symbol: "°C",
        conversionFactor: 1,
        offset: 0,
      },
      fahrenheit: {
        symbol: "°F",
        conversionFactor: 9 / 5,
        offset: 32,
      },
    },
    wind: {
      kph: {
        symbol: "km/h",
        conversionFactor: 1,
      },
      mph: {
        symbol: "mph",
        conversionFactor: 0.621371,
      },
    },
  },

  // Weather condition categories
  weatherConditions: {
    sunny: [0, 1],
    partlyCloudy: [2, 3],
    cloudy: [4, 5, 6, 7],
    fog: [45, 48],
    drizzle: [51, 53, 55],
    rain: [61, 63, 65, 80, 81, 82],
    snow: [71, 73, 75, 77, 85, 86],
    thunderstorm: [95, 96, 99],
  },

  // Default settings
  defaults: {
    temperatureUnit: "celsius" as TemperatureUnit,
    windUnit: "kph" as WindUnit,
    timeFormat: "12h" as TimeFormat,
    reduceMotion: false,
    highContrast: false,
  },

  // Format options
  timeFormats: {
    "12h": {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
    },
    "24h": {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    },
  },
};
