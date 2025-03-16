import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

type ThemeType =
  | "sunny"
  | "cloudy"
  | "rainy"
  | "snowy"
  | "stormy"
  | "foggy"
  | "night-clear"
  | "night-cloudy"
  | "night-rainy"
  | "night-snowy"
  | "night-stormy"
  | "night-foggy";

interface ThemeContextType {
  currentTheme: ThemeType;
  applyTheme: (weatherCode: number, isDay: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("sunny");

  const applyTheme = useCallback((weatherCode: number, isDay: boolean) => {
    // Map weather codes to themes
    const getThemeFromWeatherCode = (
      code: number,
      isDay: boolean
    ): ThemeType => {
      // Clear conditions
      if ([0, 1].includes(code)) {
        return isDay ? "sunny" : "night-clear";
      }

      // Cloudy conditions
      if ([2, 3].includes(code)) {
        return isDay ? "cloudy" : "night-cloudy";
      }

      // Foggy conditions
      if ([45, 48].includes(code)) {
        return isDay ? "foggy" : "night-foggy";
      }

      // Rain-related conditions
      if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return isDay ? "rainy" : "night-rainy";
      }

      // Snow-related conditions
      if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return isDay ? "snowy" : "night-snowy";
      }

      // Thunderstorm conditions
      if ([95, 96, 99].includes(code)) {
        return isDay ? "stormy" : "night-stormy";
      }

      // Default
      return isDay ? "sunny" : "night-clear";
    };

    // Set the theme
    const newTheme = getThemeFromWeatherCode(weatherCode, isDay);
    setCurrentTheme(newTheme);

    // Apply theme classes to the document body
    document.body.className = newTheme;

    // Apply CSS variables for the theme
    const root = document.documentElement;

    // Set base theme variables based on the theme
    switch (newTheme) {
      case "sunny":
        root.style.setProperty("--theme-primary", "#f59e0b");
        root.style.setProperty("--theme-secondary", "#fcd34d");
        root.style.setProperty("--theme-background", "#f8fafc");
        break;
      case "cloudy":
        root.style.setProperty("--theme-primary", "#64748b");
        root.style.setProperty("--theme-secondary", "#94a3b8");
        root.style.setProperty("--theme-background", "#f1f5f9");
        break;
      case "rainy":
        root.style.setProperty("--theme-primary", "#3b82f6");
        root.style.setProperty("--theme-secondary", "#60a5fa");
        root.style.setProperty("--theme-background", "#f0f9ff");
        break;
      case "snowy":
        root.style.setProperty("--theme-primary", "#a5b4fc");
        root.style.setProperty("--theme-secondary", "#c7d2fe");
        root.style.setProperty("--theme-background", "#f5f7ff");
        break;
      case "stormy":
        root.style.setProperty("--theme-primary", "#6366f1");
        root.style.setProperty("--theme-secondary", "#818cf8");
        root.style.setProperty("--theme-background", "#eef2ff");
        break;
      case "foggy":
        root.style.setProperty("--theme-primary", "#9ca3af");
        root.style.setProperty("--theme-secondary", "#d1d5db");
        root.style.setProperty("--theme-background", "#f3f4f6");
        break;
      case "night-clear":
        root.style.setProperty("--theme-primary", "#4f46e5");
        root.style.setProperty("--theme-secondary", "#818cf8");
        root.style.setProperty("--theme-background", "#0f172a");
        break;
      case "night-cloudy":
      case "night-foggy":
        root.style.setProperty("--theme-primary", "#475569");
        root.style.setProperty("--theme-secondary", "#64748b");
        root.style.setProperty("--theme-background", "#0f172a");
        break;
      case "night-rainy":
      case "night-snowy":
      case "night-stormy":
        root.style.setProperty("--theme-primary", "#3b82f6");
        root.style.setProperty("--theme-secondary", "#60a5fa");
        root.style.setProperty("--theme-background", "#0f172a");
        break;
      default:
        break;
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
