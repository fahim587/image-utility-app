import React, { useState } from "react";
import { 
  Pipette, Copy, CheckCircle2, 
  ChevronDown, Zap, Palette, 
  RefreshCw, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RelatedTools from "../../components/RelatedTools";

const ColorPicker = () => {
  const [color, setColor] = useState("#10b981");
  const [copied, setCopied] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(false);

  // Helper: Hex to RGB
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `${r}, ${g}, ${b}`;
  };

  // Helper: Calculate Contrast
  const getContrastColor = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#ffffff";
  };

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleEyeDropper = async () => {
    if (!window.EyeDropper) {
      alert("EyeDropper API is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    const dropper = new window.EyeDropper();
    try {
      const result = await dropper.open();
      setColor(result.sRGBHex);
    } catch {
      // User cancelled the picker - error 'e' removed to fix eslint
      console.log("Picker closed by user");
    }
  };

  const generateRandom = () => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setColor(randomColor);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#fcfcfd]">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-2xl mb-4 border border-emerald-100"
          >
            <Palette className="text-emerald-600" size={24} />
          </motion.div>
          <h1 className="text-3xl font-black text-gray-900 ">Color Studio</h1>
          <p className="text-gray-500 font-medium mt-1 text-xs uppercase tracking-widest">Precise • Professional • Secure</p>
        </div>

        {/* Studio Interface */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden grid lg:grid-cols-2">
          
          {/* Preview Panel */}
          <motion.div 
            animate={{ backgroundColor: color }}
            className="h-72 lg:h-auto relative flex flex-col items-center justify-center transition-all duration-500"
          >
            <div className="absolute top-6 right-6 flex gap-2">
               <button 
                onClick={generateRandom}
                className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 border border-white/20 transition-all shadow-sm"
               >
                 <RefreshCw size={18} />
               </button>
               <button 
                onClick={handleEyeDropper}
                className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 border border-white/20 transition-all shadow-sm"
               >
                 <Pipette size={18} />
               </button>
            </div>

            <motion.h2 
              key={color}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl font-black font-mono tracking-tighter"
              style={{ color: getContrastColor(color) }}
            >
              {color.toUpperCase()}
            </motion.h2>
            <div 
              className="mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
              style={{ color: getContrastColor(color), borderColor: getContrastColor(color) + "40" }}
            >
              Contrast: {getContrastColor(color) === "#ffffff" ? "Light Text" : "Dark Text"}
            </div>
          </motion.div>

          {/* Controls Panel */}
          <div className="p-8 lg:p-12 space-y-8">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Primary Hue Selector</label>
              <div className="relative h-14 w-full bg-gray-50 rounded-2xl border-4 border-gray-50 overflow-hidden">
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 w-full h-full cursor-pointer bg-transparent border-none scale-110"
                />
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: "HEX", value: color.toUpperCase() },
                { label: "RGB", value: `rgb(${hexToRgb(color)})` },
              ].map((item) => (
                <div key={item.label} className="group">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:border-emerald-200 transition-all">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                      <p className="text-sm font-mono font-bold text-gray-800">{item.value}</p>
                    </div>
                    <button 
                      onClick={() => handleCopy(item.value, item.label)}
                      className={`p-2.5 rounded-xl transition-all ${copied === item.label ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-gray-400 shadow-sm hover:text-emerald-500'}`}
                    >
                      {copied === item.label ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Presets/Tints */}
            <div className="space-y-3">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Opacity Variations</p>
               <div className="flex gap-2 h-10">
                {[1, 0.8, 0.6, 0.4, 0.2].map((op, i) => (
                  <div 
                    key={i}
                    className="flex-1 rounded-xl cursor-pointer hover:ring-2 ring-emerald-500 ring-offset-2 transition-all shadow-inner"
                    style={{ backgroundColor: color, opacity: op }}
                    onClick={() => handleCopy(`${color}${Math.floor(op*255).toString(16).padStart(2, '0')}`, `op-${i}`)}
                  />
                ))}
               </div>
            </div>
          </div>
        </div>

        {/* Pro Insights Dropdown */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-[32px] overflow-hidden">
            <button
              onClick={() => setOpenFAQ(!openFAQ)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-emerald-50/80 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                  <Info size={20} />
                </div>
                <div>
                  <span className="text-sm font-black text-emerald-900 uppercase tracking-wider">How it works</span>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5">Professional Tips</p>
                </div>
              </div>
              <ChevronDown className={`text-emerald-600 transition-transform duration-500 ${openFAQ ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {openFAQ && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-white"
                >
                  <div className="p-8 grid md:grid-cols-2 gap-8 border-t border-emerald-50">
                    <div>
                      <h4 className="text-xs font-black text-gray-900 uppercase mb-2 flex items-center gap-2">
                        <Zap size={14} className="text-emerald-500" /> Precision Picking
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Our studio uses the browser-native EyeDropper API to pick any color from your screen with 100% accuracy.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-900 uppercase mb-2 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" /> WCAG Contrast
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        The tool automatically checks the contrast ratio and suggests whether white or black text will be more readable on your background.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-20">
          <RelatedTools categoryId="utility" />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;