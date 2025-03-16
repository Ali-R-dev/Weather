import { WeatherProvider } from "./context/WeatherContext";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";

function App() {
  // Set meta theme color based on theme
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
          {/* Weather animations will be added via CSS classes */}

          {/* Weather content is rendered in HomePage */}
          <HomePage />
        </div>
      </WeatherProvider>
    </ThemeProvider>
  );
}

export default App;
