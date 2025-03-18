import { useEffect, useState } from "react";
import "./WeatherEffects.css";

interface CloudyEffectProps {
  isDay: boolean;
}

interface CloudProps {
  size: number;
  top: number;
  left: number;
  speed: number;
  delay: number;
  opacity: number;
}

const CloudyEffect = ({ isDay }: CloudyEffectProps) => {
  const [clouds, setClouds] = useState<CloudProps[]>([]);

  useEffect(() => {
    // Generate random clouds
    const cloudCount = 7;
    const newClouds: CloudProps[] = [];

    for (let i = 0; i < cloudCount; i++) {
      newClouds.push({
        size: Math.random() * 20 + 80, // 80-100% size
        top: Math.random() * 70,
        left: Math.random() * 50 - 10,
        speed: Math.random() * 5 + 8, // 8-13s (faster)
        delay: Math.random() * 5,
        opacity: isDay
          ? Math.random() * 0.3 + 0.6 // 0.6-0.9 for day
          : Math.random() * 0.2 + 0.35, // 0.35-0.55 for night (more visible)
      });
    }

    setClouds(newClouds);
  }, [isDay]);

  return (
    <div className={`cloudy-container ${isDay ? "day" : "night"}`}>
      {clouds.map((cloud, index) => (
        <div
          key={`cloud-${index}`}
          className="modern-cloud"
          style={{
            top: `${cloud.top}%`,
            left: `${cloud.left}%`,
            opacity: cloud.opacity,
            animationDuration: `${cloud.speed}s`,
            animationDelay: `${cloud.delay}s`,
            transform: `scale(${cloud.size / 100})`,
          }}
        >
          <div className="cloud-part part1"></div>
          <div className="cloud-part part2"></div>
          <div className="cloud-part part3"></div>
          <div className="cloud-part part4"></div>
          <div className="cloud-part part5"></div>
        </div>
      ))}
    </div>
  );
};

export default CloudyEffect;
