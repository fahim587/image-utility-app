import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Volume2,
  Upload,
  Loader2,
  Zap,
  CheckCircle2,
  FileAudio,
  X,
  Info,
  ChevronDown,
  Download,
  RotateCcw
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
  const [format, setFormat] = useState("mp3");

  const [normalize, setNormalize] = useState(false);
  const [bassBoost, setBassBoost] = useState(false);
  const [noiseReduction, setNoiseReduction] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isFFmpegReady, setIsFFmpegReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [outputURL, setOutputURL] = useState(null);

  // Revoke URLs to prevent memory leaks
  const revokeURLs = useCallback(() => {
    if (audioURL) URL.revokeObjectURL(audioURL);
    if (outputURL) URL.revokeObjectURL(outputURL);
  }, [audioURL, outputURL]);

  // Load FFmpeg Core
  const loadFFmpeg = async () => {
    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm")
      });
      setIsFFmpegReady(true);
    } catch (err) {
      console.error("FFmpeg Load Error:", err);
    }
  };

  useEffect(() => {
    loadFFmpeg();
    ffmpeg.on("progress", ({ progress: p }) => {
      setProgress(Math.round(p * 100));
    });
    return () => revokeURLs();
  }, []);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith("audio/")) {
      revokeURLs();
      setFile(selected);
      setAudioURL(URL.createObjectURL(selected));
      setIsDone(false);
      setOutputURL(null);
      setProgress(0);
    }
  };

  const processAudio = async () => {
    if (!file || loading) return;

    setLoading(true);
    setIsDone(false);
    setProgress(0);

    try {
      const inputExt = file.name.split(".").pop();
      const inputName = `input.${inputExt}`;
      const outputName = `output.${format}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Filter Chain
      let filters = [];
      filters.push(`volume=${boostLevel}`);
      if (normalize) filters.push("loudnorm");
      if (bassBoost) filters.push("bass=g=10:f=100:w=0.5"); // Optimized bass boost
      if (noiseReduction) filters.push("afftdn");

      await ffmpeg.exec([
        "-i", inputName,
        "-af", filters.join(","),
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: `audio/${format}` })
      );

      setOutputURL(url);
      setIsDone(true);

      // Trigger Auto-download
      const a = document.createElement("a");
      a.href = url;
      a.download = `Boosted_GOOGIZ_${Date.now()}.${format}`;
      a.click();

    } catch (err) {
      console.error("Processing Error:", err);
      alert("Error processing audio. Please try a different file.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    revokeURLs();
    setFile(null);
    setAudioURL(null);
    setOutputURL(null);
    setIsDone(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#fcfcfd]">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-50 rounded-2xl mb-4 border border-amber-100 shadow-sm">
            <Volume2 className="text-amber-500" size={28} />
          </div>
          <h1 className="text-4xl font-black text-slate-900">
            Volume <span className="text-amber-500">Booster</span>
          </h1>
          <p className="text-gray-400 font-bold mt-2 text-xs uppercase tracking-widest">
            Professional Audio Enhancer Online
          </p>
        </header>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden grid lg:grid-cols-5 mb-10">
          {/* Main Upload Section */}
          <div className="lg:col-span-3 p-8 border-r border-gray-50 flex flex-col justify-center bg-gray-50/30">
            {!file ? (
              <label className="flex flex-col items-center justify-center h-[350px] border-3 border-dashed border-gray-200 rounded-[32px] cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all group">
                <div className="bg-white p-5 rounded-full shadow-md group-hover:scale-110 transition-transform">
                  <Upload className="text-amber-500" size={40} />
                </div>
                <p className="font-bold text-slate-700 mt-6 text-lg">Choose Audio File</p>
                <p className="text-gray-400 text-sm mt-1">MP3, WAV, OGG supported</p>
                <input type="file" hidden accept="audio/*" onChange={handleUpload} />
              </label>
            ) : (
              <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 relative">
                  <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
                    <FileAudio size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400 uppercase">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button onClick={reset} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100">
                   <audio src={audioURL} controls className="w-full" />
                </div>

                {loading && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-amber-600 uppercase tracking-tighter">
                      <span>Processing Audio...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="bg-amber-500 h-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls Section */}
          <div className="lg:col-span-2 p-8 space-y-8 bg-white">
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} className="text-amber-500" /> Boost Intensity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["1.5", "2", "3", "4", "5"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setBoostLevel(level)}
                    className={`py-2 rounded-xl font-bold transition-all ${boostLevel === level ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'bg-gray-50 text-slate-500 hover:bg-gray-100'}`}
                  >
                    {level}x
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Enhancements</label>
              {[
                { id: "norm", label: "Normalize Audio", state: normalize, set: setNormalize },
                { id: "bass", label: "Bass Boost", state: bassBoost, set: setBassBoost },
                { id: "noise", label: "Noise Reduction", state: noiseReduction, set: setNoiseReduction }
              ].map((opt) => (
                <label key={opt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-bold text-slate-700">{opt.label}</span>
                  <input
                    type="checkbox"
                    checked={opt.state}
                    onChange={(e) => opt.set(e.target.checked)}
                    className="w-5 h-5 accent-amber-500"
                  />
                </label>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              >
                <option value="mp3">MP3 High Quality</option>
                <option value="wav">WAV Lossless</option>
                <option value="ogg">OGG Vorbis</option>
              </select>
            </div>

            <button
              onClick={processAudio}
              disabled={!file || loading || !isFFmpegReady}
              className="w-full py-5 bg-slate-900 text-white font-black rounded-[20px] shadow-xl hover:bg-amber-600 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
            >
              {!isFFmpegReady ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Initializing...
                </>
              ) : loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Processing
                </>
              ) : isDone ? (
                <>
                  <Download size={18} /> Download Again
                </>
              ) : (
                <>
                  <Zap size={18} fill="currentColor" /> Boost & Download
                </>
              )}
            </button>
          </div>
        </div>

        <RelatedTools categoryId="audio" />
      </div>
    </div>
  );
};

export default VolumeBooster;