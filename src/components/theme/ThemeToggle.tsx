import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { currentTheme, applyTheme } = useTheme();
  const isDark = currentTheme === 'night-clear';

  const handleToggle = () => {
    applyTheme(isDark ? 'sunny' : 'night-clear');
  };

  return (
    <button
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 transition-colors text-white focus:outline-none focus:ring-2 focus:ring-yellow-300/70`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={handleToggle}
      type="button"
    >
      {isDark ? <span aria-hidden="true">🌙</span> : <span aria-hidden="true">☀️</span>}
      <span className="text-sm font-medium">{isDark ? 'Dark' : 'Light'} Mode</span>
    </button>
  );
};

export default ThemeToggle;
