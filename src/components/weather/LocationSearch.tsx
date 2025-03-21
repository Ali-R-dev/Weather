import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  searchLocations,
  GeocodingResult,
} from "../../services/geocodingService";
import { useWeather } from "../../context/WeatherContext";
import useSavedLocations, {
  SavedLocation,
} from "../../hooks/useSavedLocations";
import LoadingSpinner from "../common/LoadingSpinner";

interface LocationSearchProps {
  onLocationSelect?: () => void;
  compact?: boolean;
}

export default function LocationSearch({
  onLocationSelect,
  compact = false,
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentlyUsed, setRecentlyUsed] = useState<SavedLocation[]>([]);
  const { setLocation } = useWeather();
  const {
    savedLocations,
    defaultLocation,
    saveLocation,
    setAsDefault,
    removeLocation,
  } = useSavedLocations();
  const searchTimeout = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Create a sorted version of savedLocations with default first
  const sortedLocations = [...savedLocations].sort((a, b) => {
    if (a.id === defaultLocation?.id) return -1;
    if (b.id === defaultLocation?.id) return 1;
    return 0;
  });

  // Handle search input with debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
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
    }, 500);

    return () => {
      if (searchTimeout.current) {
        window.clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

  // Focus input when in compact mode
  useEffect(() => {
    if (compact && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [compact]);

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
    const updatedRecent = [
      location,
      ...recentlyUsed.filter((loc) => loc.id !== location.id),
    ].slice(0, 3);
    setRecentlyUsed(updatedRecent);
    localStorage.setItem("recentLocations", JSON.stringify(updatedRecent));
  };

  // Select a location from search results
  const handleSelectLocation = (location: GeocodingResult) => {
    setLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
      country: location.country,
      admin1: location.admin1,
      admin2: location.admin2,
    });

    // Save to localStorage
    const savedLocation: SavedLocation = {
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      country: location.country,
      admin1: location.admin1,
    };

    saveLocation(savedLocation);
    addToRecentlyUsed(savedLocation);
    setQuery("");
    setIsDropdownOpen(false);

    if (onLocationSelect) {
      onLocationSelect();
    }
  };

  // Set location as default
  const handleSetAsDefault = (e: React.MouseEvent, locationId: number) => {
    e.stopPropagation();
    setAsDefault(locationId);
  };

  // Remove a location
  const handleRemoveLocation = (e: React.MouseEvent, locationId: number) => {
    e.stopPropagation();
    removeLocation(locationId);
  };

  // Select a saved location
  const handleSelectSavedLocation = (location: SavedLocation) => {
    setLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
      country: location.country,
      admin1: location.admin1,
    });

    addToRecentlyUsed(location);
    setIsDropdownOpen(false);

    if (onLocationSelect) {
      onLocationSelect();
    }
  };

  return (
    <div
      className="relative w-full"
      ref={dropdownRef}
      style={{ zIndex: compact ? 9999 : 30 }}
    >
      {/* Search input field - only in full mode */}
      {!compact && (
        <div className="relative">
          <motion.div
            className={`relative flex items-center w-full overflow-hidden rounded-xl 
                      bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md 
                      border border-white/20 shadow-lg ${
                        searchFocused ? "ring-2 ring-white/30" : ""
                      }`}
            animate={{
              scale: searchFocused ? 1.01 : 1,
              boxShadow: searchFocused
                ? "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
                : "0 4px 12px -2px rgba(0, 0, 0, 0.1)",
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="pl-4 py-3 text-white/70">
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
            </div>

            <input
              type="text"
              placeholder="Search for a location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                setIsDropdownOpen(true);
                setSearchFocused(true);
              }}
              onBlur={() => setSearchFocused(false)}
              className="w-full px-3 py-3 bg-transparent text-white placeholder-white/60 focus:outline-none"
              autoComplete="off"
            />

            {query.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mr-2 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => setQuery("")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </motion.button>
            )}

            {isSearching && (
              <div className="mr-3">
                <LoadingSpinner size="small" />
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Search Results Container */}
      <AnimatePresence>
        {(isDropdownOpen || compact) && (
          <motion.div
            className={`${
              compact
                ? "fixed top-0 left-1/2 -translate-x-1/2 w-[320px]"
                : "absolute z-[100] mt-2 w-[320px]"
            } shadow-2xl max-h-[50vh] overflow-auto backdrop-blur-xl bg-black/60 border border-white/20 rounded-2xl`}
            style={{ zIndex: 9999 }}
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
            {/* Header for compact mode */}
            {compact && (
              <motion.div
                className="sticky top-0 z-[101] px-3 py-2 flex items-center justify-between bg-gradient-to-r from-black/80 to-gray-900/70 backdrop-blur-xl border-b border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-white text-sm font-medium">
                  Search Locations
                </div>
                <motion.button
                  onClick={() => {
                    if (onLocationSelect) onLocationSelect();
                  }}
                  className="p-1 rounded-full hover:bg-white/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
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
              </motion.div>
            )}

            {/* Compact mode search input */}
            {compact && (
              <div className="relative px-3 py-2">
                <motion.div
                  className="relative flex items-center w-full overflow-hidden rounded-lg 
                          bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md 
                          border border-white/20"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="pl-3 py-2 text-white/70">
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
                  </div>

                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for a location..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-2 py-2 bg-transparent text-white text-sm placeholder-white/60 focus:outline-none"
                    autoComplete="off"
                    autoFocus
                  />

                  {query.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mr-2 p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                      onClick={() => setQuery("")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </motion.button>
                  )}

                  {isSearching && (
                    <div className="mr-2">
                      <LoadingSpinner size="small" />
                    </div>
                  )}
                </motion.div>
              </div>
            )}

            {/* Recently used locations section */}
            {recentlyUsed.length > 0 && query.trim().length === 0 && (
              <motion.div
                className="border-b border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium text-white/50">
                  Recent
                </div>
                <div className="px-2 py-0.5">
                  {recentlyUsed.map((location, index) => (
                    <motion.div
                      key={`recent-${location.id}`}
                      className="mx-1 px-2 py-1.5 cursor-pointer flex justify-between items-center rounded-lg hover:bg-white/10"
                      onClick={() => handleSelectSavedLocation(location)}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileHover={{
                        scale: 1.01,
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                      whileTap={{ scale: 0.99 }}
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
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Saved locations section */}
            {sortedLocations.length > 0 && query.trim().length === 0 && (
              <motion.div
                className="border-b border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium text-white/50">
                  Saved locations
                </div>
                <div className="px-2 py-0.5">
                  {sortedLocations.map((location, index) => (
                    <motion.div
                      key={location.id}
                      className="mx-1 px-2 py-1.5 cursor-pointer flex justify-between items-center rounded-lg hover:bg-white/10"
                      onClick={() => handleSelectSavedLocation(location)}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      whileHover={{
                        scale: 1.01,
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                      whileTap={{ scale: 0.99 }}
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
                          <div className="text-sm font-medium text-white flex items-center">
                            {location.name}
                            {location.id === defaultLocation?.id && (
                              <span className="ml-1.5 px-1 py-0.5 text-[8px] rounded-full bg-yellow-500/20 text-yellow-300 uppercase tracking-wide">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-white/70">
                            {location.country}
                            {location.admin1 ? `, ${location.admin1}` : ""}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <motion.button
                          onClick={(e) => handleSetAsDefault(e, location.id)}
                          className="p-1 rounded-lg bg-white/5 text-white/80 hover:bg-white/15 hover:text-yellow-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Set as default"
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
                          className="p-1 rounded-lg bg-white/5 text-white/80 hover:bg-white/15 hover:text-red-400"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Remove location"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3.5 h-3.5"
                          >
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
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
                transition={{ delay: 0.3 }}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium text-white/50">
                  Search results
                </div>
                <div className="px-2 py-0.5">
                  {results.map((location, index) => (
                    <motion.div
                      key={location.id}
                      className="mx-1 px-2 py-1.5 cursor-pointer flex items-center justify-between rounded-lg hover:bg-white/10"
                      onClick={() => handleSelectLocation(location)}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      whileHover={{
                        scale: 1.01,
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                      whileTap={{ scale: 0.99 }}
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

                      <motion.button
                        className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Save location"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty states */}
            {query.trim().length > 1 &&
              results.length === 0 &&
              !isSearching && (
                <div className="px-3 py-4 text-center">
                  <div className="inline-block p-2 rounded-full bg-white/10 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-white/70"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-white/70">
                    No locations found for "{query}"
                  </div>
                  <div className="text-[10px] text-white/50 mt-1">
                    Try a different search term
                  </div>
                </div>
              )}

            {query.trim().length <= 1 &&
              savedLocations.length === 0 &&
              recentlyUsed.length === 0 && (
                <div className="px-3 py-4 text-center">
                  <div className="inline-block p-2 rounded-full bg-white/10 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-white/70"
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
                  </div>
                  <div className="text-sm text-white/70">
                    No saved locations
                  </div>
                  <div className="text-[10px] text-white/50 mt-1">
                    Search for a location or use your current location
                  </div>
                </div>
              )}

            {/* Current location button */}
            <motion.div
              className="px-3 py-2 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                      });
                      setIsDropdownOpen(false);
                      if (onLocationSelect) {
                        onLocationSelect();
                      }
                    },
                    (error) => {
                      console.error("Geolocation error:", error);
                      alert(
                        "Unable to get your location. Please enable location services or search for a location."
                      );
                    }
                  );
                }}
                className="w-full py-2 rounded-lg flex items-center justify-center 
                          bg-gradient-to-r from-blue-500/20 to-blue-600/20
                          text-white text-sm hover:from-blue-500/30 hover:to-blue-600/30
                          border border-blue-500/20 backdrop-blur-sm
                          transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 mr-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.69 18.933l.003.001c.198.087.39.087.588 0l.003-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14 15.551 15.551 0 003.31-2.566C15.855 14.58 18 11.64 18 8.5a6.5 6.5 0 00-13 0c0 3.14 2.144 6.08 4.124 8.007a15.55 15.55 0 003.31 2.566 6.431 6.431 0 00.281.14l.018.008.006.003zM10 15a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Use current location
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
