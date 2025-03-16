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

  // Keep existing location loading logic
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
    <div className="container mx-auto p-2 sm:p-4 max-h-[calc(100dvh-85px)] flex flex-col">
      {/* Search component - fixed at top */}
      <div className="mb-2 sm:mb-3 mx-auto w-full max-w-md">
        <LocationSearch />
      </div>

      {/* Loading and error states */}
      {(geoLoading || loading) && !weatherData && (
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <div className="text-lg">Loading weather data...</div>
          </div>
        </div>
      )}

      {(geoError && !weatherData && !defaultLocation) || error ? (
        <div className="flex-1 flex justify-center items-center">
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
        <div className="flex-1 flex flex-col h-full max-h-full overflow-hidden">
          {/* Adaptive layout - column on mobile, grid on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3 h-full">
            {/* Current Weather - Takes 1/3 height on mobile, 1/2 width on desktop */}
            <div className="lg:col-span-5 h-[35vh] lg:h-full">
              <CurrentWeather data={weatherData} />
            </div>

            {/* Forecasts Container - 2/3 height on mobile, 1/2 width on desktop */}
            <div className="lg:col-span-7 flex flex-col h-[calc(65vh-85px)] lg:h-full">
              {/* Tab Navigation */}
              <div className="flex mb-2 bg-gray-100 dark:bg-slate-700 rounded-lg p-1 max-w-xs mx-auto lg:mx-0">
                <button
                  className={`flex-1 py-1 text-sm font-medium rounded-md transition ${
                    activeTab === "hourly"
                      ? "bg-white dark:bg-slate-600 shadow text-primary"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary"
                  }`}
                  onClick={() => setActiveTab("hourly")}
                >
                  24-Hour
                </button>
                <button
                  className={`flex-1 py-1 text-sm font-medium rounded-md transition ${
                    activeTab === "daily"
                      ? "bg-white dark:bg-slate-600 shadow text-primary"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary"
                  }`}
                  onClick={() => setActiveTab("daily")}
                >
                  7-Day
                </button>
              </div>

              {/* Forecast Content - Fills remaining space */}
              <div className="flex-1 min-h-0">
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
  );
}
