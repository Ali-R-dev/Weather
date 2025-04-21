import { useEffect, useState } from 'react';
import './WeatherEffects.css';

interface SnowEffectProps {
  intensity: 'light' | 'heavy';
  isDay: boolean;
}

const SnowEffect = ({ intensity, isDay }: SnowEffectProps) => {
  const [snowflakes, setSnowflakes] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Number of snowflakes based on intensity
    const flakeCount = intensity === 'light' ? 12 : 24;

    // Create snowflakes
    const flakes = Array.from({ length: flakeCount }).map((_, index) => (
      <div
        key={index}
        className="snowflake"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      >
        <div className="inner">❅</div>
      </div>
    ));

    setSnowflakes(flakes);
  }, [intensity]);

  return (
    <div className={`snowflakes ${intensity} ${isDay ? 'day' : 'night'}`} aria-hidden="true">
      {snowflakes}
    </div>
  );
};

export default SnowEffect;
