import React, { useState } from "react";
import { UploadCloud, Download, Trash2, RefreshCw, ChevronDown, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Move } from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const RotateImage = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [rotatedImage, setRotatedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(selected);
      setRotatedImage(null);
      setRotation(0);
      setFlipX(false);
      setFlipY(false);
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

      const angleInRad = (rotation * Math.PI) / 180;
      const width = img.width;
      const height = img.height;

      // Calculate new canvas size after rotation
      const sin = Math.abs(Math.sin(angleInRad));
      const cos = Math.abs(Math.cos(angleInRad));
      canvas.width = width * cos + height * sin;
      canvas.height = width * sin + height * cos;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angleInRad);
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      ctx.drawImage(img, -width / 2, -height / 2);

      setRotatedImage(canvas.toDataURL(file?.type || "image/png"));
    } catch (err) {
      console.error("Processing error:", err);
    }
    setLoading(false);
  };

  const reset = () => {
    setImage(null);
    setFile(null);
    setRotatedImage(null);
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
  };

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-12 px-4">
      <h1 className="text-4xl font-black text-center mb-6 text-blue-600 tracking-tight">Image Rotate</h1>

      <div className="max-w-xl mx-auto mb-10">
        <button 
          onClick={() => setShowDirections(!showDirections)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
        >
          <span className="flex items-center gap-2 text-blue-600"><Move size={18}/> How to use this tool?</span>
          <ChevronDown className={`transition-transform duration-300 ${showDirections ? "rotate-180" : ""}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${showDirections ? "max-h-96 mt-2" : "max-h-0"}`}>
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-xl space-y-3 text-sm text-gray-600">
            <p>• <b>Rotate:</b> Click the rotate buttons to turn the image 90° or use the slider.</p>
            <p>• <b>Flip:</b> Use Horizontal or Vertical flip to mirror the image.</p>
            <p>• <b>Apply:</b> Click "Process Image" to generate the final result.</p>
            <p>• <b>Save:</b> Use the download button to save your edited photo.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-[#1e1e1e] rounded-[2.5rem] overflow-hidden h-[500px] relative flex items-center justify-center border border-gray-800 shadow-2xl">
          {image ? (
            <div className="relative w-full h-full p-8 flex items-center justify-center overflow-hidden">
              <img 
                src={image} 
                alt="Preview" 
                style={{ transform: `rotate(${rotation}deg) scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})` }}
                className="max-w-full max-h-full rounded-lg shadow-2xl transition-transform duration-300 object-contain" 
              />
              <button onClick={reset} className="absolute top-6 right-6 bg-white/10 backdrop-blur text-white p-3 rounded-2xl border border-white/20 hover:bg-red-500 transition-all">
                <Trash2 size={22} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer group h-full w-full bg-white">
              <div className="bg-blue-50 p-10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <RotateCw size={64} className="text-blue-500" />
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              <span className="text-2xl font-bold text-gray-800">Upload Image to Rotate</span>
            </label>
          )}
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-3 text-lg">
              <RotateCw size={18} className="text-blue-600"/> Adjust Image
            </h2>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rotation Controls</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setRotation(r => r - 90)} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 flex flex-col items-center gap-1 font-bold text-gray-600 border border-gray-100">
                  <RotateCcw size={20} /> <span className="text-[10px]">-90°</span>
                </button>
                <button onClick={() => setRotation(r => r + 90)} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 flex flex-col items-center gap-1 font-bold text-gray-600 border border-gray-100">
                  <RotateCw size={20} /> <span className="text-[10px]">+90°</span>
                </button>
              </div>
              <input 
                type="range" min="0" max="360" value={rotation % 360} 
                onChange={(e) => setRotation(parseInt(e.target.value))} 
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Flip Controls</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setFlipX(!flipX)} className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${flipX ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100"}`}>
                  <FlipHorizontal size={20} /> Horizontal
                </button>
                <button onClick={() => setFlipY(!flipY)} className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${flipY ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100"}`}>
                  <FlipVertical size={20} /> Vertical
                </button>
              </div>
            </div>

            <button 
              onClick={processImage} 
              disabled={!image || loading} 
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" /> : "Process Image"}
            </button>
          </div>

          {rotatedImage && (
            <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 animate-in slide-in-from-right-4 shadow-sm">
              <a 
                href={rotatedImage} 
                download={`${file?.name.split('.')[0] || 'image'}-rotated.png`} 
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

export default RotateImage;