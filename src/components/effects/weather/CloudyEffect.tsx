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
  scale: number;
}

const CloudyEffect = ({ isDay }: CloudyEffectProps) => {
  const [clouds, setClouds] = useState<CloudProps[]>([]);

  useEffect(() => {
    // Generate random clouds with better distribution
    const cloudCount = 8;
    const newClouds: CloudProps[] = [];

    // Create clouds distributed across the viewport
    for (let i = 0; i < cloudCount; i++) {
      newClouds.push({
        size: Math.random() * 20 + 80, // 80-100% size
        top: Math.random() * 60, // Only in top 60% of screen
        left: i * (100 / cloudCount), // Evenly distribute horizontally
        speed: Math.random() * 40 + 60, // 60-100s (slower, more natural)
        delay: -Math.random() * 30, // Some clouds already mid-animation
        opacity: isDay
          ? Math.random() * 0.2 + 0.7 // 0.7-0.9 for day
          : Math.random() * 0.2 + 0.4, // 0.4-0.6 for night
        scale: Math.random() * 0.6 + 0.7, // 0.7-1.3 varied sizes
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
            transform: `scale(${cloud.scale})`,
          }}
        >
          <svg
            className="cloud-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 120"
            width="200"
            height="120"
          >
            <path
              className={
                isDay ? "cloud-path day-cloud" : "cloud-path night-cloud"
              }
              d="M150,90H60c-16.6,0-30-13.4-30-30s13.4-30,30-30c2.6,0,5.1,0.3,7.5,1C74.2,18.6,86.9,10,100,10c16.9,0,31,12.5,33.7,28.7c1.4-0.4,2.9-0.7,4.3-0.7c8.8,0,16,7.2,16,16s-7.2,16-16,16c-4.4,0-8.4-1.8-11.3-4.7C160.5,75.6,156.1,90,150,90z"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default CloudyEffect;
