import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import compression from "vite-plugin-compression";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({ algorithm: "brotliCompress" }),
  ],
  base: "/",
  optimizeDeps: {
    include: ["recharts/es6"], // Ensures Vite processes only needed components
  },
  build: {
    minify: true,
    cssCodeSplit: true,
    sourcemap: true, // Enable source maps
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react-vendor";
            if (id.includes("framer-motion")) return "framer-motion-vendor";
            if (id.includes("recharts")) return "recharts-vendor";
            if (id.includes("axios")) return "axios-vendor";
            if (id.includes("zustand")) return "zustand-vendor";
            return "vendor";
          }
        },
      },
    },
  },
});
