import { useEffect, useState } from "react";
import "./WeatherEffects.css";

interface FogEffectProps {
  isDay: boolean;
}

const FogEffect = ({ isDay }: FogEffectProps) => {
  const [fogLayers, setFogLayers] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // Create multiple fog layers with different properties
    const layers = [];
    const layerCount = 5;

    for (let i = 0; i < layerCount; i++) {
      layers.push(
        <div
          key={`fog-layer-${i}`}
          className="fog-layer"
          style={{
            opacity: isDay ? 0.2 + i * 0.05 : 0.15 + i * 0.03,
            animationDuration: `${40 + i * 15}s`,
            animationDelay: `${i * 3}s`,
            top: `${i * 20}%`,
          }}
        />
      );
    }

    setFogLayers(layers);
  }, [isDay]);

  return (
    <div className={`fog-container ${isDay ? "day" : "night"}`}>
      {fogLayers}
    </div>
  );
};

export default FogEffect;
