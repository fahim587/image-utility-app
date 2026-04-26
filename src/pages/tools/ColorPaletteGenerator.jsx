import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Upload, Palette, Copy, RefreshCw, 
  ImageIcon, CheckCircle2, Loader2, Info, ChevronDown, ChevronUp 
} from 'lucide-react';
import RelatedTools from "../../components/RelatedTools";

export default function ColorPaletteGenerator() {
  const [image, setImage] = useState(null);
  const [palette, setPalette] = useState([]);
  const [copyStatus, setCopyStatus] = useState(null);
  const [isLibLoaded, setIsLibLoaded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const imgRef = useRef(null);

  // Load ColorThief Engine safely
  useEffect(() => {
    if (window.ColorThief) {
      Promise.resolve().then(() => setIsLibLoaded(true));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js";
    script.async = true;
    script.onload = () => setIsLibLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setPalette([]); 
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColors = () => {
    if (!window.ColorThief || !imgRef.current) return;
    const colorThief = new window.ColorThief();
    const img = imgRef.current;

    if (img.complete) {
      getPalette(colorThief, img);
    } else {
      img.onload = () => getPalette(colorThief, img);
    }
  };

  const getPalette = (thief, img) => {
    try {
      // Updated to extract 20 colors as requested
      const colors = thief.getPalette(img, 20);
      const hexColors = colors.map(rgb => {
        return "#" + rgb.map(x => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        }).join("");
      });
      setPalette(hexColors);
    } catch (err) {
      console.error("Extraction error:", err);
    }
  };

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopyStatus(hex);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
      <Helmet>
        <title>Color Palette Generator | GOOGIZ</title>
      </Helmet>

      <div className="text-center">
        <h1 className="text-5xl font-black text-slate-900 mb-4 flex items-center justify-center gap-3">
          <Palette className="text-blue-600" size={48} /> Palette Generator
        </h1>
      </div>

      {/* How to use Dropdown */}
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all"
        >
          <span className="font-bold flex items-center gap-2 text-slate-700">
            <Info size={20} className="text-blue-600"/> How to generate palette?
          </span>
          {showInstructions ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
        </button>
        
        <div className={`overflow-hidden transition-all duration-300 ${showInstructions ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-5 bg-blue-50/50 border-x border-b border-slate-200 rounded-b-2xl text-sm text-slate-600 leading-relaxed">
            <ul className="list-disc list-inside space-y-1 font-medium">
              <li>Click the upload area to select an image (JPG/PNG).</li>
              <li>The tool analyzes image pixels using ColorThief engine.</li>
              <li>Up to **20 dominant colors** will be extracted automatically.</li>
              <li>Scroll through the list and click the **Copy icon** to save HEX codes.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side: Upload */}
        <div className="space-y-6">
          <div className="border-4 border-dashed rounded-[2.5rem] p-12 text-center bg-slate-50 relative group hover:border-blue-400 transition-all">
            {image ? (
              <img 
                ref={imgRef}
                src={image} 
                alt="Source" 
                className="max-h-80 mx-auto rounded-2xl shadow-2xl"
                onLoad={extractColors}
                crossOrigin="anonymous"
              />
            ) : (
              <div className="py-10">
                <ImageIcon size={60} className="mx-auto mb-4 text-blue-200" />
                <p className="text-xl font-bold text-slate-700">Click or Drop Image</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleImageUpload} 
            />
          </div>

          {image && (
             <button 
               onClick={() => {setImage(null); setPalette([]);}}
               className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-50 hover:text-rose-500 transition-all"
             >
               <RefreshCw size={20} /> Reset Tool
             </button>
          )}
        </div>

        {/* Right Side: Results (Scrollable for 20 colors) */}
        <div className="bg-slate-900 rounded-[3.5rem] p-8 flex flex-col shadow-2xl min-h-100 max-h-[650px]">
          <h3 className="text-white/40 uppercase text-[10px] font-black tracking-widest mb-6 text-center">Extracted Palette (20 Colors)</h3>
          
          {!isLibLoaded ? (
            <div className="m-auto text-white flex items-center gap-2 font-bold">
              <Loader2 className="animate-spin text-blue-500" /> Booting Engine...
            </div>
          ) : palette.length > 0 ? (
            <div className="space-y-3 flex-1 overflow-y-auto pr-3 custom-scrollbar">
              {palette.map((hex, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform" style={{ backgroundColor: hex }} />
                    <span className="text-white font-mono text-lg font-black uppercase tracking-wider">{hex}</span>
                  </div>
                  
                  <button 
                    onClick={() => copyToClipboard(hex)}
                    className={`p-3 rounded-xl transition-all ${copyStatus === hex ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white/10 text-white hover:bg-blue-600'}`}
                  >
                    {copyStatus === hex ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="m-auto text-center opacity-20">
              <Palette size={80} className="mx-auto text-white mb-4" />
              <p className="text-white text-xs font-bold uppercase tracking-widest">Awaiting Analysis</p>
            </div>
          )}
        </div>
      </div>

      <RelatedTools categoryId="image" />
    </div>
  );
}