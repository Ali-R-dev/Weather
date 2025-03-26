import React from "react";
import WeatherAlert, { WeatherAlertData } from "./WeatherAlert";
import { motion, AnimatePresence } from "framer-motion";

interface WeatherAlertsListProps {
  alerts: WeatherAlertData[];
}

const WeatherAlertsList: React.FC<WeatherAlertsListProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <motion.div
      className="mb-6 space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-lg font-semibold text-white mb-2">
        Weather Alerts ({alerts.length})
      </h2>

      <AnimatePresence>
        {alerts.map((alert) => (
          <WeatherAlert key={alert.id} alert={alert} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default WeatherAlertsList;
