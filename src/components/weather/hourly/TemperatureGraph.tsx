import React from "react";
import { formatHour } from "../../../utils/formatting";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from "recharts";

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
  // Format data for recharts
  const data = temperatures.map((temp, i) => ({
    temp,
    time: times[i],
    isPast: i <= currentTimeIndex,
    hour: formatHour(times[i]),
  }));

  // Find min and max temperatures with padding
  const minTemp = Math.floor(Math.min(...temperatures) - 1);
  const maxTemp = Math.ceil(Math.max(...temperatures) + 1);

  // Custom dot component to handle past/future styling
  const CustomDot = (props) => {
    const { cx, cy, index, payload } = props;
    const isCurrentTime = index === currentTimeIndex;

    // Only show dots at key points or current time
    if (
      index % 3 === 0 ||
      isCurrentTime ||
      index === 0 ||
      index === temperatures.length - 1
    ) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={isCurrentTime ? 4 : 3}
          fill={isCurrentTime ? "white" : payload.isPast ? "#66FF66" : "white"}
          stroke={isCurrentTime ? "rgba(255,255,255,0.3)" : "none"}
          strokeWidth={isCurrentTime ? 2 : 0}
        />
      );
    }
    return null;
  };

  // Custom tick component for X axis
  const CustomTick = (props) => {
    const { x, y, payload } = props;
    const isCurrentTime = payload.index === currentTimeIndex;

    // Show only selected hours to avoid crowding
    if (
      payload.index % 4 === 0 ||
      isCurrentTime ||
      payload.index === 0 ||
      payload.index === temperatures.length - 1
    ) {
      return (
        <g transform={`translate(${x},${y})`}>
          <text
            x={0}
            y={0}
            dy={16}
            textAnchor="middle"
            fill={isCurrentTime ? "white" : "rgba(255,255,255,0.7)"}
            fontSize={10}
            fontWeight={isCurrentTime ? "bold" : "normal"}
          >
            {isCurrentTime ? "NOW" : formatHour(times[payload.index])}
          </text>
        </g>
      );
    }
    return null;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow">
          <p>{`${payload[0].payload.hour}: ${Math.round(
            payload[0].value
          )}°`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative h-32 mb-2 mt-1">
      <div className="absolute top-1 right-3 flex space-x-4 text-xs z-10">
        <span className="text-green-400">Actual</span>
        <span className="text-white">Forecast</span>
      </div>

      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 5, left: 5, bottom: 15 }}
          >
            <defs>
              <linearGradient id="pastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#66FF66" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#66FF66" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="futureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.1)"
            />

            <XAxis
              dataKey="time"
              tick={CustomTick}
              axisLine={false}
              tickLine={false}
              minTickGap={20}
            />

            <YAxis domain={[minTemp, maxTemp]} hide={true} />

            <Tooltip content={<CustomTooltip />} />

            {/* Reference line for current time */}
            <ReferenceLine
              x={data[currentTimeIndex].time}
              stroke="rgba(255,255,255,0.4)"
              strokeDasharray="3 3"
            />

            {/* Past area fill */}
            <Area
              type="monotone"
              dataKey="temp"
              stroke="none"
              fill="url(#pastGradient)"
              fillOpacity={1}
              activeDot={false}
              data={data.slice(0, currentTimeIndex + 1)}
            />

            {/* Future area fill */}
            <Area
              type="monotone"
              dataKey="temp"
              stroke="none"
              fill="url(#futureGradient)"
              fillOpacity={1}
              activeDot={false}
              data={data.slice(currentTimeIndex)}
            />

            {/* Past temperature line */}
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#66FF66"
              strokeWidth={2}
              activeDot={false}
              isAnimationActive={false}
              dot={CustomDot}
              data={data.slice(0, currentTimeIndex + 1)}
            />

            {/* Future temperature line */}
            <Line
              type="monotone"
              dataKey="temp"
              stroke="white"
              strokeWidth={2}
              activeDot={false}
              isAnimationActive={false}
              dot={CustomDot}
              data={data.slice(currentTimeIndex)}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureGraph;
