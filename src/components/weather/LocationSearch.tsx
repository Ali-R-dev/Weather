import { useState, useEffect, useRef } from "react";
import {
  searchLocations,
  GeocodingResult,
} from "../../services/geocodingService";
import { useWeather } from "../../context/WeatherContext";
import useSavedLocations, {
  SavedLocation,
} from "../../hooks/useSavedLocations";
import LoadingSpinner from "../common/LoadingSpinner";

// Add a compact prop to the interface
interface LocationSearchProps {
  onLocationSelect?: () => void;
  compact?: boolean; // New prop for compact mode
}

export default function LocationSearch({
  onLocationSelect,
  compact = false, // Default to false for backward compatibility
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  // Handle search input
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
      const locations = await searchLocations(query);
      setResults(locations);
      setIsSearching(false);
      setIsDropdownOpen(true);
    }, 500);

    return () => {
      if (searchTimeout.current) {
        window.clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

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

  // Select a location from search results
  const handleSelectLocation = (location: GeocodingResult) => {
    setLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
      country: location.country,
    });

    // Save to localStorage
    const savedLocation: SavedLocation = {
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      country: location.country,
    };

    saveLocation(savedLocation);
    setQuery("");
    setIsDropdownOpen(false);

    if (onLocationSelect) {
      onLocationSelect();
    }
  };

  // Set location as default
  const handleSetAsDefault = (e: React.MouseEvent, locationId: number) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    setAsDefault(locationId);
  };

  // Remove a location
  const handleRemoveLocation = (e: React.MouseEvent, locationId: number) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    removeLocation(locationId);
  };

  // Select a saved location
  const handleSelectSavedLocation = (location: SavedLocation) => {
    setLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
      country: location.country,
    });
    setIsDropdownOpen(false);

    if (onLocationSelect) {
      onLocationSelect();
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Only show the search input in full mode, not compact mode */}
      {!compact && (
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-white/60 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30"
            autoComplete="off"
          />
          {isSearching && (
            <div className="absolute right-3 top-3">
              <LoadingSpinner size="small" />
            </div>
          )}
        </div>
      )}

      {/* Search Results Container */}
      {(isDropdownOpen || compact) && (
        <div
          className={`${
            compact ? "rounded-2xl" : "absolute z-30 mt-2"
          } w-full shadow-xl max-h-[70vh] overflow-auto backdrop-blur-lg bg-black/50 border border-white/20`}
        >
          {/* Close button for compact mode */}
          {compact && (
            <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-white/10">
              <div className="text-white font-medium">Search Locations</div>
              <button
                onClick={() => {
                  if (onLocationSelect) onLocationSelect();
                }}
                className="p-1.5 rounded-full hover:bg-white/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-white/90"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {compact && (
            <div className="relative px-4 py-3">
              <input
                type="text"
                placeholder="Search for a location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-white/60 shadow-md focus:outline-none focus:ring-2 focus:ring-white/30"
                autoComplete="off"
                autoFocus
              />
              {isSearching && (
                <div className="absolute right-7 top-6">
                  <LoadingSpinner size="small" />
                </div>
              )}
            </div>
          )}

          {/* Saved locations section */}
          {savedLocations.length > 0 && (
            <div className="border-b border-white/10">
              <div className="px-4 py-2 text-sm text-white/70">
                Saved locations
              </div>
              {savedLocations.map((location) => (
                <div
                  key={location.id}
                  className="px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-white/10"
                  onClick={() => handleSelectSavedLocation(location)}
                >
                  <div>
                    <div className="font-medium text-white">
                      {location.name}
                    </div>
                    <div className="text-sm text-white/70">
                      {location.country}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {location.id === defaultLocation?.id ? (
                      <div className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                        Default
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleSetAsDefault(e, location.id)}
                        className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/90 hover:bg-white/20"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={(e) => handleRemoveLocation(e, location.id)}
                      className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search results section */}
          {results.length > 0 && (
            <div>
              <div className="px-4 py-2 text-sm text-white/70">
                Search results
              </div>
              {results.map((location) => (
                <div
                  key={location.id}
                  className="px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-white/10"
                  onClick={() => handleSelectLocation(location)}
                >
                  <div>
                    <div className="font-medium text-white">
                      {location.name}
                    </div>
                    <div className="text-sm text-white/70">
                      {location.country}
                      {location.admin1 ? `, ${location.admin1}` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty states */}
          {query.trim().length > 1 && results.length === 0 && !isSearching && (
            <div className="px-4 py-6 text-center text-white/70">
              No locations found for "{query}"
            </div>
          )}

          {query.trim().length <= 1 && savedLocations.length === 0 && (
            <div className="px-4 py-6 text-center text-white/70">
              Search for a location above or use your current location
            </div>
          )}

          {/* Current location button */}
          <div className="px-4 py-3 border-t border-white/10">
            <button
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
              className="w-full py-3 rounded-lg flex items-center justify-center bg-white/10 text-white hover:bg-white/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                  clipRule="evenodd"
                />
              </svg>
              Use current location
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
