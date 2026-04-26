import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Upload, Loader2, CheckCircle2, Scissors, 
  ShieldCheck, RefreshCw, Maximize,
  Settings, ChevronDown, Trash2, HelpCircle, Info, Play, Pause, Move
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Rnd } from "react-rnd";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import RelatedTools from "../../components/RelatedTools";

const ffmpeg = new FFmpeg();

const VideoCrop = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [cropRatio, setCropRatio] = useState("16:9");
  const [showGuide, setShowGuide] = useState(false);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [range, setRange] = useState({ start: 0, end: 0 });
  const [cropBox, setCropBox] = useState({ width: 200, height: 200, x: 50, y: 50 });
  const [videoMeta, setVideoMeta] = useState({ width: 0, height: 0, displayW: 0, displayH: 0 });

  const ratios = [
    { label: "16:9", val: "16:9", desc: "YouTube/TV", w: 1, h: 0.56 },
    { label: "9:16", val: "9:16", desc: "TikTok/Reels", w: 0.56, h: 1 },
    { label: "1:1", val: "1:1", desc: "Instagram", w: 1, h: 1 },
    { label: "4:3", val: "4:3", desc: "Old TV", w: 1, h: 0.75 },
  ];

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
      setIsDone(false);
      setProgress(0);
    }
  };

  const onVideoLoad = (e) => {
    const { videoWidth, videoHeight, clientWidth, clientHeight, duration } = e.target;
    setDuration(duration);
    setRange({ start: 0, end: duration });
    setVideoMeta({ width: videoWidth, height: videoHeight, displayW: clientWidth, displayH: clientHeight });
    setCropBox({ 
        width: clientWidth * 0.6, 
        height: clientHeight * 0.6, 
        x: clientWidth * 0.2, 
        y: clientHeight * 0.2 
    });
  };

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleCrop = async () => {
    if (!file || loading) return;
    setLoading(true);
    setIsDone(false);
    try {
      const inputName = "input_video";
      const outputName = "processed_video.mp4";
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const scaleX = videoMeta.width / videoMeta.displayW;
      const scaleY = videoMeta.height / videoMeta.displayH;

      const cropW = Math.round(cropBox.width * scaleX);
      const cropH = Math.round(cropBox.height * scaleY);
      const cropX = Math.round(cropBox.x * scaleX);
      const cropY = Math.round(cropBox.y * scaleY);

      await ffmpeg.exec([
        "-i", inputName,
        "-ss", `${range.start}`,
        "-to", `${range.end}`,
        "-vf", `crop=${cropW}:${cropH}:${cropX}:${cropY}`,
        "-c:a", "copy",
        outputName
      ]);
      
      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `Cropped_${file.name}`;
      a.click();
      setIsDone(true);
    } catch  {
      alert("Crop failed. Please try a different video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
          Video <span className="text-indigo-600">Crop</span>
        </h1>
        <p className="text-slate-500 font-medium tracking-tight">Recenter and crop your videos for any platform.</p>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-2 border border-slate-100">
        
        <div className="bg-[#0f172a] p-8 flex flex-col justify-center items-center relative overflow-hidden min-h-[500px]">
          {!file ? (
            <label className="w-full max-w-sm cursor-pointer group border-2 border-dashed border-slate-700 rounded-[32px] p-16 transition-all hover:border-indigo-500 text-center">
              <Upload className="text-indigo-500 mx-auto mb-4" size={48} />
              <p className="text-white font-bold">Select Video to Crop</p>
              <input type="file" hidden onChange={handleUpload} accept="video/*" />
            </label>
          ) : (
            <div className="w-full space-y-6">
              <div className="relative rounded-3xl overflow-hidden bg-black aspect-video shadow-2xl flex items-center justify-center p-2">
                <video 
                  ref={videoRef}
                  src={previewUrl} 
                  onLoadedMetadata={onVideoLoad}
                  className="max-w-full max-h-full opacity-60" 
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {videoMeta.displayW > 0 && (
                  <Rnd
                    size={{ width: cropBox.width, height: cropBox.height }}
                    position={{ x: cropBox.x, y: cropBox.y }}
                    onDragStop={(e, d) => setCropBox({ ...cropBox, x: d.x, y: d.y })}
                    onResizeStop={(e, direction, ref, delta, position) => {
                      setCropBox({
                        width: ref.offsetWidth,
                        height: ref.offsetHeight,
                        ...position,
                      });
                    }}
                    bounds="parent"
                    dragHandleClassName="drag-handle"
                    className="z-10 border-2 border-indigo-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
                  >
                    <div className="drag-handle w-full h-full cursor-move flex items-center justify-center relative">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white"></div>
                        <Move className="text-white/30" size={24} />
                    </div>
                  </Rnd>
                )}

                <button onClick={togglePlay} className="absolute bottom-4 left-4 z-20 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all">
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <button onClick={() => setFile(null)} className="absolute top-4 right-4 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-all z-20">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-4 bg-white/5 p-5 rounded-2xl">
                <div className="flex justify-between text-[10px] font-black uppercase text-indigo-400">
                  <span>Start: {range.start.toFixed(1)}s</span>
                  <span>End: {range.end.toFixed(1)}s</span>
                </div>
                <div className="relative h-6 flex items-center">
                  <div className="absolute w-full h-1.5 bg-slate-700 rounded-full" />
                  <div 
                    className="absolute h-1.5 bg-indigo-500 rounded-full z-10"
                    style={{ 
                      left: `${(range.start / duration) * 100}%`, 
                      width: `${((range.end - range.start) / duration) * 100}%` 
                    }}
                  />
                  <input 
                    type="range" min="0" max={duration} step="0.1" value={range.start}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const newStart = Math.min(val, range.end - 0.2);
                      setRange(prev => ({ ...prev, start: newStart }));
                      if (videoRef.current) videoRef.current.currentTime = newStart;
                    }}
                    style={{ pointerEvents: "auto" }}
                    className="absolute w-full h-6 appearance-none bg-transparent z-20 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-500"
                  />
                  <input 
                    type="range" min="0" max={duration} step="0.1" value={range.end}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const newEnd = Math.max(val, range.start + 0.2);
                      setRange(prev => ({ ...prev, end: newEnd }));
                      if (videoRef.current) videoRef.current.currentTime = newEnd;
                    }}
                    style={{ pointerEvents: "auto" }}
                    className="absolute w-full h-6 appearance-none bg-transparent z-20 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-10 flex flex-col justify-between">
          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Maximize size={14} className="text-indigo-600"/> Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ratios.map((r) => (
                  <button 
                    key={r.val} 
                    onClick={() => {
                        setCropRatio(r.val);
                        const newW = videoMeta.displayW * r.w;
                        const newH = videoMeta.displayW * r.h;
                        setCropBox({...cropBox, width: newW, height: newH});
                    }}
                    className={`flex flex-col items-start p-4 rounded-2xl border transition-all ${cropRatio === r.val ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"}`}
                  >
                    <span className="text-sm font-black">{r.label}</span>
                    <span className={`text-[10px] font-bold ${cropRatio === r.val ? "text-indigo-200" : "text-slate-400"}`}>{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
              <Info className="text-amber-500 shrink-0" size={20} />
              <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                Manually drag and resize the box on the video preview. Use the sliders below the video to trim the start and end times.
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            {loading && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-indigo-600 uppercase">
                  <span className="flex items-center gap-1"><RefreshCw size={12} className="animate-spin"/> Processing...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-indigo-600" animate={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            
            <button 
              onClick={handleCrop} 
              disabled={!file || loading} 
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all ${isDone ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-900 text-white hover:bg-indigo-700 disabled:opacity-20 shadow-xl"}`}
            >
              {loading ? <Loader2 className="animate-spin" /> : isDone ? <CheckCircle2 /> : <Scissors size={18} />}
              {loading ? "Processing..." : isDone ? "Download Result" : "Apply Crop & Export"}
            </button>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase flex items-center justify-center gap-2">
               <ShieldCheck size={12} className="text-emerald-500" /> Private & Secure Engine
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
            <span>How to use Video Crop?</span>
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
                    <p className="text-xs text-slate-500 mt-1 font-medium">Add the video you want to resize. We support MP4, MOV, and more.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl font-black text-indigo-100">02</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tighter">Adjust Area</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Drag and resize the overlay box to choose your crop area.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl font-black text-indigo-100">03</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tighter">Trim & Export</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Use the range sliders to cut duration, then click Apply.</p>
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

export default VideoCrop;