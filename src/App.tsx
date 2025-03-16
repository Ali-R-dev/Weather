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
        {/* 
          The overall container fills the full viewport height.
          The content area scrolls if needed,
          while the fixed footer remains visible at the bottom.
        */}
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
      </WeatherProvider>
    </ThemeProvider>
  );
}

export default App;
