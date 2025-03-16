import { WeatherProvider } from "./context/WeatherContext";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <div className="min-h-screen flex flex-col bg-background text-text transition-colors duration-300">
          <header className="sticky top-0 z-20 bg-gradient-to-r from-primary to-secondary text-white shadow-md transition-colors duration-300">
            <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
                <h1 className="text-xl font-bold">Weather Forecast</h1>
              </div>
            </div>
          </header>

          <main className="flex-grow overflow-hidden">
            <HomePage />
          </main>

          <footer className="sticky bottom-0 z-20 bg-slate-800 bg-opacity-90 backdrop-blur-sm text-white py-2 text-center text-xs border-t border-slate-700 transition-colors duration-300">
            <p>Data by Open-Meteo API • © 2025 Weather App</p>
          </footer>
        </div>
      </WeatherProvider>
    </ThemeProvider>
  );
}

export default App;
