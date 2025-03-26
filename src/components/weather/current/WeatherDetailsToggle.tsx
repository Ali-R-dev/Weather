import React from "react";
import { motion } from "framer-motion";
import ExpandToggle from "../../ui/ExpandToggle";

interface WeatherDetailsToggleProps {
  expanded: boolean;
  onToggle: () => void;
}

const WeatherDetailsToggle: React.FC<WeatherDetailsToggleProps> = ({
  expanded,
  onToggle,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="mt-3 flex justify-center"
    >
      <ExpandToggle expanded={expanded} onToggle={onToggle} />
    </motion.div>
  );
};

export default WeatherDetailsToggle;
