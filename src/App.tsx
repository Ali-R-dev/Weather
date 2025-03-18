import { useEffect, useState } from "react";
import { WeatherProvider } from "./context/WeatherContext";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import WeatherLoadingScreen from "./components/common/WeatherLoadingScreen";
import { useWeather } from "./context/WeatherContext"; // Import useWeather

function App() {
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = "#0ea5e9";
      document.head.appendChild(meta);
    }

    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000); // Show loading screen for at least 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <WeatherProvider>
        <AppContent
          initialLoading={initialLoading}
          privacyModalVisible={privacyModalVisible}
          setPrivacyModalVisible={setPrivacyModalVisible}
        />
      </WeatherProvider>
    </ThemeProvider>
  );
}

// Separate component to use the WeatherContext
function AppContent({
  initialLoading,
  privacyModalVisible,
  setPrivacyModalVisible,
}: {
  initialLoading: boolean;
  privacyModalVisible: boolean;
  setPrivacyModalVisible: (visible: boolean) => void;
}) {
  const { loading, weatherData } = useWeather(); // Import useWeather at the top

  return (
    <>
      <WeatherLoadingScreen
        isLoading={initialLoading || (loading && !weatherData)}
      />
      <div className="flex flex-col h-screen weather-app relative">
        <div className="flex-grow overflow-y-auto">
          <HomePage />
        </div>
        <footer className="fixed bottom-0 left-0 w-full py-2 px-4 bg-black/20 backdrop-blur-md text-white text-xs flex items-center justify-between">
          <span>
            Weather data by{" "}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Open Meteo
            </a>
          </span>
          <button
            onClick={() => setPrivacyModalVisible(true)}
            className="underline focus:outline-none"
          >
            Privacy Policy
          </button>
        </footer>
        <PrivacyPolicyModal
          visible={privacyModalVisible}
          onClose={() => setPrivacyModalVisible(false)}
        />
      </div>
    </>
  );
}

export default App;
