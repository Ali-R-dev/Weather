/* eslint-disable @typescript-eslint/no-explicit-any */

import { reverseGeocode } from './geocodingService';
import { get, set } from 'idb-keyval';

/**
 * Type for location information used throughout the app
 */
export interface LocationInfo {
  latitude: number;
  longitude: number;
  name?: string;
  country?: string;
  admin1?: string; // State/province
  admin2?: string; // County/district
  id?: number; // Optional ID for saved locations
}

/**
 * Represents a saved location with mandatory ID and name
 */
export interface SavedLocation extends LocationInfo {
  id: number;
  name: string;
  country: string;
  isDefault?: boolean;
}

/**
 * Enum representing the source of a location
 * Useful for tracking how a location was selected and for analytics
 */
export enum LocationSource {
  DEFAULT = 'default', // User's explicitly chosen default location
  SAVED = 'saved', // From user's saved locations
  RECENT = 'recent', // From recently used locations
  SEARCH = 'search', // From search results
  GEOLOCATION = 'geolocation', // From device GPS
  IP_LOCATION = 'ip-location', // IP-based location detection
  FALLBACK = 'fallback', // Default fallback
}

/**
 * Event types that LocationService can emit
 */
export enum LocationEventType {
  LOCATION_CHANGED = 'location-changed',
  DEFAULT_CHANGED = 'default-changed',
  SAVED_LOCATIONS_CHANGED = 'saved-locations-changed',
  RECENT_LOCATIONS_CHANGED = 'recent-locations-changed',
  INITIALIZATION_COMPLETE = 'initialization-complete',
}

/**
 * Listener function type definition
 */
type LocationEventListener = (data: any) => void;

/**
 * LocationService - Single source of truth for all location-related functionality
 */
class LocationService {
  private currentLocation: LocationInfo | null = null;
  private defaultLocation: SavedLocation | null = null;
  private savedLocations: SavedLocation[] = [];
  private recentLocations: SavedLocation[] = [];
  private locationSource: LocationSource | null = null;
  private isInitialized: boolean = false;
  private isInitializing: boolean = false;
  private readonly MAX_RECENT_LOCATIONS = 5;

  // Event listeners for different event types
  private eventListeners: {
    [key in LocationEventType]: LocationEventListener[];
  } = {
    [LocationEventType.LOCATION_CHANGED]: [],
    [LocationEventType.DEFAULT_CHANGED]: [],
    [LocationEventType.SAVED_LOCATIONS_CHANGED]: [],
    [LocationEventType.RECENT_LOCATIONS_CHANGED]: [],
    [LocationEventType.INITIALIZATION_COMPLETE]: [],
  };

  constructor() {
    console.log('LocationService: Initializing');
    this.loadSavedData().then(() => this.initialize());
  }

  /**
   * Load all location-related data from IndexedDB (fallback to localStorage)
   */
  private async loadSavedData(): Promise<void> {
    try {
      // Load saved locations (IndexedDB, fallback to localStorage)
      const savedData = await get<SavedLocation[]>('savedLocations');
      if (savedData?.length) {
        this.savedLocations = savedData;
      } else {
        const str = localStorage.getItem('savedLocations');
        if (str) {
          const parsed = JSON.parse(str);
          this.savedLocations = parsed;
          await set('savedLocations', parsed);
        }
      }

      // Load default location (IndexedDB, fallback)
      const defData = await get<SavedLocation>('defaultLocation');
      if (defData) {
        this.defaultLocation = defData;
      } else {
        const dstr = localStorage.getItem('defaultLocation');
        if (dstr) {
          const parsed = JSON.parse(dstr);
          this.defaultLocation = parsed;
          await set('defaultLocation', parsed);
        }
      }

      // Load recent locations (IndexedDB, fallback)
      const recData = await get<SavedLocation[]>('recentLocations');
      if (recData?.length) {
        this.recentLocations = recData;
      } else {
        const rstr = localStorage.getItem('recentLocations');
        if (rstr) {
          const parsed = JSON.parse(rstr);
          this.recentLocations = parsed;
          await set('recentLocations', parsed);
        }
      }
    } catch (error) {
      console.error('LocationService: Error loading saved data', error);
    }
  }

