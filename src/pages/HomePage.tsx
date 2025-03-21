import { useEffect, useRef, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "../context/WeatherContext";
import useGeolocation from "../hooks/useGeolocation";
import useSavedLocations from "../hooks/useSavedLocations";
import CurrentWeather from "../components/weather/current";
import HourlyForecast from "../components/weather/hourly";
import DailyForecast from "../components/weather/daily";
import MiniSearchBar from "../components/weather/MiniSearchBar";
import SettingsPanel from "../components/settings/SettingsPanel";
import { timeAgo } from "../utils/dateUtils";
import BackgroundEffect from "../components/effects/BackgroundEffect";

export default function HomePage() {
  const { loading, error, weatherData, setLocation, lastUpdated } =
    useWeather();
  const { location } = useGeolocation();
  const { defaultLocation } = useSavedLocations();
  const initialLoadCompleted = useRef(false);
  const geoLocationUsed = useRef(false);
  const [activeTab, setActiveTab] = useState<"hourly" | "daily">("hourly");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
  }, [weatherData, defaultLocation, location, loading, setLocation]);

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

    if (showSearchResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchResults]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col relative bg-gradient-to-br from-sky-400 to-blue-500"
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
        perspective: "1000px",
      }}
    >
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
        <main className="flex-1 container mx-auto px-4 py-4 flex flex-col">
          {/* Search bar and settings */}
          <div
            className="flex items-center justify-between mb-2"
            ref={searchContainerRef}
          >
            <MiniSearchBar
              onFocus={() => setShowSearchResults(true)}
              onSelect={() => setShowSearchResults(false)}
              isActive={showSearchResults}
            />

            <button
              onClick={() => setShowSettings(true)}
              className="ml-3 p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Settings"
              style={{ willChange: "transform" }}
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

          {/* Weather content */}
          {weatherData && !showSearchResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
              style={{ willChange: "transform" }}
            >
              <CurrentWeather data={weatherData} />

              {/* Forecast tabs */}
              <div className="mt-8">
                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={() => setActiveTab("hourly")}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "hourly"
                        ? "bg-white/20 text-white"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Hourly
                  </button>
                  <button
                    onClick={() => setActiveTab("daily")}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "daily"
                        ? "bg-white/20 text-white"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Daily
                  </button>
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
              </div>
            </motion.div>
          )}

          {loading && !weatherData && (
            <div className="flex-1 flex items-center justify-center">
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
