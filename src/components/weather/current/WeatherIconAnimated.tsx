import React from 'react';
import { motion } from 'framer-motion';
import WeatherIcon from '../shared/WeatherIcon';

interface WeatherIconAnimatedProps {
  icon: string;
  sunrise?: string;
  sunset?: string;
}

const WeatherIconAnimated: React.FC<WeatherIconAnimatedProps> = ({ icon, sunrise, sunset }) => {
  const getBackgroundColor = () => {
    if (icon.includes('sun')) return '#FCD34D';
    if (icon.includes('rain')) return '#60A5FA';
    if (icon.includes('snow')) return '#E5E7EB';
    if (icon.includes('lightning')) return '#F59E0B';
    return '#F3F4F6';
  };

  // Only show sun or moon when appropriate for time of day, including partial cloudy logic
  let displayIcon = icon;
  if (sunrise && sunset) {
    const now = new Date();
    const sunriseDate = new Date(sunrise);
    const sunsetDate = new Date(sunset);
    const isNight = now < sunriseDate || now > sunsetDate;
    // Handle all partly cloudy cases
    if (icon === 'partly-cloudy' || icon === 'partly-cloudy-day' || icon === 'cloud-sun') {
      displayIcon = isNight ? 'partly-cloudy-night' : 'partly-cloudy-day';
    } else if (icon === 'partly-cloudy-night' || icon === 'cloud-moon') {
      displayIcon = 'partly-cloudy-night';
    } else if (icon.includes('sun')) {
      displayIcon = isNight ? 'moon' : icon;
    } else if (icon.includes('clear-day')) {
      displayIcon = isNight ? 'clear-night' : icon;
    }
  }

  return (
    <motion.div
      key="weather-icon"
      className="relative flex items-center justify-center"
      style={{ width: '3.5rem', height: '3.5rem', minWidth: '3.5rem', minHeight: '3.5rem' }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.7,
        delay: 0.4,
        type: 'spring',
        stiffness: 80,
      }}
    >
      <motion.div
        className="absolute inset-0 blur-2xl opacity-20 scale-125"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundColor: getBackgroundColor(),
        }}
      />

      <motion.div
        animate={{
          y: [0, -5, 0],
          scale: displayIcon.includes('sun') ? [1, 1.05, 1] : [1, 1, 1],
          rotate: displayIcon.includes('wind') ? [0, 3, 0, -3, 0] : 0,
        }}
        transition={{
          duration: displayIcon.includes('sun') ? 6 : 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <WeatherIcon type={displayIcon} size="large" />
      </motion.div>
    </motion.div>
  );
};

export default WeatherIconAnimated;
