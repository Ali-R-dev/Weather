export type WeatherTheme =
  | "sunny"
  | "night-clear"
  | "cloudy"
  | "night-cloudy"
  | "rainy"
  | "night-rainy"
  | "snowy"
  | "night-snowy"
  | "foggy"
  | "night-foggy"
  | "stormy"
  | "night-stormy";

interface ThemeConfig {
  gradient: string;
  textColor: string;
  animationIntensity?: "low" | "medium" | "high";
}

export const weatherThemes: Record<WeatherTheme, ThemeConfig> = {
  sunny: {
    gradient: "linear-gradient(180deg, #2196f3 0%, #42a5f5 100%)",
    textColor: "white",
    animationIntensity: "medium",
  },
  "night-clear": {
    gradient: "linear-gradient(180deg, #1a237e 0%, #3949ab 100%)",
    textColor: "white",
    animationIntensity: "low",
  },
  cloudy: {
    gradient: "linear-gradient(180deg, #78909c 0%, #90a4ae 100%)",
    textColor: "white",
    animationIntensity: "medium",
  },
  "night-cloudy": {
    gradient: "linear-gradient(180deg, #263238 0%, #37474f 100%)",
    textColor: "white",
    animationIntensity: "low",
  },
  rainy: {
    gradient: "linear-gradient(180deg, #546e7a 0%, #607d8b 100%)",
    textColor: "white",
    animationIntensity: "high",
  },
  "night-rainy": {
    gradient: "linear-gradient(180deg, #1a237e 0%, #283593 100%)",
    textColor: "white",
    animationIntensity: "medium",
  },
  snowy: {
    gradient: "linear-gradient(180deg, #b0bec5 0%, #cfd8dc 100%)",
    textColor: "#37474f",
    animationIntensity: "high",
  },
  "night-snowy": {
    gradient: "linear-gradient(180deg, #37474f 0%, #455a64 100%)",
    textColor: "white",
    animationIntensity: "medium",
  },
  foggy: {
    gradient: "linear-gradient(180deg, #b0bec5 0%, #cfd8dc 100%)",
    textColor: "#37474f",
    animationIntensity: "low",
  },
  "night-foggy": {
    gradient: "linear-gradient(180deg, #37474f 0%, #455a64 100%)",
    textColor: "white",
    animationIntensity: "low",
  },
  stormy: {
    gradient: "linear-gradient(180deg, #37474f 0%, #455a64 100%)",
    textColor: "white",
    animationIntensity: "high",
  },
  "night-stormy": {
    gradient: "linear-gradient(180deg, #1c1c1c 0%, #263238 100%)",
    textColor: "white",
    animationIntensity: "high",
  },
};

import { getThemeFromWeatherCode } from "../utils/themeUtils";

export const applyTheme = (
  themeOrCode: WeatherTheme | number,
  isDay?: boolean
): void => {
  let theme: WeatherTheme;

  // Handle being called with a weather code + isDay
  if (typeof themeOrCode === "number") {
    if (isDay === undefined) {
      console.error("isDay parameter required with weather code");
      isDay = true; // Default to day if missing
    }
    theme = getThemeFromWeatherCode(themeOrCode, isDay);
  } else {
    theme = themeOrCode as WeatherTheme;
  }

  // Add safety check to prevent the error
  const themeConfig = weatherThemes[theme];

  if (!themeConfig) {
    console.error(
      `Theme "${theme}" not found in weatherThemes, using sunny as fallback`
    );
    // Fallback to default theme
    theme = "sunny";
  }

  // Get the theme config (using the possible fallback)
  const finalThemeConfig = weatherThemes[theme];

  // Apply theme settings
  document.documentElement.style.setProperty(
    "--current-theme-gradient",
    finalThemeConfig.gradient
  );

  document.documentElement.style.setProperty(
    "--current-theme-text-color",
    finalThemeConfig.textColor
  );

  // Remove all theme classes
  document.body.classList.forEach((className) => {
    if (Object.keys(weatherThemes).includes(className)) {
      document.body.classList.remove(className);
    }
  });

  // Add the new theme class
  document.body.classList.add(theme);
};
