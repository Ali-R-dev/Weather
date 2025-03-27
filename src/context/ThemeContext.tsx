import React, { createContext, useState, useContext, useEffect } from "react";
import { WeatherTheme, applyTheme } from "../styles/themes";

interface ThemeContextType {
  applyTheme: (theme: WeatherTheme) => void;
  currentTheme: WeatherTheme;
}

const defaultContext: ThemeContextType = {
  applyTheme: () => {},
  currentTheme: "sunny", // Default theme
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTheme, setCurrentTheme] = useState<WeatherTheme>("sunny");

  const handleApplyTheme = (theme: WeatherTheme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  // Initialize with default theme
  useEffect(() => {
    handleApplyTheme("sunny");
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        applyTheme: handleApplyTheme,
        currentTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
