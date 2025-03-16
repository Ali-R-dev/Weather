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

  // Get weather-appropriate background elements with animations
  const getWeatherEffects = () => {
    if (!weatherData) return null;

    const weatherCode = weatherData.current.weather_code;
    const isDay = weatherData.current.is_day === 1;

    // Rain animation
    if (
      [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)
    ) {
      const raindrops = [];
      const intensity = [51, 56, 61, 80].includes(weatherCode)
        ? 50
        : [53, 57, 63, 66, 81].includes(weatherCode)
        ? 80
        : 120;

      for (let i = 0; i < intensity; i++) {
        const duration = 0.7 + Math.random() * 0.3;
        const delay = Math.random() * 5;
        const leftPos = Math.random() * 100;
        const height = Math.random() * 10 + 15;

        raindrops.push(
          <div
            key={`rain-${i}`}
            className="raindrop"
            style={{
              left: `${leftPos}%`,
              height: `${height}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              opacity: 0.5 + Math.random() * 0.5,
              animation: `rainfall ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      }

      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {raindrops}
        </div>
      );
    }

    // Snow animation
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
      const snowflakes = [];
      const intensity = [71, 85].includes(weatherCode)
        ? 40
        : [73].includes(weatherCode)
        ? 70
        : 100;

      for (let i = 0; i < intensity; i++) {
        const size = Math.random() * 6 + 2;
        const duration = 6 + Math.random() * 6;
        const delay = Math.random() * 5;
        const leftPos = Math.random() * 100;

        snowflakes.push(
          <div
            key={`snow-${i}`}
            className="snowflake"
            style={{
              left: `${leftPos}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              animation: `snowfall ${duration}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      }

      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {snowflakes}
        </div>
      );
    }

    // Cloud animation for cloudy weather
    if ([2, 3].includes(weatherCode)) {
      const clouds = [];
      const count = weatherCode === 2 ? 5 : 8;

      for (let i = 0; i < count; i++) {
        const size = Math.random() * 300 + 200;
        const duration = 60 + Math.random() * 60;
        const delay = Math.random() * 30;
        const topPos = Math.random() * 60;

        clouds.push(
          <div
            key={`cloud-${i}`}
            className="cloud"
            style={{
              top: `${topPos}%`,
              left: `-50%`,
              width: `${size}px`,
              height: `${size * 0.6}px`,
              background: isDay
                ? "rgba(255, 255, 255, 0.4)"
                : "rgba(255, 255, 255, 0.15)",
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              animation: `driftacross ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      }

      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {clouds}
        </div>
      );
    }

    // Fog animation
    if ([45, 48].includes(weatherCode)) {
      const fogPatches = [];

      for (let i = 0; i < 8; i++) {
        const size = Math.random() * 400 + 200;
        const duration = 30 + Math.random() * 20;
        const delay = Math.random() * 10;
        const topPos = Math.random() * 70;
        const leftPos = Math.random() * 100;

        fogPatches.push(
          <div
            key={`fog-${i}`}
            style={{
              position: "absolute",
              top: `${topPos}%`,
              left: `${leftPos}%`,
              width: `${size}px`,
              height: `${size * 0.8}px`,
              background: isDay
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              filter: "blur(50px)",
              animation: `fogMove ${duration}s ease-in-out ${delay}s infinite alternate`,
            }}
          />
        );
      }

      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {fogPatches}
        </div>
      );
    }

    // Lightning animation for thunderstorms
    if ([95, 96, 99].includes(weatherCode)) {
      const lightning = [];

      for (let i = 0; i < 3; i++) {
        const delay = i * 4 + Math.random() * 8;

        lightning.push(
          <div
            key={`lightning-${i}`}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255, 255, 255, 0.8)",
              animation: `lightningBolt 10s ease-out ${delay}s infinite`,
            }}
          />
        );
      }

      // Add rain for thunderstorms too
      const raindrops = [];
      for (let i = 0; i < 100; i++) {
        const duration = 0.7 + Math.random() * 0.3;
        const delay = Math.random() * 5;
        const leftPos = Math.random() * 100;
        const height = Math.random() * 10 + 15;

        raindrops.push(
          <div
            key={`rain-${i}`}
            className="raindrop"
            style={{
              left: `${leftPos}%`,
              height: `${height}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              animation: `rainfall ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      }

      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {lightning}
          {raindrops}
        </div>
      );
    }

    // Sun rays animation for clear skies
    if ([0, 1].includes(weatherCode) && isDay) {
      const sunPosition = {
        top: "10%",
        right: "15%",
      };

      const rays = [];
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30) % 360;
        const length = 40 + Math.random() * 20;

        rays.push(
          <div
            key={`ray-${i}`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: `${length}px`,
              height: "4px",
              background: "rgba(255, 235, 150, 0.7)",
              borderRadius: "2px",
              transformOrigin: "0 50%",
              transform: `rotate(${angle}deg)`,
              animation: "sunray 3s ease-in-out infinite alternate",
              animationDelay: `${i * 0.25}s`,
            }}
          />
        );
      }

      return (
        <div
          className="absolute overflow-hidden pointer-events-none"
          style={sunPosition}
        >
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 rounded-full bg-yellow-300 animate-pulse"></div>
            {rays}
          </div>
        </div>
      );
    }

    // Night sky with stars
    if ([0, 1].includes(weatherCode) && !isDay) {
      const stars = [];

      for (let i = 0; i < 100; i++) {
        const size = Math.random() * 3 + 1;
        const topPos = Math.random() * 70;
        const leftPos = Math.random() * 100;
        const delay = Math.random() * 5;

        stars.push(
          <div
            key={`star-${i}`}
            style={{
              position: "absolute",
              top: `${topPos}%`,
              left: `${leftPos}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "50%",
              animation: `twinkle 4s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      }

      // Add a moon
      const moon = (
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "15%",
            width: "80px",
            height: "80px",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "50%",
            boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.4)",
          }}
        />
      );

      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {moon}
          {stars}
        </div>
      );
    }

    return null;
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
