import { useEffect, useState } from "react";
import { WeatherProvider } from "./context/WeatherContext";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";

function App() {
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = "#0ea5e9";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <ThemeProvider>
      <WeatherProvider>
        <div className="min-h-screen flex flex-col weather-app relative overflow-hidden">
          <HomePage />
          <footer className="text-center p-4 text-white">
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
      </WeatherProvider>
    </ThemeProvider>
  );
}

export default App;
