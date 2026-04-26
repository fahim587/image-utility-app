import React, { useState, useEffect, useCallback } from "react";
import { 
  Upload, Loader2, CheckCircle2, Zap, 
  ShieldCheck, FileVideo, RefreshCw, FileType,
  Settings, ChevronDown, Trash2, Download, 
  RotateCw, Video, Info, HelpCircle, FlipHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import RelatedTools from "../../components/RelatedTools";

const ffmpeg = new FFmpeg();

const VideoConverter = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [targetFormat, setTargetFormat] = useState("mp4");
  const [rotation, setRotation] = useState("0"); 
  const [reflect, setReflect] = useState(false);
  const [quality, setQuality] = useState("medium");
  const [originalSize, setOriginalSize] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  const videoFormats = ["mp4", "mkv", "avi", "mov", "webm", "flv"];
  const audioFormats = ["mp3", "wav", "m4a"];

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
    return () => {
      ffmpeg.off("progress", handleProgress);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [prepareFFmpeg, previewUrl]);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setOriginalSize((selected.size / (1024 * 1024)).toFixed(2));
      setIsDone(false);
      setProgress(0);
      setRotation("0");
      setReflect(false);
    }
  };

  const handleConvert = async () => {
    if (!file || loading) return;
    setLoading(true);
    setIsDone(false);
    try {
      const inputName = "input_file";
      const outputName = `output.${targetFormat}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      let args = ["-i", inputName];
      let filters = [];

      if (rotation === "90") filters.push("transpose=1");
      else if (rotation === "180") filters.push("transpose=1,transpose=1");
      else if (rotation === "270") filters.push("transpose=2");
      
      if (reflect) filters.push("hflip");

      if (filters.length > 0) args.push("-vf", filters.join(","));

      if (audioFormats.includes(targetFormat)) {
        args.push("-vn", "-ab", "192k");
      } else {
        const crfValues = { high: "18", medium: "24", small: "32" };
        args.push("-vcodec", "libx264", "-crf", crfValues[quality], "-pix_fmt", "yuv420p", "-preset", "faster");
      }

      args.push(outputName);
      await ffmpeg.exec(args);
      
      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([data.buffer], { type: `video/${targetFormat}` }));
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `Converted_${file.name.split('.')[0]}.${targetFormat}`;
      a.click();
      setIsDone(true);
    } catch  {
      alert("Error: File is too large or format not supported.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
          Video <span className="text-indigo-600">Studio</span>
        </h1>
        <p className="text-slate-500 font-medium">Professional format converter and rotator.</p>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-2 border border-slate-100">
        
        <div className="bg-[#0f172a] p-8 flex flex-col justify-center items-center relative overflow-hidden">
          {!file ? (
            <label className="w-full max-w-sm cursor-pointer group border-2 border-dashed border-slate-700 rounded-[32px] p-16 transition-all hover:border-indigo-500 text-center">
              <Upload className="text-indigo-500 mx-auto mb-4" size={48} />
              <p className="text-white font-bold">Select Video File</p>
              <input type="file" hidden onChange={handleUpload} accept="video/*" />
            </label>
          ) : (
            <div className="w-full space-y-6">
              <div className="relative rounded-3xl overflow-hidden bg-black aspect-video shadow-2xl flex items-center justify-center p-4">
                <motion.video 
                  animate={{ 
                    rotate: parseInt(rotation),
                    scaleX: reflect ? -1 : 1,
                    scale: (rotation === "90" || rotation === "270") ? 0.55 : 1
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  src={previewUrl} 
                  controls 
                  className="max-w-full max-h-full object-contain" 
                />
                <button onClick={() => setFile(null)} className="absolute top-4 right-4 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-all z-10">
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="flex justify-between items-center text-white bg-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Video className="text-indigo-400" size={20} />
                  <p className="text-sm font-bold truncate max-w-[150px]">{file.name}</p>
                </div>
                <p className="text-[10px] font-black uppercase text-indigo-400">{originalSize} MB</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-10 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileType size={14} className="text-indigo-600"/> Target Format
              </label>
              <div className="relative">
                <select 
                  value={targetFormat} 
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold appearance-none outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <optgroup label="Video">
                    {videoFormats.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                  </optgroup>
                  <optgroup label="Audio Only">
                    {audioFormats.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <RotateCw size={14} className="text-indigo-600"/> Live Controls
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: "Normal", val: "0", icon: <Video size={14}/> },
                  { label: "90°", val: "90", icon: <RotateCw size={14}/> },
                  { label: "180°", val: "180", icon: <RefreshCw size={14}/> },
                  { label: "270°", val: "270", icon: <RotateCw size={14} className="scale-x-[-1]"/> }
                ].map((r) => (
                  <button 
                    key={r.val} 
                    onClick={() => setRotation(r.val)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all ${rotation === r.val ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"}`}
                  >
                    {r.icon}
                    <span className="text-[8px] font-black uppercase">{r.label}</span>
                  </button>
                ))}
                <button 
                  onClick={() => setReflect(!reflect)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all ${reflect ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"}`}
                >
                  <FlipHorizontal size={14} />
                  <span className="text-[8px] font-black uppercase">Reflect</span>
                </button>
              </div>
            </div>

            {!audioFormats.includes(targetFormat) && (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Settings size={14} className="text-indigo-600"/> Quality
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["small", "medium", "high"].map((q) => (
                    <button 
                      key={q} 
                      onClick={() => setQuality(q)} 
                      className={`py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${quality === q ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-50 border-slate-100 text-slate-400"}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 space-y-4">
            {loading && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-indigo-600 uppercase">
                  <span className="flex items-center gap-1"><RefreshCw size={12} className="animate-spin"/> Engine Working...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-indigo-600" animate={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            
            <button 
              onClick={handleConvert} 
              disabled={!file || loading} 
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all ${isDone ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-indigo-700 disabled:opacity-20 shadow-xl"}`}
            >
              {loading ? <Loader2 className="animate-spin" /> : isDone ? <CheckCircle2 /> : <Zap size={18} />}
              {loading ? "Processing..." : isDone ? "Download Again" : "Convert & Export"}
            </button>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase flex items-center justify-center gap-2">
               <ShieldCheck size={12} className="text-emerald-500" /> Secure Browser Processing
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6">
        <button 
          onClick={() => setShowGuide(!showGuide)}
          className="w-full flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 text-slate-700 font-bold">
            <HelpCircle size={20} className="text-indigo-600" />
            <span>How to use this tool?</span>
          </div>
          <ChevronDown className={`text-slate-400 transition-transform ${showGuide ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {showGuide && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-8 grid md:grid-cols-3 gap-6 bg-white/50 border-x border-b border-slate-100 rounded-b-3xl">
                <div className="flex gap-4">
                  <div className="text-2xl font-black text-indigo-100">01</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Upload</h4>
                    <p className="text-xs text-slate-500 mt-1">Select your video. It stays private on your device.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl font-black text-indigo-100">02</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Customize</h4>
                    <p className="text-xs text-slate-500 mt-1">Choose a format and rotate icons to see a live preview.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl font-black text-indigo-100">03</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Export</h4>
                    <p className="text-xs text-slate-500 mt-1">Click convert. The final file downloads automatically.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <RelatedTools categoryId='video' />
    </div>
  );
};

export default VideoConverter;