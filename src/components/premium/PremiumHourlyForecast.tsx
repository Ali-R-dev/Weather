import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getWeatherInfo } from "../../utils/weatherCodeMap";
import { HourlyWeather } from "../../types/weather.types";

interface PremiumHourlyForecastProps {
  hourlyData: HourlyWeather;
}

const PremiumHourlyForecast: React.FC<PremiumHourlyForecastProps> = ({
  hourlyData,
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const [chartData, setChartData] = useState<{ time: string; temp: number }[]>(
    []
  );

  // Format time to show only hour
  const formatHour = (timeStr: string): string => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
  };

  // Format date to show day name
  const formatDay = (timeStr: string): string => {
    const date = new Date(timeStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Parse hour to determine if it's daytime (roughly 6AM-6PM)
  const isDaytime = (timeStr: string): boolean => {
    const date = new Date(timeStr);
    const hour = date.getHours();
    return hour >= 6 && hour < 18;
  };

  // Prepare chart data when hourly data changes
  useEffect(() => {
    if (hourlyData && hourlyData.time) {
      const displayHours = expandedView
        ? hourlyData.time.slice(0, 48) // Show two days if expanded
        : hourlyData.time.slice(0, 24); // Show one day by default

      const data = displayHours.map((time, index) => ({
        time,
        temp: hourlyData.temperature_2m[index],
      }));

      setChartData(data);
    }
  }, [hourlyData, expandedView]);

  // Show a variable number of hours based on expandedView state
  const displayHours = expandedView
    ? hourlyData.time.slice(0, 48) // Show two days if expanded
    : hourlyData.time.slice(0, 24); // Show one day by default

  // Find temperature max/min for the visible range
  const visibleTemps = hourlyData.temperature_2m.slice(
    0,
    expandedView ? 48 : 24
  );
  const maxTemp = Math.max(...visibleTemps);
  const minTemp = Math.min(...visibleTemps);
  const tempRange = maxTemp - minTemp;

  // Container variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  // Item variants for framer-motion
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Group hours by day for better UI organization
  const groupHoursByDay = (hours: string[]) => {
    const days: { [key: string]: string[] } = {};

    hours.forEach((time) => {
      const day = new Date(time).toLocaleDateString();
      if (!days[day]) {
        days[day] = [];
      }
      days[day].push(time);
    });

    return days;
  };

  const groupedHours = groupHoursByDay(displayHours);

  return (
    <div className="h-full">
      {/* Temperature graph */}
      <div className="relative h-32 mb-2 mt-1">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Temperature curve */}
          <svg className="w-full h-full overflow-visible">
            <defs>
              <linearGradient
                id="premium-temp-gradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            {/* Line path with smoother animation */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              d={`M0,${
                24 - (visibleTemps[0] - minTemp) * (24 / Math.max(3, tempRange))
              } ${visibleTemps
                .map((temp, i) => {
                  const x = (i / (visibleTemps.length - 1)) * 100;
                  const y =
                    24 - (temp - minTemp) * (24 / Math.max(3, tempRange));
                  return `L${x},${y}`;
                })
                .join(" ")}`}
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Area fill with reduced opacity */}
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }} // Reduced opacity
              transition={{ duration: 0.8, delay: 0.3 }}
              d={`M0,${
                24 - (visibleTemps[0] - minTemp) * (24 / Math.max(3, tempRange))
              } ${visibleTemps
                .map((temp, i) => {
                  const x = (i / (visibleTemps.length - 1)) * 100;
                  const y =
                    24 - (temp - minTemp) * (24 / Math.max(3, tempRange));
                  return `L${x},${y}`;
                })
                .join(" ")} L100,24 L0,24 Z`}
              fill="url(#premium-temp-gradient)"
            />

            {/* Temperature dots with consistent spacing */}
            {visibleTemps.map((temp, i) => {
              // Show dots at more logical intervals based on view mode
              const interval = expandedView ? 6 : 3;
              if (
                i % interval !== 0 &&
                i !== 0 &&
                i !== visibleTemps.length - 1
              )
                return null;

              const x = (i / (visibleTemps.length - 1)) * 100;
              const y = 24 - (temp - minTemp) * (24 / Math.max(3, tempRange));

              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.02, duration: 0.2 }}
                  className="group"
                >
                  <circle cx={`${x}%`} cy={y} r="3" fill="white" />
                  <text
                    x={`${x}%`}
                    y={y - 8}
                    fontSize="10"
                    fontWeight="bold"
                    fill="white"
                    textAnchor="middle"
                    opacity="0"
                    className="group-hover:opacity-100 transition-opacity"
                  >
                    {Math.round(temp)}°
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* Day headers and hourly forecast */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Render day headers and their respective hours */}
        {Object.entries(groupedHours).map(([day, hours], dayIndex) => (
          <div key={day} className="mb-4">
            {/* Day header */}
            <motion.div
              variants={itemVariants}
              className="sticky top-0 z-20 mb-2 py-1 pl-2 backdrop-blur-md bg-black/30 rounded-lg text-white font-medium text-xs uppercase"
            >
              {dayIndex === 0 ? "Today" : formatDay(hours[0])} -{" "}
              {new Date(day).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </motion.div>

            {/* Scrollable hours container */}
            <div className="flex overflow-x-auto py-1 space-x-3 hide-scrollbar">
              {hours.map((time, timeIndex) => {
                const index = hourlyData.time.indexOf(time);
                const weatherInfo = getWeatherInfo(
                  hourlyData.weather_code[index]
                );
                const hasPrecip =
                  hourlyData.precipitation_probability[index] > 0;
                const isCurrentHour = index === 0;
                const daytime = isDaytime(time);

                return (
                  <motion.div
                    key={time}
                    variants={itemVariants}
                    className={`relative flex flex-col items-center min-w-[72px] flex-shrink-0 py-3 px-2 rounded-2xl transition-all ${
                      isCurrentHour
                        ? "bg-white/20 border border-white/20"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Time display */}
                    <div className="font-medium text-xs uppercase tracking-wide text-white/80 mb-1">
                      {index === 0 ? "Now" : formatHour(time)}
                    </div>

                    {/* Day/Night indicator */}
                    <div className="absolute top-2 right-2">
                      {daytime ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3 h-3 text-yellow-300"
                        >
                          <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3 h-3 text-indigo-300"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Weather icon with animation */}
                    <div
                      className={`my-2 flex items-center justify-center h-10 ${
                        isCurrentHour ? "animate-pulse" : ""
                      }`}
                    >
                      {weatherInfo.icon === "sun" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-8 h-8 text-yellow-300"
                        >
                          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                        </svg>
                      ) : weatherInfo.icon === "cloud" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-8 h-8 text-white/90"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : weatherInfo.icon === "cloud-rain" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-8 h-8 text-blue-300"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
                            clipRule="evenodd"
                          />
                          <path d="M3.75 14.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75z" />
                        </svg>
                      ) : weatherInfo.icon === "cloud-snow" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-8 h-8 text-blue-100"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
                            clipRule="evenodd"
                          />
                          <path d="M3.75 15.75a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75v.008zm2.25-3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75v-.008zm3 3a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H9.75a.75.75 0 00-.75.75v.008zm2.25-3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" />
                        </svg>
                      ) : weatherInfo.icon === "cloud-lightning" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-8 h-8 text-yellow-300"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-8 h-8 text-white/80"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Temperature with glass effect */}
                    <div className="font-semibold text-lg text-white">
                      {Math.round(hourlyData.temperature_2m[index])}°
                    </div>

                    {/* Weather condition tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {weatherInfo.label}
                    </div>

                    {/* Precipitation probability with improved pill design */}
                    {hasPrecip && (
                      <div
                        className={`
                        mt-2 flex items-center justify-center
                        ${
                          hourlyData.precipitation_probability[index] > 50
                            ? "text-blue-200"
                            : "text-blue-100/70"
                        }`}
                      >
                        <svg
                          className="w-3 h-3 mr-0.5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M11.28 15.63C11.28 17.73 9.57 19.44 7.47 19.44C5.38 19.44 3.67 17.73 3.67 15.63C3.67 14 6 11.37 7.47 10.03C8.93 11.37 11.28 14 11.28 15.63Z" />
                        </svg>
                        <span className="text-xs font-medium">
                          {hourlyData.precipitation_probability[index]}%
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Toggle button for expanded view */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-3 flex justify-center"
      >
        <button
          onClick={() => setExpandedView(!expandedView)}
          className="text-sm bg-white/10 backdrop-blur-md py-2 px-4 rounded-full border border-white/20 text-white flex items-center hover:bg-white/20 transition-colors"
        >
          {expandedView ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
                  clipRule="evenodd"
                />
              </svg>
              Show less
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
              Show 48 hours
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default PremiumHourlyForecast;
