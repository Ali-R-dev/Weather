import React, { useState } from "react";
import { WeatherData } from "../types/weather.types";
import CurrentWeather from "./weather/current";
import HourlyForecast from "./weather/hourly";
import DailyForecast from "./weather/daily";

interface WeatherProps {
  data: WeatherData;
  isLoading?: boolean;
  error?: string | null;
}

const Weather: React.FC<WeatherProps> = ({
  data,
  isLoading = false,
  error = null,
}) => {
  const [activeTab, setActiveTab] = useState<"current" | "hourly" | "daily">(
    "current"
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        <div className="text-3xl mb-2">😕</div>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4">
        <button
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === "current"
              ? "bg-white/20 font-medium"
              : "bg-white/5 hover:bg-white/10"
          }`}
          onClick={() => setActiveTab("current")}
        >
          Current
        </button>
        <button
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === "hourly"
              ? "bg-white/20 font-medium"
              : "bg-white/5 hover:bg-white/10"
          }`}
          onClick={() => setActiveTab("hourly")}
        >
          Hourly
        </button>
        <button
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === "daily"
              ? "bg-white/20 font-medium"
              : "bg-white/5 hover:bg-white/10"
          }`}
          onClick={() => setActiveTab("daily")}
        >
          Daily
        </button>
      </div>

      {/* Tab Content */}
      <div className="rounded-3xl overflow-hidden border border-white/10 h-auto bg-gradient-to-br from-black/20 to-black/30 backdrop-blur-md">
        <div className="p-4 h-full">
          {activeTab === "current" && <CurrentWeather data={data} />}
          {activeTab === "hourly" && (
            <HourlyForecast hourlyData={data.hourly} />
          )}
          {activeTab === "daily" && <DailyForecast dailyData={data.daily} />}
        </div>
      </div>
    </div>
  );
};

export default Weather;
