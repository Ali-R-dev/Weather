import React from "react";
import { motion } from "framer-motion";

interface ExpandToggleProps {
  expanded: boolean;
  onToggle: () => void;
  label?: string;
}

const ExpandToggle: React.FC<ExpandToggleProps> = ({
  expanded,
  onToggle,
  label,
}) => {
  return (
    <motion.button
      onClick={onToggle}
      className="px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium text-white hover:bg-white/15 transition-all flex items-center"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="mr-1">{expanded ? "Hide" : "Show"}</span>
      {label ? label : "Details"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-4 h-4 ml-1 transition-transform ${
          expanded ? "rotate-180" : ""
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={expanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
        />
      </svg>
    </motion.button>
  );
};

export default ExpandToggle;
