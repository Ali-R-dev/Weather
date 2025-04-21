import React from 'react';
import { motion } from 'framer-motion';

interface FeelsLikeProps {
  feelsLike: number;
  tempDiffText: string;
}

const FeelsLike: React.FC<FeelsLikeProps> = ({ feelsLike, tempDiffText }) => {
  return (
    <motion.div
      className="text-base sm:text-lg text-white/80 mt-1 flex items-center"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <span className="mr-1">{Math.round(feelsLike)}°</span>
      <span className="text-sm text-white/60">{tempDiffText}</span>
    </motion.div>
  );
};

export default FeelsLike;
