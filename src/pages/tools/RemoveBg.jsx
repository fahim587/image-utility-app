import React, { useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import { Upload, Download, Loader2, ChevronDown, HelpCircle, Sparkles, Image as ImageIcon } from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const RemoveBg = () => {

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  // image upload
  const handleUpload = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);

  };

  // remove background
  const handleRemoveBg = async () => {

    if (!imageFile) return;

    setLoading(true);

    try {

      const blob = await removeBackground(imageFile);

      const url = URL.createObjectURL(blob);

      setResult(url);

    } catch (err) {

      console.error(err);
      alert("Background removal failed");

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen pt-24 pb-16 px-4 bg-slate-50">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="mb-12 text-center">
        
          <h1 className="text-4xl md:text-5xl font-black text-blue-600 tracking-tight">
            Remove Background From Image
          </h1>

          <p className="text-slate-500 mt-3 text-lg font-medium">
            Upload an image and remove the background instantly using AI.
          </p>

        </div>

        {/* Upload Area */}

        <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 text-center mb-10 transition-all">

          {!preview && (

            <label className="group cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 py-16 rounded-[2rem] transition-all bg-slate-50/50 hover:bg-blue-50/30">

              <div className="p-6 bg-white rounded-3xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <Upload size={40} className="text-blue-600" />
              </div>

              <div className="space-y-1">
                <p className="text-xl font-bold text-slate-800 block">
                  Click to Upload Image
                </p>
                <p className="text-slate-400 text-sm font-medium">Supports PNG, JPG, WEBP</p>
              </div>

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleUpload}
              />

            </label>

          )}

          {/* Preview */}

          {preview && !result && !loading && (

            <div className="space-y-8 animate-in fade-in zoom-in duration-300">

              <div className="relative inline-block p-2 bg-slate-50 rounded-3xl border shadow-inner">
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto max-h-80 rounded-2xl shadow-lg"
                />
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {setPreview(null); setImageFile(null);}}
                  className="px-8 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveBg}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Sparkles size={18} /> Remove Background
                </button>
              </div>

            </div>

          )}

          {/* Loading */}

          {loading && (

            <div className="py-20 flex flex-col items-center justify-center animate-pulse">

              <Loader2 className="animate-spin text-blue-600" size={64} />

              <div className="mt-6 space-y-1">
                <h3 className="text-2xl font-black text-slate-800">Processing image...</h3>
                <p className="text-slate-500 font-medium italic">
                  AI is isolating the subject...
                </p>
              </div>

            </div>

          )}

          {/* Result */}

          {result && !loading && (

            <div className="space-y-8 animate-in fade-in zoom-in duration-300">

              <div className="relative p-2 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-slate-200 rounded-3xl overflow-hidden shadow-inner">
                <img
                  src={result}
                  alt="Result"
                  className="mx-auto max-h-80 drop-shadow-2xl"
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => {setPreview(null); setResult(null); setImageFile(null);}} 
                  className="w-full md:w-auto px-8 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-all"
                >
                  Remove Another
                </button>
                <a
                  href={result}
                  download="remove-bg.png"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-green-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-green-700 shadow-lg shadow-green-200 active:scale-95 transition-all"
                >
                  <Download size={18} />
                  Download Image
                </a>
              </div>

            </div>

          )}

        </div>

        {/* Directions Dropdown */}

        <div className="mb-12">
          <button 
            onClick={() => setShowDirections(!showDirections)} 
            className="w-full flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="text-blue-600" size={20} />
              <span>How to use this tool?</span>
            </div>
            <ChevronDown className={`transition-transform duration-300 ${showDirections ? "rotate-180" : ""}`} />
          </button>
          
          {showDirections && (
            <div className="mt-2 p-8 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-600 animate-in slide-in-from-top-2">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold text-sm">1</div>
                  <p className="font-bold text-slate-800">Upload Image</p>
                  <p className="text-sm">Click the upload box and select your photo.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold text-sm">2</div>
                  <p className="font-bold text-slate-800">Remove BG</p>
                  <p className="text-sm">Click the blue button to start AI processing.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold text-sm">3</div>
                  <p className="font-bold text-slate-800">Download PNG</p>
                  <p className="text-sm">Save your transparent image to your device.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* More Tools */}

        <div className="mt-16">


          <div className="mt-20 border-t pt-10">
        <RelatedTools categoryId="image" />
          </div>

        </div>

        {/* SEO Content */}

      

          

        </div>

      </div>


  );
};

export default RemoveBg;