  /**
   * Initialize location with priority chain
   * 1. Default location
   * 2. Last used location
   * 3. Any saved location
   * 4. Geolocation
   * 5. IP-based location
   * 6. Fallback
   */
  public async initialize(): Promise<LocationInfo> {
    if (this.isInitialized) {
      return this.currentLocation!;
    }

    if (this.isInitializing) {
      return new Promise((resolve) => {
        this.addEventListener(LocationEventType.INITIALIZATION_COMPLETE, () => {
          resolve(this.currentLocation!);
        });
      });
    }

    this.isInitializing = true;
    console.log('LocationService: Starting location initialization with priority chain');

    try {
      // Priority 1: Default location
      if (this.defaultLocation) {
        console.log('LocationService: Using default location');
        await this.setLocation(this.defaultLocation, LocationSource.DEFAULT);
        this.completeInitialization();
        return this.currentLocation!;
      }

      // Priority 2: Last used location
      const lastLocationStr = localStorage.getItem('lastLocation');
      if (lastLocationStr) {
        try {
          const lastLocation = JSON.parse(lastLocationStr);
          console.log('LocationService: Using last used location');
          await this.setLocation(lastLocation, LocationSource.RECENT);
          this.completeInitialization();
          return this.currentLocation!;
        } catch (error) {
          console.warn('LocationService: Error parsing last location', error);
        }
      }

      // Priority 3: Any saved location
      if (this.savedLocations.length > 0) {
        console.log('LocationService: Using first saved location');
        await this.setLocation(this.savedLocations[0], LocationSource.SAVED);
        this.completeInitialization();
        return this.currentLocation!;
      }

      // Priority 4: Geolocation
      try {
        const geoLocation = await this.getGeolocation();
        console.log('LocationService: Using geolocation');
        await this.setLocation(geoLocation, LocationSource.GEOLOCATION);
        this.completeInitialization();
        return this.currentLocation!;
      } catch (error) {
        console.warn('LocationService: Geolocation error', error);
      }

      // Priority 5: IP-based location
      try {
        const ipLocation = await this.getIPLocation();
        console.log('LocationService: Using IP-based location');
        await this.setLocation(ipLocation, LocationSource.IP_LOCATION);
        this.completeInitialization();
        return this.currentLocation!;
      } catch (error) {
        console.warn('LocationService: IP location error', error);
      }

      // Priority 6: Fallback location (New York)
      console.log('LocationService: Using fallback location (New York)');
      await this.setLocation(
        {
          latitude: 40.7128,
          longitude: -74.006,
          name: 'New York City',
          country: 'United States',
          admin1: 'New York',
        },
        LocationSource.FALLBACK
      );

      this.completeInitialization();
      return this.currentLocation!;
    } catch (error) {
      console.error('LocationService: Initialization error', error);
      this.isInitializing = false;
      throw error;
    }
  }

  private completeInitialization(): void {
    this.isInitialized = true;
    this.isInitializing = false;
    this.emitEvent(LocationEventType.INITIALIZATION_COMPLETE, this.currentLocation);
    console.log('LocationService: Initialization complete');
  }

  /**
   * Get the current location
   */
  public getCurrentLocation(): LocationInfo | null {
    return this.currentLocation;
  }

  /**
   * Get the source of the current location
   */
  public getCurrentLocationSource(): LocationSource | null {
    return this.locationSource;
  }

  /**
   * Set the current location
   */
  public async setLocation(location: LocationInfo, source: LocationSource): Promise<void> {
    // Enhanced location with name if it doesn't have one
    if (!location.name && location.latitude && location.longitude) {
      try {
        const geoDetails = await reverseGeocode(location.latitude, location.longitude);
        if (geoDetails) {
          location = {
            ...location,
            name: geoDetails.name,
            country: geoDetails.country,
            admin1: geoDetails.admin1,
            admin2: geoDetails.admin2,
          };
        }
      } catch (error) {
        console.warn('LocationService: Error fetching location details', error);
      }
    }

    console.log(
      `LocationService: Setting location to ${
        location.name || 'unnamed location'
      } from source: ${source}`
    );
    this.currentLocation = location;
    this.locationSource = source;

    // Save as last used location
    localStorage.setItem('lastLocation', JSON.stringify(location));

    // If it has a name and id, add to recent locations
    if (location.name && location.id) {
      this.addToRecentLocations(location as SavedLocation);
    }

    this.emitEvent(LocationEventType.LOCATION_CHANGED, { location, source });
  }

  /**
   * Save a location to the user's saved locations
   */
  public saveLocation(location: SavedLocation): void {
    const exists = this.savedLocations.some((loc) => loc.id === location.id);

    if (!exists) {
      const updatedLocations = [...this.savedLocations, location];
      this.savedLocations = updatedLocations;
      set('savedLocations', updatedLocations).catch((e) => console.error('IDB save error', e));
      console.log('LocationService: Location saved', location);
      this.emitEvent(LocationEventType.SAVED_LOCATIONS_CHANGED, this.savedLocations);

      // If this is the first location, make it default
      if (updatedLocations.length === 1 && !this.defaultLocation) {
        this.setDefaultLocation(location.id);
      }
    }
  }

