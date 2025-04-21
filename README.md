# Modern Weather App ⛅

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fweather.araza.me)](https://weather.araza.me)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/github/license/yourusername/weather-app)](LICENSE)

A modern, responsive weather application built with React, TypeScript, and Tailwind CSS. Get real-time weather information with a beautiful, intuitive interface.

![Weather App Screenshot](public/screenshot.png)

## ✨ Features

- 🌡️ Real-time weather data with hourly and daily forecasts
- 🌍 Location-based weather information
- 📱 Responsive design for all devices
- 🎨 Beautiful animations and transitions
- 🌓 Theme change based on weather condition
- 🔍 Search for any location worldwide
- 📍 Save favorite locations
- 🕒 12/24 hour time format support
- 🌡️ Temperature unit conversion (°C/°F)

## 🚀 Demo

Visit the live demo at [weather.araza.me](https://weather.araza.me)

## 🛠️ Tech Stack

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Vite](https://vitejs.dev/)
- [Open-Meteo API](https://open-meteo.com/)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run `npm run prepare` to install Git hooks.
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](/.github/CONTRIBUTING.md) for more details.

## 📝 Project Information

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgments
- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

### Contact
For any questions or feedback, please open an issue or reach out to the maintainers.

## ⚙️ Configuration & Environment Variables

- Create a `.env` file in the project root:
  ```bash
  # .env
  VITE_API_URL=https://api.open-meteo.com
  ```
- Rename or create environment-specific files:
  - `.env.development.local`
  - `.env.production.local`
  - `.env.test.local`

## 🏗️ Project Structure & Architecture

This project is organized as follows:
- `src/api` — Weather API calls
- `src/context` — React Context providers
- `src/components` — Reusable UI components
- `src/hooks` — Custom React hooks
- `src/pages` — Route-level page components
- `src/utils` — Helper utilities
- `src/styles` — Global styles (Tailwind CSS entry)
