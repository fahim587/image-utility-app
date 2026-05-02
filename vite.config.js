import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindVite from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindVite()],

  optimizeDeps: {
    // @imgly/background-removal কে exclude করা জরুরি যাতে এটি webgpu খোঁজা বন্ধ করে
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util", "@imgly/background-removal"], 
    include: ["jspdf", "pdfjs-dist/legacy/build/pdf"]
  },

  server: {
    hmr: { overlay: false },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "credentialless"
    }
  },

  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      // এটি নিশ্চিত করে যে বিল্ডের সময় এই মডিউলটি ইগনোর করা হবে
      external: ["onnxruntime-web", "onnxruntime-web/webgpu"],
      output: {
        globals: {
          "onnxruntime-web": "ort",
        },
      },
    }
  }
});