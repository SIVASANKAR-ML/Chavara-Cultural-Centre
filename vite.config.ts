import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // 1. ADD THIS: This ensures images and scripts load correctly in production
  // base: mode === "production" ? "/assets/chavara_booking/frontend_folder/" : "/",

  server: {
    host: "::",
    port: 8080,
    proxy: {
      "^/(api|files|assets)": {
        target: "http://127.0.0.1:8001", // Changed from 8001 to 8000
        changeOrigin: true,
        secure: false,
        headers: {
          "X-Frappe-Site-Name": "library.localhost", // Changed from chavara.local
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 3. ADD THIS: This automates moving your React files to the other Frappe App
  // build: {
  //   outDir: "../other_app_name/public/frontend_folder",
  //   emptyOutDir: true,
  // },
}));