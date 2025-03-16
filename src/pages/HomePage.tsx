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
import RainEffect3D from "../components/effects/RainEffect3D";

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

    // Rain animation with 3D depth and splashes
    if (
      [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)
    ) {
      const intensity = [51, 56, 61, 80].includes(weatherCode)
        ? "light"
        : [53, 57, 63, 66, 81].includes(weatherCode)
        ? "medium"
        : "heavy";

      return (
        <RainEffect3D intensity={intensity as "light" | "medium" | "heavy"} />
      );
    }

    // Snow animation with 3D layers and realistic motion
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
      const snowflakes = [];
      const intensity = [71, 85].includes(weatherCode)
        ? 40
        : [73].includes(weatherCode)
        ? 70
        : 100;

      for (let layer = 1; layer <= 3; layer++) {
        const layerIntensity = Math.floor(intensity / (4 - layer));
        const scale = 0.7 + layer * 0.2;

        for (let i = 0; i < layerIntensity; i++) {
          const size = (Math.random() * 6 + 2) * scale;
          const duration = (6 + Math.random() * 6) / scale; // Larger flakes fall faster
          const delay = Math.random() * 5;
          const leftPos = Math.random() * 100;
          const blurAmount =
            layer === 1 ? "1px" : layer === 2 ? "0.5px" : "0px";

          // Calculate a unique oscillation pattern for natural movement
          const oscillationX = Math.random() * 50 + 20; // Horizontal drift amount
          const oscillationPeriods = Math.floor(Math.random() * 3) + 2; // 2-4 wobbles during fall

          snowflakes.push(
            <div
              key={`snow-${layer}-${i}`}
              style={
                {
                  position: "absolute",
                  left: `${leftPos}%`,
                  top: "-10px",
                  width: `${size}px`,
                  height: `${size}px`,
                  background: "white",
                  borderRadius: "50%",
                  filter: `blur(${blurAmount})`,
                  boxShadow: "0 0 5px rgba(255, 255, 255, 0.8)",
                  animation: `snowfall${layer} ${duration}s ease-in-out ${delay}s infinite`,
                  opacity: layer === 1 ? 0.4 : layer === 2 ? 0.6 : 0.8,
                  zIndex: layer,
                  "--oscillation-x": `${oscillationX}px`,
                  "--oscillation-periods": oscillationPeriods,
                } as React.CSSProperties
              }
            />
          );
        }
      }

      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none perspective-1000">
          {snowflakes}
        </div>
      );
    }

    // Cloud animation with 3D layers
    if ([2, 3].includes(weatherCode)) {
      const clouds = [];
      const count = weatherCode === 2 ? 7 : 10;
      const layers = [
        { depth: 10, opacity: 0.2, scale: 0.7 },
        { depth: 30, opacity: 0.4, scale: 1 },
        { depth: 60, opacity: 0.6, scale: 1.3 },
      ];

      // Create clouds across different depth layers
      for (let layer = 0; layer < layers.length; layer++) {
        const { depth, opacity, scale } = layers[layer];
        const layerClouds = Math.ceil(count / layers.length);

        for (let i = 0; i < layerClouds; i++) {
          const size = (Math.random() * 300 + 200) * scale;
          const duration = 60 + Math.random() * 60;
          const delay = Math.random() * 30;
          const topPos = Math.random() * 60;

          clouds.push(
            <div
              key={`cloud-${layer}-${i}`}
              className="cloud"
              style={
                {
                  top: `${topPos}%`,
                  left: `-50%`,
                  width: `${size}px`,
                  height: `${size * 0.6}px`,
                  background: isDay
                    ? `rgba(255, 255, 255, ${opacity})`
                    : `rgba(255, 255, 255, ${opacity * 0.5})`,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                  animation: `driftacross3D ${duration}s linear ${delay}s infinite`,
                  filter: `blur(${30 / scale}px)`,
                  "--cloud-depth": `${depth}px`,
                  "--cloud-opacity": opacity,
                } as React.CSSProperties
              }
            />
          );
        }
      }

      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none preserve-3d">
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

    // Lightning animation with thunder glow
    if ([95, 96, 99].includes(weatherCode)) {
      const lightningBolts = [];
      const thunderGlows = [];

      // Create 3-5 lightning bolts with varying delays
      for (let i = 0; i < 5; i++) {
        const delay = i * 3 + Math.random() * 4;
        const brightness = 0.7 + Math.random() * 0.3;
        const duration = 8 + Math.random() * 4;

        // Lightning flash (full screen)
        lightningBolts.push(
          <div
            key={`lightning-${i}`}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255, 255, 255, 0.8)",
              animation: `lightning3D ${duration}s ease-out ${delay}s infinite`,
            }}
          />
        );

        // Thunder cloud glow
        thunderGlows.push(
          <div
            key={`thunder-${i}`}
            style={{
              position: "absolute",
              top: "20%",
              left: `${30 + Math.random() * 40}%`,
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              filter: "blur(50px)",
              animation: `thunderGlow ${duration}s ease-out ${delay}s infinite`,
            }}
          />
        );
      }

      // Add rain for thunderstorms
      const raindrops = [];
      for (let layer = 1; layer <= 3; layer++) {
        for (let i = 0; i < (layer === 3 ? 60 : layer === 2 ? 40 : 20); i++) {
          const duration = (0.7 + Math.random() * 0.3) / (layer * 0.5);
          const delay = Math.random() * 5;
          const leftPos = Math.random() * 100;
          const height = (Math.random() * 10 + 15) * layer;
          const angle = -15 - Math.random() * 10; // Stronger wind

          raindrops.push(
            <div
              key={`rain-${layer}-${i}`}
              style={{
                position: "absolute",
                left: `${leftPos}%`,
                top: "-20px",
                height: `${height}px`,
                width: `${2 * layer}px`,
                background: `linear-gradient(180deg, 
                             rgba(255,255,255,0) 0%, 
                             rgba(255,255,255,${0.3 + layer * 0.2}) 40%, 
                             rgba(255,255,255,${0.4 + layer * 0.3}) 100%)`,
                borderRadius: "100% / 5%",
                transform: `rotate(${angle}deg) translateZ(${layer * 20}px)`,
                animation: `rainfall${layer} ${duration}s linear ${delay}s infinite`,
                opacity: layer === 1 ? 0.3 : layer === 2 ? 0.6 : 0.9,
                zIndex: layer,
              }}
            />
          );
        }
      }

      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {thunderGlows}
          {lightningBolts}
          {raindrops}
        </div>
      );
    }

    // Sun rays animation for clear skies with lens flare
    if ([0, 1].includes(weatherCode) && isDay) {
      const sunPosition = {
        top: "10%",
        right: "15%",
      };

      const rays = [];
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30) % 360;
        const length = 40 + Math.random() * 20;
        const delay = i * 0.25;

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
              transform: `rotate(${angle}deg) translateZ(10px)`,
              animation: `sunray3D 3s ease-in-out ${delay}s infinite alternate`,
              boxShadow: "0 0 10px rgba(255, 235, 150, 0.4)",
            }}
          />
        );
      }

      // Add lens flares
      const flares = [];
      for (let i = 0; i < 6; i++) {
        const size = 30 + i * 10;
        const opacity = 0.7 - i * 0.1;
        const offsetX = -50 + i * 20;
        const offsetY = 30 - i * 10;

        flares.push(
          <div
            key={`flare-${i}`}
            className="lens-flare"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `calc(50% + ${offsetX}px)`,
              top: `calc(50% + ${offsetY}px)`,
              opacity: opacity,
              transform: `translateZ(${i * 5}px)`,
            }}
          />
        );
      }

      return (
        <div
          className="absolute overflow-hidden pointer-events-none"
          style={{
            ...sunPosition,
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative w-40 h-40">
            <div
              className="absolute inset-0 rounded-full bg-yellow-300"
              style={{
                boxShadow: "0 0 50px 20px rgba(255, 213, 0, 0.8)",
                animation: "pulse 3s infinite alternate",
              }}
            />
            {rays}
            {flares}
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
