import { useEffect, useState } from "react";
// import LoadingSpinner from "./LoadingSpinner";

interface WeatherLoadingScreenProps {
  isLoading: boolean;
}

export default function WeatherLoadingScreen({
  isLoading,
}: WeatherLoadingScreenProps) {
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
    <div className={`weather-loading-container ${fadeOut ? "fade-out" : ""}`}>
      <div className="ambient-background">
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
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="loading-content">
        <div className="app-logo">
          <div className="logo-icon">
            <div className="sun-circle"></div>
            <div className="cloud-shape"></div>
          </div>
          <h1>Weather App</h1>
        </div>
        <div className="loading-indicator">
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <p>Loading your forecast...</p>
        </div>
      </div>
    </div>
  );
}
