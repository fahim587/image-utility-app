/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      spacing: {
        '130': '520px', 
      },
      borderRadius: {
        '4xl': '32px', 
      },
      zIndex: {
        '60': '60', 
      },
      // আপনার নতুন ব্র্যান্ড কালার এখানে অ্যাড করা হলো
      colors: {
        'deep-navy': '#010326', 
        'sky-blue': '#0583F2',
        darkBg: '#020617',     // slate-950 (ডার্ক মোড ব্যাকগ্রাউন্ড)
        
      }
    },
  },
  plugins: [],
}