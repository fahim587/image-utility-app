import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindVite from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindVite()],

  optimizeDeps: {
    // @imgly/background-removal কে exclude রাখা ভালো
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util", "@imgly/background-removal"], 
    include: ["jspdf", "pdfjs-dist/legacy/build/pdf"]
  },

  server: {
    hmr: { overlay: false },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin", // 'same-origin-allow-popups' এর বদলে 'same-origin' বেশি নিরাপদ
      "Cross-Origin-Embedder-Policy": "require-corp" // FFmpeg এর জন্য 'require-corp' লাইভে বেশি কাজ করে
    }
  },

  build: {
    chunkSizeWarningLimit: 2000, // লিমিট একটু বাড়ালে বিল্ডে ওয়ার্নিং কম আসবে
    rollupOptions: {
      // 'onnxruntime-web' কে external করার প্রয়োজন নেই যদি আপনি সরাসরি npm প্যাকেজ হিসেবে ব্যবহার করেন
      // তবে @imgly এর প্রয়োজনে এটি বান্ডেলে থাকাই ভালো। 
      // আপনি যদি CDN থেকে 'ort' লোড না করেন, তবে external থেকে এটি বাদ দিন।
      external: [], 
      output: {
        manualChunks: {
          // বড় লাইব্রেরিগুলোকে আলাদা চাঙ্কে ভাগ করলে সাইট দ্রুত লোড হবে
          'vendor-ui': ['framer-motion', 'lucide-react'],
          'vendor-pdf': ['jspdf', 'pdf-lib', 'pdfjs-dist'],
          'vendor-ai': ['@imgly/background-removal', 'onnxruntime-web']
        }
      },
    }
  }
});