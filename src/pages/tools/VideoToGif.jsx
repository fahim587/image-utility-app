import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Upload, Loader2, CheckCircle2, 
  RefreshCw, Settings, Trash2, 
  HelpCircle, Info, Play, Pause, ImageIcon, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import RelatedTools from "../../components/RelatedTools";

const ffmpeg = new FFmpeg();

const VideoToGif = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [quality, setQuality] = useState("large");
  const [layout, setLayout] = useState("original");
  const [fillScreen, setFillScreen] = useState(false);
  const [fps, setFps] = useState(10);
  const [scale, setScale] = useState(480);

  const [duration, setDuration] = useState(0);
  const [range, setRange] = useState({ start: 0, end: 0 });
  const [thumbnails, setThumbnails] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const videoRef = useRef(null);

  // FFmpeg loader
  const loadFFmpeg = useCallback(async () => {
    if (ffmpeg.loaded) return;
    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadFFmpeg();
    const handleProgress = ({ progress: _P }) => setProgress(Math.round(_P * 100));
    ffmpeg.on("progress", handleProgress);
    return () => {
      ffmpeg.off("progress", handleProgress);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [loadFFmpeg, previewUrl]);

  // File upload
  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setIsDone(false);
      setProgress(0);
      setThumbnails([]);
    }
  };

  // Video load -> generate thumbnails
  const onVideoLoad = async (e) => {
    const dur = e.target.duration;
    setDuration(dur);
    setRange({ start: 0, end: dur });

    const video = e.target;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const frames = [];
    const captureCount = 12;

    for (let i = 0; i < captureCount; i++) {
      video.currentTime = (dur / captureCount) * i;
      await new Promise((r) => setTimeout(r, 150));
      canvas.width = 160;
      canvas.height = 90;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      frames.push(canvas.toDataURL("image/jpeg"));
    }
    setThumbnails(frames);
    video.currentTime = 0;
  };

  // Play/Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Convert to GIF
  const convertToGif = async () => {
    if (!file || loading) return;
    setLoading(true);
    setIsDone(false);
    try {
      const inputName = "input_video";
      const outputName = "output.gif";
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      let filter = `fps=${fps}`;
      if (layout === "square") {
        filter += `,scale='if(gt(iw,ih),-1,${scale})':'if(gt(iw,ih),${scale},-1)',crop=${scale}:${scale}`;
      } else if (layout === "landscape") {
        filter += `,scale=${scale}:-1,pad=${scale}:${Math.round(scale * (9/16))}:(ow-iw)/2:(oh-ih)/2`;
      } else if (layout === "portrait") {
        filter += `,scale=-1:${scale},pad:${Math.round(scale * (9/16))}:${scale}:(ow-iw)/2:(oh-ih)/2`;
      } else {
        filter += `,scale=${scale}:-1:flags=lanczos`;
      }
      filter += `,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`;

      const qualityMap = { small: "20", medium: "15", large: "10" };

      await ffmpeg.exec([
        "-i", inputName,
        "-ss", `${range.start}`,
        "-to", `${range.end}`,
        "-vf", filter,
        "-q:v", qualityMap[quality],
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([data.buffer], { type: "image/gif" }));

      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.split('.')[0]}.gif`;
      a.click();
      setIsDone(true);
    } catch {
      alert("Conversion failed. Try a smaller segment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-[#f8fafc]">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
          Video to <span className="text-indigo-600">GIF</span>
        </h1>
        <p className="text-slate-500 font-medium">Create high-quality animated GIFs instantly.</p>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-2 border border-slate-100">
        {/* Video & Upload */}
        <div className="bg-[#0f172a] p-8 flex flex-col justify-start items-center relative min-h-[500px]">
          {!file ? (
            <label className="w-full max-w-sm cursor-pointer border-2 border-dashed border-slate-700 rounded-[32px] p-16 transition-all hover:border-indigo-500 text-center">
              <Upload className="text-indigo-500 mx-auto mb-4" size={48} />
              <p className="text-white font-bold">Upload Video</p>
              <input type="file" hidden onChange={handleUpload} accept="video/*" />
            </label>
          ) : (
            <>
              <div className={`relative rounded-3xl overflow-hidden bg-black shadow-2xl flex items-center justify-center transition-all 
                ${layout === 'square' ? 'aspect-square' : layout === 'portrait' ? 'aspect-[9/16] max-h-[450px]' : 'aspect-video'} w-full`}>
                <video 
                  ref={videoRef}
                  src={previewUrl} 
                  onLoadedMetadata={onVideoLoad}
                  className={`max-w-full max-h-full ${fillScreen ? 'object-cover w-full h-full' : 'object-contain'}`}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <button onClick={togglePlay} className="absolute bottom-4 left-4 z-20 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={() => setFile(null)} className="absolute top-4 right-4 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 z-20">
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Thumbnail strip + dual-handle slider */}
              <div className="relative w-full bg-slate-800 rounded-xl p-3 mt-6 select-none">
                <div className="relative h-14 w-full bg-slate-900 rounded-lg overflow-hidden flex items-center">
                  {thumbnails.length > 0 ? (
                    thumbnails.map((img, i) => (
                      <img key={i} src={img} className="flex-1 h-full object-cover opacity-40 border-r border-slate-800" />
                    ))
                  ) : (
                    [...Array(12)].map((_, i) => (
                      <div key={i} className="flex-1 h-full border-r border-slate-700/50 flex items-center justify-center bg-indigo-500/5">
                        <ImageIcon size={14} className="text-slate-700/30" />
                      </div>
                    ))
                  )}

                  {/* Highlight range */}
                  <div
                    className="absolute h-full bg-indigo-500/30 border-x-4 border-white z-20 pointer-events-none"
                    style={{
                      left: `${(range.start / duration) * 100}%`,
                      width: `${((range.end - range.start) / duration) * 100}%`,
                    }}
                  >
                    <span className="absolute left-1/2 -translate-x-1/2 -top-1 text-[10px] font-black text-white bg-indigo-600 px-2 rounded-full z-20">
                      {(range.end - range.start).toFixed(1)}s
                    </span>
                  </div>
                </div>

                {/* Dual-handle sliders */}
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step="0.01"
                  value={range.start}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setRange(prev => ({ ...prev, start: Math.min(val, prev.end - 0.1) }));
                    if(videoRef.current) videoRef.current.currentTime = val;
                  }}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-30"
                />
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step="0.01"
                  value={range.end}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setRange(prev => ({ ...prev, end: Math.max(val, prev.start + 0.1) }));
                    if(videoRef.current) videoRef.current.currentTime = val;
                  }}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
              </div>
            </>
          )}
        </div>

        {/* Settings & Generate */}
        <div className="p-10 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-slate-400">
              <Settings size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Conversion Settings</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700">File Quality</label>
                <div className="grid grid-cols-3 gap-3">
                  {["small", "medium", "large"].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`py-2 text-[10px] font-black uppercase rounded-xl border transition-all ${quality === q ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700">Layout</label>
                  <select 
                    value={layout} 
                    onChange={(e) => setLayout(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none focus:ring-2 ring-indigo-500/20"
                  >
                    <option value="original">Original</option>
                    <option value="square">Square (1:1)</option>
                    <option value="landscape">Landscape (16:9)</option>
                    <option value="portrait">Portrait (9:16)</option>
                  </select>
                </div>
                <div className="space-y-3 flex flex-col">
                  <label className="text-xs font-bold text-slate-700">Fill Screen</label>
                  <div 
                    onClick={() => setFillScreen(!fillScreen)}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${fillScreen ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${fillScreen ? 'left-7' : 'left-1'}`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Resolution</label>
                  <select value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none">
                    <option value={320}>320px</option>
                    <option value={480}>480px</option>
                    <option value={720}>720px</option>
                    <option value={1080}>1080px</option>
                    <option value={1920}>1920px</option>
                    <option value={0}>Original</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">FPS ({fps})</label>
                  <input type="range" min="5" max="30" value={fps} onChange={(e) => setFps(Number(e.target.value))} className="w-full accent-indigo-600" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-3">
              <Info className="text-indigo-500 shrink-0" size={18} />
              <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                Large quality and high FPS result in better visuals but significantly larger file sizes.
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            {loading && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-indigo-600 uppercase">
                  <span className="flex items-center gap-1"><RefreshCw size={12} className="animate-spin"/> Processing Video...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-indigo-600" animate={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            
            <button 
              onClick={convertToGif} 
              disabled={!file || loading} 
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isDone ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-900 text-white hover:bg-indigo-700 disabled:opacity-20 shadow-xl"}`}
            >
              {loading ? <Loader2 className="animate-spin" /> : isDone ? <CheckCircle2 /> : <ImageIcon size={18} />}
              {loading ? "Converting..." : isDone ? "Download GIF" : "Generate GIF"}
            </button>
          </div>
        </div>
      </div>

      {/* Guide */}
      <div className="max-w-6xl mx-auto mt-6">
        <button 
          onClick={() => setShowGuide(!showGuide)}
          className="w-full flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 text-slate-700 font-bold">
            <HelpCircle size={20} className="text-indigo-600" />
            <span>How to use Video to GIF?</span>
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
              <div className="p-8 grid md:grid-cols-3 gap-6 bg-white border-x border-b border-slate-100 rounded-b-3xl shadow-sm">
                <div className="flex gap-4">
                  <div className="text-2xl font-black text-indigo-100">01</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tighter">Upload</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Select any MP4, WebM or MOV file from your computer.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl font-black text-indigo-100">02</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tighter">Trim & Style</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Use handles to cut the clip. Choose Square, Landscape, or Portrait layout.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl font-black text-indigo-100">03</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tighter">Export</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Hit Generate. Your browser converts it without uploading to servers.</p>
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

export default VideoToGif;