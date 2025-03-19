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
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailPanel;
