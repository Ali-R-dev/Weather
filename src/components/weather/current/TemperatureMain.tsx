import React from "react";
import { motion } from "framer-motion";

interface TemperatureMainProps {
  temperature: number;
  unitSymbol: string;
}

const TemperatureMain: React.FC<TemperatureMainProps> = ({
  temperature,
  unitSymbol,
}) => {
  return (
    <motion.div
      className="flex items-start"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.7,
        delay: 0.3,
        type: "spring",
        stiffness: 100,
      }}
    >
      <span className="text-7xl sm:text-8xl font-bold tracking-tighter bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
        {Math.round(temperature)}
      </span>
      <span className="text-3xl sm:text-4xl font-light mt-2 text-white/90">
        {unitSymbol}
      </span>
    </motion.div>
  );
};

export default TemperatureMain;
