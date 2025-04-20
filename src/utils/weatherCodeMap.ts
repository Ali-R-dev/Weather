export interface WeatherInfo {
  label: string;
  icon: string;
  className: string;
  description: string;
}

const weatherCodes: { [key: number]: WeatherInfo } = {
  0: {
    label: "Clear sky",
    icon: "sun",
    className: "bg-sunny text-white",
    description: "Clear sky with no clouds."
  },
  1: {
    label: "Mainly clear",
    icon: "sun",
    className: "bg-sunny text-white",
    description: "Mainly clear sky with few clouds."
  },
  2: {
    label: "Partly cloudy",
    icon: "cloud-sun",
    className: "bg-partly-cloudy text-white",
    description: "Partly cloudy sky."
  },
  3: {
    label: "Overcast",
    icon: "cloud",
    className: "bg-cloudy text-white",
    description: "Overcast sky, mostly covered with clouds."
  },
  45: {
    label: "Fog",
    icon: "cloud-fog",
    className: "bg-foggy text-gray-800",
    description: "Foggy conditions."
  },
  48: {
    label: "Depositing rime fog",
    icon: "cloud-fog",
    className: "bg-foggy text-gray-800",
    description: "Fog with rime deposits."
  },
  51: {
    label: "Light drizzle",
    icon: "cloud-drizzle",
    className: "bg-rainy text-white",
    description: "Light drizzle precipitation."
  },
  53: {
    label: "Moderate drizzle",
    icon: "cloud-drizzle",
    className: "bg-rainy text-white",
    description: "Moderate drizzle precipitation."
  },
  55: {
    label: "Dense drizzle",
    icon: "cloud-drizzle",
    className: "bg-rainy text-white",
    description: "Dense drizzle precipitation."
  },
  56: {
    label: "Light freezing drizzle",
    icon: "cloud-sleet",
    className: "bg-rainy text-white",
    description: "Light freezing drizzle precipitation."
  },
  57: {
    label: "Dense freezing drizzle",
    icon: "cloud-sleet",
    className: "bg-rainy text-white",
    description: "Dense freezing drizzle precipitation."
  },
  61: {
    label: "Slight rain",
    icon: "cloud-rain",
    className: "bg-rainy text-white",
    description: "Slight rain precipitation."
  },
  63: {
    label: "Moderate rain",
    icon: "cloud-rain",
    className: "bg-rainy text-white",
    description: "Moderate rain precipitation."
  },
  65: {
    label: "Heavy rain",
    icon: "cloud-rain",
    className: "bg-rainy text-white",
    description: "Heavy rain precipitation."
  },
  66: {
    label: "Light freezing rain",
    icon: "cloud-sleet",
    className: "bg-rainy text-white",
    description: "Light freezing rain precipitation."
  },
  67: {
    label: "Heavy freezing rain",
    icon: "cloud-sleet",
    className: "bg-rainy text-white",
    description: "Heavy freezing rain precipitation."
  },
  71: {
    label: "Slight snow fall",
    icon: "cloud-snow",
    className: "bg-snowy text-white",
    description: "Slight snow fall."
  },
  73: {
    label: "Moderate snow fall",
    icon: "cloud-snow",
    className: "bg-snowy text-white",
    description: "Moderate snow fall."
  },
  75: {
    label: "Heavy snow fall",
    icon: "cloud-snow",
    className: "bg-snowy text-white",
    description: "Heavy snow fall."
  },
  77: {
    label: "Snow grains",
    icon: "cloud-snow",
    className: "bg-snowy text-white",
    description: "Snow grains."
  },
  80: {
    label: "Slight rain showers",
    icon: "cloud-rain",
    className: "bg-rainy text-white",
    description: "Slight rain showers."
  },
  81: {
    label: "Moderate rain showers",
    icon: "cloud-rain",
    className: "bg-rainy text-white",
    description: "Moderate rain showers."
  },
  82: {
    label: "Violent rain showers",
    icon: "cloud-rain",
    className: "bg-rainy text-white",
    description: "Violent rain showers."
  },
  85: {
    label: "Slight snow showers",
    icon: "cloud-snow",
    className: "bg-snowy text-white",
    description: "Slight snow showers."
  },
  86: {
    label: "Heavy snow showers",
    icon: "cloud-snow",
    className: "bg-snowy text-white",
    description: "Heavy snow showers."
  },
  95: {
    label: "Thunderstorm",
    icon: "cloud-lightning",
    className: "bg-stormy text-white",
    description: "Thunderstorm with lightning."
  },
  96: {
    label: "Thunderstorm with slight hail",
    icon: "cloud-hail",
    className: "bg-stormy text-white",
    description: "Thunderstorm with slight hail."
  },
  99: {
    label: "Thunderstorm with heavy hail",
    icon: "cloud-hail",
    className: "bg-stormy text-white",
    description: "Thunderstorm with heavy hail."
  },
};

export function getWeatherInfo(code: number): WeatherInfo {
  if (code in weatherCodes) {
    return weatherCodes[code];
  }

  // Default fallback
  return {
    label: "Unknown",
    icon: "cloud",
    className: "bg-cloudy text-white",
    description: "Unknown weather condition."
  };
}
