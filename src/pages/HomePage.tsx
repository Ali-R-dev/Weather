import { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "../context/WeatherContext";
import { useTheme } from "../context/ThemeContext";
// import { useLocation } from "../context/LocationContext"; // Use location context
import { timeAgo } from "../utils/dateUtils";
import BackgroundEffect from "../components/effects/BackgroundEffect";
import CurrentWeather from "../components/weather/current";
import HourlyForecast from "../components/weather/hourly";
import DailyForecast from "../components/weather/daily";
import { MiniSearchBar } from "../components/weather/search";
import SettingsPanel from "../components/settings/SettingsPanel";
import SkipToContent from "../components/SkipToContent";

export default function HomePage() {
  // Get weather data but not location setting
  const { loading, error, weatherData, lastUpdated } = useWeather();

  // Get location from the context
  // const { currentLocation } = useLocation();

  // Remove location-related refs that were handling initialization
  const [activeTab, setActiveTab] = useState<"hourly" | "daily">("hourly");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { currentTheme } = useTheme();

  // Function to get theme colors for tab buttons
  const getThemeColors = () => {
    switch (currentTheme) {
      case "sunny":
        return {
          active: "text-amber-900",
          color: "bg-amber-400",
          glow: "bg-amber-300",
        };
      case "night-clear":
        return {
          active: "text-indigo-900",
          color: "bg-indigo-400",
          glow: "bg-indigo-300",
        };
      case "cloudy":
        return {
          active: "text-slate-900",
          color: "bg-slate-400",
          glow: "bg-slate-300",
        };
      case "night-cloudy":
        return {
          active: "text-gray-900",
          color: "bg-gray-400",
          glow: "bg-gray-300",
        };
      case "rainy":
        return {
          active: "text-blue-900",
          color: "bg-blue-400",
          glow: "bg-blue-300",
        };
      case "stormy":
        return {
          active: "text-slate-900",
          color: "bg-slate-400",
          glow: "bg-slate-300",
        };
      case "snowy":
        return {
          active: "text-sky-900",
          color: "bg-sky-200",
          glow: "bg-sky-100",
        };
      default:
        return {
          active: "text-blue-900",
          color: "bg-white",
          glow: "bg-blue-300",
        };
    }
  };

  const themeColors = getThemeColors();

  // Handle click outside search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchResults]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col relative bg-gradient-to-br from-sky-400 to-blue-500"
    >
      <SkipToContent />
      {/* Background Effect - Lazy loaded with Suspense */}
      <Suspense fallback={null}>
        {weatherData && (
          <BackgroundEffect
            weatherCode={weatherData.current.weather_code}
            isDay={weatherData.current.is_day === 1}
          />
        )}
      </Suspense>

      <div className="relative z-10 flex-1 flex flex-col">
        <main id="main-content" className="flex-1 w-full px-2 md:px-8 lg:px-20 xl:px-40 py-2 md:py-6 flex flex-col">
          {/* Search bar and settings */}
          <nav aria-label="Main navigation" className="w-full">
            <div
              className="flex flex-row items-center justify-between mb-2 gap-2 px-0 sm:px-0 w-full"
              ref={searchContainerRef}
            >
              <div className="p-2 text-2xl sm:text-3xl font-bold text-white min-w-[48px] text-left flex-shrink-0">AR</div>
              <div className="flex-1 flex justify-center">
                <MiniSearchBar
                  onFocus={() => setShowSearchResults(true)}
                  onSelect={() => setShowSearchResults(false)}
                  isActive={showSearchResults}
                />
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors min-w-[48px] text-right flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
                aria-label="Settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </nav>

          {/* Last updated status */}
          {!showSearchResults && weatherData && (
            <div className="text-xs opacity-60 text-center mt-0">
              Last updated: {lastUpdated ? timeAgo(lastUpdated) : "recently"}
            </div>
          )}

          {/* Weather content */}
          {weatherData && !showSearchResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 sm:mt-4 w-full"
              style={{ willChange: "transform" }}
            >
              <CurrentWeather data={weatherData} />

              {/* Forecast tabs */}
              <div className="relative mb-4 sm:mb-8 mt-2 sm:mt-4">
                <div className="flex justify-center">
                  <div className="relative rounded-full">
                    <div className="flex rounded-full p-1">
                      <button
                        onClick={() => setActiveTab("hourly")}
                        className={`relative px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full transition-all duration-300 flex items-center text-base md:text-lg lg:text-xl ${
                          activeTab === "hourly"
                            ? `${themeColors.color} ${themeColors.active} font-semibold`
                            : "text-white/80 hover:bg-white/10"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 mr-1.5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Hourly
                      </button>

                      <button
                        onClick={() => setActiveTab("daily")}
                        className={`relative px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full transition-all duration-300 flex items-center text-base md:text-lg lg:text-xl ${
                          activeTab === "daily"
                            ? `${themeColors.color} ${themeColors.active} font-semibold shadow-md`
                            : "text-white/80 hover:bg-white/10"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 mr-1.5"
                        >
                          <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8z" />
                          <path
                            fillRule="evenodd"
                            d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Daily
                      </button>
                    </div>

                    {/* Optional: Add a subtle glow effect */}
                    <div
                      className={`absolute inset-0 -z-10 opacity-30 ${themeColors.glow} rounded-full`}
                    ></div>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "hourly" ? (
                  <motion.div
                    key="hourly"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    style={{ willChange: "transform" }}
                  >
                    <HourlyForecast hourlyData={weatherData.hourly} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="daily"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    style={{ willChange: "transform" }}
                  >
                    <DailyForecast dailyData={weatherData.daily} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {loading && !weatherData && (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
              <div className="text-white text-opacity-80">Loading...</div>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-400">
              <div className="text-3xl mb-2">😕</div>
              <div>{error}</div>
            </div>
          )}
        </main>

        {/* Settings Panel */}
        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </motion.div>
  );
}
