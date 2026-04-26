import React, { useState, useEffect, useCallback } from "react";
import { 
  Upload, Loader2, CheckCircle2, Download, Settings, Zap, 
  ShieldCheck, FileVideo, HardDrive, Link, Cloud, Globe, 
  Smartphone, ChevronDown, HelpCircle, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import RelatedTools from './../../components/RelatedTools';

const ffmpeg = new FFmpeg();

const VideoCompressor = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [quality, setQuality] = useState("medium");
  const [targetSize, setTargetSize] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [importType, setImportType] = useState("local"); // local, url, cloud
  const [urlInput, setUrlInput] = useState("");
  const [showHowTo, setShowHowTo] = useState(false);

  const prepareFFmpeg = useCallback(async () => {
    if (ffmpeg.loaded) return;
    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
    } catch (err) {
      console.error("FFmpeg Load Error:", err);
    }
  }, []);

  useEffect(() => {
    prepareFFmpeg();
    const handleProgress = ({ progress }) => setProgress(Math.round(progress * 100));
    ffmpeg.on("progress", handleProgress);
    return () => ffmpeg.off("progress", handleProgress);
  }, [prepareFFmpeg]);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith("video/")) {
      setFile(selected);
      setOriginalSize((selected.size / (1024 * 1024)).toFixed(2));
      setIsDone(false);
      setProgress(0);
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput) return;
    setLoading(true);
    try {
      const response = await fetch(urlInput);
      const blob = await response.blob();
      const remoteFile = new File([blob], "video.mp4", { type: blob.type });
      setFile(remoteFile);
      setOriginalSize((remoteFile.size / (1024 * 1024)).toFixed(2));
      setImportType("local");
    } catch  {
      alert("CORS error or invalid link. Try a direct MP4 link.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompress = async () => {
    if (!file || loading) return;
    setLoading(true);
    setIsDone(false);
    try {
      const inputName = file.name || "input.mp4";
      const outputName = "compressed.mp4";
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      let args = ["-i", inputName];
      if (targetSize) {
        args.push("-b:v", `${Math.max(100, Math.round((targetSize * 8192) / 60))}k`); 
      } else {
        const crfValues = { high: "18", medium: "24", small: "32" };
        args.push("-vcodec", "libx264", "-crf", crfValues[quality] || "24");
      }
      args.push("-preset", "faster", outputName);
      
      await ffmpeg.exec(args);
      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Compressed_${file.name || "video.mp4"}`;
      a.click();
      setIsDone(true);
    } catch (err) {
      console.error(err);
      alert("Compression failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-[#f8fafc] font-sans">
      
      {/* Dynamic SEO Header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
         <span className="text-indigo-600">Video Compressor</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Reduce video size instantly from Local, URL, or Cloud. High quality, secure, and no-upload browser processing.
        </p>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-2 border border-gray-100 min-h-[550px]">
        
        {/* LEFT SIDE: Import Methods */}
        <div className="bg-[#0a0a0b] p-8 lg:p-12 flex flex-col justify-center items-center border-b lg:border-b-0 lg:border-r border-white/5">
          {!file ? (
            <div className="w-full max-w-sm space-y-8">
              <div className="flex justify-center gap-3">
                {['local', 'url', 'cloud'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setImportType(t)}
                    className={`p-4 rounded-2xl transition-all ${importType === t ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                  >
                    {t === 'local' && <Smartphone size={20} />}
                    {t === 'url' && <Link size={20} />}
                    {t === 'cloud' && <Cloud size={20} />}
                  </button>
                ))}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[32px] p-10 text-center backdrop-blur-md">
                {importType === 'local' ? (
                  <label className="cursor-pointer group block">
                    <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-xl">
                      <Upload className="text-white" size={30} />
                    </div>
                    <p className="text-white font-bold text-lg">Choose Local Video</p>
                    <input type="file" hidden accept="video/*" onChange={handleUpload} />
                  </label>
                ) : importType === 'url' ? (
                  <div className="space-y-4">
                    <input 
                      className="w-full bg-black/40 px-4 py-4 text-white rounded-2xl border border-white/10 outline-none text-sm placeholder:text-gray-600" 
                      placeholder="Paste direct video URL..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                    />
                    <button onClick={handleUrlSubmit} className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest">Load Video</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex flex-col items-center gap-3 p-5 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                      <Globe className="text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] text-white font-black">Google Drive</span>
                    </button>
                    <button className="flex flex-col items-center gap-3 p-5 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                      <Cloud className="text-blue-500 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] text-white font-black">Dropbox</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
              <div className="w-24 h-24 bg-indigo-600/20 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto">
                <FileVideo size={48} />
              </div>
              <div className="px-6">
                <h3 className="text-white font-bold text-xl truncate">{file.name}</h3>
                <p className="text-indigo-400 font-black text-sm mt-2 uppercase tracking-widest">{originalSize} MB</p>
              </div>
              <button onClick={() => setFile(null)} className="text-gray-500 hover:text-white text-xs font-bold transition-colors">Change Selection</button>
            </motion.div>
          )}
        </div>

        {/* RIGHT SIDE: Controls */}
        <div className="p-10 flex flex-col justify-between bg-white">
          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Settings size={14} /> Quality Preset
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["small", "medium", "high"].map((q) => (
                  <button 
                    key={q} 
                    onClick={() => {setQuality(q); setTargetSize("");}}
                    className={`py-4 rounded-2xl border text-[11px] font-black uppercase transition-all ${quality === q && !targetSize ? "bg-indigo-600 border-indigo-600 text-white shadow-xl" : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100"}`}
                  >
                    {q === "small" ? "Smaller" : q === "high" ? "Best Qual" : "Balanced"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <HardDrive size={14} /> Custom Target Size
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="Example: 25" 
                  value={targetSize}
                  onChange={(e) => setTargetSize(e.target.value)}
                  className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-300">MB</span>
              </div>
              <p className="text-[10px] text-gray-400 italic flex items-center gap-1"><Info size={12}/> Target size overrides quality presets.</p>
            </div>
          </div>

          <div className="mt-12 space-y-5">
            {loading && (
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black text-indigo-600 uppercase tracking-widest">
                  <span className="flex items-center gap-2 animate-pulse"><Zap size={12}/> Optimizing...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-indigo-600" animate={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <button 
              onClick={handleCompress}
              disabled={!file || loading}
              className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all ${isDone ? "bg-emerald-500 text-white" : "bg-gray-900 text-white hover:bg-black shadow-2xl disabled:opacity-20"}`}
            >
              {loading ? <Loader2 className="animate-spin" /> : isDone ? <CheckCircle2 /> : <Download size={18} />}
              {loading ? "Compressing..." : isDone ? "Save Video" : "Start Compression"}
            </button>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-bold uppercase">
              <ShieldCheck size={12} /> Privacy Secure: No files leave your browser
            </div>
          </div>
        </div>
      </div>

      {/* SEO & Directions Section */}
      <div className="max-w-6xl mx-auto mt-10">
        <button 
          onClick={() => setShowHowTo(!showHowTo)}
          className="w-full flex items-center justify-between p-8 bg-white rounded-[35px] border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <HelpCircle size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 text-lg">How to use Smart Video Compressor?</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-black mt-1">3 Simple steps to optimize your videos</p>
            </div>
          </div>
          <ChevronDown className={`text-gray-300 transition-transform duration-500 ${showHowTo ? "rotate-180" : ""}`} />
        </button>
        
        <AnimatePresence>
          {showHowTo && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white border border-gray-100 rounded-b-[35px] px-10 pb-10"
            >
              <div className="grid md:grid-cols-3 gap-12 pt-10 border-t border-gray-50">
                <div className="space-y-4 text-center md:text-left">
                  <div className="text-4xl font-black text-indigo-100">01</div>
                  <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Upload or Paste</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Choose a video from your device, or use the URL icon to paste a direct link from the web.</p>
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <div className="text-4xl font-black text-indigo-100">02</div>
                  <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Set Preferences</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Select a quality preset or enter a specific target size (e.g. 25MB for Discord/Email).</p>
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <div className="text-4xl font-black text-indigo-100">03</div>
                  <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Compress & Save</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Click compress and wait for the browser-based FFmpeg engine to finish. Save your video instantly.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <RelatedTools categoryId="video" />
    </div>
  );
};

export default VideoCompressor;