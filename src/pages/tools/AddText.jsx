import React, { useState } from "react";
import { UploadCloud, Download, Trash2, RefreshCw, ChevronDown, Type, Move, Settings2, Palette } from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const AddText = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [text, setText] = useState("Type Your Message");
  const [fontSize, setFontSize] = useState(50);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(1);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
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

  const processImage = async () => {
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

      ctx.drawImage(img, 0, 0);

      ctx.save();
      const responsiveFontSize = (fontSize * canvas.width) / 1000;
      ctx.font = `bold ${responsiveFontSize}px Arial`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const x = (posX / 100) * canvas.width;
      const y = (posY / 100) * canvas.height;
      
      ctx.fillText(text, x, y);
      ctx.restore();

      setProcessedImage(canvas.toDataURL(file?.type || "image/png"));
    } catch (err) {
      console.error("Error adding text:", err);
    }
    setLoading(false);
  };

  const reset = () => {
    setImage(null);
    setFile(null);
    setProcessedImage(null);
    setText("Type Your Message");
    setPosX(50);
    setPosY(50);
    setOpacity(1);
  };

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-12 px-4 font-sans">
      <h1 className="text-4xl font-black text-center mb-6 text-gray-900 tracking-tight">Add Text to Photo</h1>

      <div className="max-w-xl mx-auto mb-10">
        <button 
          onClick={() => setShowDirections(!showDirections)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
        >
          <span className="flex items-center gap-2 text-blue-600"><Move size={18}/> Quick Guide</span>
          <ChevronDown className={`transition-transform duration-300 ${showDirections ? "rotate-180" : ""}`} />
        </button>
        {showDirections && (
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-xl mt-2 space-y-3 text-sm text-gray-600">
            <p>• <b>Text:</b> Enter the text and position it anywhere.</p>
            <p>• <b>Opacity:</b> Use the transparency slider for a subtle look.</p>
            <p>• <b>Apply:</b> Click process to bake the text into your photo.</p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-gray-900 rounded-[2.5rem] overflow-hidden h-[550px] relative flex items-center justify-center border-4 border-gray-800 shadow-2xl">
          {image ? (
            <div className="relative w-full h-full p-8 flex items-center justify-center overflow-hidden">
              <img src={image} alt="Preview" className="max-w-full max-h-full rounded-lg object-contain shadow-2xl" />
              <div 
                className="absolute pointer-events-none select-none font-bold text-center drop-shadow-lg"
                style={{ 
                  fontSize: `${fontSize / 10}vw`, 
                  color: color, 
                  opacity: opacity,
                  left: `${posX}%`,
                  top: `${posY}%`,
                  transform: 'translate(-50%, -50%)',
                  fontFamily: 'Arial',
                  maxWidth: '90%'
                }}
              >
                {text}
              </div>
              <button onClick={reset} className="absolute top-6 right-6 bg-white/10 backdrop-blur-md text-white p-3 rounded-2xl border border-white/20 hover:bg-red-500 transition-all">
                <Trash2 size={22} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer h-full w-full bg-white group">
              <div className="bg-blue-50 p-10 rounded-full mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-50">
                <Type size={64} className="text-blue-600" />
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              <span className="text-2xl font-bold text-gray-800">Upload Image</span>
            </label>
          )}
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
              <Settings2 size={18} className="text-blue-600"/> Text Settings
            </h2>

            <div className="space-y-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="space-y-2">
                <label>Input Text</label>
                <input 
                  type="text" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between"><span>Transparency</span> <span className="text-blue-600">{Math.round(opacity * 100)}%</span></div>
                <input type="range" min="0.1" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-blue-600 cursor-pointer"/>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between"><span>Font Size</span> <span className="text-blue-600">{fontSize}px</span></div>
                <input type="range" min="10" max="300" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-blue-600 cursor-pointer"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <span>Pos X ({posX}%)</span>
                  <input type="range" min="0" max="100" value={posX} onChange={(e) => setPosX(parseInt(e.target.value))} className="w-full h-1 appearance-none bg-gray-100 accent-blue-600 rounded-full"/>
                </div>
                <div className="space-y-2">
                  <span>Pos Y ({posY}%)</span>
                  <input type="range" min="0" max="100" value={posY} onChange={(e) => setPosY(parseInt(e.target.value))} className="w-full h-1 appearance-none bg-gray-100 accent-blue-600 rounded-full"/>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2"><Palette size={14}/> Text Color</label>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer bg-transparent border-none"/>
              </div>
            </div>

            <button 
              onClick={processImage} 
              disabled={!image || loading} 
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" /> : "Apply Text"}
            </button>
          </div>

          {processedImage && (
            <div className="bg-white p-4 rounded-[2rem] border border-green-200 shadow-sm animate-in slide-in-from-right-4">
              <a 
                href={processedImage} 
                download="text-added.png" 
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl w-full font-bold hover:bg-green-700 transition-all text-sm uppercase"
              >
                <Download size={18} /> Download Result
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

export default AddText; 