  /**
   * Set a location as the default
   */
  public setDefaultLocation(locationId: number): void {
    const location = this.savedLocations.find((loc) => loc.id === locationId);

    if (location) {
      const defaultLoc = { ...location, isDefault: true };
      this.defaultLocation = defaultLoc;
      set('defaultLocation', defaultLoc).catch((e) => console.error('IDB save error', e));

      console.log('LocationService: Default location set', defaultLoc);
      this.emitEvent(LocationEventType.DEFAULT_CHANGED, defaultLoc);

      // Also change current location to this default
      this.setLocation(defaultLoc, LocationSource.DEFAULT);
    }
  }

  /**
   * Remove a location from saved locations
   */
  public removeLocation(locationId: number): void {
    const updatedLocations = this.savedLocations.filter((loc) => loc.id !== locationId);
    this.savedLocations = updatedLocations;
    set('savedLocations', updatedLocations).catch((e) => console.error('IDB save error', e));

    // If default location was removed, update default
    if (this.defaultLocation && this.defaultLocation.id === locationId) {
      this.defaultLocation = null;
      set('defaultLocation', null).catch((e) => console.error('IDB save error', e));

      // If there are other locations, make the first one default
      if (updatedLocations.length > 0) {
        this.setDefaultLocation(updatedLocations[0].id);
      }
    }

    console.log('LocationService: Location removed', locationId);
    this.emitEvent(LocationEventType.SAVED_LOCATIONS_CHANGED, this.savedLocations);
  }

  /**
   * Add a location to recently used
   */
  private addToRecentLocations(location: SavedLocation): void {
    const filteredRecent = this.recentLocations.filter((loc) => loc.id !== location.id);
    const updatedRecent = [location, ...filteredRecent].slice(0, this.MAX_RECENT_LOCATIONS);

    this.recentLocations = updatedRecent;
    set('recentLocations', updatedRecent).catch((e) => console.error('IDB save error', e));

    this.emitEvent(LocationEventType.RECENT_LOCATIONS_CHANGED, this.recentLocations);
  }

  /**
   * Remove from recently used locations
   */
  public removeFromRecentLocations(locationId: number): void {
    const updatedRecent = this.recentLocations.filter((loc) => loc.id !== locationId);
    this.recentLocations = updatedRecent;
    set('recentLocations', updatedRecent).catch((e) => console.error('IDB save error', e));

    this.emitEvent(LocationEventType.RECENT_LOCATIONS_CHANGED, this.recentLocations);
  }

  /**
   * Get browser geolocation
   */
  public async getGeolocation(): Promise<LocationInfo> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location: LocationInfo = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          // Try to get the location name
          try {
            const geoDetails = await reverseGeocode(location.latitude, location.longitude);
            if (geoDetails) {
              location.name = geoDetails.name;
              location.country = geoDetails.country;
              location.admin1 = geoDetails.admin1;
              location.admin2 = geoDetails.admin2;
              location.id = geoDetails.id;
            }
          } catch (error) {
            console.warn('LocationService: Error fetching location name', error);
          }

          resolve(location);
        },
        (error) => {
          reject(error);
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  /**
   * Get location from IP address
   */
  public async getIPLocation(): Promise<LocationInfo> {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('IP geolocation failed');
    }

    const data = await response.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      name: data.city,
      country: data.country_name,
      admin1: data.region,
    };
  }

  /**
   * Get all saved locations
   */
  public getSavedLocations(): SavedLocation[] {
    return [...this.savedLocations];
  }

  /**
   * Get recent locations
   */
  public getRecentLocations(): SavedLocation[] {
    return [...this.recentLocations];
  }

  /**
   * Get default location
   */
  public getDefaultLocation(): SavedLocation | null {
    return this.defaultLocation;
  }

  /**
   * Event handling methods
   */
  public addEventListener(event: LocationEventType, callback: LocationEventListener): void {
    this.eventListeners[event].push(callback);
  }

  public removeEventListener(event: LocationEventType, callback: LocationEventListener): void {
    this.eventListeners[event] = this.eventListeners[event].filter(
      (listener) => listener !== callback
    );
  }

  private emitEvent(event: LocationEventType, data: any): void {
    this.eventListeners[event].forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`LocationService: Error in ${event} event listener`, error);
      }
    });
  }

  /**
   * Check if the service has finished initializing
   */
  public isInitializationComplete(): boolean {
    return this.isInitialized;
  }

  /**
   * Wait for initialization to complete
   */
  public async waitForInitialization(): Promise<LocationInfo> {
    if (this.isInitialized && this.currentLocation) {
      return this.currentLocation;
    }

    return new Promise((resolve) => {
      this.addEventListener(LocationEventType.INITIALIZATION_COMPLETE, () => {
        resolve(this.currentLocation!);
      });

      // If not initializing yet, start initialization
      if (!this.isInitializing) {
        this.initialize();
      }
    });
  }
}

