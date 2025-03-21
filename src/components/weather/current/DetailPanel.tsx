import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DetailPanelProps {
  show: boolean;
  children: React.ReactNode;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ show, children }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="details"
          initial={{ height: 0, opacity: 0, y: -20 }}
          animate={{ height: "auto", opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -10 }}
          transition={{
            duration: 0.4,
            opacity: { duration: 0.3 },
            height: { type: "spring", stiffness: 300, damping: 30 },
          }}
          className="mt-6 overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailPanel;
