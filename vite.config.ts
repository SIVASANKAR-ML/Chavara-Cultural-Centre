import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // 1. BASE: Points to the folder where Frappe serves assets for your app
  base: mode === "production" ? "/assets/chavara_booking/js/" : "/",
  plugins: [
    react(), 
    mode === "development" && componentTagger()
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // 2. BUILD: Automates moving files to your Frappe public folder
  build: {
    // Build directly into the public/js folder for clarity
    outDir: "../chavara_booking/public/js",
    emptyOutDir: true,
  },

}));