// Create singleton instance
export const locationService = new LocationService();

/**
 * React hook for accessing LocationService
 */
import { useState, useEffect } from 'react';

export function useLocationService() {
  const [currentLocation, setCurrentLocation] = useState<LocationInfo | null>(
    locationService.getCurrentLocation()
  );
  const [defaultLocation, setDefaultLocation] = useState<SavedLocation | null>(
    locationService.getDefaultLocation()
  );
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(
    locationService.getSavedLocations()
  );
  const [recentLocations, setRecentLocations] = useState<SavedLocation[]>(
    locationService.getRecentLocations()
  );
  const [locationSource, setLocationSource] = useState<LocationSource | null>(
    locationService.getCurrentLocationSource()
  );
  const [isInitialized, setIsInitialized] = useState<boolean>(
    locationService.isInitializationComplete()
  );

  useEffect(() => {
    // Setup event listeners
    const handleLocationChanged = (data: { location: LocationInfo; source: LocationSource }) => {
      setCurrentLocation(data.location);
      setLocationSource(data.source);
    };

    const handleDefaultChanged = (location: SavedLocation) => {
      setDefaultLocation(location);
    };

    const handleSavedLocationsChanged = (locations: SavedLocation[]) => {
      setSavedLocations([...locations]);
    };

    const handleRecentLocationsChanged = (locations: SavedLocation[]) => {
      setRecentLocations([...locations]);
    };

    const handleInitializationComplete = () => {
      setIsInitialized(true);
      setCurrentLocation(locationService.getCurrentLocation());
      setLocationSource(locationService.getCurrentLocationSource());
    };

    // Register event listeners
    locationService.addEventListener(LocationEventType.LOCATION_CHANGED, handleLocationChanged);
    locationService.addEventListener(LocationEventType.DEFAULT_CHANGED, handleDefaultChanged);
    locationService.addEventListener(
      LocationEventType.SAVED_LOCATIONS_CHANGED,
      handleSavedLocationsChanged
    );
    locationService.addEventListener(
      LocationEventType.RECENT_LOCATIONS_CHANGED,
      handleRecentLocationsChanged
    );
    locationService.addEventListener(
      LocationEventType.INITIALIZATION_COMPLETE,
      handleInitializationComplete
    );

    // If not initialized yet, trigger initialization
    if (!locationService.isInitializationComplete()) {
      locationService.initialize().catch((error) => {
        console.error('Failed to initialize location service:', error);
      });
    }

    // Cleanup listeners on unmount
    return () => {
      locationService.removeEventListener(
        LocationEventType.LOCATION_CHANGED,
        handleLocationChanged
      );
      locationService.removeEventListener(LocationEventType.DEFAULT_CHANGED, handleDefaultChanged);
      locationService.removeEventListener(
        LocationEventType.SAVED_LOCATIONS_CHANGED,
        handleSavedLocationsChanged
      );
      locationService.removeEventListener(
        LocationEventType.RECENT_LOCATIONS_CHANGED,
        handleRecentLocationsChanged
      );
      locationService.removeEventListener(
        LocationEventType.INITIALIZATION_COMPLETE,
        handleInitializationComplete
      );
    };
  }, []);

  return {
    // Current state
    currentLocation,
    defaultLocation,
    savedLocations,
    recentLocations,
    locationSource,
    isInitialized,

    // Actions
    setLocation: async (location: LocationInfo, source: LocationSource = LocationSource.SEARCH) =>
      await locationService.setLocation(location, source),
    setDefaultLocation: (locationId: number) => locationService.setDefaultLocation(locationId),
    saveLocation: (location: SavedLocation) => locationService.saveLocation(location),
    removeLocation: (locationId: number) => locationService.removeLocation(locationId),
    removeFromRecentLocations: (locationId: number) =>
      locationService.removeFromRecentLocations(locationId),
    getGeolocation: async () => await locationService.getGeolocation(),
  };
}
