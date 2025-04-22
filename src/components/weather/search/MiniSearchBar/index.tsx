import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../../../../context/LocationContext';
import { SavedLocation } from '../../../../hooks/useSavedLocations';
import { GeocodingResult } from '../../../../types/geocoding.types';
import { useLocationSearch } from '../../../../hooks/useLocationSearch';
import { useTranslation } from 'react-i18next';
import SearchInput from '../SearchInput';
import LocationItem from '../LocationItem';
import NoResults from '../NoResults';
import styles from './styles.module.css';
import { LocationSource } from '../../../../services/LocationService';

interface MiniSearchBarProps {
  onFocus: () => void;
  onSelect: () => void;
  isActive: boolean;
}

export default function MiniSearchBar({ onFocus, onSelect, isActive }: MiniSearchBarProps) {
  const { query, setQuery, results, isSearching, clearSearch } = useLocationSearch(2, 300); // minChars=2, debounceTime=300
  const { t } = useTranslation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    defaultLocation,
    recentLocations,
    setLocation,
    setDefaultLocation,
    saveLocation,
    removeLocation,
    removeFromRecentLocations,
  } = useLocation();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle removing a location
  const handleRemoveLocation = (e: React.MouseEvent, locationId: number) => {
    e.stopPropagation();
    removeLocation(locationId);
    removeFromRecentLocations(locationId);
  };

  // Handle setting default location
  const handleSetDefault = (e: React.MouseEvent, locationId: number) => {
    e.stopPropagation();
    setDefaultLocation(locationId);
  };

  // Select a location from search results
  const handleSelectLocation = (
    location: GeocodingResult | SavedLocation,
    event?: React.MouseEvent
  ) => {
    // Don't update weather if clicking remove/default buttons
    if (event?.target && (event.target as HTMLElement).closest('.action-button')) {
      return;
    }

    // Use the location context to set location
    setLocation(
      {
        id: location.id,
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
        country: location.country,
        admin1: location.admin1,
        admin2: 'admin2' in location ? location.admin2 : undefined,
      },
      LocationSource.SEARCH
    );

    // Convert to SavedLocation if from search results
    if (!('isDefault' in location)) {
      const savedLocation: SavedLocation = {
        id: location.id,
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        country: location.country,
        admin1: location.admin1,
      };

      // Save the location
      saveLocation(savedLocation);
    }

    clearSearch();
    setIsDropdownOpen(false);
    onSelect();
  };

  const handleFocus = () => {
    setIsDropdownOpen(true);
    onFocus();
  };

  const handleClear = () => {
    clearSearch();
    setIsDropdownOpen(false);
    onSelect();
  };

  return (
    <div className={styles.searchContainer} ref={searchBarRef}>
      <motion.div
        animate={{
          scale: isActive ? 1.02 : 1,
          // boxShadow: isActive
          //   ? "0 0 0 3px rgba(255,255,255,0.3)"
          //   : "0 0 0 0 rgba(255,255,255,0)",
        }}
      >
        <SearchInput
          query={query}
          onQueryChange={setQuery}
          onFocus={handleFocus}
          onClear={handleClear}
          inputRef={inputRef as React.RefObject<HTMLInputElement>}
        />
      </motion.div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              duration: 0.2,
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
            ref={dropdownRef}
          >
            {/* Recently used locations section */}
            {recentLocations.length > 0 && query.trim().length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className={styles.sectionHeader}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={styles.sectionIcon}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a.75.75 0 01.75.75v.258a33.186 33.186 0 016.668.83.75.75 0 01-.336 1.461 31.28 31.28 0 00-1.103-.232l1.702 7.545a.75.75 0 01-.387.832A4.981 4.981 0 0115 14c-.825 0-1.606-.2-2.294-.556a.75.75 0 01-.387-.832l1.77-7.849a31.743 31.743 0 00-3.339-.254v11.505a20.01 20.01 0 013.78.501.75.75 0 11-.339 1.462A18.51 18.51 0 0010 17.5c-1.442 0-2.845.165-4.191.477a.75.75 0 01-.338-1.462 20.01 20.01 0 013.779-.501V4.509c-1.129.026-2.243.112-3.34.254l1.771 7.85a.75.75 0 01-.387.831A4.981 4.981 0 015 14c-.825 0-1.606-.2-2.294-.556a.75.75 0 01-.387-.832l1.702-7.545c-.37.053-.738.11-1.103.232a.75.75 0 11-.336-1.461 33.186 33.186 0 016.668-.83V2.75A.75.75 0 0110 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t('recent_locations')}
                </div>
                <div className={styles.resultsContainer}>
                  {recentLocations.map((location, index) => (
                    <LocationItem
                      key={`recent-${location.id}`}
                      location={location}
                      isDefault={defaultLocation?.id === location.id}
                      isRecent={true}
                      onSelect={handleSelectLocation}
                      onSetDefault={handleSetDefault}
                      onRemove={handleRemoveLocation}
                      index={index}
                    />
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
                <div className={styles.sectionHeader}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={styles.sectionIcon}
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t('search_results')}
                </div>
                <div className={styles.resultsContainer}>
                  {results.map((location, index) => (
                    <LocationItem
                      key={location.id}
                      location={location}
                      onSelect={handleSelectLocation}
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty state */}
            {query.trim().length > 1 && results.length === 0 && !isSearching && (
              <NoResults query={query} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
