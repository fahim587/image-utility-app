import React, { useState } from "react";
import { UploadCloud, Download, Trash2, RefreshCw, ChevronDown, Type, Move, ImageIcon, Settings2 } from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const AddWatermark = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [watermarkText, setWatermarkText] = useState("Your Watermark");
  const [fontSize, setFontSize] = useState(40);
  const [opacity, setOpacity] = useState(0.5);
  const [color, setColor] = useState("#ffffff");
  const [posX, setPosX] = useState(50); // initial percent
  const [posY, setPosY] = useState(50); // initial percent
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(selected);
      setProcessedImage(null);
    }
  };

  const applyWatermark = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const img = new Image();
      img.src = image;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Watermark settings
      ctx.font = `${fontSize}px Arial`;
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw text based on coordinates
      const textX = (posX / 100) * canvas.width;
      const textY = (posY / 100) * canvas.height;
      ctx.fillText(watermarkText, textX, textY);

      setProcessedImage(canvas.toDataURL(file?.type || "image/png"));
    } catch (err) {
      console.error("Watermark error:", err);
    }
    setLoading(false);
  };

  const reset = () => {
    setImage(null);
    setFile(null);
    setProcessedImage(null);
    setWatermarkText("Your Watermark");
    setPosX(50);
    setPosY(50);
  };

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-12 px-4">
      <h1 className="text-4xl font-black text-center mb-6 text-gray-900 tracking-tight">Image Watermark Tool</h1>

      <div className="max-w-xl mx-auto mb-10">
        <button 
          onClick={() => setShowDirections(!showDirections)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
        >
          <span className="flex items-center gap-2 text-blue-600"><Move size={18}/> How to add text watermark?</span>
          <ChevronDown className={`transition-transform duration-300 ${showDirections ? "rotate-180" : ""}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${showDirections ? "max-h-96 mt-2" : "max-h-0"}`}>
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-xl space-y-3 text-sm text-gray-600">
            <p>• <b>Text:</b> Type your copyright text or brand name.</p>
            <p>• <b>Placement:</b> Use Position sliders to move text anywhere on the photo.</p>
            <p>• <b>Styling:</b> Adjust size, opacity, and color like a professional snipping tool.</p>
            <p>• <b>Download:</b> Apply the watermark and save your protected photo.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-gray-100 rounded-[2.5rem] overflow-hidden h-[500px] relative flex items-center justify-center border-2 border-dashed border-gray-200 shadow-inner">
          {image ? (
            <div className="relative w-full h-full p-8 flex items-center justify-center overflow-hidden">
              <img src={image} alt="Preview" className="max-w-full max-h-full rounded-lg shadow-2xl object-contain" />
              <div 
                className="absolute pointer-events-none select-none font-bold text-center"
                style={{ 
                  fontSize: `${fontSize / 4}px`, 
                  color: color, 
                  opacity: opacity,
                  fontFamily: 'Arial',
                  left: `${posX}%`,
                  top: `${posY}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {watermarkText}
              </div>
              <button onClick={reset} className="absolute top-6 right-6 bg-white shadow-lg text-red-500 p-3 rounded-2xl hover:bg-red-50 transition-all">
                <Trash2 size={22} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer h-full w-full bg-white group">
              <div className="bg-blue-50 p-10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <Type size={64} className="text-blue-500" />
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              <span className="text-2xl font-bold text-gray-800">Upload Image to Snip Text On</span>
              <p className="text-gray-400 mt-2">Add custom text to any location</p>
            </label>
          )}
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-3 text-lg">
              <Settings2 size={18} className="text-blue-600"/> Text Settings
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Watermark Text</label>
                <input 
                  type="text" 
                  value={watermarkText} 
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter text..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>Width % (X)</span>
                  <span className="text-blue-600">{posX}%</span>
                </div>
                <input type="range" min="0" max="100" value={posX} onChange={(e) => setPosX(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-blue-600"/>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>Height % (Y)</span>
                  <span className="text-blue-600">{posY}%</span>
                </div>
                <input type="range" min="0" max="100" value={posY} onChange={(e) => setPosY(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-blue-600"/>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>Font Size</span>
                  <span className="text-blue-600">{fontSize}px</span>
                </div>
                <input type="range" min="10" max="200" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-blue-600"/>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>Opacity</span>
                  <span className="text-blue-600">{Math.round(opacity * 100)}%</span>
                </div>
                <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-blue-600"/>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600">Color</label>
                <div className="flex gap-2 relative">
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full rounded-lg cursor-pointer bg-transparent border-none"/>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16}/>
                </div>
              </div>
            </div>

            <button 
              onClick={applyWatermark} 
              disabled={!image || loading} 
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" /> : "Apply Text"}
            </button>
          </div>

          {processedImage && (
            <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 animate-in slide-in-from-right-4 shadow-sm">
              <a 
                href={processedImage} 
                download={`${file?.name.split('.')[0] || 'image'}-snip.png`} 
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl w-full font-bold hover:bg-green-700 transition-all shadow-lg"
              >
                <Download size={20} /> Download Result
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mt-20">
        <RelatedTools categoryId="image" />
      </div>
    </div>
  );
};

export default AddWatermark;