/* DayItem.tsx - Enhanced */
import React from 'react';
import { useTranslation } from 'react-i18next';
import WeatherIcon from '../shared/WeatherIcon';
import { getWeatherInfo } from '../../../utils/weatherCodeMap';
import { formatDay, formatDate } from '../../../utils/formatting';
import { useSettings } from '../../../context/SettingsContext';
import { AppConfig } from '../../../config/appConfig';

// Add native props support
type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

interface DayItemProps extends NativeButtonProps {
  day: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipProbability: number;
  isToday: boolean;
}

const DayItem: React.FC<DayItemProps> = ({
  day,
  maxTemp,
  minTemp,
  weatherCode,
  precipProbability,
  isToday,
  ...rest
}) => {
  const weatherInfo = getWeatherInfo(weatherCode);
  const hasPrecip = precipProbability > 0;
  const { settings } = useSettings();
  const { t } = useTranslation();

  const displayMaxTemp =
    settings.units.temperature === 'celsius'
      ? maxTemp
      : AppConfig.utils.convertTemperature(maxTemp, 'fahrenheit');

  const displayMinTemp =
    settings.units.temperature === 'celsius'
      ? minTemp
      : AppConfig.utils.convertTemperature(minTemp, 'fahrenheit');

  const maxTempCelsius = maxTemp;

  const getTempColor = (temp: number) => {
    if (temp >= 35) return 'text-red-500'; // Extreme heat
    if (temp >= 30) return 'text-red-400'; // Very hot
    if (temp >= 25) return 'text-orange-400'; // Hot
    if (temp >= 20) return 'text-orange-300'; // Warm
    if (temp >= 15) return 'text-yellow-300'; // Mild
    if (temp >= 10) return 'text-green-300'; // Cool
    if (temp >= 5) return 'text-blue-300'; // Cold
    if (temp >= 0) return 'text-blue-400'; // Very cold
    if (temp >= -5) return 'text-indigo-400'; // Freezing
    return 'text-indigo-500'; // Extreme cold
  };

  return (
    <button
      className={`
        relative flex items-center px-4 py-3 rounded-xl
        backdrop-blur-sm border gap-3
        w-full min-w-0
        sm:px-3 sm:py-2
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/70
        hover:shadow-lg hover:scale-[1.02]
        ${
          isToday
            ? 'border-white/40 bg-white/20 shadow-md shadow-yellow-100/10'
            : 'border-white/15 bg-white/10'
        }
      `}
      style={{
        fontSize: '1rem',
        maxWidth: '100%',
        cursor: 'pointer',
      }}
      {...rest}
      aria-label={`Forecast for ${formatDay(day)}: ${displayMaxTemp}° / ${displayMinTemp}°, ${
        weatherInfo.description
      }`}
      role="button"
    >
      {/* Day info */}
      <div className="flex flex-col min-w-[60px]">
        <div className="font-semibold text-sm text-white">{isToday ? t('today') : t(formatDay(day))}</div>
        <div className="text-xs text-white/70 mt-0.5">{formatDate(day)}</div>
      </div>

      {/* Weather icon */}
      <div className="flex items-center justify-center w-8">
        <WeatherIcon type={weatherInfo.icon} />
      </div>

      {/* Weather info and precipitation */}
      <div className="flex-grow flex flex-col md:flex-row md:items-center md:gap-2">
        {/* Weather description */}
        <span className="text-sm font-medium text-white/90 md:flex-grow">{t(weatherInfo.label)}</span>

        {/* Precipitation indicator - below on mobile, inline on larger screens */}
        {hasPrecip && (
          <div className="flex items-center gap-1 mt-1 md:mt-0 md:ml-auto md:mr-2">
            <div className="h-1 w-12 bg-blue-900/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400/70 rounded-full"
                style={{ width: `${precipProbability}%` }}
              />
            </div>
            <span className="text-xs font-medium text-blue-200 whitespace-nowrap">
              {precipProbability}%
            </span>
          </div>
        )}
      </div>

      {/* Temperature */}
      <div className="flex items-center gap-1.5 min-w-[70px] shrink-0 justify-end ml-1">
        <span className={`font-bold text-sm whitespace-nowrap ${getTempColor(maxTempCelsius)}`}>
          {Math.round(displayMaxTemp)}°
        </span>
        <span className="text-sm text-white/60 whitespace-nowrap">
          {Math.round(displayMinTemp)}°
        </span>
      </div>
    </button>
  );
};

export default DayItem;
