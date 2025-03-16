const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export interface WeatherParams {
  latitude: number;
  longitude: number;
  timezone?: string;
}

export async function fetchWeatherData({
  latitude,
  longitude,
  timezone = "auto",
}: WeatherParams) {
  const url = new URL(BASE_URL);

  // Set required parameters
  url.searchParams.append("latitude", latitude.toString());
  url.searchParams.append("longitude", longitude.toString());
  url.searchParams.append("timezone", timezone);

  // Set weather data we want to retrieve
  url.searchParams.append(
    "current",
    "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,is_day"
  );
  url.searchParams.append(
    "hourly",
    "temperature_2m,precipitation_probability,weather_code"
  );
  url.searchParams.append(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max"
  );

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    throw error;
  }
}
