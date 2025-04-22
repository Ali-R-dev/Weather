import React from 'react';
import { useTranslation } from 'react-i18next';

interface HourlyForecastSummaryProps {
  highTemp: number;
  lowTemp: number;
}

const HourlyForecastSummary: React.FC<HourlyForecastSummaryProps> = ({ highTemp, lowTemp }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-white">{t('hourly_forecast')}</h2>
      <div className="text-sm text-white/80">
        <span>
          {lowTemp}° - {highTemp}°
        </span>
      </div>
    </div>
  );
};

export default HourlyForecastSummary;
