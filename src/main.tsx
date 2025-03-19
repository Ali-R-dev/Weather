import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./premium-styles.css"; // Premium styles are imported
import App from "./App.tsx";

// Make sure the root element exists
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Make sure there is an element with id 'root' in your HTML."
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
