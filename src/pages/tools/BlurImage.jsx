import React, { useRef, useState, useEffect, useCallback } from "react";
import { Download, Plus, ChevronDown, HelpCircle, ScanEye, Settings2, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { Rnd } from "react-rnd";
import * as faceapi from "face-api.js";
import RelatedTools from "../../components/RelatedTools";

const BlurImage = () => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [blurAreas, setBlurAreas] = useState([]);
  const [blurLevel, setBlurLevel] = useState(15);
  const [mode, setMode] = useState("blur");
  const [showDirections, setShowDirections] = useState(false);

  // 1️⃣ Load AI models
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Updated path to ensure it finds models in the public folder
        const MODEL_URL = `${window.location.origin}/models`; 
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setIsModelLoading(false);
        console.log("AI Models Loaded!");
      } catch (err) {
        console.error("Model loading failed:", err);
        setIsModelLoading(false);
      }
    };
    loadModels();
  }, []);

  // 2️⃣ Pixelate logic
  const pixelate = useCallback((ctx, area) => {
    const size = Math.max(2, Math.floor(blurLevel / 2));
    for (let y = area.y; y < area.y + area.height; y += size) {
      for (let x = area.x; x < area.x + area.width; x += size) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        ctx.fillStyle = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
        ctx.fillRect(x, y, size, size);
      }
    }
  }, [blurLevel]);

  // 3️⃣ Draw canvas with image and blur areas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    blurAreas.forEach((area) => {
      ctx.save();
      if (mode === "pixel") {
        pixelate(ctx, area);
      } else {
        ctx.filter = `blur(${blurLevel}px)`;
        ctx.drawImage(img, area.x, area.y, area.width, area.height, area.x, area.y, area.width, area.height);
      }
      ctx.restore();
    });
  }, [blurAreas, blurLevel, mode, pixelate]);

  // 4️⃣ Redraw on state changes
  useEffect(() => {
    if (isLoaded) {
      drawCanvas();
    }
  }, [isLoaded, blurAreas, blurLevel, mode, drawCanvas]);

  // 5️⃣ Upload image
  const uploadImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;

    img.onload = () => {
      imgRef.current = img;
      setBlurAreas([]);
      setIsLoaded(true);
      setTimeout(drawCanvas, 50);
    };
  };

  // 6️⃣ AI Auto Face Detection
  const detectFaces = async () => {
    if (!imgRef.current || isModelLoading) return;

    try {
      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.1 });
      const detections = await faceapi.detectAllFaces(imgRef.current, options);

      if (!detections || !detections.length) {
        alert("AI could not detect any faces. Try a clearer image or add manually.");
        return;
      }

      const boxes = detections.map(d => ({
        x: d.box.x,
        y: d.box.y,
        width: d.box.width,
        height: d.box.height
      }));

      setBlurAreas(boxes);
    } catch (err) {
      console.error("AI Detection Error:", err);
    }
  };

  // 7️⃣ Download canvas
  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `BlurImage-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 pt-24 md:pt-32 font-sans text-gray-800 min-h-screen">
      {/* Header - Centered Title */}
      <div className="flex flex-col items-center text-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Pro <span className="text-blue-600">Privacy</span> Tool
          </h1>
          <p className="text-gray-500 font-medium">Professional AI face masking and data blurring</p>
        </div>
        <button 
          onClick={() => setShowDirections(!showDirections)} 
          className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-2xl font-bold border border-gray-200 transition-all"
        >
          <HelpCircle size={18} className="text-blue-600" /> How to use?
          <ChevronDown className={`transition-transform ${showDirections ? "rotate-180" : ""}`} />
        </button>
      </div>

      {showDirections && (
        <div className="max-w-4xl mx-auto mb-10 p-6 bg-blue-50 border border-blue-100 rounded-3xl text-sm text-blue-900 shadow-sm">
          <ul className="list-disc list-inside space-y-2 font-medium">
            <li>Upload an image to start editing.</li>
            <li>Use <b>AI AUTO DETECT</b> to find faces automatically.</li>
            <li>Use <b>MANUAL AREA</b> to add custom blur boxes.</li>
            <li>Resize or drag boxes to cover specific information.</li>
            <li>Adjust <b>Intensity</b> and <b>Mode</b> from the control panel.</li>
          </ul>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-10">
        {/* Canvas Area */}
        <div className="lg:col-span-3 bg-gray-50 rounded-[3rem] border-4 border-gray-100 shadow-inner min-h-[600px] flex items-center justify-center relative overflow-auto p-6">
          {isLoaded ? (
            <div className="relative inline-block shadow-2xl rounded-xl" style={{ lineHeight: 0 }}>
              <canvas ref={canvasRef} className="rounded-xl block max-w-full h-auto shadow-lg" />
              {blurAreas.map((area, i) => (
                <Rnd
                  key={i}
                  size={{ width: area.width, height: area.height }}
                  position={{ x: area.x, y: area.y }}
                  onDragStop={(e, d) => {
                    const newAreas = [...blurAreas];
                    newAreas[i] = { ...newAreas[i], x: d.x, y: d.y };
                    setBlurAreas(newAreas);
                    drawCanvas();
                  }}
                  onResizeStop={(e, dir, ref, delta, pos) => {
                    const newAreas = [...blurAreas];
                    newAreas[i] = { x: pos.x, y: pos.y, width: parseInt(ref.style.width), height: parseInt(ref.style.height) };
                    setBlurAreas(newAreas);
                    drawCanvas();
                  }}
                  bounds="parent"
                  className="border-2 border-blue-500 bg-blue-500/10 cursor-move group z-10"
                >
                  <button 
                    onClick={() => { setBlurAreas(blurAreas.filter((_, idx) => idx !== i)); drawCanvas(); }} 
                    className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                  >
                    <Trash2 size={14} />
                  </button>
                </Rnd>
              ))}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer text-center group bg-white p-16 rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-blue-200 transition-all">
              <div className="p-8 bg-blue-600 rounded-3xl mb-8 group-hover:scale-110 transition-transform shadow-2xl shadow-blue-200">
                <ImageIcon size={64} className="text-white" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">Initialize Editor</h3>
              <p className="text-gray-400 font-bold">Select an image to start blurring</p>
              <input type="file" hidden onChange={uploadImage} accept="image/*" />
            </label>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl space-y-8 sticky top-10">
            <h2 className="font-black text-gray-900 flex items-center gap-2 border-b pb-4 uppercase text-xs tracking-widest">
              <Settings2 size={16} className="text-blue-600" /> Control Panel
            </h2>

            <div className="space-y-4">
              <button 
                onClick={detectFaces} 
                disabled={!isLoaded || isModelLoading} 
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white py-5 rounded-[1.25rem] font-black transition-all shadow-xl active:scale-95"
              >
                {isModelLoading ? <Loader2 className="animate-spin" /> : <ScanEye size={22} />} AI AUTO DETECT
              </button>

              <button 
                onClick={() => { setBlurAreas([...blurAreas, { x: 50, y: 50, width: 150, height: 150 }]); drawCanvas(); }} 
                disabled={!isLoaded} 
                className="w-full flex items-center justify-center gap-3 bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-100 py-5 rounded-[1.25rem] font-black transition-all active:scale-95"
              >
                <Plus size={22} /> MANUAL AREA
              </button>
            </div>

            <div className="space-y-6 pt-4">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Blur Mode</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1.5 rounded-2xl">
                  <button onClick={() => setMode("blur")} className={`py-2 text-xs font-bold rounded-xl transition-all ${mode === "blur" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>Smooth</button>
                  <button onClick={() => setMode("pixel")} className={`py-2 text-xs font-bold rounded-xl transition-all ${mode === "pixel" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>Pixel</button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Intensity <span className="text-blue-600">{blurLevel}px</span>
                </div>
                <input type="range" min="2" max="60" value={blurLevel} onChange={(e) => setBlurLevel(parseInt(e.target.value))} className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>
            </div>

            <button onClick={download} disabled={!isLoaded} className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white py-5 rounded-[1.25rem] font-black transition-all shadow-2xl uppercase tracking-wider">
              <Download size={22} /> Export Image
            </button>
          </div>
        </div>
      </div>

      {/* Related Tools Section - Full Width Bottom */}
      <div className="mt-20 border-t border-gray-100 pt-16">
        <RelatedTools categoryId="image" />
      </div>
    </div>
  );
};

export default BlurImage;