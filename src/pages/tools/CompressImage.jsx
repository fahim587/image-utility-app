import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import {
  Download,
  Trash2,
  Settings,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  UploadCloud
} from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const CompressImage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(0.8);

  const [stats, setStats] = useState({
    oldSize: 0,
    newSize: 0,
    ratio: 0
  });

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // memory cleanup to prevent leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      if (compressedFile) URL.revokeObjectURL(compressedFile);
    };
  }, [preview, compressedFile]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }

    setFile(selectedFile);
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
    setCompressedFile(null); // Reset previous compression
    setStats({
      oldSize: (selectedFile.size / 1024).toFixed(2),
      newSize: 0,
      ratio: 0
    });
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality
      };

      const compressedBlob = await imageCompression(file, options);
      const url = URL.createObjectURL(compressedBlob);

      const oldSizeNum = parseFloat(stats.oldSize);
      const newSizeNum = (compressedBlob.size / 1024).toFixed(2);
      const reductionRatio = (((oldSizeNum - newSizeNum) / oldSizeNum) * 100).toFixed(1);

      setCompressedFile(url);
      setStats({
        ...stats,
        newSize: newSizeNum,
        ratio: reductionRatio > 0 ? reductionRatio : 0
      });
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-4">
          Compress <span className="text-blue-600">Image</span>
        </h1>
        <p className="text-center text-gray-500 mb-12">
          Fast, secure, and high-quality image compression right in your browser.
        </p>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Upload Area */}
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-6 min-h-[400px] flex flex-col items-center justify-center shadow-sm">
            {preview ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-[350px] max-w-full rounded-xl object-contain shadow-md"
                />
                <button
                  onClick={reset}
                  className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer group">
                <div className="bg-blue-50 p-6 rounded-full group-hover:scale-110 transition-transform mb-4">
                  <UploadCloud size={48} className="text-blue-600" />
                </div>
                <span className="text-lg font-semibold text-gray-700">Click to upload image</span>
                <span className="text-sm text-gray-400 mt-2 text-center">Supports JPG, PNG, and WEBP</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>

          {/* Controls & Stats */}
          <div className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border">
            <div className="flex items-center gap-3 text-xl font-bold text-gray-800">
              <Settings size={24} className="text-blue-600" />
              Settings
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-3 text-gray-600">
                <span>Compression Power</span>
                <span>{Math.round((1 - quality) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {file && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Original Size</p>
                  <p className="text-lg font-black text-gray-700">{stats.oldSize} KB</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-right">
                  <p className="text-xs text-blue-400 uppercase font-bold mb-1">New Size</p>
                  <p className="text-lg font-black text-blue-600">{stats.newSize || "--"} KB</p>
                </div>
              </div>
            )}

            <button
              onClick={handleCompress}
              disabled={!file || loading}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
            >
              {loading ? "Compressing..." : "Apply Compression"}
            </button>

            {compressedFile && (
              <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-center items-center gap-2 text-green-600 font-bold mb-5 bg-green-50 py-2 rounded-lg">
                  <CheckCircle size={18} />
                  Reduced by {stats.ratio}%
                </div>
                <a
                  href={compressedFile}
                  download={`Googiz_compressed_${file.name}`}
                  className="w-full bg-green-600 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-green-700 shadow-xl transition-all"
                >
                  <Download size={22} />
                  Download Compressed Image
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Info Guide */}
        <div className="mt-16 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <button
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-lg font-bold text-gray-800">Frequently Asked Questions</h2>
            {isGuideOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </button>
          {isGuideOpen && (
            <div className="p-8 border-t border-gray-50 bg-gray-50/50 space-y-4 text-gray-600">
              <p><strong>Is my data safe?</strong> Yes, the compression happens entirely in your browser. No files are uploaded to our servers.</p>
              <p><strong>Will I lose quality?</strong> Our tool uses smart algorithms to reduce file size while maintaining visual clarity.</p>
            </div>
          )}
        </div>

        <div className="mt-16">
          <RelatedTools categoryId="image" />
        </div>
      </div>
    </div>
  );
};

export default CompressImage;