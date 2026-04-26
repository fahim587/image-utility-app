import React, { useRef, useState, useEffect, useCallback } from "react";
import { Download, Image as ImageIcon, ChevronDown, HelpCircle, RotateCcw } from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const ImageFilters = () => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  // Filter states
  const [brightness, setBrightness] = useState(100); // %
  const [contrast, setContrast] = useState(100); // %
  const [saturation, setSaturation] = useState(100); // %
  const [grayscale, setGrayscale] = useState(0); // %
  const [sepia, setSepia] = useState(0); // %
  const [invert, setInvert] = useState(0); // %
  const [blur, setBlur] = useState(0); // px
  const [hueRotate, setHueRotate] = useState(0); // deg
  const [opacity, setOpacity] = useState(100); // %

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(0);
    setSepia(0);
    setInvert(0);
    setBlur(0);
    setHueRotate(0);
    setOpacity(100);
  };

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;

    // Apply CSS-like filter string
    ctx.filter = `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
      grayscale(${grayscale}%)
      sepia(${sepia}%)
      invert(${invert}%)
      blur(${blur}px)
      hue-rotate(${hueRotate}deg)
      opacity(${opacity}%)
    `;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, [brightness, contrast, saturation, grayscale, sepia, invert, blur, hueRotate, opacity]);

  useEffect(() => {
    if (isLoaded) {
      drawCanvas();
    }
  }, [isLoaded, drawCanvas, brightness, contrast, saturation, grayscale, sepia, invert, blur, hueRotate, opacity]);

  const uploadImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;

    img.onload = () => {
      imgRef.current = img;
      setIsLoaded(true);
      setTimeout(drawCanvas, 50);
    };
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    // Shortened file name using minutes and seconds
    const time = new Date().toLocaleTimeString().replace(/:/g, "-");
    link.download = `Filtered-${time}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-12 px-4">
      <div className="flex flex-col items-center mb-10 gap-4">
        <h1 className="text-4xl font-black text-center text-gray-900 tracking-tight">Image Filter Tool</h1>
        <button 
          onClick={() => setShowDirections(!showDirections)}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg font-bold border border-gray-200 transition-all shadow-sm text-sm"
        >
          <HelpCircle size={16} className="text-blue-600" /> How to use?
          <ChevronDown size={16} className={`transition-transform ${showDirections ? "rotate-180" : ""}`} />
        </button>
      </div>

      {showDirections && (
        <div className="mb-8 p-5 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-900 leading-relaxed shadow-sm">
          <p className="font-bold mb-2">Instructions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Select an image from your device to start.</li>
            <li>Adjust the sliders on the right to apply various visual filters.</li>
            <li>Preview the changes instantly on the main canvas area.</li>
            <li>Click "Export Image" to download your edited photo.</li>
          </ul>
        </div>
      )}

      {!isLoaded ? (
        <label className="flex flex-col items-center justify-center cursor-pointer text-center bg-gray-100 p-16 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all">
          <div className="p-8 bg-blue-600 rounded-3xl mb-4">
            <ImageIcon size={64} className="text-white" />
          </div>
          <span className="font-bold text-gray-700">Select an image</span>
          <input type="file" hidden onChange={uploadImage} accept="image/*" />
        </label>
      ) : (
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Canvas area (Thumbnail) */}
          <div className="lg:col-span-3 bg-gray-50 rounded-2xl p-4 flex items-center justify-center border border-gray-200 shadow-inner min-h-[500px]">
            <canvas ref={canvasRef} className="rounded-xl shadow-lg max-w-full h-auto block" />
          </div>

          {/* Controls sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xl overflow-y-auto max-h-[600px]">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Settings</span>
                <button onClick={resetFilters} className="text-blue-600 flex items-center gap-1 text-xs font-bold hover:underline">
                  <RotateCcw size={12} /> Reset
                </button>
              </div>
              <FilterSlider label="Brightness" value={brightness} setValue={setBrightness} min={0} max={200} />
              <FilterSlider label="Contrast" value={contrast} setValue={setContrast} min={0} max={200} />
              <FilterSlider label="Saturation" value={saturation} setValue={setSaturation} min={0} max={200} />
              <FilterSlider label="Grayscale" value={grayscale} setValue={setGrayscale} min={0} max={100} />
              <FilterSlider label="Sepia" value={sepia} setValue={setSepia} min={0} max={100} />
              <FilterSlider label="Invert" value={invert} setValue={setInvert} min={0} max={100} />
              <FilterSlider label="Hue Rotate" value={hueRotate} setValue={setHueRotate} min={0} max={360} unit="deg" />
              <FilterSlider label="Opacity" value={opacity} setValue={setOpacity} min={0} max={100} />
              <FilterSlider label="Blur" value={blur} setValue={setBlur} min={0} max={20} unit="px" />
            </div>

            <button
              onClick={download}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95"
            >
              <Download size={20} /> Export Image
            </button>
          </div>
        </div>
      )}

      <div className="mt-20 border-t pt-10">
        <RelatedTools categoryId="image" />
      </div>
    </div>
  );
};

// Slider component
const FilterSlider = ({ label, value, setValue, min, max, unit = "%" }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-bold text-gray-600 uppercase tracking-tight">
      {label}: <span className="text-blue-600">{value}{unit}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => setValue(parseInt(e.target.value))}
      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
  </div>
);

export default ImageFilters;