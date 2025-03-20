import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "../context/WeatherContext";
import useGeolocation from "../hooks/useGeolocation";
import useSavedLocations from "../hooks/useSavedLocations";
import CurrentWeather from "../components/weather/current";
import HourlyForecast from "../components/weather/hourly";
import DailyForecast from "../components/weather/daily";
import LocationSearch from "../components/weather/LocationSearch";
import MiniSearchBar from "../components/weather/MiniSearchBar";
import SettingsPanel from "../components/settings/SettingsPanel";
import { timeAgo } from "../utils/dateUtils";
import BackgroundEffect from "../components/effects/BackgroundEffect";

export default function HomePage() {
  const { loading, error, weatherData, setLocation, lastUpdated } =
    useWeather();
  const { location, loading: _geoLoading, error: _geoError } = useGeolocation();
  const { defaultLocation } = useSavedLocations();
  const initialLoadCompleted = useRef(false);
  const geoLocationUsed = useRef(false);
  const [activeTab, setActiveTab] = useState<"hourly" | "daily">("hourly");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Location loading logic
  useEffect(() => {
    if (initialLoadCompleted.current) {
      return;
    }

    if (weatherData) {
      initialLoadCompleted.current = true;
      return;
    }

    if (defaultLocation && !loading) {
      setLocation({
        latitude: defaultLocation.latitude,
        longitude: defaultLocation.longitude,
        name: defaultLocation.name,
        country: defaultLocation.country,
      });
      return;
    }

    if (location && !geoLocationUsed.current && !loading) {
      geoLocationUsed.current = true;
      setLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
  }, [defaultLocation, location, loading, setLocation, weatherData]);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="weather-app"
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
    >
      {weatherData && (
        <BackgroundEffect
          weatherCode={weatherData.current.weather_code}
          isDay={weatherData.current.is_day === 1}
        />
      )}

      <div className="min-h-screen flex flex-col w-full relative z-10">
        {/* Header with search */}
        <header className="app-header pt-safe transition-all duration-300">
          <div className="max-w-screen-sm mx-auto w-full px-4 py-4 flex justify-between items-center">
            <div className="flex-grow">
              <MiniSearchBar
                onFocus={() => setShowSearchResults(true)}
                onSelect={() => setShowSearchResults(false)}
                isActive={showSearchResults}
              />
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className="ml-3 p-2 rounded-full hover:bg-white/10 transition-colors"
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

          {/* Last updated status */}
          {!showSearchResults && weatherData && (
            <div className="text-xs opacity-60 text-center mt-0">
              Last updated: {lastUpdated ? timeAgo(lastUpdated) : "recently"}
            </div>
          )}

          {/* Search results overlay */}
          <AnimatePresence>
            {showSearchResults && (
              <div className="search-overlay bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm pt-20 px-3 pb-3 max-h-screen overflow-auto md:pt-24 fixed inset-0">
                <div className="max-w-lg mx-auto">
                  <LocationSearch
                    compact={true}
                    onLocationSelect={() => setShowSearchResults(false)}
                  />
                </div>
              </div>
            )}
          </AnimatePresence>
        </header>

        <main className="weather-content flex-1">
          {/* Weather data content */}
          {weatherData && (
            <div className="flex flex-col flex-grow">
              {/* Current weather */}
              <div className="flex-grow flex flex-col justify-end p-5 pb-0">
                <CurrentWeather data={weatherData} />
              </div>

              {/* Forecast section */}
              <div className="mt-auto p-5 pt-2">
                {/* Forecast tabs */}
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Forecast
                  </h2>
                  <div className="forecast-tabs">
                    <button
                      onClick={() => setActiveTab("hourly")}
                      className={`tab-button ${
                        activeTab === "hourly" ? "tab-active" : "tab-inactive"
                      }`}
                    >
                      Hourly
                    </button>
                    <button
                      onClick={() => setActiveTab("daily")}
                      className={`tab-button ${
                        activeTab === "daily" ? "tab-active" : "tab-inactive"
                      }`}
                    >
                      7-Day
                    </button>
                  </div>
                </div>

                {/* Forecast content */}
                <div className="current-weather-card">
                  <div className="p-4 h-full">
                    {activeTab === "hourly" ? (
                      <HourlyForecast hourlyData={weatherData.hourly} />
                    ) : (
                      <DailyForecast dailyData={weatherData.daily} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-8 text-red-400">
              <div className="text-3xl mb-2">😕</div>
              <div>{error}</div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-3 px-4 bg-black/30 backdrop-blur-lg text-white text-xs flex items-center justify-between border-t border-white/10">
          <div className="flex items-center">
            <span className="text-white/80">
              Powered by{" "}
              <a
                href="https://open-meteo.com/"
                className="text-blue-300 hover:text-blue-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Meteo
              </a>
            </span>
          </div>
        </footer>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </motion.div>
  );
}
