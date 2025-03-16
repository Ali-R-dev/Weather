import { useState, useEffect, useRef } from "react";
import {
  searchLocations,
  GeocodingResult,
} from "../../services/geocodingService";
import { useWeather } from "../../context/WeatherContext";
import useSavedLocations, {
  SavedLocation,
} from "../../hooks/useSavedLocations";
import { useTheme } from "../../context/ThemeContext";

export default function LocationSearch() {
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
  const { currentTheme } = useTheme();
  const searchTimeout = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDarkTheme = currentTheme.includes("night");

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
  };

  return (
    <div className="relative w-full mx-auto" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          className={`w-full px-3 py-2 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300 ${
            isDarkTheme
              ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-800"
          }`}
        />
        {isSearching && (
          <div className="absolute right-2 top-2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {isDropdownOpen && (
        <div
          className={`absolute z-20 mt-1 w-full rounded-md shadow-lg max-h-[50vh] overflow-auto transition-colors duration-300 ${
            isDarkTheme
              ? "bg-slate-800 border border-slate-700"
              : "bg-white border border-gray-100"
          }`}
        >
          {/* Saved locations section */}
          {savedLocations.length > 0 && (
            <div
              className={
                isDarkTheme
                  ? "border-b border-slate-700"
                  : "border-b border-gray-100"
              }
            >
              <div
                className={`px-4 py-2 text-sm ${
                  isDarkTheme ? "text-gray-400" : "text-text-light"
                }`}
              >
                Saved locations
              </div>
              {savedLocations.map((location) => (
                <div
                  key={location.id}
                  className={`px-4 py-2 cursor-pointer flex justify-between items-center ${
                    isDarkTheme ? "hover:bg-slate-700" : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelectSavedLocation(location)}
                >
                  <div>
                    <div
                      className={`font-medium ${
                        isDarkTheme ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {location.name}
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkTheme ? "text-gray-400" : "text-text-light"
                      }`}
                    >
                      {location.country}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {location.id === defaultLocation?.id ? (
                      <div className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                        Default
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleSetAsDefault(e, location.id)}
                        className={`text-xs px-2 py-1 rounded ${
                          isDarkTheme
                            ? "bg-slate-600 text-slate-200 hover:bg-slate-500"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={(e) => handleRemoveLocation(e, location.id)}
                      className={`ml-2 p-1 rounded-full ${
                        isDarkTheme
                          ? "text-slate-400 hover:text-red-300 hover:bg-slate-600"
                          : "text-gray-500 hover:text-red-500 hover:bg-gray-100"
                      }`}
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
              <div
                className={`px-4 py-2 text-sm ${
                  isDarkTheme ? "text-gray-400" : "text-text-light"
                }`}
              >
                Search results
              </div>
              {results.map((location) => (
                <div
                  key={location.id}
                  className={`px-4 py-2 cursor-pointer flex items-center justify-between ${
                    isDarkTheme ? "hover:bg-slate-700" : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelectLocation(location)}
                >
                  <div>
                    <div
                      className={`font-medium ${
                        isDarkTheme ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {location.name}
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkTheme ? "text-gray-400" : "text-text-light"
                      }`}
                    >
                      {location.country}
                      {location.admin1 ? `, ${location.admin1}` : ""}
                    </div>
                  </div>
                  <div>
                    <button
                      className={`p-1 rounded-full ${
                        isDarkTheme
                          ? "bg-slate-700 text-slate-300"
                          : "bg-gray-100 text-gray-600"
                      }`}
                      title="Add to saved locations"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty states */}
          {query.trim().length > 1 && results.length === 0 && !isSearching && (
            <div
              className={`px-4 py-6 text-center ${
                isDarkTheme ? "text-gray-400" : "text-text-light"
              }`}
            >
              No locations found for "{query}"
            </div>
          )}

          {query.trim().length <= 1 && savedLocations.length === 0 && (
            <div
              className={`px-4 py-6 text-center ${
                isDarkTheme ? "text-gray-400" : "text-text-light"
              }`}
            >
              Search for a location above or use your current location
            </div>
          )}

          {/* Current location button */}
          <div
            className={`px-4 py-3 border-t ${
              isDarkTheme ? "border-slate-700" : "border-gray-100"
            }`}
          >
            <button
              onClick={() => {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setLocation({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    });
                    setIsDropdownOpen(false);
                  },
                  (error) => {
                    console.error("Geolocation error:", error);
                    alert(
                      "Unable to get your location. Please enable location services or search for a location."
                    );
                  }
                );
              }}
              className={`w-full py-2 rounded-md flex items-center justify-center ${
                isDarkTheme
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
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
