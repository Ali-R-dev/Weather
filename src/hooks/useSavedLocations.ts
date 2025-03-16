import { useState, useEffect } from "react";

export interface SavedLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  isDefault?: boolean;
}

export default function useSavedLocations() {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [defaultLocation, setDefaultLocation] = useState<SavedLocation | null>(
    null
  );

  // Load saved locations from localStorage on mount
  useEffect(() => {
    const storedLocations = localStorage.getItem("savedLocations");
    const storedDefaultLocation = localStorage.getItem("defaultLocation");

    if (storedLocations) {
      try {
        const locations = JSON.parse(storedLocations);
        setSavedLocations(locations);
      } catch (error) {
        console.error("Failed to parse saved locations:", error);
      }
    }

    if (storedDefaultLocation) {
      try {
        const defaultLoc = JSON.parse(storedDefaultLocation);
        setDefaultLocation(defaultLoc);
      } catch (error) {
        console.error("Failed to parse default location:", error);
      }
    }
  }, []);

  // Save location to localStorage
  const saveLocation = (location: SavedLocation) => {
    const exists = savedLocations.some((loc) => loc.id === location.id);

    if (!exists) {
      const updatedLocations = [...savedLocations, location];
      setSavedLocations(updatedLocations);
      localStorage.setItem("savedLocations", JSON.stringify(updatedLocations));

      // If this is the first location saved, make it default
      if (updatedLocations.length === 1 && !defaultLocation) {
        setAsDefault(location.id);
      }
    }
  };

  // Set default location
  const setAsDefault = (locationId: number) => {
    const location = savedLocations.find((loc) => loc.id === locationId);

    if (location) {
      setDefaultLocation({ ...location, isDefault: true });
      localStorage.setItem(
        "defaultLocation",
        JSON.stringify({ ...location, isDefault: true })
      );
    }
  };

  // Remove saved location
  const removeLocation = (locationId: number) => {
    const updatedLocations = savedLocations.filter(
      (loc) => loc.id !== locationId
    );
    setSavedLocations(updatedLocations);
    localStorage.setItem("savedLocations", JSON.stringify(updatedLocations));

    // If default location was removed, clear it
    if (defaultLocation && defaultLocation.id === locationId) {
      setDefaultLocation(null);
      localStorage.removeItem("defaultLocation");

      // If there are other locations, set the first one as default
      if (updatedLocations.length > 0) {
        setAsDefault(updatedLocations[0].id);
      }
    }
  };

  return {
    savedLocations,
    defaultLocation,
    saveLocation,
    setAsDefault,
    removeLocation,
  };
}
