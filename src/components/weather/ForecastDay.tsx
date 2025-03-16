import { getWeatherInfo } from "../../utils/weatherCodeMap";
import { DailyWeather } from "../../types/weather.types";
import { useTheme } from "../../context/ThemeContext";

interface ForecastDayProps {
  dailyData: DailyWeather;
}

export default function ForecastDay({ dailyData }: ForecastDayProps) {
  const { currentTheme } = useTheme();
  const isDarkTheme = currentTheme.includes("night");

  // Function to format date to display weekday
  const formatDay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
  };

  // Function to format date to display month and day
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="h-full">
      {/* Modern 7-day forecast */}
      <div className="space-y-3">
        {dailyData.time.map((day, index) => {
          const weatherInfo = getWeatherInfo(dailyData.weather_code[index]);
          const isToday = index === 0;
          const precipProbability =
            dailyData.precipitation_probability_max[index];
          const hasPrecip = precipProbability > 0;

          return (
            <div
              key={day}
              className={`flex items-center p-2.5 rounded-xl transition-all ${
                isToday ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {/* Day of week and date */}
              <div className="flex flex-col w-[70px]">
                <div className="font-medium text-sm text-white">
                  {isToday ? "Today" : formatDay(day)}
                </div>
                <div className="text-xs text-white/60">{formatDate(day)}</div>
              </div>

              {/* Weather condition icon */}
              <div className="ml-1 mr-3">
                {renderWeatherIcon(weatherInfo.icon)}
              </div>

              {/* Weather condition text */}
              <div className="flex-grow">
                <span className="text-sm text-white/90">
                  {weatherInfo.label}
                </span>
                {hasPrecip && (
                  <div className="flex items-center mt-0.5">
                    <svg
                      className="w-3 h-3 text-blue-300/80"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M11.28 15.63C11.28 17.73 9.57 19.44 7.47 19.44C5.38 19.44 3.67 17.73 3.67 15.63C3.67 14 6 11.37 7.47 10.03C8.93 11.37 11.28 14 11.28 15.63Z" />
                    </svg>
                    <span className="text-xs text-blue-100/70 ml-1">
                      {precipProbability}%
                    </span>
                  </div>
                )}
              </div>

              {/* Temperature range */}
              <div className="flex items-center space-x-1.5 whitespace-nowrap">
                <span className="font-medium text-sm">
                  {Math.round(dailyData.temperature_2m_max[index])}°
                </span>
                <span className="h-0.5 w-2 bg-white/30 rounded-full"></span>
                <span className="text-sm text-white/60">
                  {Math.round(dailyData.temperature_2m_min[index])}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to render weather icons consistently
const renderWeatherIcon = (iconType: string) => {
  const iconClasses = "w-8 h-8";

  switch (iconType) {
    case "sun":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${iconClasses} text-yellow-300`}
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      );
    case "cloud":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${iconClasses} text-gray-200`}
        >
          <path d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" />
        </svg>
      );
    case "cloud-rain":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${iconClasses} text-blue-300`}
        >
          <path d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${iconClasses} text-gray-400`}
        >
          <path d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" />
        </svg>
      );
  }
};
