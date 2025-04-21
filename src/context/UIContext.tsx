import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UIContextProps {
  // Animation settings
  animationIntensity: number;
  setAnimationIntensity: (intensity: number) => void;

  // Reduced motion preference
  reducedMotion: boolean;

  // High contrast mode
  highContrast: boolean;
  toggleHighContrast: () => void;

  // UI density
  compactMode: boolean;
  toggleCompactMode: () => void;

  // UI accent color
  accentColor: string;
  setAccentColor: (color: string) => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Toast notifications
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  // Animation settings
  const [animationIntensity, setAnimationIntensity] = useState(1);

  // Reduced motion preference from system
  const [reducedMotion, setReducedMotion] = useState(false);

  // High contrast mode
  const [highContrast, setHighContrast] = useState(false);

  // Compact UI mode
  const [compactMode, setCompactMode] = useState(false);

  // Accent color
  const [accentColor, setAccentColor] = useState('#0ea5e9');

  // App loading state
  const [isLoading, setIsLoading] = useState(false);

  // Toast messages
  const [toasts, setToasts] = useState<
    Array<{
      id: number;
      message: string;
      type: 'info' | 'success' | 'warning' | 'error';
    }>
  >([]);

  // Check for system reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(prefersReducedMotion.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    prefersReducedMotion.addEventListener('change', handleChange);
    return () => {
      prefersReducedMotion.removeEventListener('change', handleChange);
    };
  }, []);

  // Apply reduced motion setting
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
      document.documentElement.style.setProperty('--animation-speed', '0.5');
      document.documentElement.style.setProperty('--animation-intensity', '0.5');
    } else {
      document.documentElement.classList.remove('reduce-motion');
      document.documentElement.style.setProperty('--animation-speed', '1');
      document.documentElement.style.setProperty(
        '--animation-intensity',
        String(animationIntensity)
      );
    }
  }, [reducedMotion, animationIntensity]);

  // Toggle high contrast mode
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);

    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  // Toggle compact mode
  const toggleCompactMode = () => {
    const newValue = !compactMode;
    setCompactMode(newValue);

    if (newValue) {
      document.documentElement.classList.add('compact-ui');
    } else {
      document.documentElement.classList.remove('compact-ui');
    }
  };

  // Show toast notification
  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  // Set accent color and update CSS variables
  const handleSetAccentColor = (color: string) => {
    setAccentColor(color);
    document.documentElement.style.setProperty('--color-accent', color);
  };

  return (
    <UIContext.Provider
      value={{
        animationIntensity,
        setAnimationIntensity,
        reducedMotion,
        highContrast,
        toggleHighContrast,
        compactMode,
        toggleCompactMode,
        accentColor,
        setAccentColor: handleSetAccentColor,
        isLoading,
        setIsLoading,
        showToast,
      }}
    >
      {children}

      {/* Toast notifications container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-2 rounded-md shadow-lg animate-fade-in text-white ${
                toast.type === 'success'
                  ? 'bg-green-500'
                  : toast.type === 'error'
                  ? 'bg-red-500'
                  : toast.type === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      )}
    </UIContext.Provider>
  );
};
