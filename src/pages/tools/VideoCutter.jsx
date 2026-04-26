import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Upload, Loader2, CheckCircle2, Play, Pause, 
  Volume2, VolumeX, Maximize, Download, ChevronDown, HelpCircle, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import RelatedTools from './../../components/RelatedTools';

const ffmpeg = new FFmpeg();

const VideoCutter = () => {
  const [file, setFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [layout, setLayout] = useState("original");
  const [thumbnails, setThumbnails] = useState([]);
  const [showHowTo, setShowHowTo] = useState(false);

  const videoRef = useRef(null);
  const containerRef = useRef(null);

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

  // থাম্বনেইল জেনারেটর (Video Frames)
  const generateThumbnails = async (videoFile) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(videoFile);
    video.load();
    
    video.onloadedmetadata = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const frames = [];
      const interval = video.duration / 8; // ৮টি ফ্রেম জেনারেট হবে

      for (let i = 0; i < 8; i++) {
        video.currentTime = i * interval;
        await new Promise((r) => (video.onseeked = r));
        canvas.width = 160;
        canvas.height = 90;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL("image/jpeg"));
      }
      setThumbnails(frames);
    };
  };

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith("video/")) {
      setFile(selected);
      setVideoURL(URL.createObjectURL(selected));
      setIsDone(false);
      setProgress(0);
      setStartTime(0);
      generateThumbnails(selected);
    }
  };

  const handleRangeChange = (value, type) => {
    const time = Math.max(0, Math.min(Number(value), duration));
    if (type === "start") {
      if (time >= endTime) return;
      setStartTime(time);
      videoRef.current.currentTime = time;
    } else {
      if (time <= startTime) return;
      setEndTime(time);
      videoRef.current.currentTime = time;
    }
    setIsPlayingPreview(false);
  };

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
      else if (videoRef.current.webkitRequestFullscreen) videoRef.current.webkitRequestFullscreen();
      else if (videoRef.current.msRequestFullscreen) videoRef.current.msRequestFullscreen();
    }
  };

  const handleTrim = async () => {
    if (!file || loading) return;
    setLoading(true);
    setIsDone(false);
    try {
      const inputName = "input.mp4";
      const outputName = "output.mp4";
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      let args = ["-ss", startTime.toString(), "-to", endTime.toString(), "-i", inputName];
      if (isMuted) args.push("-an");
      if (layout === "1:1") args.push("-vf", "crop=ih:ih");
      else if (layout === "9:16") args.push("-vf", "crop=ih*9/16:ih");

      args.push("-c:v", "libx264", "-preset", "ultrafast", outputName);
      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Trimmed_Video.mp4`;
      a.click();
      setIsDone(true);
    } catch  {
      alert("Export failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-[#f8fafc] font-sans">
      {/* SEO Friendly Header */}
      
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Professional Online Video Cutter</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Fast, secure, and high-quality video trimming directly in your browser. No upload to server required.</p>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-12 border border-gray-100 min-h-[650px]">
        
        {/* LEFT SIDE: Preview & Pro Timeline */}
        <div className="lg:col-span-8 bg-[#0a0a0b] p-6 lg:p-10 flex flex-col justify-between">
          <div className="flex-1 flex items-center justify-center relative" ref={containerRef}>
            {!file ? (
              <label className="cursor-pointer text-white flex flex-col items-center gap-4 group">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-indigo-600 transition-all duration-500">
                  <Upload size={32} />
                </div>
                <span className="font-bold text-gray-400 group-hover:text-white transition-colors">Select Video File</span>
                <input type="file" hidden accept="video/*" onChange={handleUpload} />
              </label>
            ) : (
              <div className="relative group w-full flex justify-center">
                <video 
                  ref={videoRef} src={videoURL} 
                  onLoadedMetadata={(e) => {setDuration(e.target.duration); setEndTime(e.target.duration);}}
                  muted={isMuted}
                  className={`max-h-[400px] rounded-2xl shadow-2xl transition-all duration-300 ${layout === '1:1' ? 'aspect-square' : layout === '9:16' ? 'aspect-[9/16]' : ''}`}
                />
                
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all z-20">
                  <button 
                    onClick={() => {
                      if(isPlayingPreview) videoRef.current.pause();
                      else videoRef.current.play();
                      setIsPlayingPreview(!isPlayingPreview);
                    }}
                    className="w-16 h-16 bg-indigo-600/90 text-white rounded-full flex items-center justify-center transform hover:scale-110 shadow-2xl"
                  >
                    {isPlayingPreview ? <Pause size={30} fill="white" /> : <Play size={30} fill="white" className="ml-1" />}
                  </button>
                  <button 
                    onClick={handleFullScreen}
                    className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Professional Timeline */}
          {file && (
            <div className="mt-8 bg-[#18181b] p-5 rounded-3xl border border-white/10 shadow-2xl">
              <div className="relative h-20 flex items-center rounded-2xl overflow-hidden bg-black/60 border border-white/5">
                {/* Video Frames (Thumbnails) */}
                <div className="absolute inset-0 flex">
                  {thumbnails.map((src, i) => (
                    <img key={i} src={src} alt="frame" className="flex-1 h-full object-cover opacity-30 border-r border-black/20" />
                  ))}
                </div>

                {/* Range Selection Highlight */}
                <div 
                  className="absolute h-full bg-indigo-500/20 border-x-[6px] border-white z-10 transition-all duration-75"
                  style={{ 
                    left: `${(startTime / duration) * 100}%`, 
                    right: `${100 - (endTime / duration) * 100}%` 
                  }}
                >
                  {/* Smart Start Marker */}
                  <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-14 bg-white rounded-lg shadow-2xl flex flex-col items-center justify-center">
                    <div className="w-1 h-6 bg-gray-200 rounded-full" />
                    <span className="absolute -top-7 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black whitespace-nowrap">
                      {startTime.toFixed(1)}s
                    </span>
                  </div>
                  {/* Smart End Marker */}
                  <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-14 bg-white rounded-lg shadow-2xl flex flex-col items-center justify-center">
                    <div className="w-1 h-6 bg-gray-200 rounded-full" />
                    <span className="absolute -top-7 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black whitespace-nowrap">
                      {endTime.toFixed(1)}s
                    </span>
                  </div>
                </div>

                {/* Multi-Range Inputs */}
                <div className="relative w-full h-full">
                  <input type="range" min="0" max={duration} step="0.1" value={startTime} onChange={(e) => handleRangeChange(e.target.value, "start")} className="absolute w-full h-full bg-transparent appearance-none pointer-events-none z-30 cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:h-20 [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:appearance-none" />
                  <input type="range" min="0" max={duration} step="0.1" value={endTime} onChange={(e) => handleRangeChange(e.target.value, "end")} className="absolute w-full h-full bg-transparent appearance-none pointer-events-none z-30 cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:h-20 [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:appearance-none" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Original: {duration.toFixed(1)}s</span>
                <span className="text-[11px] bg-indigo-600/10 text-indigo-400 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                  Trim Duration: {(endTime - startTime).toFixed(1)}s
                </span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Controls */}
        <div className="lg:col-span-4 p-8 lg:p-10 flex flex-col gap-6 bg-white">
          <div className="space-y-4">
            {/* Start & End Time Input Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={12}/> Start Time
                </label>
                <input 
                  type="number" step="0.1" value={startTime.toFixed(1)} 
                  onChange={(e) => handleRangeChange(e.target.value, "start")}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={12}/> End Time
                </label>
                <input 
                  type="number" step="0.1" value={endTime.toFixed(1)} 
                  onChange={(e) => handleRangeChange(e.target.value, "end")}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Video Format</label>
              <div className="grid grid-cols-2 gap-2">
                {["Original", "16:9", "1:1", "9:16"].map((opt) => (
                  <button key={opt} onClick={() => setLayout(opt)} className={`py-3 text-[11px] font-bold rounded-xl border transition-all ${layout === opt ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Toggle */}
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-xs transition-all border ${isMuted ? "bg-red-50 border-red-100 text-red-500" : "bg-indigo-50 border-indigo-50 text-indigo-600"}`}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {isMuted ? "Audio Removed" : "Original Audio"}
            </button>
          </div>

          <div className="mt-auto space-y-4">
            {loading && (
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-black text-indigo-600">
                  <span>PROCESSING...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-indigo-600" animate={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <button 
              onClick={handleTrim}
              disabled={!file || loading}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${isDone ? "bg-emerald-500 text-white" : "bg-gray-900 text-white hover:bg-black shadow-2xl disabled:opacity-20"}`}
            >
              {loading ? <Loader2 className="animate-spin" /> : isDone ? <CheckCircle2 /> : <Download size={18} />}
              {loading ? "Trimming..." : isDone ? "Ready to Download" : "Cut Video"}
            </button>
          </div>
        </div>
      </div>

      {/* How To Use Dropdown Section */}
      <div className="max-w-6xl mx-auto mt-6">
        <button 
          onClick={() => setShowHowTo(!showHowTo)}
          className="w-full flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3 text-gray-700 font-bold">
            <HelpCircle size={20} className="text-indigo-600" />
            <span>How to use this Video Cutter?</span>
          </div>
          <ChevronDown className={`transition-transform duration-300 ${showHowTo ? "rotate-180" : ""}`} />
        </button>
        
        <AnimatePresence>
          {showHowTo && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white border-x border-b border-gray-100 rounded-b-3xl px-8 pb-8"
            >
              <div className="grid md:grid-cols-3 gap-8 pt-6">
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-sm">1</div>
                  <h4 className="font-bold text-gray-900">Upload Video</h4>
                  <p className="text-sm text-gray-500">Select your video file from your device. We support MP4, WebM, and more.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-sm">2</div>
                  <h4 className="font-bold text-gray-900">Select Range</h4>
                  <p className="text-sm text-gray-500">Use the timeline sliders or type specific start and end times in seconds.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-sm">3</div>
                  <h4 className="font-bold text-gray-900">Cut & Download</h4>
                  <p className="text-sm text-gray-500">Choose your aspect ratio, click "Cut Video," and save the result instantly.</p>
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

export default VideoCutter;