import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import { 
  UploadCloud, 
  Download, 
  Trash2, 
  Settings, 
  Image as ImageIcon, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import RelatedTools from '../../components/RelatedTools';
import UniversalFilePicker from "../../components/UniversalFilePicker";
import axios from "axios";

const CompressImage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compressedFile, setCompressedFile] = useState(null);
  const [quality, setQuality] = useState(0.8);
  const [stats, setStats] = useState({ oldSize: 0, newSize: 0, ratio: 0 });
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleFileSelect = async (fileInfo) => {
    let selectedFile = null;

    try {
      if (fileInfo.source === "local") {
        selectedFile = fileInfo.data;
      } else if (fileInfo.source === "google-drive" || fileInfo.source === "dropbox") {
        const response = await fetch(fileInfo.data.downloadUrl || fileInfo.data.link);
        const blob = await response.blob();
        selectedFile = new File([blob], fileInfo.data.name || "cloud-image.jpg", { type: blob.type });
      } else if (fileInfo.source === "url") {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/${fileInfo.data.filePath}`);
        const blob = await response.blob();
        selectedFile = new File([blob], fileInfo.data.fileName, { type: blob.type });
      }

      if (selectedFile && selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setStats({ ...stats, oldSize: (selectedFile.size / 1024).toFixed(2) });
        setCompressedFile(null);
      } else {
        alert("Please upload a valid image file (JPG, PNG, WEBP)");
      }
    } catch (error) {
      console.error("File selection error:", error);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: quality,
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      const url = URL.createObjectURL(compressedBlob);
      const newSize = (compressedBlob.size / 1024).toFixed(2);
      
      setCompressedFile(url);
      setStats((prev) => ({
        ...prev,
        newSize: newSize,
        ratio: (((prev.oldSize - newSize) / prev.oldSize) * 100).toFixed(1),
      }));
    } catch (error) {
      console.error("Compression error:", error);
      alert("Something went wrong during compression.");
    }
    setLoading(false);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setCompressedFile(null);
    setStats({ oldSize: 0, newSize: 0, ratio: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">
          Compress <span className="text-blue-600">Image</span>
        </h1>
        <p className="text-center text-gray-500 mb-12">Reduce image size without losing quality. 100% Secure & Private.</p>
        
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[400px] relative transition-all hover:bg-gray-100/50">
            {preview ? (
              <div className="relative group animate-in zoom-in duration-300 w-full flex justify-center">
                <img src={preview} className="max-h-[450px] object-contain rounded-xl shadow-2xl border-4 sm:border-8 border-white" alt="Preview" />
                <button onClick={reset} className="absolute -top-4 -right-2 bg-blue-600 text-white p-2.5 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            ) : (
              <UniversalFilePicker onFileSelect={handleFileSelect} allowedTypes="image/*" />
            )}
          </div>

          <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 text-xl font-bold text-gray-800">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Settings size={24} className="text-blue-600" />
              </div>
              Compression Settings
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between text-sm font-bold text-gray-600">
                <span>Compression Level</span>
                <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{Math.round((1 - quality) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>High Quality</span>
                <span>Small Size</span>
              </div>
            </div>

            {file && (
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-black">Original</p>
                  <p className="text-lg font-bold text-gray-700">{stats.oldSize} <span className="text-sm font-normal">KB</span></p>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                  <p className="text-[10px] text-blue-400 uppercase tracking-wider font-black">New Size</p>
                  <p className="text-lg font-bold text-blue-600">{stats.newSize || "---"} <span className="text-sm font-normal">KB</span></p>
                </div>
              </div>
            )}

            <button
              onClick={handleCompress}
              disabled={!file || loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : "Compress Image"}
            </button>

            {compressedFile && (
              <div className="pt-4 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 mb-4 text-green-600 font-bold justify-center bg-green-50 py-2 rounded-xl">
                  {/* ফিক্স: Bug এর বদলে CheckCircle ব্যবহার করা হয়েছে */}
                  <CheckCircle size={18} />
                  Saved {stats.ratio}% of original size
                </div>
                <a
                  href={compressedFile}
                  download={`compressed_${file?.name}`}
                  className="flex items-center justify-center gap-3 bg-green-600 text-white py-5 rounded-2xl w-full font-bold shadow-xl hover:bg-green-700 active:scale-[0.98] transition-all"
                >
                  <Download size={24} />
                  Download Compressed Image
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Guide Section */}
        <section className="mt-20 max-w-4xl mx-auto">
          <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
            <button 
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors group"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">How to use this tool?</h2>
              <div className={`p-2 rounded-full transition-all ${isGuideOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`}>
                {isGuideOpen ? <ChevronUp size={24}/> : <ChevronDown size={24}/>}
              </div>
            </button>

            {isGuideOpen && (
              <div className="p-6 sm:p-8 pt-0 border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-6">
                  {[
                    {step: "1", title: "Select Image", text: "Upload the JPG, PNG, or WEBP image you want to compress."},
                    {step: "2", title: "Adjust Quality", text: "Use the slider to balance between file size and image quality."},
                    {step: "3", title: "Download", text: "Your compressed image is ready! Save it instantly to your device."}
                  ].map((item, idx) => (
                    <div key={idx} className="relative px-2">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto font-black text-lg mb-4">{item.step}</div>
                      <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="mt-20">
          <RelatedTools categoryId="image" />
        </div>
      </div>
    </div>
  );
};

export default CompressImage;