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

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2">7-Day Forecast</h3>
      <div
        className={`flex-1 rounded-lg shadow overflow-auto ${
          isDarkTheme
            ? "bg-slate-800 text-white border border-slate-700"
            : "bg-white text-gray-800 border border-gray-100"
        } transition-colors duration-300`}
      >
        {dailyData.time.map((day, index) => {
          const weatherInfo = getWeatherInfo(dailyData.weather_code[index]);

          return (
            <div
              key={day}
              className={`flex items-center justify-between p-3 ${
                index !== dailyData.time.length - 1
                  ? isDarkTheme
                    ? "border-b border-slate-700"
                    : "border-b border-gray-200"
                  : ""
              }`}
            >
              <div className="font-medium w-16 shrink-0">
                {index === 0 ? "Today" : formatDay(day)}
              </div>

              <div className="flex items-center space-x-1">
                {weatherInfo.icon === "sun" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-amber-500"
                  >
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                  </svg>
                ) : weatherInfo.icon === "cloud" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-gray-500"
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
                    className="w-5 h-5 text-blue-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
                      clipRule="evenodd"
                    />
                    <path d="M3.75 14.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-gray-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className="text-xs sm:text-sm ml-1 hidden sm:inline">
                  {weatherInfo.label}
                </span>
              </div>

              <div className="flex space-x-2 ml-auto text-sm sm:text-base">
                <span className="font-semibold">
                  {Math.round(dailyData.temperature_2m_max[index])}°
                </span>
                <span
                  className={isDarkTheme ? "text-gray-400" : "text-gray-500"}
                >
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
