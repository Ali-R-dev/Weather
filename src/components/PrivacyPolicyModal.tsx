import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({
  visible,
  onClose,
}: PrivacyPolicyModalProps) {
  if (!visible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-900/90 backdrop-blur-md rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Privacy Policy
            </h2>

            <div className="space-y-4 text-white/80">
              <section>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Data We Store Locally
                </h3>
                <p className="mb-2">
                  We store the following information in your browser's local
                  storage:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Weather preferences (temperature unit, wind speed unit, time
                    format)
                  </li>
                  <li>Saved locations and default location</li>
                  <li>Recent search history</li>
                  <li>Weather data cache (to reduce API calls)</li>
                  <li>Privacy policy acceptance status</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Location Data
                </h3>
                <p>
                  We request access to your location to provide local weather
                  information. This is:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Entirely optional - you can manually search for locations
                  </li>
                  <li>Only used when you explicitly allow it</li>
                  <li>Never stored on any servers</li>
                  <li>Only shared with Open-Meteo API for weather data</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Third-Party Services
                </h3>
                <p className="mb-2">We use the following external services:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Open-Meteo API for weather data (no API key required,
                    privacy-focused)
                  </li>
                  <li>Open-Meteo Geocoding API for location search</li>
                  <li>OpenStreetMap/Nominatim for reverse geocoding</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Data Retention
                </h3>
                <p>
                  All data is stored locally in your browser and you can clear
                  it at any time by:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Clearing your browser's local storage</li>
                  <li>Using your browser's privacy/incognito mode</li>
                  <li>Using the app's reset settings feature</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Analytics & Tracking
                </h3>
                <p>
                  We do not use any analytics or tracking services. Your usage
                  of the app is completely private.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Updates to Privacy Policy
                </h3>
                <p>
                  We may update this privacy policy as we add new features.
                  Significant changes will require renewed consent.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Contact
                </h3>
                <p className="mb-2">
                  For any questions, concerns, or feedback about:
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-3">
                  <li>Privacy and data handling</li>
                  <li>Feature requests or bug reports</li>
                  <li>General inquiries</li>
                </ul>
                <p>
                  Please reach out through my contact page:{" "}
                  <a
                    href="https://araza.me/#contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    araza.me/#contact
                  </a>
                </p>
              </section>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
