import React from 'react';
import { motion } from 'framer-motion';
import { TemperatureUnit } from '../../../context/SettingsContext';
import { AppConfig } from '../../../config/appConfig';
import TemperatureMain from './TemperatureMain';
import FeelsLike from './FeelsLike';
import WeatherIconAnimated from './WeatherIconAnimated';
import { useTranslation } from 'react-i18next';

interface TemperatureDisplayProps {
  temperature: number;
  feelsLike: number;
  weatherInfo: {
    label: string;
    icon: string;
    sunrise?: string;
    sunset?: string;
  };
  humidity: number;
  temperatureUnit: TemperatureUnit;
}

const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({
  temperature,
  feelsLike,
  weatherInfo,
  humidity,
  temperatureUnit,
}) => {
  const { t } = useTranslation();

  // Get unit symbol (°C or °F)
  const unitSymbol = AppConfig.units.temperature[temperatureUnit].symbol;

  // Calculate temperature difference text
  const tempDiff = Math.round(feelsLike - temperature);
  let tempDiffText: string;
  if (tempDiff === 0) {
    tempDiffText = t('same_as_actual');
  } else if (tempDiff > 0) {
    tempDiffText = t('feels_warmer', { diff: tempDiff });
  } else {
    tempDiffText = t('feels_colder', { diff: Math.abs(tempDiff) });
  }

  // Get comfort level based on temperature and humidity
  const comfortLevel = AppConfig.getComfortLevel(temperature, humidity, temperatureUnit);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="flex items-center justify-between mb-8"
    >
      {/* Temperature section with enhanced animation and styling */}
      <div>
        <TemperatureMain temperature={temperature} unitSymbol={unitSymbol} />
        <FeelsLike feelsLike={feelsLike} tempDiffText={tempDiffText} />

        <motion.div
          className="mt-3 flex items-center"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <span className="text-xl sm:text-2xl font-medium mr-3">{t(weatherInfo.label)}</span>
          <span
            className={`text-sm px-3 py-0.5 rounded-full ${comfortLevel.color} bg-white/10 backdrop-blur-sm border border-white/10`}
          >
            {comfortLevel.level}
          </span>
        </motion.div>
      </div>

      {/* Enhanced weather icon with animations and effects */}
      <WeatherIconAnimated
        icon={weatherInfo.icon}
        sunrise={weatherInfo.sunrise}
        sunset={weatherInfo.sunset}
      />
    </motion.div>
  );
};

export default TemperatureDisplay;
