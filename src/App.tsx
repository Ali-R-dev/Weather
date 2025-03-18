import { useEffect, useState } from "react";
import { WeatherProvider } from "./context/WeatherContext";
import { ThemeProvider } from "./context/ThemeContext";
import PremiumHomePage from "./pages/PremiumHomePage"; // Update import
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import WeatherLoadingScreen from "./components/common/WeatherLoadingScreen";
import { useWeather } from "./context/WeatherContext";

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
    }, 2000);

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

function AppContent({
  initialLoading,
  privacyModalVisible,
  setPrivacyModalVisible,
}) {
  const { loading, weatherData } = useWeather();

  return (
    <>
      <WeatherLoadingScreen
        isLoading={initialLoading || (loading && !weatherData)}
      />
      <div className="flex flex-col h-screen relative">
        <div className="flex-grow overflow-y-auto">
          <PremiumHomePage /> {/* Use premium page here */}
        </div>
        <PrivacyPolicyModal
          visible={privacyModalVisible}
          onClose={() => setPrivacyModalVisible(false)}
        />
      </div>
    </>
  );
}

export default App;
