import React, { useMemo } from 'react';
import { formatHour } from '../../../utils/formatting';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from 'recharts';
import { useSettings } from '../../../context/SettingsContext';
import { AppConfig } from '../../../config/appConfig';
import { useTranslation } from 'react-i18next';

// Create proper types
interface TemperatureDataPoint {
  temp: number;
  time: string;
  label: string;
  isCurrent: boolean;
  isPast: boolean;
  isKey: boolean;
}

interface DotProps {
  cx?: number;
  cy?: number;
  index?: number;
  payload?: TemperatureDataPoint;
}

interface TemperatureGraphProps {
  temperatures: number[]; // Temperatures in Celsius from API
  times: string[];
  currentTimeIndex: number;
}

const TemperatureGraph: React.FC<TemperatureGraphProps> = ({
  temperatures,
  times,
  currentTimeIndex,
}) => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  // Convert temperatures if needed (they come in Celsius)
  const convertedTemps = temperatures.map((temp) =>
    settings.units.temperature === 'celsius'
      ? temp
      : AppConfig.utils.convertTemperature(temp, 'fahrenheit')
  );

  // Use convertedTemps for data processing
  const data = useMemo(() => {
    return convertedTemps.map((temp, i) => ({
      temp,
      time: times[i],
      label: formatHour(times[i], settings.timeFormat), // Pass the user's time format preference
      isCurrent: i === currentTimeIndex,
      isPast: i <= currentTimeIndex,
      isKey: i === 0 || i === currentTimeIndex || i === convertedTemps.length - 1 || i % 4 === 0,
    }));
  }, [convertedTemps, times, currentTimeIndex, settings.timeFormat]); // Add settings.timeFormat as dependency

  // Find temperature extremes for the day
  const minTemp = Math.floor(Math.min(...convertedTemps)) - 1;
  const maxTemp = Math.ceil(Math.max(...convertedTemps)) + 1;

  // Calculate gradient transition point
  const gradientBreakpoint = (currentTimeIndex / (convertedTemps.length - 1)) * 100;

  // Determine if the graph is showing a significant temperature change
  const tempChange = convertedTemps[convertedTemps.length - 1] - convertedTemps[0];
  const showsTempTrend = Math.abs(tempChange) >= (settings.units.temperature === 'celsius' ? 3 : 5);

  // Custom dot renderer with premium styling
  const renderDot = (props: DotProps) => {
    const { cx = 0, cy = 0, index = 0, payload } = props;

    // Instead of returning null, return an invisible element
    if (!payload?.isKey && index !== currentTimeIndex) {
      return <g key={`dot-empty-${index}`}></g>;
    }

    if (index === currentTimeIndex) {
      // Current time dot with glow effect
      return (
        <g key={`dot-current-${index}`}>
          {/* Subtle glow effect */}
          <circle
            key={`dot-glow-outer-${index}`}
            cx={cx}
            cy={cy}
            r={8}
            fill="rgba(255,255,255,0.15)"
          />
          <circle
            key={`dot-glow-inner-${index}`}
            cx={cx}
            cy={cy}
            r={6}
            fill="rgba(255,255,255,0.25)"
          />
          {/* Main dot */}
          <circle
            key={`dot-main-${index}`}
            cx={cx}
            cy={cy}
            r={5}
            fill="white"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={1.5}
          />
        </g>
      );
    }

    // Regular dots with subtle inner glow
    return (
      <g key={`dot-regular-${index}`}>
        <circle
          key={`dot-outer-${index}`}
          cx={cx}
          cy={cy}
          r={4}
          fill={index <= currentTimeIndex ? '#66FF66' : 'white'}
          opacity={0.9}
        />
        <circle
          key={`dot-inner-${index}`}
          cx={cx}
          cy={cy}
          r={2}
          fill={index <= currentTimeIndex ? '#9CFFB3' : '#F8F8F8'}
          opacity={0.7}
        />
      </g>
    );
  };

  return (
    <div className="relative h-36 mb-2 mt-2 px-0.5">
      {/* Temperature range indicators */}
      <div className="absolute top-0 right-2 flex space-x-4 text-xs z-10">
        <div className="flex items-center">
          <span className="text-green-400 font-medium mr-1">{t('actual')}</span>
        </div>
        <div className="flex items-center">
          <span className="text-white font-medium">{t('forecast')}</span>
        </div>
      </div>

      {/* Min/Max display */}
      <div className="absolute top-0 left-2 flex space-x-3 text-xs z-10">
        <div className="flex items-center">
          <span className="text-white opacity-80 mr-1">↑</span>
          <span className="font-medium">{Math.round(maxTemp - 1)}°</span>
        </div>
        <div className="flex items-center">
          <span className="text-white opacity-80 mr-1">↓</span>
          <span className="font-medium">{Math.round(minTemp + 1)}°</span>
        </div>
      </div>

      {/* Temperature trend indicator */}
      {showsTempTrend && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs z-10">
          <div className={`font-medium ${tempChange > 0 ? 'text-yellow-400' : 'text-blue-300'}`}>
            {tempChange > 0 ? t('warming') : t('cooling')} {Math.abs(Math.round(tempChange))}°
          </div>
        </div>
      )}

      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 25, right: 8, left: 8, bottom: 15 }}>
            <defs>
              {/* Premium gradient for the line */}
              <linearGradient id="temperatureGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset={`${gradientBreakpoint - 0.01}%`} stopColor="#66FF66" />
                <stop offset={`${gradientBreakpoint}%`} stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F0F0F0" />
              </linearGradient>

              {/* Shadow effect for the line */}
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.2" />
              </filter>
            </defs>

            {/* Premium grid lines */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={0.8}
            />

            {/* Time axis with premium styling */}
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fontFamily: "'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
                fill: 'rgba(255,255,255,0.7)',
              }}
              interval={3}
              padding={{ left: 10, right: 10 }}
            />

            <YAxis domain={[minTemp, maxTemp]} hide={true} />

            {/* Use a function to render CustomTooltip with proper props */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as TemperatureDataPoint;
                  return (
                    <div className="backdrop-blur-md bg-gray-900/80 border border-gray-700 text-white px-3 py-2 rounded-lg shadow-lg">
                      <div className="font-medium text-xs mb-0.5">
                        {data.label}
                        {data.isCurrent && <span className="text-xs ml-1 font-bold">(Now)</span>}
                      </div>
                      <div
                        className={`text-sm font-bold ${
                          data.isPast ? 'text-green-400' : 'text-white'
                        }`}
                      >
                        {Math.round(data.temp)}°
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Current time indicator */}
            <ReferenceLine
              x={data[currentTimeIndex].label}
              stroke="rgba(255,255,255,0.35)"
              strokeDasharray="3 3"
              strokeWidth={1.2}
            >
              <Label
                value="NOW"
                position="top"
                fill="white"
                fontSize={9}
                fontWeight="bold"
                offset={3}
              />
            </ReferenceLine>

            {/* Premium temperature line */}
            <Line
              type="monotone"
              dataKey="temp"
              stroke="url(#temperatureGradient)"
              strokeWidth={3}
              dot={(props) => renderDot(props)}
              activeDot={{
                r: 5.5,
                stroke: 'white',
                strokeWidth: 1.5,
                fill: 'white', // Fixed string value instead of function
              }}
              isAnimationActive={false}
              connectNulls={true}
              filter="url(#shadow)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureGraph;
