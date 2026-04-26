import React, { useState } from "react";
import { UploadCloud, Download, Trash2, RefreshCw, ChevronDown, FlipHorizontal, FlipVertical, Move, ImageIcon } from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const FlipImage = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
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
      setFlipX(false);
      setFlipY(false);
    }
  };

  const processFlip = async () => {
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

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      setProcessedImage(canvas.toDataURL(file?.type || "image/png"));
    } catch (err) {
      console.error("Flip error:", err);
    }
    setLoading(false);
  };

  const reset = () => {
    setImage(null);
    setFile(null);
    setProcessedImage(null);
    setFlipX(false);
    setFlipY(false);
  };

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-12 px-4">
      <h1 className="text-4xl font-black text-center mb-6 text-blue-600 tracking-tight">Image Flip Tool</h1>

      {/* Directions */}
      <div className="max-w-xl mx-auto mb-10">
        <button 
          onClick={() => setShowDirections(!showDirections)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
        >
          <span className="flex items-center gap-2 text-blue-600"><Move size={18}/> How to flip an image?</span>
          <ChevronDown className={`transition-transform duration-300 ${showDirections ? "rotate-180" : ""}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${showDirections ? "max-h-96 mt-2" : "max-h-0"}`}>
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-xl space-y-3 text-sm text-gray-600">
            <p>• <b>Horizontal Flip:</b> Mirror your image from left to right.</p>
            <p>• <b>Vertical Flip:</b> Mirror your image from top to bottom.</p>
            <p>• <b>Real-time Preview:</b> See changes instantly in the viewer.</p>
            <p>• <b>Export:</b> Click "Apply Flip" and download your result.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* VIEWPORT */}
        <div className="lg:col-span-3 bg-[#1a1a1a] rounded-[2.5rem] overflow-hidden h-[500px] relative flex items-center justify-center border border-gray-800 shadow-2xl">
          {image ? (
            <div className="relative w-full h-full p-8 flex items-center justify-center">
              <img 
                src={image} 
                alt="Preview" 
                style={{ transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})` }}
                className="max-w-full max-h-full rounded-lg transition-transform duration-500 object-contain shadow-2xl" 
              />
              <button onClick={reset} className="absolute top-6 right-6 bg-white/10 backdrop-blur text-white p-3 rounded-2xl border border-white/20 hover:bg-red-500 transition-all">
                <Trash2 size={22} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer h-full w-full bg-white group">
              <div className="bg-blue-50 p-10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <FlipHorizontal size={64} className="text-blue-500" />
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              <span className="text-2xl font-bold text-gray-800">Upload Image to Flip</span>
              <p className="text-gray-400 mt-2">Instant mirror effect preview</p>
            </label>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-3 text-lg">
              <ImageIcon size={18} className="text-blue-600"/> Flip Options
            </h2>

            <div className="space-y-3">
              <button 
                onClick={() => setFlipX(!flipX)} 
                className={`w-full py-4 px-4 rounded-xl border font-bold flex items-center justify-between transition-all ${flipX ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100"}`}
              >
                <span className="flex items-center gap-2"><FlipHorizontal size={20}/> Horizontal</span>
                <div className={`w-4 h-4 rounded-full border-2 ${flipX ? "bg-white border-white" : "border-gray-300"}`}></div>
              </button>

              <button 
                onClick={() => setFlipY(!flipY)} 
                className={`w-full py-4 px-4 rounded-xl border font-bold flex items-center justify-between transition-all ${flipY ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100"}`}
              >
                <span className="flex items-center gap-2"><FlipVertical size={20}/> Vertical</span>
                <div className={`w-4 h-4 rounded-full border-2 ${flipY ? "bg-white border-white" : "border-gray-300"}`}></div>
              </button>
            </div>

            <button 
              onClick={processFlip} 
              disabled={!image || loading} 
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" /> : "Apply Flip"}
            </button>
          </div>

          {processedImage && (
            <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 animate-in slide-in-from-right-4 shadow-sm">
              <a 
                href={processedImage} 
                download={`${file?.name.split('.')[0] || 'image'}-flipped.png`} 
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

export default FlipImage;