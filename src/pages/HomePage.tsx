import { useEffect, useRef, useState } from "react";
import { useWeather } from "../context/WeatherContext";
import useGeolocation from "../hooks/useGeolocation";
import useSavedLocations from "../hooks/useSavedLocations";
import { useTheme } from "../context/ThemeContext";
import CurrentWeather from "../components/weather/CurrentWeather";
import HourlyForecast from "../components/weather/HourlyForecast";
import ForecastDay from "../components/weather/ForecastDay";
import LocationSearch from "../components/weather/LocationSearch";
import { timeAgo } from "../utils/dateUtils";

export default function HomePage() {
  const { loading, error, weatherData, setLocation, lastUpdated } =
    useWeather();
  const { location, loading: geoLoading, error: geoError } = useGeolocation();
  const { defaultLocation } = useSavedLocations();
  const { currentTheme } = useTheme();
  const initialLoadCompleted = useRef(false);
  const geoLocationUsed = useRef(false);
  const [activeTab, setActiveTab] = useState<"hourly" | "daily">("hourly");
  const [showSearch, setShowSearch] = useState(false);

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

  // Get weather-appropriate background elements
  const getWeatherEffects = () => {
    // ... existing effects code (unchanged) ...
    switch (currentTheme) {
      // All your existing cases remain unchanged
      default:
        return null;
    }
  };

  return (
    <>
      {/* Dynamic weather effects in background */}
      {getWeatherEffects()}

      {/* Main content container */}
      <div className="min-h-screen flex flex-col w-full relative z-10">
        {/* Header with location search toggle */}
        <header className="pt-safe sticky top-0 z-50 w-full">
          <div className="flex justify-between items-center p-4">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="bg-black/20 backdrop-blur-md rounded-full p-3 shadow-lg text-white"
              aria-label="Toggle location search"
            >
              {showSearch ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              )}
            </button>

            {weatherData && lastUpdated && (
              <div className="text-sm text-white/70">
                Last updated: {timeAgo(lastUpdated)}
              </div>
            )}
          </div>

          {/* Search overlay */}
          {showSearch && (
            <div className="absolute left-0 right-0 px-4 pb-4 animate-fade-in">
              <LocationSearch onLocationSelect={() => setShowSearch(false)} />
            </div>
          )}
        </header>

        {/* Loading states */}
        {(geoLoading || loading) && !weatherData && (
          <div className="flex-grow flex flex-col justify-center items-center">
            <div className="animate-spin w-16 h-16 border-4 border-t-transparent border-white rounded-full"></div>
            <p className="mt-4 text-white text-xl">Loading weather data...</p>
          </div>
        )}

        {/* Error states */}
        {(geoError && !weatherData && !defaultLocation) || error ? (
          <div className="flex-grow flex flex-col justify-center items-center p-6">
            <div className="bg-black/30 backdrop-blur-md text-white p-6 rounded-xl max-w-md border border-white/10">
              <p className="font-medium text-xl mb-2">
                {error ? "Error loading data" : "Location access denied"}
              </p>
              <p>
                {error ||
                  "Please search for a location by tapping the location button above."}
              </p>
            </div>
          </div>
        ) : null}

        {/* Weather data content */}
        {weatherData && (
          <div className="flex flex-col flex-grow">
            {/* Current weather - takes about 50% of screen height */}
            <div className="flex-grow flex flex-col justify-end p-4 pb-0">
              <CurrentWeather data={weatherData} />
            </div>

            {/* Forecast section */}
            <div className="mt-auto p-4 pt-2">
              {/* Tabs for forecast type */}
              <div className="flex rounded-full backdrop-blur-md bg-black/20 p-1 mb-3">
                <button
                  onClick={() => setActiveTab("hourly")}
                  className={`flex-1 text-center py-2 rounded-full transition ${
                    activeTab === "hourly"
                      ? "bg-white/20 text-white font-medium"
                      : "text-white/70"
                  }`}
                >
                  Hourly
                </button>
                <button
                  onClick={() => setActiveTab("daily")}
                  className={`flex-1 text-center py-2 rounded-full transition ${
                    activeTab === "daily"
                      ? "bg-white/20 text-white font-medium"
                      : "text-white/70"
                  }`}
                >
                  Daily
                </button>
              </div>

              {/* Forecast content - fixed height container */}
              <div className="bg-black/20 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 h-60">
                <div className="p-4 h-full">
                  {activeTab === "hourly" ? (
                    <HourlyForecast hourlyData={weatherData.hourly} />
                  ) : (
                    <ForecastDay dailyData={weatherData.daily} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
