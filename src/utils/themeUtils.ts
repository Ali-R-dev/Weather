import { weatherThemes, WeatherTheme } from "../styles/themes";

/**
 * Maps a weather code to the appropriate theme name
 */
export function getThemeFromWeatherCode(
  code: number,
  isDay: boolean
): WeatherTheme {
  // Clear weather
  if (code === 0) {
    return isDay ? "sunny" : "night-clear";
  }

  // Partly cloudy
  if (code === 1 || code === 2) {
    return isDay ? "cloudy" : "night-cloudy";
  }

  // Cloudy
  if (code === 3) {
    return isDay ? "cloudy" : "night-cloudy";
  }

  // Fog
  if (code >= 45 && code <= 48) {
    return isDay ? "foggy" : "night-foggy";
  }

  // Drizzle or light rain
  if ((code >= 51 && code <= 55) || (code >= 61 && code <= 63)) {
    return isDay ? "rainy" : "night-rainy";
  }

  // Heavy rain
  if (code === 65 || (code >= 80 && code <= 82)) {
    return isDay ? "rainy" : "night-rainy";
  }

  // Snow
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return isDay ? "snowy" : "night-snowy";
  }

  // Thunderstorm
  if (code >= 95 && code <= 99) {
    return isDay ? "stormy" : "night-stormy";
  }

  // Default to cloudy if unknown code
  return isDay ? "cloudy" : "night-cloudy";
}

/**
 * Gets CSS variables for a specific theme
 */
export function getThemeVariables(theme: WeatherTheme): Record<string, string> {
  const themeConfig = weatherThemes[theme];

  return {
    "--theme-gradient": themeConfig.gradient,
    "--theme-text-color": themeConfig.textColor,
    "--theme-animation-intensity": themeConfig.animationIntensity || "medium",
  };
}

/**
 * Generates CSS for a theme that can be injected into a style tag
 */
export function generateThemeCSS(theme: WeatherTheme): string {
  const variables = getThemeVariables(theme);

  return `
    :root {
      ${Object.entries(variables)
        .map(([key, value]) => `${key}: ${value};`)
        .join("\n      ")}
    }
    
    body.${theme} {
      background: ${variables["--theme-gradient"]};
      color: ${variables["--theme-text-color"]};
    }
  `;
}

/**
 * Determines if a theme is a night theme
 */
export function isNightTheme(theme: WeatherTheme): boolean {
  return theme.startsWith("night-");
}
