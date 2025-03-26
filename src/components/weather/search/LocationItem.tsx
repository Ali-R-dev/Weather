import React from "react";
import { motion } from "framer-motion";
import { SavedLocation } from "../../../hooks/useSavedLocations";
import { GeocodingResult } from "../../../services/geocodingService";
import styles from "../MiniSearchBar.module.css";

interface LocationItemProps {
  location: SavedLocation | GeocodingResult;
  isDefault?: boolean;
  isRecent?: boolean;
  onSelect: (
    location: SavedLocation | GeocodingResult,
    e: React.MouseEvent
  ) => void;
  onSetDefault?: (e: React.MouseEvent, id: number) => void;
  onRemove?: (e: React.MouseEvent, id: number) => void;
  index: number;
}

const LocationItem: React.FC<LocationItemProps> = ({
  location,
  isDefault = false,
  isRecent = false,
  onSelect,
  onSetDefault,
  onRemove,
  index,
}) => {
  return (
    <motion.div
      key={`location-${location.id}`}
      className={`${styles.locationItem} group`}
      onClick={(e) => onSelect(location, e)}
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
            className={`w-3.5 h-3.5 ${
              isRecent ? "text-blue-300" : "text-white/70"
            }`}
          >
            <path
              fillRule="evenodd"
              d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-white">{location.name}</div>
          <div className="text-[10px] text-white/70">
            {location.country}
            {"admin1" in location && location.admin1
              ? `, ${location.admin1}`
              : ""}
          </div>
        </div>
      </div>

      {isRecent && onSetDefault && onRemove && (
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            onClick={(e) => onSetDefault(e, location.id)}
            className={`p-1 rounded-full hover:bg-white/10 transition-colors ${
              isDefault
                ? "text-yellow-300"
                : "text-white/70 hover:text-white/90"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={isDefault ? "Default location" : "Set as default"}
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
            onClick={(e) => onRemove(e, location.id)}
            className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white/90 transition-colors action-button"
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
      )}
    </motion.div>
  );
};

export default LocationItem;
