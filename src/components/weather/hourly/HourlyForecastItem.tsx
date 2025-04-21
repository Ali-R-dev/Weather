import React from 'react';
import { motion } from 'framer-motion';
import WeatherIcon from '../shared/WeatherIcon';
import { getWeatherInfo } from '../../../utils/weatherCodeMap';
import { formatHour } from '../../../utils/formatting';
import { useSettings } from '../../../context/SettingsContext';
import { AppConfig } from '../../../config/appConfig';
import styles from '../hourly/HourlyForecast.module.css';

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
  const weatherInfo = getWeatherInfo(weatherCode);
  const hasPrecip = precipitationProbability > 0;

  // const tempCelsius = temperature;
  const displayTemp =
    settings.units.temperature === 'celsius'
      ? temperature
      : AppConfig.utils.convertTemperature(temperature, 'fahrenheit');

  return (
    <motion.button
      className={`group flex flex-col items-center w-full px-2 py-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 border border-transparent hover:border-white/30 bg-white/10 transition-colors shadow-sm ${
        styles.hourlyItem
      } ${isCurrentHour ? styles.current : ''}`}
      tabIndex={0}
      aria-label={`Forecast for ${formatHour(time)}: ${displayTemp}°, ${
        weatherInfo?.description || ''
      }`}
      role="button"
      style={{ cursor: 'pointer' }}
    >
      {/* Time display */}
      <div className={styles.timeText}>
        {isCurrentHour ? (
          <span className="px-2 py-0.5 bg-white/30 rounded-full text-white text-[10px] font-bold tracking-wide">
            NOW
          </span>
        ) : (
          <span className="font-semibold">{formatHour(time)}</span>
        )}
      </div>

      {/* Weather icon */}
      <motion.div
        className="relative my-1.5"
        animate={{
          y: [0, 2, 0],
          rotate: weatherInfo.icon.includes('wind') ? [0, 2, 0, -2, 0] : 0,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <WeatherIcon type={weatherInfo.icon} />
        {/* Glow effect */}
        <div
          className="absolute inset-0 -z-10 blur-md opacity-30 scale-125"
          style={{
            backgroundColor: weatherInfo.icon.includes('sun')
              ? 'rgba(252, 211, 77, 0.3)'
              : weatherInfo.icon.includes('rain')
              ? 'rgba(96, 165, 250, 0.2)'
              : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
          }}
        />
      </motion.div>

      {/* Temperature */}
      <div className={styles.temperature}>{Math.round(displayTemp)}°</div>

      {/* Precipitation probability */}
      {hasPrecip && (
        <div className={styles.precipChance}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.precipIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
            />
          </svg>
          <span>{precipitationProbability}%</span>
        </div>
      )}
    </motion.button>
  );
};

export default HourlyForecastItem;
