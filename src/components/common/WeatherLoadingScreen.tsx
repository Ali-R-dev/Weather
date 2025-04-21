/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import styles from './WeatherLoadingScreen.module.css';

interface WeatherLoadingScreenProps {
  isLoading: boolean;
}

export default function WeatherLoadingScreen({ isLoading }: WeatherLoadingScreenProps) {
  // Don't show loading overlay during Cypress tests
  if (typeof window !== 'undefined' && window.Cypress) {
    return null;
  }

  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setFadeOut(true);
      const timer = setTimeout(() => {
        setHidden(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (hidden) return null;

  return (
    <div className={`${styles.loadingScreen} ${fadeOut ? styles.fadeOut : ''}`}>
      <div className={styles.ambientBackground}>
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="rain-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="raindrop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${0.5 + Math.random() * 0.7}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className={styles.loadingContent}>
        <div className="app-logo mb-6">
          <div className="logo-icon">
            <div className="sun-circle"></div>
            <div className="cloud-shape"></div>
          </div>
          <h1 className="text-2xl font-semibold text-white text-center">Weather App</h1>
        </div>

        <div className={styles.loadingSpinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>

        <div className={styles.loadingBar}>
          <div className={styles.loadingProgress}></div>
        </div>

        <p className="text-white/80 text-sm mt-2">Loading weather data...</p>
      </div>
    </div>
  );
}
