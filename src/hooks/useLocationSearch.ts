import { useState, useEffect, useRef } from "react";
import { searchLocations, GeocodingResult } from "../services/geocodingService";

export function useLocationSearch(
  minChars: number = 2,
  debounceTime: number = 300
) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (query.trim().length < minChars) {
      setResults([]);
      setIsSearching(false);
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
      }
    }, debounceTime);

    return () => {
      if (searchTimeout.current) {
        window.clearTimeout(searchTimeout.current);
      }
    };
  }, [query, minChars, debounceTime]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch: () => setQuery(""),
  };
}
