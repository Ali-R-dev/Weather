import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "../context/WeatherContext";
import useGeolocation from "../hooks/useGeolocation";
import useSavedLocations from "../hooks/useSavedLocations";
import PremiumCurrentWeather from "../components/premium/PremiumCurrentWeather";
import PremiumHourlyForecast from "../components/premium/PremiumHourlyForecast";
import ForecastDay from "../components/weather/ForecastDay";
import LocationSearch from "../components/weather/LocationSearch";
import MiniSearchBar from "../components/weather/MiniSearchBar";
import PremiumWeatherScene from "../components/premium/PremiumWeatherScene";
import { timeAgo } from "../utils/dateUtils";
import BackgroundEffect from "../components/effects/BackgroundEffect";
import "../premium-styles.css";

const PremiumHomePage: React.FC = () => {
  const { loading, error, weatherData, setLocation, lastUpdated } =
    useWeather();
  const { location, loading: geoLoading, error: geoError } = useGeolocation();
  const { defaultLocation } = useSavedLocations();
  const initialLoadCompleted = useRef(false);
  const geoLocationUsed = useRef(false);
  const [activeTab, setActiveTab] = useState<"hourly" | "daily">("hourly");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showGlassBackground, setShowGlassBackground] = useState(true);

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

  // Toggle glass background based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowGlassBackground(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  // Content variants for staggered animations
  const contentVariants = {
    initial: { y: 20, opacity: 0 },
    enter: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      className="weather-app"
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
    >
      {/* Modern 3D weather scene */}
      {weatherData && <PremiumWeatherScene />}

      {/* Traditional weather effects as fallback/enhancement */}
      {weatherData && (
        <BackgroundEffect
          weatherCode={weatherData.current.weather_code}
          isDay={weatherData.current.is_day === 1}
        />
      )}

      <div className="min-h-screen flex flex-col w-full relative z-10">
        {/* Header with centered search bar */}
        <header className="app-header pt-safe transition-all duration-300 ${...}">
          <div className="max-w-screen-sm mx-auto w-full px-4 py-4">
            {/* Mini Search Bar Component */}
            <MiniSearchBar
              onFocus={() => setShowSearchResults(true)}
              onSelect={() => setShowSearchResults(false)}
              isActive={showSearchResults}
            />

            {/* Last updated status below search */}
            {!showSearchResults && weatherData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs opacity-60 text-center mt-2"
              >
                Last updated: {timeAgo(lastUpdated)}
              </motion.div>
            )}
          </div>

          {/* Search results overlay with animation */}
          <AnimatePresence>
            {showSearchResults && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="search-overlay bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm pt-20 px-3 pb-3 max-h-screen overflow-auto md:pt-24 inset-0"
              >
                <div className="max-w-lg mx-auto">
                  <LocationSearch
                    compact={true}
                    onLocationSelect={() => setShowSearchResults(false)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main className="weather-content flex-1">
          {/* Loading state with enhanced animation */}
          {(geoLoading || loading) && !weatherData && (
            <motion.div
              className="flex-grow flex flex-col justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative">
                <div className="animate-spin w-16 h-16 border-4 border-t-transparent border-white rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 text-white/50"
                  >
                    <path d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" />
                  </svg>
                </div>
              </div>
              <p className="mt-6 text-white text-xl font-light">
                Loading your weather data...
              </p>
            </motion.div>
          )}

          {/* Error states with improved visual design */}
          {(geoError && !weatherData && !defaultLocation) || error ? (
            <motion.div
              className="flex-grow flex flex-col justify-center items-center p-6"
              variants={contentVariants}
            >
              <div className="bg-black/40 backdrop-blur-xl text-white p-8 rounded-2xl max-w-md border border-white/20 shadow-xl">
                <div className="flex flex-col items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-12 h-12 text-red-400 mb-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-medium text-xl mb-1">
                    {error ? "Error loading data" : "Location access denied"}
                  </p>
                </div>
                <p className="text-center mb-4">
                  {error ||
                    "Please search for a location by tapping the location button above."}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowSearchResults(true)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 transition-colors rounded-lg text-white flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Search for a location
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Weather data content with animations */}
          {weatherData && (
            <div className="flex flex-col flex-grow">
              {/* Current weather - takes about 50% of screen height */}
              <motion.div
                className="flex-grow flex flex-col justify-end p-5 pb-0"
                variants={contentVariants}
              >
                <PremiumCurrentWeather data={weatherData} />
              </motion.div>

              {/* Forecast section */}
              <motion.div
                className="mt-auto p-5 pt-2"
                variants={contentVariants}
              >
                {/* Forecast tabs - Modern, glassmorphic design */}
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Forecast
                  </h2>
                  <div className="flex rounded-full overflow-hidden bg-white/10 backdrop-blur-lg p-1 border border-white/20">
                    <button
                      onClick={() => setActiveTab("hourly")}
                      className={`px-4 py-1.5 text-sm font-medium transition-all rounded-full ${
                        activeTab === "hourly"
                          ? "bg-white/20 text-white shadow-sm"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      Hourly
                    </button>
                    <button
                      onClick={() => setActiveTab("daily")}
                      className={`px-4 py-1.5 text-sm font-medium transition-all rounded-full ${
                        activeTab === "daily"
                          ? "bg-white/20 text-white shadow-sm"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      7-Day
                    </button>
                  </div>
                </div>

                {/* Forecast content container - premium glassmorphic design */}
                <motion.div
                  className="rounded-3xl overflow-hidden border border-white/20 h-auto bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-xl shadow-xl"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <div className="p-4 h-full">
                    <AnimatePresence mode="wait">
                      {activeTab === "hourly" ? (
                        <motion.div
                          key="hourly"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <PremiumHourlyForecast
                            hourlyData={weatherData.hourly}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="daily"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ForecastDay dailyData={weatherData.daily} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </main>

        {/* Enhanced footer */}
        <motion.footer
          className="fixed bottom-0 left-0 w-full py-3 px-4 bg-black/30 backdrop-blur-lg text-white text-xs flex items-center justify-between border-t border-white/10 z-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex items-center">
            <span className="text-white/80">
              Powered by{" "}
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 transition-colors"
              >
                Open Meteo
              </a>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                // Add a settings functionality here
                alert("Settings will be available in the next update!");
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                // Add your privacy policy functionality here
                alert("Privacy Policy will open in the next update!");
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              Privacy
            </button>
          </div>
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default PremiumHomePage;
