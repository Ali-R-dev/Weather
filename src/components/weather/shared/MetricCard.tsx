import React from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  progress?: number; // Optional progress value (0-100)
  progressColor?: string; // CSS color value for progress bar
  trend?: "up" | "down" | "stable"; // Optional trend indicator
  trendValue?: string; // Optional trend value (e.g., "+2°" or "-5%")
  type?: "default" | "primary" | "success" | "warning" | "danger" | "info"; // Card type/color
  size?: "sm" | "md" | "lg"; // Card size
  animationDelay?: number;
  onClick?: () => void; // Optional click handler
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  progress,
  progressColor,
  trend,
  trendValue,
  type = "default",
  size = "md",
  animationDelay = 0.1,
  onClick,
}) => {
  // Determine gradient and styling based on type
  const getTypeStyles = () => {
    switch (type) {
      case "primary":
        return "from-blue-500/20 to-indigo-600/10 border-blue-500/30 hover:from-blue-500/30 hover:to-indigo-600/20";
      case "success":
        return "from-green-500/20 to-emerald-600/10 border-green-500/30 hover:from-green-500/30 hover:to-emerald-600/20";
      case "warning":
        return "from-yellow-500/20 to-amber-600/10 border-yellow-500/30 hover:from-yellow-500/30 hover:to-amber-600/20";
      case "danger":
        return "from-red-500/20 to-rose-600/10 border-red-500/30 hover:from-red-500/30 hover:to-rose-600/20";
      case "info":
        return "from-cyan-500/20 to-sky-600/10 border-cyan-500/30 hover:from-cyan-500/30 hover:to-sky-600/20";
      default:
        return "from-white/15 to-white/5 border-white/20 hover:from-white/20 hover:to-white/10";
    }
  };

  // Determine size-related classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "p-2.5 rounded-xl";
      case "lg":
        return "p-4 rounded-2xl";
      default:
        return "p-3 rounded-xl";
    }
  };

  // Get trend icon and color
  const getTrendIndicator = () => {
    if (!trend) return null;

    const trendColors = {
      up: "text-green-400",
      down: "text-red-400",
      stable: "text-blue-400",
    };

    const trendIcons = {
      up: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
            clipRule="evenodd"
          />
        </svg>
      ),
      down: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
            clipRule="evenodd"
          />
        </svg>
      ),
      stable: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" />
        </svg>
      ),
    };

    return (
      <div className={`flex items-center ${trendColors[trend]}`}>
        {trendIcons[trend]}
        {trendValue && (
          <span className="ml-1 text-xs font-medium">{trendValue}</span>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className={`backdrop-blur-lg bg-gradient-to-br ${getTypeStyles()} ${getSizeClasses()} border shadow-lg transition-all cursor-${
        onClick ? "pointer" : "default"
      }`}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
      }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: animationDelay,
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center">
          <div className="mr-2 text-white/90">{icon}</div>
          <div className="text-xs font-medium text-white/90 uppercase tracking-wide">
            {title}
          </div>
        </div>
        {getTrendIndicator()}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-xl font-bold text-white">{value}</div>
          {subtitle && (
            <div className="text-xs text-white/70 mt-0.5">{subtitle}</div>
          )}
        </div>
      </div>

      {/* Optional progress bar */}
      {progress !== undefined && (
        <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: progressColor || "rgba(255, 255, 255, 0.7)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: animationDelay + 0.3, duration: 0.8 }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
