import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "../../context/WeatherContext";
import { reverseGeocode } from "../../services/geocodingService";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // Use current location name as placeholder
  const locationName = weatherData?.location?.name || "Search location...";

  // Watch for geolocation status changes
  useEffect(() => {
    if (!isLocationLoading) return;

    const timeoutId = setTimeout(() => {
      // Auto-cancel loading state after 10 seconds as fallback
      setIsLocationLoading(false);
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [isLocationLoading]);

  // Animation variants
  const searchBarVariants = {
    inactive: {
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      y: 0,
    },
    active: {
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      y: -2,
    },
    hovered: {
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      y: -1,
    },
  };

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      initial="inactive"
      animate={isActive ? "active" : isHovered ? "hovered" : "inactive"}
      variants={searchBarVariants}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className={`flex items-center bg-gradient-to-r from-white/20 via-white/15 to-white/10 backdrop-blur-md 
                  rounded-full pl-3 pr-2 py-2 border border-white/20 transition-all`}
        animate={{
          borderColor: isActive
            ? "rgba(255,255,255,0.3)"
            : "rgba(255,255,255,0.2)",
        }}
      >
        <motion.div
          className="text-white/80 mr-2 shrink-0"
          animate={{ scale: isActive ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>

        <input
          type="text"
          className="bg-transparent border-none outline-none text-white flex-grow placeholder-white/70 text-sm md:text-base"
          placeholder={isActive ? "Search for a location..." : locationName}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={onFocus}
        />

        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.button
              onClick={onSelect}
              className="ml-1 p-1.5 rounded-full hover:bg-white/20 transition-colors"
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.9 }}
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
          ) : isLocationLoading ? (
            <motion.div
              className="ml-1 p-1.5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              transition={{
                opacity: { duration: 0.2 },
                rotate: { repeat: Infinity, duration: 1, ease: "linear" },
              }}
            >
              <svg
                className="animate-spin h-4 w-4 text-white/90"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => {
                setIsLocationLoading(true);
                navigator.geolocation.getCurrentPosition(
                  async (position) => {
                    try {
                      const locationInfo = await reverseGeocode(
                        position.coords.latitude,
                        position.coords.longitude
                      );

                      if (locationInfo) {
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
                    } finally {
                      setIsLocationLoading(false);
                    }
                  },
                  (error) => {
                    console.error("Geolocation error:", error);
                    setIsLocationLoading(false);
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
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
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
