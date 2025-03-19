import React from "react";
import { motion } from "framer-motion";
import { formatHour } from "../../../utils/formatting";

interface TemperatureGraphProps {
  temperatures: number[];
  times: string[];
  currentTimeIndex: number;
}

const TemperatureGraph: React.FC<TemperatureGraphProps> = ({
  temperatures,
  times,
  currentTimeIndex,
}) => {
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  const tempRange = Math.max(maxTemp - minTemp, 4); // Ensure at least 4 degrees of range for visibility

  return (
    <div className="relative h-32 mb-2 mt-1">
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <svg className="w-full h-full overflow-visible">
          {/* Grid lines */}
          <g className="grid-lines">
            {[0, 25, 50, 75, 100].map((x) => (
              <line
                key={`grid-v-${x}`}
                x1={`${x}%`}
                y1="0"
                x2={`${x}%`}
                y2="24"
                stroke="rgba(255,255,255,0.1)"
                strokeDasharray="2,2"
              />
            ))}
            {[0, 8, 16, 24].map((y) => (
              <line
                key={`grid-h-${y}`}
                x1="0"
                y1={y}
                x2="100%"
                y2={y}
                stroke="rgba(255,255,255,0.1)"
                strokeDasharray="2,2"
              />
            ))}
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop
                offset={`${currentTimeIndex / (temperatures.length - 1)}`}
                stopColor="rgba(102,255,102,0.9)"
              />
              <stop
                offset={`${currentTimeIndex / (temperatures.length - 1)}`}
                stopColor="rgba(255,255,255,0.9)"
              />
            </linearGradient>
            <linearGradient id="past-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#66FF66" />
              <stop offset="100%" stopColor="#66FF66" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="future-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Continuous temperature path */}
          <motion.path
            d={temperatures
              .map((temp, i) => {
                const x = (i / (temperatures.length - 1)) * 100;
                const y = 24 - (temp - minTemp) * (24 / tempRange);
                return (i === 0 ? "M" : "L") + `${x} ${y}`;
              })
              .join(" ")}
            stroke="url(#line-gradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
          />

          {/* Past area fill */}
          <motion.path
            d={`${temperatures
              .slice(0, currentTimeIndex + 1)
              .map((temp, i) => {
                const x = (i / (temperatures.length - 1)) * 100;
                const y = 24 - (temp - minTemp) * (24 / tempRange);
                return (i === 0 ? "M" : "L") + `${x} ${y}`;
              })
              .join(" ")} L${
              (currentTimeIndex / (temperatures.length - 1)) * 100
            } 24 L0 24 Z`}
            fill="url(#past-gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.5 }}
          />

          {/* Future area fill */}
          <motion.path
            d={`${temperatures
              .slice(currentTimeIndex)
              .map((temp, i) => {
                const actualIndex = i + currentTimeIndex;
                const x = (actualIndex / (temperatures.length - 1)) * 100;
                const y = 24 - (temp - minTemp) * (24 / tempRange);
                return (i === 0 ? "M" : "L") + `${x} ${y}`;
              })
              .join(" ")} L100 24 L${
              (currentTimeIndex / (temperatures.length - 1)) * 100
            } 24 Z`}
            fill="url(#future-gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.5 }}
          />

          {/* "Now" marker */}
          <motion.line
            x1={`${(currentTimeIndex / (temperatures.length - 1)) * 100}%`}
            y1="0"
            x2={`${(currentTimeIndex / (temperatures.length - 1)) * 100}%`}
            y2="24"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="1.5"
            initial={{ height: 0 }}
            animate={{ height: 24 }}
            transition={{ delay: 0.8 }}
          />

          {/* "Now" marker dot */}
          <motion.circle
            cx={`${(currentTimeIndex / (temperatures.length - 1)) * 100}%`}
            cy={
              24 - (temperatures[currentTimeIndex] - minTemp) * (24 / tempRange)
            }
            r="4"
            fill="white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
          />

          {/* Temperature dots */}
          {temperatures.map((temp, i) => {
            if (i % 4 === 0 || i === temperatures.length - 1) {
              const x = (i / (temperatures.length - 1)) * 100;
              const y = 24 - (temp - minTemp) * (24 / tempRange);
              const isPast = i <= currentTimeIndex;

              return (
                <motion.circle
                  key={`dot-${i}`}
                  cx={`${x}%`}
                  cy={y}
                  r="2.5"
                  fill={isPast ? "#66FF66" : "white"}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                />
              );
            }
            return null;
          })}

          {/* Temperature labels */}
          {[
            0,
            Math.floor(temperatures.length / 2),
            temperatures.length - 1,
          ].map((i) => (
            <text
              key={`temp-${i}`}
              x={`${(i / (temperatures.length - 1)) * 100}%`}
              y={24 - (temperatures[i] - minTemp) * (24 / tempRange) - 8}
              fontSize="10"
              fill="white"
              textAnchor={
                i === 0
                  ? "start"
                  : i === temperatures.length - 1
                  ? "end"
                  : "middle"
              }
            >
              {Math.round(temperatures[i])}°
            </text>
          ))}

          {/* Time markers */}
          {[
            0,
            Math.floor(temperatures.length / 2),
            temperatures.length - 1,
          ].map((i) => (
            <text
              key={`time-${i}`}
              x={`${(i / (temperatures.length - 1)) * 100}%`}
              y="30"
              fontSize="9"
              fill="rgba(255,255,255,0.8)"
              textAnchor={
                i === 0
                  ? "start"
                  : i === temperatures.length - 1
                  ? "end"
                  : "middle"
              }
            >
              {formatHour(times[i])}
            </text>
          ))}

          {/* Now label */}
          <text
            x={`${(currentTimeIndex / (temperatures.length - 1)) * 100}%`}
            y="30"
            fontSize="9"
            fill="rgba(255,255,255,1)"
            textAnchor="middle"
            fontWeight="bold"
          >
            Now
          </text>
        </svg>
      </motion.div>
    </div>
  );
};

export default TemperatureGraph;
