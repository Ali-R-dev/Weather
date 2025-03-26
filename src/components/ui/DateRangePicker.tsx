import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
  className?: string;
  maxRange?: number; // Maximum number of days allowed in range
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  className = "",
  maxRange = 7,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [selectingStart, setSelectingStart] = useState(true);

  // Format date to display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const today = new Date();
    const days: Date[] = [];
    // Removed unused startMonth variable

    // Generate days for current month and next month
    for (let i = 0; i < maxRange; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      days.push(day);
    }

    return days;
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (selectingStart) {
      setLocalStartDate(date);
      setLocalEndDate(date);
      setSelectingStart(false);
    } else {
      // Ensure end date is after start date
      if (date < localStartDate) {
        setLocalStartDate(date);
        setLocalEndDate(localStartDate);
      } else {
        setLocalEndDate(date);
        setIsOpen(false);
        onChange(localStartDate, date);
      }
      setSelectingStart(true);
    }
  };

  // Check if a date is in the selected range
  const isInRange = (date: Date) => {
    if (selectingStart) {
      return date.getTime() === localStartDate.getTime();
    }

    const hoverDate = hoveredDate || localEndDate;
    return (
      date >= localStartDate &&
      date <= (hoverDate > localStartDate ? hoverDate : localStartDate)
    );
  };

  const days = generateCalendarDays();

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl border border-white/20 text-white text-sm transition-all"
      >
        <span>
          {formatDate(startDate)} — {formatDate(endDate)}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 z-30 w-72 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-4"
          >
            <div className="mb-3 text-sm font-medium text-white/80">
              {selectingStart ? "Select start date" : "Select end date"}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs text-white/50 py-1"
                >
                  {day}
                </div>
              ))}

              {days.map((date, i) => (
                <motion.button
                  key={date.toISOString()}
                  className={`text-center py-2 rounded-md text-sm transition-all ${
                    isInRange(date)
                      ? "bg-blue-500/80 text-white"
                      : "hover:bg-white/10 text-white/80"
                  }`}
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => !selectingStart && setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: i * 0.01,
                  }}
                >
                  {date.getDate()}
                </motion.button>
              ))}
            </div>

            <div className="flex justify-end mt-3 gap-2">
              <button
                className="px-3 py-1.5 text-sm text-white/70 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                onClick={() => {
                  setIsOpen(false);
                  onChange(localStartDate, localEndDate);
                }}
              >
                Apply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateRangePicker;
