import { getWeatherInfo } from "../../utils/weatherCodeMap";
import { HourlyWeather } from "../../types/weather.types";

interface HourlyForecastProps {
  hourlyData: HourlyWeather;
}

export default function HourlyForecast({ hourlyData }: HourlyForecastProps) {
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
    <div className="h-full">
      {/* Modern scrollable container with improved aesthetics */}
      <div className="flex overflow-x-auto py-2 space-x-3 hide-scrollbar">
        {next24Hours.time.map((time, index) => {
          const weatherInfo = getWeatherInfo(next24Hours.weather_code[index]);
          const hasPrecip = next24Hours.precipitation_probability[index] > 0;
          const isCurrentHour = index === 0;

          return (
            <div
              key={time}
              className={`flex flex-col items-center min-w-[68px] flex-shrink-0 py-3 px-2 rounded-2xl transition-all ${
                isCurrentHour
                  ? "bg-white/20 border border-white/20"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {/* Time display */}
              <div className="font-medium text-xs uppercase tracking-wide text-white/80 mb-1">
                {index === 0 ? "Now" : formatHour(time)}
              </div>

              {/* Weather icon - simplified and more modern */}
              <div className="my-2 flex items-center justify-center h-10">
                {renderWeatherIcon(weatherInfo.icon)}
              </div>

              {/* Temperature with bolder styling */}
              <div className="font-semibold text-base text-white">
                {Math.round(next24Hours.temperature_2m[index])}°
              </div>

              {/* Precipitation probability with improved pill design */}
              {hasPrecip && (
                <div
                  className={`
                  mt-2 flex items-center justify-center
                  ${
                    next24Hours.precipitation_probability[index] > 50
                      ? "text-blue-200"
                      : "text-blue-100/70"
                  }`}
                >
                  <svg
                    className="w-3 h-3 mr-0.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13 5.5C13 4.67 13.67 4 14.5 4S16 4.67 16 5.5C16 6.33 15.33 7 14.5 7S13 6.33 13 5.5Z" />
                    <path d="M20 8.5C20 7.67 20.67 7 21.5 7S23 7.67 23 8.5C23 9.33 22.33 10 21.5 10S20 9.33 20 8.5Z" />
                    <path d="M17 10.5C17 9.67 17.67 9 18.5 9S20 9.67 20 10.5C20 11.33 19.33 12 18.5 12S17 11.33 17 10.5Z" />
                    <path d="M11.28 15.63C11.28 17.73 9.57 19.44 7.47 19.44C5.38 19.44 3.67 17.73 3.67 15.63C3.67 14 6 11.37 7.47 10.03C8.93 11.37 11.28 14 11.28 15.63Z" />
                    <path d="M15 14.5C15 13.67 15.67 13 16.5 13S18 13.67 18 14.5C18 15.33 17.33 16 16.5 16S15 15.33 15 14.5Z" />
                  </svg>
                  <span className="text-xs font-medium">
                    {next24Hours.precipitation_probability[index]}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to render weather icons consistently
const renderWeatherIcon = (iconType: string) => {
  const iconClasses = "w-7 h-7";

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
          className={`${iconClasses} text-white/90`}
        >
          <path
            fillRule="evenodd"
            d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
            clipRule="evenodd"
          />
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
          <path
            fillRule="evenodd"
            d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
            clipRule="evenodd"
          />
          <path d="M3.75 14.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-3.75z" />
        </svg>
      );
    case "cloud-snow":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${iconClasses} text-blue-100`}
        >
          <path
            fillRule="evenodd"
            d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
            clipRule="evenodd"
          />
          <path d="M3.75 15.75a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75v.008zm2.25-3a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75v-.008zm3 3a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H9.75a.75.75 0 00-.75.75v.008z" />
        </svg>
      );
    case "cloud-lightning":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${iconClasses} text-yellow-300`}
        >
          <path
            fillRule="evenodd"
            d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${iconClasses} text-white/80`}
        >
          <path
            fillRule="evenodd"
            d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
            clipRule="evenodd"
          />
        </svg>
      );
  }
};
