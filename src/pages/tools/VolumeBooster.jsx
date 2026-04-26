import React, { useState, useEffect, useCallback } from "react";
import { 
  Volume2, Upload, Download, Loader2, 
  Zap, CheckCircle2, FileAudio, X, Info, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import RelatedTools from "../../components/RelatedTools";

const ffmpeg = new FFmpeg();

const VolumeBooster = () => {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [boostLevel, setBoostLevel] = useState("2");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // মেমোরি ক্লিনআপ ফাংশন
  const revokeURL = useCallback(() => {
    if (audioURL) URL.revokeObjectURL(audioURL);
  }, [audioURL]);

  // FFmpeg লোড করার ফাংশন (useCallback ব্যবহার করে ESLint ওয়ার্নিং ফিক্স করা হয়েছে)
  const prepareFFmpeg = useCallback(async () => {
    if (loaded || ffmpeg.loaded) {
      setLoaded(true);
      return;
    }
    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      setLoaded(true);
    } catch (err) {
      console.error("FFmpeg Load Error:", err);
    }
  }, [loaded]);

  useEffect(() => {
    // প্রোগ্রেস ট্র্যাকিং
    ffmpeg.on("progress", ({ progress: p }) => {
      setProgress(Math.round(p * 100));
    });
    
    prepareFFmpeg();

    // কম্পোনেন্ট আনমাউন্ট হলে মেমোরি ক্লিয়ার করা
    return () => revokeURL();
  }, [revokeURL, prepareFFmpeg]);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith("audio/")) {
      revokeURL(); // আগের ফাইল মেমোরি থেকে মুছে ফেলা
      setFile(selected);
      setAudioURL(URL.createObjectURL(selected));
      setIsDone(false);
      setProgress(0);
    }
  };

  const boostVolume = async () => {
    if (!file || loading) return;
    setLoading(true);
    setIsDone(false);
    setProgress(0);

    try {
      if (!loaded) await prepareFFmpeg();

      const inputExt = file.name.split('.').pop();
      const inputName = `input_${Date.now()}.${inputExt}`;
      const outputName = `output_${Date.now()}.mp3`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      await ffmpeg.exec([
        "-i", inputName, 
        "-filter:a", `volume=${boostLevel}`, 
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' }));

      const a = document.createElement("a");
      a.href = url;
      a.download = `Boosted_GOOGIZ_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setIsDone(true);
    } catch (err) {
      console.error("Boosting Error:", err);
      alert("Boosting failed. Try a smaller file or refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    revokeURL();
    setFile(null);
    setAudioURL(null);
    setIsDone(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#fcfcfd]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="inline-flex items-center justify-center w-12 h-12 bg-amber-50 rounded-2xl mb-4 border border-amber-100 shadow-sm">
            <Volume2 className="text-amber-500" size={24} />
          </motion.div>
          <h1 className="text-3xl font-black text-amber-500">Volume Booster</h1>
          <p className="text-gray-400 font-bold mt-1 text-[10px] uppercase tracking-[0.3em]">Enhance Audio Amplitude Safely</p>
        </div>

        {/* Interface */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden grid lg:grid-cols-5 mb-8">
          
          <div className="lg:col-span-3 p-8 border-r border-gray-50 bg-[#fafafb]/50">
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.label key="up" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[350px] border-2 border-dashed border-gray-200 rounded-[32px] cursor-pointer hover:bg-amber-50/30 hover:border-amber-300 transition-all group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="text-amber-500" />
                  </div>
                  <p className="text-lg font-bold text-gray-700">Upload audio for boosting</p>
                  <input type="file" hidden accept="audio/*" onChange={handleUpload} />
                </motion.label>
              ) : (
                <motion.div key="pre" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><FileAudio size={28} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 truncate">{file.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Input Audio File</p>
                    </div>
                    <button onClick={reset} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"><X size={20} /></button>
                  </div>
                  {audioURL && <audio src={audioURL} controls className="w-full h-12" />}
                  
                  {loading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-blue-600 uppercase">
                        <span>Boosting Volume...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-blue-500" animate={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-2 p-8 space-y-8 flex flex-col justify-center">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Select Boost Level</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "1.5x (Soft)", val: "1.5" },
                  { label: "2x (Normal)", val: "2" },
                  { label: "3x (Loud)", val: "3" },
                  { label: "4x (Extreme)", val: "4" }
                ].map((b) => (
                  <button 
                    key={b.val} 
                    onClick={() => {setBoostLevel(b.val); setIsDone(false);}} 
                    className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${boostLevel === b.val ? "bg-gray-900 text-white shadow-lg" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
              <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-amber-800 font-medium ">
                Boosting too high (3x+) may cause audio distortion depending on the original quality.
              </p>
            </div>

            <button 
              onClick={boostVolume} 
              disabled={!file || loading} 
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${isDone ? "bg-emerald-500 text-white shadow-emerald-100" : "bg-amber-500 text-white shadow-amber-100 hover:bg-amber-600 disabled:opacity-50"}`}
            >
              {loading ? <><Loader2 className="animate-spin" /> Processing...</> : isDone ? <><CheckCircle2 /> Success</> : <><Zap fill="currentColor" /> Boost & Save</>}
            </button>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="max-w-4xl mx-auto mb-10">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-gray-700 flex items-center gap-2">
              <Info size={20} className="text-amber-500" /> How to use Volume Booster?
            </span>
            <ChevronDown className={`transition-transform duration-300 ${showGuide ? "rotate-180" : ""}`} />
          </button>
          
          <AnimatePresence>
            {showGuide && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 bg-white border-x border-b border-gray-100 rounded-b-[24px] space-y-4">
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">1</span>
                    <p className="text-gray-600 text-sm ">Click the upload area to select your audio file (MP3, WAV, etc.) from your device.</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">2</span>
                    <p className="text-gray-600 text-sm ">Choose your desired boost level from 1.5x up to 4x. Normal (2x) is recommended for clarity.</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">3</span>
                    <p className="text-gray-600 text-sm ">Click "Boost & Save". The tool will process the audio in your browser and automatically download the enhanced file.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <RelatedTools categoryId="audio" />
      </div>
    </div>
  );
};

export default VolumeBooster;