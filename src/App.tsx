import { useEffect, useState } from "react";
import { WeatherProvider } from "./context/WeatherContext";
import { ThemeProvider } from "./context/ThemeContext";
import PremiumHomePage from "./pages/PremiumHomePage";
import HomePage from "./pages/HomePage";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import WeatherLoadingScreen from "./components/common/WeatherLoadingScreen";

// Add proper TypeScript interface for AppContent props
interface AppContentProps {
  initialLoading: boolean;
  isPremium: boolean;
  privacyModalVisible: boolean;
  setPrivacyModalVisible: (visible: boolean) => void;
}

function App() {
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  // Set to true to enable the premium version
  const [isPremium, setIsPremium] = useState(true);

  useEffect(() => {
    // Update theme-color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", "#0ea5e9");
    } else {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = "#0ea5e9";
      document.head.appendChild(meta);
    }

    // Simulate initial loading (you might want to adjust this)
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
          isPremium={isPremium}
          privacyModalVisible={privacyModalVisible}
          setPrivacyModalVisible={setPrivacyModalVisible}
        />
      </WeatherProvider>
    </ThemeProvider>
  );
}

function AppContent({
  initialLoading,
  isPremium,
  privacyModalVisible,
  setPrivacyModalVisible,
}: AppContentProps) {
  // Using the context inside the AppContent component
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);

  // Effect to simulate loading state for demonstration purposes
  useEffect(() => {
    // This would typically be replaced with actual data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <WeatherLoadingScreen isLoading={initialLoading || loading} />
      <div className="flex flex-col min-h-screen relative">
        <main className="flex-grow overflow-y-auto">
          {isPremium ? <PremiumHomePage /> : <HomePage />}
        </main>
        <PrivacyPolicyModal
          visible={privacyModalVisible}
          onClose={() => setPrivacyModalVisible(false)}
        />
      </div>
    </>
  );
}

export default App;
