import { useEffect, useState } from "react";
import { WeatherProvider } from "./context/WeatherContext";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import WeatherLoadingScreen from "./components/common/WeatherLoadingScreen";
import "./premium-styles.css";

interface AppContentProps {
  initialLoading: boolean;
  privacyModalVisible: boolean;
  setPrivacyModalVisible: (visible: boolean) => void;
}

function App() {
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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

    // Simulate initial loading
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
}: AppContentProps) {
  return (
    <>
      <WeatherLoadingScreen isLoading={initialLoading} />
      <div className="flex flex-col min-h-screen relative">
        <main className="flex-grow overflow-y-auto">
          <HomePage />
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
