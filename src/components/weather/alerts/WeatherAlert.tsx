import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface WeatherAlertData {
  id: string;
  title: string;
  description: string;
  severity: 'advisory' | 'watch' | 'warning';
  start: Date;
  end: Date;
  source?: string;
}

interface WeatherAlertProps {
  alert: WeatherAlertData;
}

const WeatherAlert: React.FC<WeatherAlertProps> = ({ alert }) => {
  const [expanded, setExpanded] = useState(false);

  // Determine color based on severity
  const getSeverityColor = () => {
    switch (alert.severity) {
      case 'warning':
        return 'bg-red-500/80';
      case 'watch':
        return 'bg-orange-500/80';
      case 'advisory':
        return 'bg-yellow-500/80';
      default:
        return 'bg-blue-500/80';
    }
  };

  // Format date ranges
  const formatTimeRange = () => {
    const formatOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };

    return `${alert.start.toLocaleString(undefined, formatOptions)} - ${alert.end.toLocaleString(
      undefined,
      formatOptions
    )}`;
  };

  return (
    <motion.div
      className={`rounded-lg backdrop-blur-md border border-white/20 overflow-hidden ${getSeverityColor()}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h3 className="font-medium text-white">
              {alert.severity.toUpperCase()}: {alert.title}
            </h3>
            <p className="text-xs text-white/80">{formatTimeRange()}</p>
          </div>
        </div>
        <div>
          <svg
            className={`w-5 h-5 text-white/80 transition-transform ${
              expanded ? 'transform rotate-180' : ''
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-3 text-sm text-white/90 border-t border-white/20"
          >
            <p className="py-2 whitespace-pre-line">{alert.description}</p>
            {alert.source && <p className="text-xs text-white/80 mt-2">Source: {alert.source}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WeatherAlert;
