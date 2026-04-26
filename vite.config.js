// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindVite from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindVite()],
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
    include: ["jspdf", "pdfjs-dist/legacy/build/pdf"]
  },
  server: {
    hmr: { overlay: false },
    headers: {
      // ✅ পপ-আপ এবং FFmpeg উভয়ের জন্য এটি সেরা কম্বিনেশন
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "credentialless" 
    }
  },
  build: {
    chunkSizeWarningLimit: 1500
  }
});