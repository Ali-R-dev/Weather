import { useEffect, useRef } from "react";
import RainEffect from "./RainEffect";
import "./WeatherEffects.css";

interface StormyEffectProps {
  isDay: boolean;
}

const StormyEffect = ({ isDay }: StormyEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to create lightning flash
    const createLightning = () => {
      if (!containerRef.current) return;

      // Create a lightning flash element
      const flash = document.createElement("div");
      flash.className = "lightning-flash";
      containerRef.current.appendChild(flash);

      // Remove the flash after animation completes
      setTimeout(() => {
        if (flash.parentNode === containerRef.current && containerRef.current) {
          containerRef.current.removeChild(flash);
        }
      }, 250);

      // Schedule next lightning at random interval
      setTimeout(createLightning, Math.random() * 3000 + 2000);
    };

    // Start lightning effect
    const timeout = setTimeout(createLightning, Math.random() * 2000);

    // Cleanup
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`stormy-container ${isDay ? "day" : "night"}`}
    >
      <RainEffect intensity="heavy" isDay={isDay} />
    </div>
  );
};

export default StormyEffect;
