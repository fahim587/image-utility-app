import React, { useState, useEffect, useCallback } from "react";
import { 
  Upload, Loader2, CheckCircle2, Zap, 
  ShieldCheck, FileVideo, RefreshCw, FileType,
  Smartphone, Settings, ChevronDown, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import RelatedTools from "../../components/RelatedTools";

const ffmpeg = new FFmpeg();

const VideoConverter = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [targetFormat, setTargetFormat] = useState("mp4");
  const [quality, setQuality] = useState("medium");
  const [originalSize, setOriginalSize] = useState(0);
  const [showHowTo, setShowHowTo] = useState(false);

  const formats = ["mp4", "mkv", "avi", "webm", "mov", "flv", "3gp", "ogv", "wmv", "mp3"];
  const devices = ["android", "iphone", "ipad", "kindle", "mobile", "psp", "xbox"];

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
    if (selected) {
      setFile(selected);
      setOriginalSize((selected.size / (1024 * 1024)).toFixed(2));
      setIsDone(false);
      setProgress(0);
    }
  };

  const handleConvert = async () => {
    if (!file || loading) return;
    setLoading(true);
    setIsDone(false);
    try {
      const inputName = "input_file";
      let ext = targetFormat;
      if (devices.includes(targetFormat)) ext = "mp4";
      const outputName = `output.${ext}`;
      
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      let args = ["-i", inputName];

      if (targetFormat === "mp3") {
        args.push("-vn", "-ab", "128k", "-ar", "44100", "-y");
      } else {
        const crfValues = { high: "18", medium: "24", small: "32" };
        
        if (targetFormat === "3gp") {
          args.push("-vcodec", "h263", "-s", "352x288", "-r", "15", "-acodec", "aac", "-ar", "8000", "-ac", "1");
        } else if (targetFormat === "psp") {
          args.push("-vcodec", "libx264", "-s", "480x272", "-b:v", "500k", "-acodec", "aac");
        } else {
          args.push("-vcodec", "libx264", "-crf", crfValues[quality], "-pix_fmt", "yuv420p", "-preset", "faster");
        }
      }
      
      args.push(outputName);
      await ffmpeg.exec(args);
      
      const data = await ffmpeg.readFile(outputName);
      const type = targetFormat === "mp3" ? "audio/mp3" : "video/mp4";
      const url = URL.createObjectURL(new Blob([data.buffer], { type }));
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `Converted_${file.name.split('.')[0]}.${ext}`;
      a.click();
      setIsDone(true);
    } catch (err) {
      console.error(err);
      alert("Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-[#f8fafc] font-sans">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
         <span className="text-indigo-600">Video Converter</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Fast and private browser-based video conversion.
        </p>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-2 border border-gray-100 min-h-[600px]">
        <div className="bg-[#0a0a0b] p-8 lg:p-12 flex flex-col justify-center items-center">
          {!file ? (
            <div className="w-full max-w-sm space-y-8 text-center">
              <label className="cursor-pointer group block bg-white/5 border border-white/10 rounded-[32px] p-16 transition-all hover:bg-white/10">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Upload className="text-white" size={30} />
                </div>
                <p className="text-white font-bold text-lg">Select Video</p>
                <p className="text-gray-500 text-sm mt-2">MP4, MKV, MOV and more</p>
                <input type="file" hidden onChange={handleUpload} />
              </label>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <FileVideo className="text-indigo-500 mx-auto" size={64} />
              <h3 className="text-white font-bold text-xl truncate px-4">{file.name}</h3>
              <p className="text-indigo-400 font-black">{originalSize} MB</p>
              <button onClick={() => setFile(null)} className="text-gray-500 text-xs font-bold uppercase hover:text-white transition-colors">Change File</button>
            </div>
          )}
        </div>

        <div className="p-10 flex flex-col justify-between bg-white">
          <div className="space-y-8 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FileType size={14} /> Video Formats
              </label>
              <div className="grid grid-cols-5 gap-2">
                {formats.map((fmt) => (
                  <button key={fmt} onClick={() => setTargetFormat(fmt)} className={`py-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${targetFormat === fmt ? "bg-indigo-600 border-indigo-600 text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>{fmt}</button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Smartphone size={14} /> Optimized for Devices
              </label>
              <div className="grid grid-cols-4 gap-2">
                {devices.map((dev) => (
                  <button key={dev} onClick={() => setTargetFormat(dev)} className={`py-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${targetFormat === dev ? "bg-indigo-600 border-indigo-600 text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>{dev}</button>
                ))}
              </div>
            </div>

            {targetFormat !== "mp3" && (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Settings size={14} /> Quality
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["small", "medium", "high"].map((q) => (
                    <button key={q} onClick={() => setQuality(q)} className={`py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${quality === q ? "bg-indigo-600 text-white" : "bg-gray-50 hover:bg-gray-100"}`}>{q}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4">
            {loading && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-indigo-600 uppercase">
                  <span className="flex items-center gap-1"><RefreshCw size={12} className="animate-spin"/> Processing...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-indigo-600" animate={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            <button onClick={handleConvert} disabled={!file || loading} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isDone ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-gray-900 text-white disabled:opacity-20"}`}>
              {loading ? <Loader2 className="animate-spin" /> : isDone ? <CheckCircle2 /> : <Zap size={18} />}
              {loading ? "Processing..." : isDone ? "Download Again" : "Start Conversion"}
            </button>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-bold uppercase">
              <ShieldCheck size={12} /> Local Processing: Privacy Secured
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10">
        <button 
          onClick={() => setShowHowTo(!showHowTo)}
          className="w-full flex items-center justify-between p-8 bg-white rounded-[35px] border border-gray-100 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <HelpCircle size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 text-lg">How to use?</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-black mt-1">Simple 3-step process</p>
            </div>
          </div>
          <ChevronDown className={`text-gray-300 transition-transform duration-300 ${showHowTo ? "rotate-180" : ""}`} />
        </button>
        
        <AnimatePresence>
          {showHowTo && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white border-x border-b border-gray-100 rounded-b-[35px] px-10 pb-10"
            >
              <div className="grid md:grid-cols-3 gap-12 pt-10 border-t border-gray-50">
                <div className="space-y-2">
                  <div className="text-4xl font-black text-indigo-100">01</div>
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-widest">Upload</h4>
                  <p className="text-sm text-gray-500">Select any video file from your device. It stays in your browser.</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black text-indigo-100">02</div>
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-widest">Settings</h4>
                  <p className="text-sm text-gray-500">Pick an output format like MP4, MP3 or choose a device like iPhone.</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black text-indigo-100">03</div>
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-widest">Convert</h4>
                  <p className="text-sm text-gray-500">Click start and wait. Your converted file downloads automatically.</p>
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