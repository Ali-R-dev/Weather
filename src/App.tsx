import { useEffect, useState, Suspense, lazy } from "react";
import { WeatherProvider } from "./context/WeatherContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SettingsProvider } from "./context/SettingsContext";
import WeatherLoadingScreen from "./components/common/WeatherLoadingScreen";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Footer from "./components/layout/Footer";
import "./premium-styles.css";
import {
  initializeAllMonitoring,
  markPerformance,
  measureBetweenMarks,
} from "./utils/performance";

// Lazy load heavyweight components
const HomePage = lazy(() => import("./pages/HomePage"));

interface AppContentProps {
  initialLoading: boolean;
  privacyModalVisible: boolean;
  setPrivacyModalVisible: (visible: boolean) => void;
}

function App() {
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Initialize performance monitoring
    initializeAllMonitoring();

    // Mark the start of app initialization
    markPerformance("app-mount-start");

    // Check if it's the first visit
    const hasAcceptedPrivacy = localStorage.getItem("privacyPolicyAccepted");
    if (!hasAcceptedPrivacy) {
      setPrivacyModalVisible(true);
    }

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

    return () => {
      // Measure total mount time when component unmounts
      markPerformance("app-mount-end");
      measureBetweenMarks(
        "app-mount-start",
        "app-mount-end",
        "Total App Mount Time"
      );
      clearTimeout(timer);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SettingsProvider>
          <WeatherProvider>
            <AppContent
              initialLoading={initialLoading}
              privacyModalVisible={privacyModalVisible}
              setPrivacyModalVisible={setPrivacyModalVisible}
            />
          </WeatherProvider>
        </SettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
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
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              }
            >
              <HomePage />
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer onShowPrivacyModal={() => setPrivacyModalVisible(true)} />
        <PrivacyPolicyModal
          visible={privacyModalVisible}
          onClose={() => {
            setPrivacyModalVisible(false);
            localStorage.setItem("privacyPolicyAccepted", "true");
          }}
        />
      </div>
    </>
  );
}

export default App;
