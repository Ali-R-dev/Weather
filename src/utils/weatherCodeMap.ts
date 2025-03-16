export interface WeatherInfo {
  label: string;
  icon: string;
  className: string;
}

export const weatherCodeMap: Record<number, WeatherInfo> = {
  0: {
    label: "Clear sky",
    icon: "sun",
    className: "bg-sunny text-white",
  },
  1: {
    label: "Mainly clear",
    icon: "sun",
    className: "bg-sunny text-white",
  },
  2: {
    label: "Partly cloudy",
    icon: "cloud-sun",
    className: "bg-cloudy text-white",
  },
  3: {
    label: "Overcast",
    icon: "cloud",
    className: "bg-cloudy text-white",
  },
  45: {
    label: "Fog",
    icon: "cloud-fog",
    className: "bg-foggy text-text-dark",
  },
  48: {
    label: "Depositing rime fog",
    icon: "cloud-fog",
    className: "bg-foggy text-text-dark",
  },
  51: {
    label: "Light drizzle",
    icon: "cloud-drizzle",
    className: "bg-rainy text-white",
  },
  53: {
    label: "Moderate drizzle",
    icon: "cloud-drizzle",
    className: "bg-rainy text-white",
  },
  55: {
    label: "Dense drizzle",
    icon: "cloud-drizzle",
    className: "bg-rainy text-white",
  },
  56: {
    label: "Light freezing drizzle",
    icon: "cloud-sleet",
    className: "bg-rainy text-white",
  },
  57: {
    label: "Dense freezing drizzle",
    icon: "cloud-sleet",
    className: "bg-rainy text-white",
  },
  61: {
    label: "Slight rain",
    icon: "cloud-rain",
    className: "bg-rainy text-white",
  },
  63: {
    label: "Moderate rain",
    icon: "cloud-rain",
    className: "bg-rainy text-white",
  },
  65: {
    label: "Heavy rain",
    icon: "cloud-rain-heavy",
    className: "bg-rainy text-white",
  },
  66: {
    label: "Light freezing rain",
    icon: "cloud-sleet",
    className: "bg-rainy text-white",
  },
  67: {
    label: "Heavy freezing rain",
    icon: "cloud-sleet",
    className: "bg-rainy text-white",
  },
  71: {
    label: "Slight snow",
    icon: "cloud-snow",
    className: "bg-snowy text-text-dark",
  },
  73: {
    label: "Moderate snow",
    icon: "cloud-snow",
    className: "bg-snowy text-text-dark",
  },
  75: {
    label: "Heavy snow",
    icon: "cloud-snow",
    className: "bg-snowy text-text-dark",
  },
  77: {
    label: "Snow grains",
    icon: "cloud-snow",
    className: "bg-snowy text-text-dark",
  },
  80: {
    label: "Slight rain showers",
    icon: "cloud-rain",
    className: "bg-rainy text-white",
  },
  81: {
    label: "Moderate rain showers",
    icon: "cloud-rain",
    className: "bg-rainy text-white",
  },
  82: {
    label: "Violent rain showers",
    icon: "cloud-rain-heavy",
    className: "bg-rainy text-white",
  },
  85: {
    label: "Slight snow showers",
    icon: "cloud-snow",
    className: "bg-snowy text-text-dark",
  },
  86: {
    label: "Heavy snow showers",
    icon: "cloud-snow",
    className: "bg-snowy text-text-dark",
  },
  95: {
    label: "Thunderstorm",
    icon: "cloud-lightning",
    className: "bg-stormy text-white",
  },
  96: {
    label: "Thunderstorm with slight hail",
    icon: "cloud-lightning-rain",
    className: "bg-stormy text-white",
  },
  99: {
    label: "Thunderstorm with heavy hail",
    icon: "cloud-hail",
    className: "bg-stormy text-white",
  },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return (
    weatherCodeMap[code] || {
      label: "Unknown",
      icon: "question",
      className: "bg-gray-500 text-white",
    }
  );
}
