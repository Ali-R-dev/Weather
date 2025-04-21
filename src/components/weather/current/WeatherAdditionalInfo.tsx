import React from 'react';
import { motion } from 'framer-motion';
import styles from './CurrentWeather.module.css';

interface WeatherAdditionalInfoProps {
  pressure?: number;
}

const WeatherAdditionalInfo: React.FC<WeatherAdditionalInfoProps> = ({ pressure }) => {
  if (!pressure) return null;

  return (
    <motion.div
      className={styles.detailCard}
      initial={{
        boxShadow: '0 0px 0px 0px rgba(0, 0, 0, 0)', // Explicit initial value
      }}
      whileHover={{
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        y: -2,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.detailLabel}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={styles.detailIcon}
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5z"
            clipRule="evenodd"
          />
        </svg>
        Air Pressure
      </div>
      <div className="flex items-center">
        <span className={styles.detailValue}>{pressure}</span>
        <span className={styles.detailUnit}>hPa</span>
      </div>
      <div className="text-xs text-white/60 mt-1">
        {pressure > 1013
          ? 'High pressure - Generally fair weather'
          : 'Low pressure - Potential for precipitation'}
      </div>
    </motion.div>
  );
};

export default WeatherAdditionalInfo;
