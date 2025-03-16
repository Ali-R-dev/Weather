import { memo, useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import RainEffect from "./weather/RainEffect";
import SnowEffect from "./weather/SnowEffect";
import FogEffect from "./weather/FogEffect";
import SunnyEffect from "./weather/SunnyEffect";
import CloudyEffect from "./weather/CloudyEffect";
import StormyEffect from "./weather/StormyEffect";

interface BackgroundEffectProps {
  weatherCode: number;
  isDay: boolean;
  intensity?: "light" | "medium" | "heavy";
}

const BackgroundEffect = memo(
  ({ weatherCode, isDay, intensity = "medium" }: BackgroundEffectProps) => {
    const { currentTheme } = useTheme();
    const [animationKey, setAnimationKey] = useState<string>("");

    // Map weather code to animation key
    useEffect(() => {
      // Get animation key based on weather code and time of day
      const getAnimationKey = () => {
        // Clear skies
        if ([0, 1].includes(weatherCode)) {
          return isDay ? "sunny" : "night-clear";
        }

        // Cloudy conditions
        if ([2, 3].includes(weatherCode)) {
          return isDay ? "cloudy" : "night-cloudy";
        }

        // Fog conditions
        if ([45, 48].includes(weatherCode)) {
          return isDay ? "foggy" : "night-foggy";
        }

        // Rain conditions - use intensity here
        if (
          [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(
            weatherCode
          )
        ) {
          const rainIntensity = [51, 56, 61, 80].includes(weatherCode)
            ? "light"
            : [53, 57, 63, 66, 81].includes(weatherCode)
            ? "medium"
            : "heavy";

          return isDay
            ? `rainy-${rainIntensity}`
            : `night-rainy-${rainIntensity}`;
        }

        // Snow conditions
        if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
          const snowIntensity = [71, 85].includes(weatherCode)
            ? "light"
            : "heavy";

          return isDay
            ? `snowy-${snowIntensity}`
            : `night-snowy-${snowIntensity}`;
        }

        // Thunderstorm conditions
        if ([95, 96, 99].includes(weatherCode)) {
          return isDay ? "stormy" : "night-stormy";
        }

        // Default fallback
        return isDay ? "sunny" : "night-clear";
      };

      setAnimationKey(getAnimationKey());
    }, [weatherCode, isDay, intensity]);

    // Render the appropriate weather effect based on animation key
    const renderWeatherEffect = () => {
      if (animationKey.includes("rainy")) {
        const intensity = animationKey.includes("light")
          ? "light"
          : animationKey.includes("heavy")
          ? "heavy"
          : "medium";
        return <RainEffect intensity={intensity} isDay={isDay} />;
      }

      if (animationKey.includes("snowy")) {
        const intensity = animationKey.includes("heavy") ? "heavy" : "light";
        return <SnowEffect intensity={intensity} isDay={isDay} />;
      }

      if (animationKey.includes("foggy")) {
        return <FogEffect isDay={isDay} />;
      }

      if (animationKey.includes("stormy")) {
        return <StormyEffect isDay={isDay} />;
      }

      if (animationKey.includes("cloudy")) {
        return <CloudyEffect isDay={isDay} />;
      }

      // Default sunny/clear effect
      return <SunnyEffect isDay={isDay} />;
    };

    return (
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${currentTheme}`}
      >
        {renderWeatherEffect()}
      </div>
    );
  }
);

export default BackgroundEffect;
