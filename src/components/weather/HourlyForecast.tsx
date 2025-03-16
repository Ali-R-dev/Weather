import { getWeatherInfo } from "../../utils/weatherCodeMap";
import { HourlyWeather } from "../../types/weather.types";
import { useTheme } from "../../context/ThemeContext";

interface HourlyForecastProps {
  hourlyData: HourlyWeather;
}

export default function HourlyForecast({ hourlyData }: HourlyForecastProps) {
  const { currentTheme } = useTheme();
  const isDarkTheme = currentTheme.includes("night");

  // Format time to show only hour
  const formatHour = (timeStr: string): string => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
  };

  // Show only the next 24 hours
  const next24Hours = {
    time: hourlyData.time.slice(0, 24),
    temperature_2m: hourlyData.temperature_2m.slice(0, 24),
    precipitation_probability: hourlyData.precipitation_probability.slice(
      0,
      24
    ),
    weather_code: hourlyData.weather_code.slice(0, 24),
  };

  return (
    <div className="weather-card weather-card-light h-full">
      <div
        className="flex overflow-x-auto py-2 snap-x snap-mandatory pb-4 scrollbar-thin 
                    scrollbar-thumb-white/20 scrollbar-track-transparent space-x-2 h-full"
      >
        {next24Hours.time.map((time, index) => {
          const weatherInfo = getWeatherInfo(next24Hours.weather_code[index]);
          const hasPrecip = next24Hours.precipitation_probability[index] > 0;

          return (
            <div
              key={time}
              className="flex flex-col items-center min-w-[72px] flex-shrink-0 snap-start 
                       backdrop-blur-sm p-3 rounded-2xl bg-white/10 border border-white/10"
            >
              <div className="font-medium text-sm text-white">
                {index === 0 ? "Now" : formatHour(time)}
              </div>
              <div className="my-2">
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
                    <path d="M3.75 15.75a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75v.008zm2.25-3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75v-.008zm3 3a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H9.75a.75.75 0 00-.75.75v.008z" />
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
              <div className="font-semibold text-base text-white">
                {Math.round(next24Hours.temperature_2m[index])}°
              </div>
              {hasPrecip && (
                <div
                  className={`text-xs rounded-full px-2 py-0.5 mt-1 ${
                    next24Hours.precipitation_probability[index] > 50
                      ? "bg-blue-900/50 text-blue-100"
                      : "bg-blue-800/30 text-blue-100"
                  }`}
                >
                  {next24Hours.precipitation_probability[index]}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
