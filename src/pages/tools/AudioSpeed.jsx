import React, { useState, useEffect, useCallback } from "react";
import { 
  FastForward, Upload, Download, Loader2, 
  Zap, CheckCircle2, FileAudio, X, Timer, Gauge, Info, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import RelatedTools from "../../components/RelatedTools";


// গ্লোবাল ইন্সট্যান্স যাতে বারবার লোড হতে গিয়ে ক্র্যাশ না করে
const ffmpeg = new FFmpeg();

const AudioSpeed = () => {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [speed, setSpeed] = useState("1.0"); 
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

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
    const handleProgress = ({ progress }) => {
      setProgress(Math.round(progress * 100));
    };
    ffmpeg.on("progress", handleProgress);
    prepareFFmpeg();
    return () => {
      ffmpeg.off("progress", handleProgress);
      revokeURL();
    };
  }, [revokeURL, prepareFFmpeg]);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith("audio/")) {
      revokeURL();
      setFile(selected);
      setAudioURL(URL.createObjectURL(selected));
      setIsDone(false);
      setProgress(0);
    }
  };

  const applySpeed = async () => {
    if (!file || loading) return;
    setLoading(true);
    setIsDone(false);
    setProgress(0);

    try {
      // সেফটি চেক: FFmpeg লোড না থাকলে আবার চেষ্টা করা
      if (!loaded) await prepareFFmpeg();

      const inputExt = file.name.split('.').pop() || 'mp3';
      const inputName = `in_${Date.now()}.${inputExt}`;
      const outputName = `out_${Date.now()}.mp3`;

      // ১. ফাইল রাইট করা
      const fileData = await fetchFile(file);
      await ffmpeg.writeFile(inputName, fileData);

      // ২. ফিল্টার চেইন লজিক (৪.০x এর জন্য স্ট্যাবল মেথড)
      let filter;
      const s = parseFloat(speed);
      if (s > 2.0) {
        filter = `atempo=2.0,atempo=${(s / 2.0).toFixed(1)}`;
      } else {
        filter = `atempo=${s}`;
      }

      // ৩. কমান্ড রান করা (ক্লিন আউটপুট নিশ্চিত করতে)
      await ffmpeg.exec([
        "-i", inputName,
        "-filter:a", filter,
        "-vn", // ভিডিও থাকলে তা ইগনোর করা
        "-ar", "44100", // স্ট্যান্ডার্ড স্যাম্পল রেট
        "-ac", "2", // স্টিরিও চ্যানেল
        "-b:a", "192k", // ভালো কোয়ালিটি বিটরেট
        outputName
      ]);

      // ৪. রেজাল্ট রিড করা
      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' }));

      const a = document.createElement("a");
      a.href = url;
      a.download = `Speed_${speed}x_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setIsDone(true);
      
      // ৫. মেমোরি ক্লিনআপ (FFmpeg ইন্টারনাল ফাইল ডিলিট করা)
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

    } catch (err) {
      console.error("Detailed Error:", err);
      alert("Processing failed. This usually happens with very large files or browser memory limits. Try a smaller file.");
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
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-2xl mb-4 border border-purple-100 text-amber-500">
            <FastForward size={24} />
          </motion.div>
          <h1 className="text-3xl font-black text-amber-500">Audio Speed</h1>
          <p className="text-gray-400 font-bold mt-1 text-[10px] uppercase tracking-[0.3em]">Smart Tempo Adjustment</p>
        </div>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden grid lg:grid-cols-5 mb-8">
          <div className="lg:col-span-3 p-8 border-r border-gray-50 bg-[#fafafb]/50">
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.label key="up" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[350px] border-2 border-dashed border-gray-200 rounded-[32px] cursor-pointer hover:bg-purple-50/30 hover:border-amber-300 transition-all group">
                  <Upload className="text-amber-500 mb-4" size={40} />
                  <p className="text-lg font-bold text-gray-700">Drop your audio here</p>
                  <input type="file" hidden accept="audio/*" onChange={handleUpload} />
                </motion.label>
              ) : (
                <motion.div key="pre" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
                    <FileAudio className="text-amber-500" size={28} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 truncate">{file.name}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase">Audio Source</p>
                    </div>
                    <button onClick={reset} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl"><X size={20} /></button>
                  </div>
                  {audioURL && <audio src={audioURL} controls className="w-full h-12" />}
                  {loading && (
                    <div className="space-y-2 pt-4">
                      <div className="flex justify-between text-[10px] font-black text-amber-500 uppercase">
                        <span>Speeding Up...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-amber-500" animate={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-2 p-8 space-y-8 flex flex-col justify-center">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4  flex items-center gap-2"><Gauge size={14}/> Choose Speed</label>
              <div className="grid grid-cols-2 gap-2">
                {["0.5", "1.0", "1.5", "2.0", "3.0", "4.0"].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => {setSpeed(s); setIsDone(false);}} 
                    className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${speed === s ? "bg-gray-900 text-white shadow-lg" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={applySpeed} 
              disabled={!file || loading} 
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${isDone ? "bg-emerald-500 text-white" : "bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 shadow-lg shadow-amber-100"}`}
            >
              {loading ? <><Loader2 className="animate-spin" /> Processing...</> : isDone ? <><CheckCircle2 /> Success</> : <><Zap fill="currentColor" /> Apply Speed</>}
            </button>
          </div>
        </div>

        {/* How to Use Dropdown Section */}
        <div className="max-w-4xl mx-auto mb-10">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-gray-700 flex items-center gap-2">
              <Info size={20} className="text-amber-500" /> How to use Audio Speed?
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
                    <p className="text-gray-600 text-sm ">Upload your audio file by clicking the box or dragging a file into it.</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">2</span>
                    <p className="text-gray-600 text-sm ">Select the desired speed level (e.g., 0.5x for slow motion, 4.0x for ultra-fast).</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">3</span>
                    <p className="text-gray-600 text-sm ">Click "Apply Speed" to process. The processed file will be downloaded automatically once finished.</p>
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

export default AudioSpeed;