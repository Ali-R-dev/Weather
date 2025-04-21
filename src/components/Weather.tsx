import React, { useState } from 'react';
import { WeatherData } from '../types/weather.types';
import CurrentWeather from './weather/current';
import HourlyForecast from './weather/hourly';
import DailyForecast from './weather/daily';
import { useTheme } from '../context/ThemeContext';

interface WeatherProps {
  data: WeatherData;
  isLoading?: boolean;
  error?: string | null;
}

const Weather: React.FC<WeatherProps> = ({ data, isLoading = false, error = null }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'hourly' | 'daily'>('current');
  const { currentTheme } = useTheme(); // Get current theme

  // Function to get theme-based gradient for active tab
  const getThemeGradient = () => {
    // Match the button gradient to current weather theme
    switch (currentTheme) {
      case 'sunny':
        return 'from-yellow-500/80 to-amber-400/70 shadow-yellow-500/20';
      case 'night-clear':
        return 'from-indigo-500/80 to-purple-400/70 shadow-indigo-500/20';
      case 'cloudy':
        return 'from-gray-500/80 to-slate-400/70 shadow-gray-500/20';
      case 'night-cloudy':
        return 'from-slate-500/80 to-gray-400/70 shadow-slate-500/20';
      case 'rainy':
        return 'from-blue-500/80 to-sky-400/70 shadow-blue-500/20';
      case 'night-rainy':
        return 'from-blue-700/80 to-blue-500/70 shadow-blue-700/20';
      case 'snowy':
        return 'from-blue-300/80 to-sky-200/70 shadow-blue-300/20';
      case 'stormy':
        return 'from-slate-600/80 to-slate-500/70 shadow-slate-600/20';
      default:
        return 'from-blue-500/80 to-blue-400/70 shadow-blue-500/20'; // Default fallback
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        <div className="text-3xl mb-2">😕</div>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Tab Navigation */}
      <div className="relative mt-2 mb-6">
        {/* Highlight banner showing available tabs */}
        <div className="absolute -top-8 left-0 right-0 text-center">
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white/90 animate-pulse">
            Swipe to see Current, Hourly & Daily views
          </div>
        </div>

        <div className="flex space-x-1 p-1 bg-white/10 backdrop-blur-md rounded-xl">
          <button
            className={`flex-1 py-3 px-2 rounded-lg transition-all flex items-center justify-center ${
              activeTab === 'current'
                ? `bg-gradient-to-r ${getThemeGradient()} shadow-lg transform -translate-y-0.5`
                : 'bg-white/5 hover:bg-white/15'
            }`}
            onClick={() => setActiveTab('current')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.591-1.591a.75.75 0 10-1.06 1.06l1.591 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.592-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
            <span className="font-medium">Current</span>
          </button>

          <button
            className={`flex-1 py-3 px-2 rounded-lg transition-all flex items-center justify-center ${
              activeTab === 'hourly'
                ? `bg-gradient-to-r ${getThemeGradient()} shadow-lg transform -translate-y-0.5`
                : 'bg-white/5 hover:bg-white/15'
            }`}
            onClick={() => setActiveTab('hourly')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Hourly</span>
          </button>

          <button
            className={`flex-1 py-3 px-2 rounded-lg transition-all flex items-center justify-center ${
              activeTab === 'daily'
                ? `bg-gradient-to-r ${getThemeGradient()} shadow-lg transform -translate-y-0.5`
                : 'bg-white/5 hover:bg-white/15'
            }`}
            onClick={() => setActiveTab('daily')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              <path
                fillRule="evenodd"
                d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Daily</span>
          </button>
        </div>

        {/* Swipe indicator */}
        <div className="mt-2 flex justify-center">
          <div className="flex space-x-1">
            <div
              className={`h-1 w-6 rounded-full ${
                activeTab === 'current' ? 'bg-white' : 'bg-white/30'
              }`}
            ></div>
            <div
              className={`h-1 w-6 rounded-full ${
                activeTab === 'hourly' ? 'bg-white' : 'bg-white/30'
              }`}
            ></div>
            <div
              className={`h-1 w-6 rounded-full ${
                activeTab === 'daily' ? 'bg-white' : 'bg-white/30'
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-3xl overflow-hidden border border-white/10 h-auto bg-gradient-to-br from-black/20 to-black/30 backdrop-blur-md">
        <div className="p-4 h-full">
          {activeTab === 'current' && <CurrentWeather data={data} />}
          {activeTab === 'hourly' && <HourlyForecast hourlyData={data.hourly} />}
          {activeTab === 'daily' && <DailyForecast dailyData={data.daily} />}
        </div>
      </div>
    </div>
  );
};

export default Weather;
