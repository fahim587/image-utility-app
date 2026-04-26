import React, { useState } from "react";
import { UploadCloud, Download, Trash2, RefreshCw, ChevronDown, Image as ImageIcon, FileType, CheckCircle, Move } from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const ConvertFormat = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [targetFormat, setTargetFormat] = useState("image/jpeg");
  const [convertedImage, setConvertedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(selected);
      setConvertedImage(null);
    }
  };

  const convertImage = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const img = new Image();
      img.src = image;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const resultDataURL = canvas.toDataURL(targetFormat, 0.9);
      setConvertedImage(resultDataURL);
    } catch (err) {
      console.error("Conversion error:", err);
    }
    setLoading(false);
  };

  const reset = () => {
    setImage(null);
    setFile(null);
    setConvertedImage(null);
  };

  return (
    <div className="max-w-7xl mx-auto pt-32 pb-12 px-4">
      <h1 className="text-4xl font-black text-center mb-6 text-blue-600 tracking-tight">Image Format Converter</h1>

      <div className="max-w-xl mx-auto mb-10">
        <button 
          onClick={() => setShowDirections(!showDirections)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
        >
          <span className="flex items-center gap-2 text-blue-600"><FileType size={18}/> How to convert?</span>
          <ChevronDown className={`transition-transform duration-300 ${showDirections ? "rotate-180" : ""}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${showDirections ? "max-h-96 mt-2" : "max-h-0"}`}>
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-xl space-y-3 text-sm text-gray-600">
            <p>• <b>Step 1:</b> Upload your image (PNG, JPG, WEBP, etc.)</p>
            <p>• <b>Step 2:</b> Select your desired output format from the sidebar.</p>
            <p>• <b>Step 3:</b> Click "Convert Format" to process the image.</p>
            <p>• <b>Step 4:</b> Download the high-quality converted file.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 overflow-hidden h-[500px] relative flex items-center justify-center">
          {image ? (
            <div className="relative w-full h-full p-8 flex items-center justify-center">
              <img src={image} alt="Preview" className="max-w-full max-h-full rounded-xl shadow-lg object-contain" />
              <button onClick={reset} className="absolute top-6 right-6 bg-white shadow-lg text-red-500 p-3 rounded-2xl hover:bg-red-50 transition-all">
                <Trash2 size={22} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer group">
              <div className="bg-blue-50 p-10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud size={64} className="text-blue-500" />
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              <span className="text-2xl font-bold text-gray-800">Select Image to Convert</span>
              <p className="text-gray-400 mt-2">Supports JPG, PNG, WEBP, BMP</p>
            </label>
          )}
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-3 text-lg">
              <ImageIcon size={18} className="text-blue-600"/> Convert Settings
            </h2>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Format</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "Convert to JPG", value: "image/jpeg" },
                  { label: "Convert to PNG", value: "image/png" },
                  { label: "Convert to WEBP", value: "image/webp" }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTargetFormat(opt.value)}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border flex items-center justify-between transition-all ${
                      targetFormat === opt.value
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                        : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                    {targetFormat === opt.value && <CheckCircle size={16} />}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={convertImage} 
              disabled={!image || loading} 
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" /> : "Convert Format"}
            </button>
          </div>

          {convertedImage && (
            <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 animate-in slide-in-from-right-4 shadow-sm">
              <a 
                href={convertedImage} 
                download={`${file?.name.split('.')[0] || 'image'}-converted.${targetFormat.split("/")[1]}`} 
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-xl w-full font-bold hover:bg-green-700 transition-all shadow-lg"
              >
                <Download size={20} /> Download {targetFormat.split("/")[1].toUpperCase()}
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

export default ConvertFormat;