import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "../../context/WeatherContext";
import {
  reverseGeocode,
  searchLocations,
  GeocodingResult,
} from "../../services/geocodingService";
import useSavedLocations, {
  SavedLocation,
} from "../../hooks/useSavedLocations";
import LoadingSpinner from "../common/LoadingSpinner";

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
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentlyUsed, setRecentlyUsed] = useState<SavedLocation[]>([]);
  const { weatherData, setLocation } = useWeather();
  const [isHovered, setIsHovered] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const { saveLocation, setAsDefault, removeLocation, defaultLocation } =
    useSavedLocations();
  const searchTimeout = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use current location name as placeholder
  const locationName = weatherData?.location?.name || "Search location...";

  // Handle search input with debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false); // Stop loading when query is cleared or too short
      return;
    }

    if (searchTimeout.current) {
      window.clearTimeout(searchTimeout.current);
    }

    setIsSearching(true);
    searchTimeout.current = window.setTimeout(async () => {
      try {
        const locations = await searchLocations(query);
        setResults(locations);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
        setIsDropdownOpen(true);
      }
    }, 300); // Reduced debounce time for better responsiveness

    return () => {
      if (searchTimeout.current) {
        window.clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

  // Clear loading state when component unmounts
  useEffect(() => {
    return () => {
      setIsSearching(false);
    };
  }, []);

  // Load recently used locations from localStorage
  useEffect(() => {
    const recentLocations = localStorage.getItem("recentLocations");
    if (recentLocations) {
      try {
        setRecentlyUsed(JSON.parse(recentLocations));
      } catch (e) {
        console.error("Error parsing recent locations", e);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add to recently used locations
  const addToRecentlyUsed = (location: SavedLocation) => {
    setIsSearching(false); // Ensure loading is stopped when selecting a location
    const updatedRecent = [
      location,
      ...recentlyUsed.filter((loc) => loc.id !== location.id),
    ].slice(0, 3);
    setRecentlyUsed(updatedRecent);
    localStorage.setItem("recentLocations", JSON.stringify(updatedRecent));
  };

  // Handle removing a location
  const handleRemoveLocation = (e: React.MouseEvent, locationId: number) => {
    e.stopPropagation();
    // Remove from recent locations
    const updatedRecent = recentlyUsed.filter((loc) => loc.id !== locationId);
    setRecentlyUsed(updatedRecent);
    localStorage.setItem("recentLocations", JSON.stringify(updatedRecent));
    // Remove from saved locations
    removeLocation(locationId);
  };

  // Handle setting default location
  const handleSetDefault = async (e: React.MouseEvent, locationId: number) => {
    e.stopPropagation();
    setAsDefault(locationId);

    // Find the location in recently used
    const location = recentlyUsed.find((loc) => loc.id === locationId);
    if (location) {
      // Update the location in state and fetch weather
      setLocation(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          name: location.name,
          country: location.country,
          admin1: location.admin1,
        },
        true
      ); // Explicitly fetch weather for default location
    }
  };

  // Select a location from search results
  const handleSelectLocation = (
    location: GeocodingResult | SavedLocation,
    event?: React.MouseEvent
  ) => {
    // Don't update weather if clicking remove/default buttons
    if (
      event?.target &&
      (event.target as HTMLElement).closest(".action-button")
    ) {
      return;
    }

    // Update location and fetch weather data
    setLocation(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
        country: location.country,
        admin1: location.admin1,
        admin2: "admin2" in location ? location.admin2 : undefined,
      },
      true // Set to true to fetch weather data for the new location
    );

    // Save to localStorage
    const savedLocation: SavedLocation = {
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      country: location.country,
      admin1: location.admin1,
      isDefault: defaultLocation?.id === location.id,
    };

    saveLocation(savedLocation);
    addToRecentlyUsed(savedLocation);
    setQuery("");
    setIsDropdownOpen(false);
    onSelect();
  };

  // Load default location on mount
  useEffect(() => {
    if (defaultLocation) {
      setLocation({
        latitude: defaultLocation.latitude,
        longitude: defaultLocation.longitude,
        name: defaultLocation.name,
        country: defaultLocation.country,
        admin1: defaultLocation.admin1,
      });
    }
  }, [defaultLocation, setLocation]);

  // Animation variants
  const searchBarVariants = {
    inactive: {
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
      y: 0,
    },
    active: {
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
      y: -2,
    },
    hovered: {
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      y: -1,
    },
  };

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      ref={dropdownRef}
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
                  rounded-full pl-3 pr-2 py-1.5 border border-white/20 transition-all overflow-hidden`}
        animate={{
          borderColor: isActive
            ? "rgba(255, 255, 255, 0.3)"
            : "rgba(255, 255, 255, 0.2)",
        }}
      >
        <motion.div
          className="text-white/80 mr-2 shrink-0"
          animate={{ scale: isActive ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {isSearching && query.trim().length >= 2 ? (
            <LoadingSpinner size="small" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </motion.div>

        <input
          type="text"
          className="bg-transparent border-none outline-none text-white flex-grow placeholder-white/70 text-sm w-full"
          placeholder={isActive ? "Search for a location..." : locationName}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsDropdownOpen(true);
            onFocus();
          }}
        />

        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.button
              onClick={() => {
                setQuery("");
                setIsDropdownOpen(false);
                onSelect();
              }}
              className="ml-1 p-1 rounded-full hover:bg-white/10 transition-colors shrink-0"
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-3.5 h-3.5 text-white/90"
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
              className="ml-1 p-1 shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              transition={{
                opacity: { duration: 0.2 },
                rotate: { repeat: Infinity, duration: 1, ease: "linear" },
              }}
            >
              <LoadingSpinner size="small" />
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
                        setLocation({
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude,
                        });
                      }
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
              className="ml-1 p-1 rounded-full hover:bg-white/20 transition-colors shrink-0"
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
                className="w-3.5 h-3.5 text-white/90"
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

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="absolute z-[100] mt-2 w-full max-w-md shadow-2xl max-h-[50vh] overflow-auto backdrop-blur-xl bg-gradient-to-b from-black/80 to-black/60 border border-white/20 rounded-2xl"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            {/* Recently used locations section */}
            {recentlyUsed.length > 0 && query.trim().length === 0 && (
              <motion.div
                className="border-b border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-white/60 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5 mr-1.5 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a.75.75 0 01.75.75v.258a33.186 33.186 0 016.668.83.75.75 0 01-.336 1.461 31.28 31.28 0 00-1.103-.232l1.702 7.545a.75.75 0 01-.387.832A4.981 4.981 0 0115 14c-.825 0-1.606-.2-2.294-.556a.75.75 0 01-.387-.832l1.77-7.849a31.743 31.743 0 00-3.339-.254v11.505a20.01 20.01 0 013.78.501.75.75 0 11-.339 1.462A18.51 18.51 0 0010 17.5c-1.442 0-2.845.165-4.191.477a.75.75 0 01-.338-1.462 20.01 20.01 0 013.779-.501V4.509c-1.129.026-2.243.112-3.34.254l1.771 7.85a.75.75 0 01-.387.831A4.981 4.981 0 015 14c-.825 0-1.606-.2-2.294-.556a.75.75 0 01-.387-.832l1.702-7.545c-.37.053-.738.11-1.103.232a.75.75 0 11-.336-1.461 33.186 33.186 0 016.668-.83V2.75A.75.75 0 0110 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Recent Locations
                </div>
                <div className="px-2 pb-3">
                  {recentlyUsed.map((location, index) => (
                    <motion.div
                      key={`recent-${location.id}`}
                      className="mx-1 px-2.5 py-2.5 cursor-pointer flex justify-between items-center rounded-xl bg-transparent hover:bg-white/10 transition-all duration-200 group"
                      onClick={(e) => handleSelectLocation(location, e)}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <div className="mr-2 p-1 rounded-full bg-white/10">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3.5 h-3.5 text-blue-300"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 116.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0zM10 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm-9 3.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 011 10zm16.25-.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zm-13.907 6.45a.75.75 0 010-1.06l1.06-1.062a.75.75 0 011.062 1.061l-1.06 1.06a.75.75 0 01-1.062 0zm9.904 0a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 111.06-1.061l1.06 1.06a.75.75 0 010 1.061zM10 18a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 18z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {location.name}
                          </div>
                          <div className="text-[10px] text-white/70">
                            {location.country}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          onClick={(e) => handleSetDefault(e, location.id)}
                          className={`p-1 rounded-full hover:bg-white/10 transition-colors ${
                            defaultLocation?.id === location.id
                              ? "text-yellow-300"
                              : "text-white/70 hover:text-white/90"
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title={
                            defaultLocation?.id === location.id
                              ? "Default location"
                              : "Set as default"
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3.5 h-3.5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.button>
                        <motion.button
                          onClick={(e) => handleRemoveLocation(e, location.id)}
                          className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white/90 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Remove from recent"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3.5 h-3.5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Search results section */}
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-white/60 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5 mr-1.5 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Search Results
                </div>
                <div className="px-2 py-1">
                  {results.map((location, index) => (
                    <motion.div
                      key={location.id}
                      className="mx-1 px-2.5 py-2.5 cursor-pointer flex items-center justify-between rounded-xl bg-transparent hover:bg-white/10 transition-all duration-200"
                      onClick={(e) => handleSelectLocation(location, e)}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <div className="mr-2 p-1 rounded-full bg-white/10">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3.5 h-3.5 text-white/70"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {location.name}
                          </div>
                          <div className="text-[10px] text-white/70">
                            {location.country}
                            {location.admin1 ? `, ${location.admin1}` : ""}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty state */}
            {query.trim().length > 1 &&
              results.length === 0 &&
              !isSearching && (
                <div className="px-3 py-6 text-center">
                  <motion.div
                    className="inline-block p-2.5 rounded-full bg-white/10 mb-3"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-white/70"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                      />
                    </svg>
                  </motion.div>
                  <motion.div
                    className="text-sm font-medium text-white/70"
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    No locations found for "{query}"
                  </motion.div>
                  <motion.div
                    className="text-xs text-white/50 mt-1.5"
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Try a different search term
                  </motion.div>
                </div>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
