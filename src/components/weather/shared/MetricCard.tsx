import React from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  animationDelay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  animationDelay = 0.1,
}) => {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 border border-white/20 shadow-lg transition-all hover:bg-white/15"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
    >
      <div className="flex items-center mb-1">
        {icon}
        <div className="text-xs text-white/80">{title}</div>
      </div>
      <div className="text-lg font-medium">{value}</div>
    </motion.div>
  );
};

export default MetricCard;
