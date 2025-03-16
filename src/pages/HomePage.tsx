import { useEffect, useRef, useState } from "react";
import { useWeather } from "../context/WeatherContext";
import useGeolocation from "../hooks/useGeolocation";
import useSavedLocations from "../hooks/useSavedLocations";
import CurrentWeather from "../components/weather/CurrentWeather";
import HourlyForecast from "../components/weather/HourlyForecast";
import ForecastDay from "../components/weather/ForecastDay";
import LocationSearch from "../components/weather/LocationSearch";

export default function HomePage() {
  const { loading, error, weatherData, setLocation } = useWeather();
  const { location, loading: geoLoading, error: geoError } = useGeolocation();
  const { defaultLocation } = useSavedLocations();
  const initialLoadCompleted = useRef(false);
  const geoLocationUsed = useRef(false);
  const [activeTab, setActiveTab] = useState<"hourly" | "daily">("hourly");

  // Location loading logic
  useEffect(() => {
    // Skip this effect if we've already loaded weather data
    if (initialLoadCompleted.current) {
      return;
    }

    if (weatherData) {
      // Mark the initial load as complete once we have weather data
      initialLoadCompleted.current = true;
      return;
    }

    // If we have the default location from localStorage, use it
    if (defaultLocation && !loading) {
      setLocation({
        latitude: defaultLocation.latitude,
        longitude: defaultLocation.longitude,
        name: defaultLocation.name,
        country: defaultLocation.country,
      });
      return;
    }

    // Use geolocation if available and not already used
    if (location && !geoLocationUsed.current && !loading) {
      geoLocationUsed.current = true;
      setLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
  }, [defaultLocation, location, loading, setLocation, weatherData]);

  return (
    <div className="container max-w-7xl mx-auto p-2 sm:p-4">
      {/* Search component - fixed at top */}
      <div className="mb-2 sm:mb-3 w-full max-w-lg mx-auto">
        <LocationSearch />
      </div>

      {/* Loading and error states */}
      {(geoLoading || loading) && !weatherData && (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <div className="text-lg">Loading weather data...</div>
          </div>
        </div>
      )}

      {(geoError && !weatherData && !defaultLocation) || error ? (
        <div className="flex justify-center items-center py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg max-w-md">
            <p className="font-medium">
              {error ? "Error loading data" : "Location access denied"}
            </p>
            <p className="mt-1">
              {error || "Please search for a location above."}
            </p>
          </div>
        </div>
      ) : null}

      {/* Weather Data Layout */}
      {weatherData && (
        <div className="weather-container">
          {/* Desktop layout with side-by-side components */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:h-[calc(100vh-150px)]">
            {/* Current Weather - Left Side */}
            <div className="lg:col-span-5 xl:col-span-4">
              <CurrentWeather data={weatherData} />
            </div>

            {/* Forecast - Right Side */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
              {/* Tab Navigation */}
              <div className="flex mb-2 bg-gray-100 dark:bg-slate-700 rounded-lg p-1 max-w-xs">
                <button
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                    activeTab === "hourly"
                      ? "bg-white dark:bg-slate-600 shadow text-primary"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary"
                  }`}
                  onClick={() => setActiveTab("hourly")}
                >
                  24-Hour Forecast
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                    activeTab === "daily"
                      ? "bg-white dark:bg-slate-600 shadow text-primary"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary"
                  }`}
                  onClick={() => setActiveTab("daily")}
                >
                  7-Day Forecast
                </button>
              </div>

              {/* Forecast Content */}
              <div className="flex-1">
                {activeTab === "hourly" ? (
                  <HourlyForecast hourlyData={weatherData.hourly} />
                ) : (
                  <ForecastDay dailyData={weatherData.daily} />
                )}
              </div>
            </div>
          </div>

          {/* Mobile layout with stacked components */}
          <div className="lg:hidden space-y-3">
            {/* Current Weather - Top */}
            <div className="h-auto max-h-[45vh]">
              <CurrentWeather data={weatherData} />
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1 max-w-xs mx-auto">
              <button
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${
                  activeTab === "hourly"
                    ? "bg-white dark:bg-slate-600 shadow text-primary"
                    : "text-gray-600 dark:text-gray-300 hover:text-primary"
                }`}
                onClick={() => setActiveTab("hourly")}
              >
                24-Hour
              </button>
              <button
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${
                  activeTab === "daily"
                    ? "bg-white dark:bg-slate-600 shadow text-primary"
                    : "text-gray-600 dark:text-gray-300 hover:text-primary"
                }`}
                onClick={() => setActiveTab("daily")}
              >
                7-Day
              </button>
            </div>

            {/* Forecast Content - Bottom */}
            <div className="h-auto max-h-[40vh]">
              {activeTab === "hourly" ? (
                <HourlyForecast hourlyData={weatherData.hourly} />
              ) : (
                <ForecastDay dailyData={weatherData.daily} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
