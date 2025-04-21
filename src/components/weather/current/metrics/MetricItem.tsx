import React from 'react';
import { motion } from 'framer-motion';

interface MetricItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: React.ReactNode;
  trendIndicator?: React.ReactNode;
  onClick?: () => void;
  animationDelay?: number;
}

const MetricItem: React.FC<MetricItemProps> = ({
  icon,
  title,
  value,
  subtitle,
  trendIndicator,
  onClick,
  animationDelay = 0.1,
}) => {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex-1 min-w-[140px] border border-white/10 transition-all hover:bg-white/15"
      whileHover={{ y: -3, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      initial={{
        opacity: 0,
        y: 20,
        boxShadow: '0 0px 0px 0px rgba(0, 0, 0, 0)',
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: animationDelay,
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center">
          <div className="mr-2 text-white/90">{icon}</div>
          <div className="text-xs font-medium text-white/90 uppercase tracking-wide">{title}</div>
        </div>
        {trendIndicator}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-xl font-bold text-white">{value}</div>
          {subtitle && <div className="text-xs text-white/70 mt-0.5">{subtitle}</div>}
        </div>
      </div>
    </motion.div>
  );
};

export default MetricItem;
