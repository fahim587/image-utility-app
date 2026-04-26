import React, { useState, useEffect, useCallback } from "react";
import { 
  Upload, Download, Music, Loader2, 
  Zap, CheckCircle2, FileAudio, X, RefreshCcw, Settings2, Info, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import RelatedTools from "../../components/RelatedTools";

const ffmpeg = new FFmpeg();

const AudioConverter = () => {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [format, setFormat] = useState("mp3");
  const [bitrate, setBitrate] = useState("192k");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // মেমোরি ক্লিনআপ ফাংশন
  const revokeURL = useCallback(() => {
    if (audioURL) URL.revokeObjectURL(audioURL);
  }, [audioURL]);

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
    ffmpeg.on("progress", ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });
    // কম্পোনেন্ট লোড হওয়ার সময় FFmpeg তৈরি রাখা
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

  const convertAudio = async () => {
    if (!file || loading) return;
    setLoading(true);
    setIsDone(false);
    setProgress(0);

    try {
      if (!loaded) await prepareFFmpeg();

      // সেফ ফাইল নেমিং (স্পেস ও স্পেশাল ক্যারেক্টার হ্যান্ডলিং)
      const inputName = `input_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const outputName = `output_${Date.now()}.${format}`;

      // ফাইল রাইট করা
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // কনভার্ট কমান্ড
      await ffmpeg.exec(["-i", inputName, "-b:a", bitrate, outputName]);

      // ফাইল রিড করা
      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([data.buffer], { type: `audio/${format}` }));

      // ডাউনলোড
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.split(".")[0]}_GOOGIZ.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setIsDone(true);

      // মেমোরি ক্লিনআপ (FFmpeg ইন্টারনাল ফাইল ডিলিট)
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (err) {
      console.error(err);
      alert("Error during conversion. Please check console.");
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
        <div className="text-center mb-10">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="inline-flex items-center justify-center w-12 h-12 bg-amber-50 rounded-2xl mb-4 border border-amber-100 shadow-sm">
            <Music className="text-amber-600" size={24} />
          </motion.div>
          <h1 className="text-3xl font-black text-amber-500 ">Audio converter</h1>
          <p className="text-gray-400 font-bold mt-1 text-[10px] uppercase tracking-[0.3em]">WASM-Powered • Secure • No Servers</p>
        </div>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden grid lg:grid-cols-5 mb-8">
          {/* Left Side */}
          <div className="lg:col-span-3 p-8 border-r border-gray-50 bg-[#fafafb]/50">
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.label key="up" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[350px] border-2 border-dashed border-gray-200 rounded-[32px] cursor-pointer hover:bg-amber-50/30 hover:border-amber-300 transition-all group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="text-amber-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-700">Upload audio file</p>
                  <input type="file" hidden accept="audio/*" onChange={handleUpload} />
                </motion.label>
              ) : (
                <motion.div key="pre" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><FileAudio size={28} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 truncate">{file.name}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button onClick={reset} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400"><X size={20} /></button>
                  </div>
                  {audioURL && <audio src={audioURL} controls className="w-full h-12" />}
                  {loading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-amber-600 uppercase">
                        <span>Encoding Files...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-amber-50 rounded-full overflow-hidden border border-amber-100">
                        <motion.div className="h-full bg-amber-500" animate={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side */}
          <div className="lg:col-span-2 p-8 space-y-8 flex flex-col justify-center">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Output Format</label>
              <div className="grid grid-cols-2 gap-2">
                {["mp3", "wav", "aac", "ogg"].map((f) => (
                  <button key={f} onClick={() => {setFormat(f); setIsDone(false);}} className={`py-3 rounded-xl text-xs font-black uppercase transition-all ${format === f ? "bg-gray-900 text-white shadow-lg" : "bg-gray-50 text-gray-400"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Audio Quality</label>
              <select value={bitrate} onChange={(e) => {setBitrate(e.target.value); setIsDone(false);}} className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer">
                <option value="128k">128 kbps (Mobile Ready)</option>
                <option value="192k">192 kbps (Standard)</option>
                <option value="320k">320 kbps (Lossless)</option>
              </select>
            </div>

            <button onClick={convertAudio} disabled={!file || loading} className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${isDone ? "bg-emerald-500 text-white shadow-emerald-100" : "bg-amber-500 text-white shadow-amber-100 hover:bg-amber-600 disabled:opacity-50"}`}>
              {loading ? <><Loader2 className="animate-spin" /> Processing...</> : isDone ? <><CheckCircle2 /> Success</> : <><Zap fill="currentColor" /> Convert Now</>}
            </button>
          </div>
        </div>

        {/* How to Use Dropdown */}
        <div className="max-w-4xl mx-auto mb-10">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-gray-700 flex items-center gap-2">
              <Info size={20} className="text-amber-500" /> How to use Audio Converter?
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
                    <p className="text-gray-600 text-sm ">Upload your audio file (MP3, WAV, etc.) by clicking the upload area.</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">2</span>
                    <p className="text-gray-600 text-sm ">Choose your preferred output format and bitrate for audio quality.</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">3</span>
                    <p className="text-gray-600 text-sm ">Click "Convert Now". The processing happens entirely in your browser. Download starts automatically.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-8 opacity-40">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"><Settings2 size={14}/> WASM 0.12</div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"><RefreshCcw size={14}/> Instant Save</div>
        </div>
      </div>
      <RelatedTools categoryId="audio" />
    </div>
  );
};

export default AudioConverter;