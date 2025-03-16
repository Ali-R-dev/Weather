import { useEffect, useRef, useState } from "react";
import { useWeather } from "../context/WeatherContext";
import useGeolocation from "../hooks/useGeolocation";
import useSavedLocations from "../hooks/useSavedLocations";
import CurrentWeather from "../components/weather/CurrentWeather";
import HourlyForecast from "../components/weather/HourlyForecast";
import ForecastDay from "../components/weather/ForecastDay";
import LocationSearch from "../components/weather/LocationSearch";
import MiniSearchBar from "../components/weather/MiniSearchBar";
import { timeAgo } from "../utils/dateUtils";
import BackgroundEffect from "../components/effects/BackgroundEffect";

export default function HomePage() {
  const { loading, error, weatherData, setLocation, lastUpdated } =
    useWeather();
  const { location, loading: geoLoading, error: geoError } = useGeolocation();
  const { defaultLocation } = useSavedLocations();
  const initialLoadCompleted = useRef(false);
  const geoLocationUsed = useRef(false);
  const [activeTab, setActiveTab] = useState<"hourly" | "daily">("hourly");
  const [showSearchResults, setShowSearchResults] = useState(false);

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

  // Helper function to get rain intensity
  const getRainIntensity = (code: number): "light" | "medium" | "heavy" => {
    if ([51, 56, 61, 80].includes(code)) return "light";
    if ([53, 57, 63, 66, 81].includes(code)) return "medium";
    return "heavy";
  };

  return (
    <div className="weather-app">
      {weatherData && (
        <BackgroundEffect
          weatherCode={weatherData.current.weather_code}
          isDay={weatherData.current.is_day === 1}
        />
      )}

      <div className="min-h-screen flex flex-col w-full relative z-10">
        {/* Header with centered search bar */}
        <header className="pt-safe sticky top-0 z-50 w-full">
          <div className="max-w-screen-sm mx-auto w-full px-3 pt-4">
            {/* Mini Search Bar Component - centered on desktop, full-width on mobile */}
            <MiniSearchBar
              onFocus={() => setShowSearchResults(true)}
              onSelect={() => setShowSearchResults(false)}
              isActive={showSearchResults}
            />

            {/* Last updated status below search */}
            {!showSearchResults && weatherData && (
              <div className="text-xs opacity-60 text-center mt-2">
                Last updated: {timeAgo(lastUpdated)}
              </div>
            )}
          </div>

          {/* Search results overlay */}
          {showSearchResults && (
            <div className="fixed inset-0 bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-sm pt-20 px-3 pb-3 animate-fade-in max-h-screen overflow-auto md:pt-24">
              <div className="max-w-lg mx-auto">
                <LocationSearch
                  compact={true}
                  onLocationSelect={() => setShowSearchResults(false)}
                />
              </div>
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
    </div>
  );
}
