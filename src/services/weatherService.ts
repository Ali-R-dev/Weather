import { WeatherData } from '../types/weather.types';
import { LocationInfo } from '../services/LocationService'; // Import LocationInfo

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export interface WeatherParams {
  latitude: number;
  longitude: number;
  timezone?: string;
}

export async function fetchWeatherData({ latitude, longitude, timezone = 'auto' }: WeatherParams) {
  const url = new URL(BASE_URL);

  // Set required parameters
  url.searchParams.append('latitude', latitude.toString());
  url.searchParams.append('longitude', longitude.toString());
  url.searchParams.append('timezone', timezone);

  // Set weather data we want to retrieve
  url.searchParams.append(
    'current',
    'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,is_day,uv_index'
  );
  url.searchParams.append('hourly', 'temperature_2m,precipitation_probability,weather_code');
  url.searchParams.append(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset'
  );

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    throw error;
  }
}

export const WeatherCacheService = {
  saveToCache(data: WeatherData, location: LocationInfo) {
    try {
      localStorage.setItem('weatherCache', JSON.stringify(data));
      localStorage.setItem('cachedLocation', JSON.stringify(location));
      localStorage.setItem('cacheTimestamp', JSON.stringify(new Date().toISOString()));
    } catch (e) {
      console.warn('Failed to cache weather data:', e);
    }
  },

  getFromCache() {
    try {
      const cachedData = localStorage.getItem('weatherCache');
      const cachedLocation = localStorage.getItem('cachedLocation');
      const cacheTimestamp = localStorage.getItem('cacheTimestamp');

      return {
        data: cachedData ? JSON.parse(cachedData) : null,
        location: cachedLocation ? JSON.parse(cachedLocation) : null,
        timestamp: cacheTimestamp ? new Date(JSON.parse(cacheTimestamp)) : null,
      };
    } catch (e) {
      console.error('Failed to load cached weather data:', e);
      return { data: null, location: null, timestamp: null };
    }
  },
};
