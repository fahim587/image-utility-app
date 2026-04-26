import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { UploadCloud, Download, Trash2, Crop, RefreshCw, ChevronDown, Move, Target, FlipHorizontal, FlipVertical, RotateCw } from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const CropImage = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(null); // default null মানেই ইচ্ছেমতো ছোট-বড় করা যাবে
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(selected);
      setCroppedImage(null);
    }
  };

  const cropImage = async () => {
    if (!image || !croppedAreaPixels) return;
    setLoading(true);
    
    try {
      const img = new Image();
      img.src = image;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.save();
      
      // Flip logic
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      ctx.restore();
      setCroppedImage(canvas.toDataURL(file?.type || "image/png"));
    } catch (err) {
      console.error("Crop error:", err);
    }
    setLoading(false);
  };

  const reset = () => {
    setImage(null);
    setFile(null);
    setCroppedImage(null);
    setZoom(1);
    setRotation(0);
    setAspect(null);
    setFlipX(false);
    setFlipY(false);
  };

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-12 px-4">
      <h1 className="text-4xl font-black text-center mb-6 text-blue-600 tracking-tight">Advanced Crop Tool</h1>

      

      <div className="grid lg:grid-cols-4 gap-8">
        {/* VIEWPORT */}
        <div className="lg:col-span-3 bg-[#1e1e1e] rounded-[2.5rem] overflow-hidden h-[600px] relative shadow-2xl border border-gray-800">
          {image ? (
            <>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect} // null থাকলে ইচ্ছেমতো ড্র্যাগ করা যায়
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                showGrid={true}
              />
              <button onClick={reset} className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur text-white p-3 rounded-2xl border border-white/20 hover:bg-red-500 transition-all">
                <Trash2 size={22} />
              </button>
            </>
          ) : (
            <label className="flex flex-col items-center justify-center h-full cursor-pointer bg-white group">
              <div className="bg-blue-50 p-10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud size={64} className="text-blue-500" />
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              <span className="text-2xl font-bold text-gray-800">Choose Image File</span>
              <p className="text-gray-400 mt-2">Free dragging enabled</p>
            </label>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-3 text-lg">
              <Crop size={18} className="text-blue-600"/> Crop Settings
            </h2>

            {/* Aspect Ratio Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Free", value: "free" },
                  { label: "1:1", value: 1 },
                  { label: "4:3", value: 4/3 },
                  { label: "16:9", value: 16/9 }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setAspect(opt.value === "free" ? null : opt.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      (aspect === opt.value || (opt.value === "free" && aspect === null))
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                        : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Size & Position */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Width</label>
                <div className="p-3 bg-gray-50 rounded-xl font-mono text-sm font-bold text-blue-600">{Math.round(croppedAreaPixels?.width || 0)}px</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Height</label>
                <div className="p-3 bg-gray-50 rounded-xl font-mono text-sm font-bold text-blue-600">{Math.round(croppedAreaPixels?.height || 0)}px</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Pos X</label>
                <div className="p-3 bg-gray-50 rounded-xl font-mono text-xs text-gray-400">{Math.round(croppedAreaPixels?.x || 0)}</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Pos Y</label>
                <div className="p-3 bg-gray-50 rounded-xl font-mono text-xs text-gray-400">{Math.round(croppedAreaPixels?.y || 0)}</div>
              </div>
            </div>

            {/* Zoom & Rotate */}
            <div className="space-y-4 pt-2">
               <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-600 "><span>Zoom</span><span>{Math.round(zoom * 100)}%</span></div>
                  <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-blue-600"/>
               </div>
               <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-600 "><span>Rotate</span><span>{rotation}°</span></div>
                  <input type="range" min={0} max={360} value={rotation} onChange={(e) => setRotation(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-blue-600"/>
               </div>
            </div>

            <button onClick={cropImage} disabled={!image || loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-100 flex items-center justify-center gap-2">
              {loading ? <RefreshCw className="animate-spin" /> : <>Crop Image <Target size={20}/></>}
            </button>
          </div>

          {croppedImage && (
            <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 animate-in slide-in-from-right-4 shadow-sm">
              <a href={croppedImage} download="cropped.png" className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl w-full font-bold hover:bg-green-700 transition-all shadow-lg">
                <Download size={20} /> Download Result
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mt-20">
        {/* How to use Dropdown */}
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
            <p>• <b>Upload:</b> Click the center box to choose an image.</p>
            <p>• <b>Scaling:</b> Use "Free" mode to drag corners and resize manually.</p>
            <p>• <b>Rotation:</b> Use the sliders to adjust zoom or orientation.</p>
            <p>• <b>Download:</b> Click "Crop Image" and then the green button to save.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8"></div>
        <RelatedTools categoryId="image" />
      </div>
    </div>
  );
};

export default CropImage;