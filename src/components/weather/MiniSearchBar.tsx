import { useState } from "react";
import { motion } from "framer-motion";
import { useWeather } from "../../context/WeatherContext";

interface MiniSearchBarProps {
  onFocus: () => void;
  onSelect: () => void;
  isActive: boolean;
}

export default function MiniSearchBar({
  onFocus,
  onSelect,
  isActive,
}: MiniSearchBarProps) {
  const [query, setQuery] = useState("");
  const { weatherData, setLocation } = useWeather();

  // Use current location name as placeholder
  const locationName = weatherData?.location?.name || "Search location...";

  // Animation variants
  const searchBarVariants = {
    inactive: {
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      scale: 1,
    },
    active: {
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      scale: 1.02,
    },
  };

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      initial="inactive"
      animate={isActive ? "active" : "inactive"}
      variants={searchBarVariants}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`flex items-center bg-white/20 backdrop-blur-md rounded-full pl-3 pr-2 py-2 border border-white/20 transition-all ${
          isActive ? "shadow-lg ring-2 ring-white/30" : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 text-white/80 mr-2 shrink-0"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>

        <input
          type="text"
          className="bg-transparent border-none outline-none text-white flex-grow placeholder-white/70 text-sm md:text-base"
          placeholder={isActive ? "Search for a location..." : locationName}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={onFocus}
        />

        {isActive ? (
          <motion.button
            onClick={onSelect}
            className="ml-1 p-1.5 rounded-full hover:bg-white/20 transition-colors"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4 text-white/90"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        ) : (
          <motion.button
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                async (position) => {
                  try {
                    // Reverse geocode to get the location name
                    const response = await fetch(
                      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&format=json`
                    );
                    const data = await response.json();

                    if (data && data.features && data.features.length > 0) {
                      const locationInfo = data.features[0].properties;
                      // Set location with the actual city name
                      setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        name: locationInfo.name,
                        country: locationInfo.country,
                        admin1: locationInfo.admin1,
                      });
                    } else {
                      // Fallback if reverse geocoding fails
                      setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                      });
                    }
                    // Close search
                    onSelect();
                  } catch (error) {
                    console.error("Reverse geocoding error:", error);
                    setLocation({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    });
                    onSelect();
                  }
                },
                (error) => {
                  console.error("Geolocation error:", error);
                  if (error.code === error.PERMISSION_DENIED) {
                    alert(
                      "Location access denied. Please enable location permissions in your browser settings."
                    );
                  }
                }
              );
            }}
            className="ml-1 p-1.5 rounded-full hover:bg-white/20 transition-colors"
            title="Use current location"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-white/90"
            >
              <path
                fillRule="evenodd"
                d="M9.69 18.933l.003.001c.198.087.39.087.588 0l.003-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14 15.551 15.551 0 003.31-2.566C15.855 14.58 18 11.64 18 8.5a6.5 6.5 0 00-13 0c0 3.14 2.144 6.08 4.124 8.007a15.55 15.55 0 003.31 2.566 6.431 6.431 0 00.281.14l.018.008.006.003zM10 15a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
