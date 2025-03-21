import { useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "../../context/SettingsContext";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { settings, updateSettings } = useSettings();
  const [tempUnit, setTempUnit] = useState(settings.units.temperature);
  const [windUnit, setWindUnit] = useState(settings.units.wind);
  const [timeFormat, setTimeFormat] = useState(settings.timeFormat);
  const [reduceMotion, setReduceMotion] = useState(
    settings.accessibility.reduceMotion
  );
  const [highContrast, setHighContrast] = useState(
    settings.accessibility.highContrast
  );

  const handleSave = () => {
    updateSettings({
      units: {
        temperature: tempUnit,
        wind: windUnit,
      },
      timeFormat: timeFormat,
      accessibility: {
        reduceMotion: reduceMotion,
        highContrast: highContrast,
      },
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
      className={`fixed inset-0 z-50 flex items-start justify-center bg-black/50 ${
        !isOpen && "pointer-events-none"
      }`}
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
      }}
    >
      <div className="min-h-screen w-full py-4 px-2 sm:py-16 sm:px-4 overflow-y-auto">
        <motion.div
          className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl w-[95%] sm:w-full max-w-md p-4 sm:p-6 mx-auto my-auto"
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Temperature Units */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Temperature
              </label>
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    tempUnit === "celsius" ? "bg-white/20 font-medium" : ""
                  }`}
                  onClick={() => setTempUnit("celsius")}
                >
                  Celsius (°C)
                </button>
                <button
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    tempUnit === "fahrenheit" ? "bg-white/20 font-medium" : ""
                  }`}
                  onClick={() => setTempUnit("fahrenheit")}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>

            {/* Wind Speed Units */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Wind Speed
              </label>
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    windUnit === "kph" ? "bg-white/20 font-medium" : ""
                  }`}
                  onClick={() => setWindUnit("kph")}
                >
                  km/h
                </button>
                <button
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    windUnit === "mph" ? "bg-white/20 font-medium" : ""
                  }`}
                  onClick={() => setWindUnit("mph")}
                >
                  mph
                </button>
              </div>
            </div>

            {/* Time Format */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Time Format
              </label>
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    timeFormat === "12h" ? "bg-white/20 font-medium" : ""
                  }`}
                  onClick={() => setTimeFormat("12h")}
                >
                  12-hour
                </button>
                <button
                  className={`flex-1 py-2 rounded-md transition-colors ${
                    timeFormat === "24h" ? "bg-white/20 font-medium" : ""
                  }`}
                  onClick={() => setTimeFormat("24h")}
                >
                  24-hour
                </button>
              </div>
            </div>

            {/* Accessibility options */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Accessibility
              </label>

              <div className="flex items-center justify-between py-2">
                <span className="text-white/80">Reduce motion</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reduceMotion}
                    onChange={() => setReduceMotion(!reduceMotion)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-white/80">High contrast</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={() => setHighContrast(!highContrast)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SettingsPanel;
