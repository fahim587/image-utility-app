import { motion } from "framer-motion";
import { Sparkles, MousePointer2, Image as ImageIcon, PenTool } from "lucide-react";

const DecorativeElements = () => {
  return (
    // z-10 করে দেওয়া হয়েছে যাতে এটি ব্যাকগ্রাউন্ডের উপরে থাকে
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      
      {/* ১. ডান পাশের এলিমেন্ট (Pen Tool) */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[10%] md:right-[15%] p-3 bg-cyan-500 rounded-xl text-white shadow-xl hidden md:block"
      >
        <PenTool size={24} />
      </motion.div>

      {/* ২. বাম পাশের এলিমেন্ট (Image Icon) */}
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[30%] left-[10%] p-3 bg-amber-400 rounded-xl text-white shadow-xl hidden md:block"
      >
        <ImageIcon size={24} />
      </motion.div>

      {/* ৩. স্পার্কলস */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-[25%] left-[20%] text-rose-400 font-bold text-3xl hidden md:block"
      >
        +
      </motion.div>

      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] right-[25%] text-blue-400"
      >
        <Sparkles size={24} />
      </motion.div>

      {/* ৪. ব্যাকগ্রাউন্ড ব্লব (এগুলোকে সবার নিচে রাখতে -z-10 ই ঠিক আছে) */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 bg-purple-100/40 rounded-full blur-[100px] -z-10" />

      {/* ৫. মাউস কার্সার */}
      <motion.div
        animate={{ 
          x: [0, 30, 0], 
          y: [0, -30, 0] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] right-[18%] text-gray-800 hidden lg:block opacity-40"
      >
        <MousePointer2 size={36} fill="currentColor" />
      </motion.div>
    </div>
  );
};

export default DecorativeElements;