import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Copy, Check, Download, Image as ImageIcon, Loader2, ChevronDown, AlertCircle } from "lucide-react";

export default function AIImageExplainer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [fileType, setFileType] = useState("txt");

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setResult(""); // নতুন ছবি আপলোড করলে আগের রেজাল্ট মুছে যাবে
    };
    reader.readAsDataURL(selected);
  };

  const handleExplain = async () => {
    if (!preview) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const token = localStorage.getItem("token");
      
      // এপিআই ইউআরএল ফিক্স করা হয়েছে (ব্যাকটিক ব্যবহার করা হয়েছে)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/explain-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          image: preview
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResult(data.explanation);
      } else {
        throw new Error(data.message || "AI Analysis Failed");
      }

    } catch (error) {
      console.error(error);
      alert(`⚠️ Error: ${error.message}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResult = () => {
    if (!result) return;

    let content = result;
    let mime = "text/plain";
    let filename = "ai-image-analysis";

    if (fileType === "md") {
      mime = "text/markdown";
      filename += ".md";
    } else if (fileType === "html") {
      mime = "text/html";
      content = `<html><body style="font-family:Arial;padding:40px;line-height:1.6;"><h2>Image Analysis</h2><p>${result.replace(/\n/g, "<br/>")}</p></body></html>`;
      filename += ".html";
    } else if (fileType === "doc") {
      mime = "application/msword";
      filename += ".doc";
    } else {
      filename += ".txt";
    }

    const element = document.createElement("a");
    const fileBlob = new Blob([content], { type: mime + ';charset=utf-8' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <Helmet>
        <title>AI Image Explainer | Get Detailed Visual Insights</title>
        <meta name="description" content="Describe context, objects, and details from any image using AI." />
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6 font-sans">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12">
             <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
               Free AI Image Explainer: <span className="text-blue-600">Visual Insights</span>
             </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Upload any photo and let our advanced Vision AI describe the context and hidden details for you.
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon size={18} className="text-blue-600" /> Source Image
                </label>
                
                <div className="relative group border-2 border-dashed border-gray-200 rounded-[2rem] p-3 transition-all hover:border-blue-500 bg-gray-50 min-h-[400px] flex items-center justify-center overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFile} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  {!preview ? (
                    <div className="text-center p-10">
                      <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload size={32} />
                      </div>
                      <p className="text-gray-600 font-bold text-xl">Drag & Drop or Click to Upload</p>
                      <p className="text-gray-400 mt-2">Supports JPG, PNG, WEBP</p>
                    </div>
                  ) : (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full h-full relative">
                       <img src={preview} alt="AI Preview" className="w-full max-h-[600px] object-contain rounded-xl shadow-md" />
                       {loading && (
                          <motion.div 
                            initial={{ top: "0%" }}
                            animate={{ top: "100%" }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-30"
                          />
                       )}
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center">
                <button
                  onClick={handleExplain}
                  disabled={loading || !preview}
                  className="w-full md:flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />}
                  {loading ? "AI is Analyzing..." : "Start Analysis"}
                </button>

                <div className="relative w-full md:w-auto">
                  <button 
                    onClick={() => setShowOptions(!showOptions)}
                    className="w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-5 rounded-2xl font-bold flex items-center justify-between gap-3 transition-all"
                  >
                    Actions <ChevronDown size={20} className={showOptions ? 'rotate-180' : ''} />
                  </button>
                  
                  <AnimatePresence>
                    {showOptions && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full mb-2 right-0 w-56 bg-white rounded-2xl shadow-2xl border p-2 z-50"
                      >
                        <div className="px-3 py-2 border-b mb-1">
                          <select 
                            value={fileType}
                            onChange={(e) => setFileType(e.target.value)}
                            className="w-full p-2 bg-gray-50 border rounded-lg text-sm font-bold outline-none text-gray-700"
                          >
                            <option value="txt">Plain Text (.txt)</option>
                            <option value="md">Markdown (.md)</option>
                            <option value="html">HTML File (.html)</option>
                            <option value="doc">Word Doc (.doc)</option>
                          </select>
                        </div>
                        <button onClick={copyToClipboard} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-xl text-left text-sm font-bold text-gray-700">
                          <Copy size={16} /> {copied ? "Copied!" : "Copy Explanation"}
                        </button>
                        <button onClick={downloadResult} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-xl text-left text-sm font-bold text-gray-700">
                          <Download size={16} /> Download File
                        </button>
                        <button onClick={() => {setPreview(""); setResult(""); setFile(null); setShowOptions(false)}} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl text-left text-sm font-bold text-red-600 border-t mt-1">
                          <AlertCircle size={16} /> Clear & Start New
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence>
                {result && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-10 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-6 text-blue-600 font-black uppercase tracking-widest">
                       <Sparkles size={20} /> <span>Vision AI Analysis</span>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] text-gray-800 leading-relaxed border border-gray-100 text-lg shadow-inner whitespace-pre-wrap font-medium">
                      {result}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}