import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindVite from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindVite()],

  optimizeDeps: {
    // @imgly এবং FFmpeg কে বিল্ড অপ্টিমাইজেশন থেকে বাদ রাখা জরুরি
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util", "@imgly/background-removal"], 
    include: ["jspdf", "pdfjs-dist/legacy/build/pdf"]
  },

  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp"
    }
  },

  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        // Rolldown/Vite 8 এর জন্য ফাংশন ফরম্যাটে manualChunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // AI এবং Background Removal লাইব্রেরি
            if (id.includes('@imgly') || id.includes('onnxruntime-web')) {
              return 'vendor-ai';
            }
            // PDF সংক্রান্ত লাইব্রেরি
            if (id.includes('jspdf') || id.includes('pdf-lib') || id.includes('pdfjs-dist')) {
              return 'vendor-pdf';
            }
            // অন্যান্য বড় ইউটিলিটি (যেমন: Tesseract, Framer Motion)
            if (id.includes('tesseract.js') || id.includes('framer-motion')) {
              return 'vendor-utils';
            }
            // বাকি সব সাধারণ লাইব্রেরি
            return 'vendor';
          }
        }
      }
    }
  }
});