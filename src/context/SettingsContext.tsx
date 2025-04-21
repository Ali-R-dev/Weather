import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig } from '../config/appConfig';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindUnit = 'kph' | 'mph';
export type TimeFormat = '12h' | '24h';

interface Settings {
  units: {
    temperature: TemperatureUnit;
    wind: WindUnit;
  };
  timeFormat: TimeFormat;
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
  };
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
}

// Use the defaults from our config
const defaultSettings: Settings = {
  units: {
    temperature: AppConfig.defaults.temperatureUnit,
    wind: AppConfig.defaults.windUnit,
  },
  timeFormat: AppConfig.defaults.timeFormat,
  accessibility: {
    reduceMotion: AppConfig.defaults.reduceMotion,
    highContrast: AppConfig.defaults.highContrast,
  },
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load from localStorage if available
    const savedSettings = localStorage.getItem('weatherAppSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('weatherAppSettings', JSON.stringify(settings));

    // Apply high contrast mode to the document if enabled
    if (settings.accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply reduced motion if enabled
    if (settings.accessibility.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [settings]);

  // This will force components to re-render when settings change
  useEffect(() => {
    console.log('Settings updated:', settings);
  }, [settings]);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
