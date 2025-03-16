import { useEffect, useRef } from "react";
import "./WeatherEffects.css";

interface RainEffectProps {
  intensity: "light" | "medium" | "heavy";
  isDay: boolean;
}

const RainEffect = ({ intensity, isDay }: RainEffectProps) => {
  const frontRowRef = useRef<HTMLDivElement>(null);
  const backRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create rain drops when component mounts
    makeItRain();

    // Clean up function
    return () => {
      if (frontRowRef.current) frontRowRef.current.innerHTML = "";
      if (backRowRef.current) backRowRef.current.innerHTML = "";
    };
  }, [intensity]);

  // Function to create rain drops
  const makeItRain = () => {
    if (!frontRowRef.current || !backRowRef.current) return;

    // Clear existing drops
    frontRowRef.current.innerHTML = "";
    backRowRef.current.innerHTML = "";

    let increment = 0;
    let drops = "";
    let backDrops = "";

    // Set drop count based on intensity
    const dropCount =
      intensity === "light" ? 70 : intensity === "medium" ? 100 : 150;

    while (increment < dropCount) {
      // Random values for animation variations
      const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
      const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);

      // Increment for positioning
      increment += randoFiver;

      // Create drops with randomized styling
      drops += `<div class="drop" style="left: ${increment}%; bottom: ${
        randoFiver + randoFiver - 1 + 100
      }%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
        <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
        <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
      </div>`;

      backDrops += `<div class="drop" style="right: ${increment}%; bottom: ${
        randoFiver + randoFiver - 1 + 100
      }%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
        <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
        <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
      </div>`;
    }

    // Apply the drops to the DOM
    frontRowRef.current.innerHTML = drops;
    backRowRef.current.innerHTML = backDrops;
  };

  return (
    <div className={`rain-container ${intensity} ${isDay ? "day" : "night"}`}>
      <div ref={frontRowRef} className="rain front-row"></div>
      <div ref={backRowRef} className="rain back-row"></div>
    </div>
  );
};

export default RainEffect;
