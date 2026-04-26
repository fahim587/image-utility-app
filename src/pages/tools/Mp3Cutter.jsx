import React, { useState, useRef, useEffect } from "react";
import { 
  Music, Scissors, Play, Pause, Trash2, 
  Upload, Volume2, Download, Zap, ChevronDown, Info, Repeat, RotateCw, RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RelatedTools from "../../components/RelatedTools";

const Mp3Cutter = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [range, setRange] = useState({ start: 10, end: 90 });
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [format, setFormat] = useState("mp3");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  
  const [bars] = useState(() => 
    [...Array(80)].map(() => ({ height: Math.floor(Math.random() * 40) + 15 }))
  );
  
  const [history, setHistory] = useState([{ start: 10, end: 90 }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const audioRef = useRef(null);
  const containerRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("audio/")) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setHistory([{ start: 10, end: 90 }]);
      setHistoryIndex(0);
    }
  };

  const onLoadedMetadata = () => {
    if(audioRef.current){
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleWaveformClick = (e) => {
    if (!containerRef.current || !duration) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    audioRef.current.currentTime = (x / rect.width) * duration;
  };

  const updateHistory = (newRange) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newRange);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setRange(prev);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setRange(next);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleDrag = (e, type) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const moveHandler = (moveEvent) => {
      const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
      const percent = (x / rect.width) * 100;
      
      setRange(prev => {
        if (type === 'start' && percent < prev.end - 2) return { ...prev, start: percent };
        if (type === 'end' && percent > prev.start + 2) return { ...prev, end: percent };
        return prev;
      });
    };

    const upHandler = () => {
      setRange(currentRange => {
        updateHistory(currentRange);
        return currentRange;
      });
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
  };

  const handleExport = async () => {
    if (!audioUrl) return;
    const startTime = (range.start / 100) * duration;
    const endTime = (range.end / 100) * duration;
    
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const cutDuration = endTime - startTime;
    const newBuffer = audioCtx.createBuffer(
      audioBuffer.numberOfChannels,
      Math.max(1, Math.floor(cutDuration * audioBuffer.sampleRate)),
      audioBuffer.sampleRate
    );

    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      const channelData = audioBuffer.getChannelData(i);
      const newChannelData = newBuffer.getChannelData(i);
      const startOffset = Math.floor(startTime * audioBuffer.sampleRate);
      
      for (let j = 0; j < newChannelData.length; j++) {
        let sample = channelData[startOffset + j] || 0;
        
        if (fadeIn && j < audioBuffer.sampleRate * 2) {
          sample *= (j / (audioBuffer.sampleRate * 2));
        }
        
        if (fadeOut && j > newChannelData.length - (audioBuffer.sampleRate * 2)) {
          const remaining = newChannelData.length - j;
          sample *= (remaining / (audioBuffer.sampleRate * 2));
        }

        newChannelData[j] = sample;
      }
    }

    const wavBuffer = (function bufferToWav(abuffer) {
      let numOfChan = abuffer.numberOfChannels,
          length = abuffer.length * numOfChan * 2 + 44,
          buffer = new ArrayBuffer(length),
          view = new DataView(buffer),
          pos = 0;

      function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }
      function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }

      setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157);
      setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan);
      setUint32(abuffer.sampleRate); setUint32(abuffer.sampleRate * 2 * numOfChan);
      setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164); setUint32(length - pos - 4);

      for (let i = 0; i < abuffer.length; i++) {
        for (let channel = 0; channel < numOfChan; channel++) {
          let s = Math.max(-1, Math.min(1, abuffer.getChannelData(channel)[i]));
          view.setInt16(pos, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
          pos += 2;
        }
      }
      return buffer;
    })(newBuffer);

    const mimeTypes = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg'
    };

    const blob = new Blob([wavBuffer], { type: mimeTypes[format] });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `GOOGIZ-cut-${Date.now()}.${format}`;
    link.click();
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = speed;
      audioRef.current.loop = isLooping;
    }
  }, [volume, speed, isLooping]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <motion.div initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} className="inline-block p-3 bg-amber-100 rounded-3xl text-amber-600 mb-4">
            <Music size={32} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl font-black text-gray-900 ">
            Audio <span className="text-amber-600">Editor</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Trim, Fade, and Export with professional precision</p>
        </div>

        <AnimatePresence mode="wait">
          {!audioUrl ? (
            <motion.label key="upload" className="relative group block w-full h-80 bg-white border-2 border-dashed border-gray-200 rounded-[48px] cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all overflow-hidden">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={32} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Choose an audio file</h3>
                <p className="text-gray-400 text-sm mt-1 font-medium">MP3, WAV, or OGG (Max 50MB)</p>
              </div>
              <input type="file" className="hidden" accept="audio/*" onChange={handleFileChange} />
            </motion.label>
          ) : (
            <motion.div key="editor" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-white rounded-[48px] p-8 shadow-2xl border border-gray-100">
              
              <div ref={containerRef} onClick={handleWaveformClick} className="relative h-44 bg-gray-900 rounded-[32px] mb-8 overflow-hidden flex items-center px-4 cursor-pointer group">
                <div className="flex gap-[3px] items-center w-full h-24 opacity-30">
                  {bars.map((bar,i)=>(<div key={i} className="flex-1 rounded-full bg-amber-500" style={{ height: `${bar.height}%` }} />))}
                </div>
                
                <div className="absolute h-full bg-amber-500/20 border-x-4 border-amber-500 pointer-events-none" style={{ left: `${range.start}%`, right: `${100 - range.end}%` }} />
                
                <div onMouseDown={(e) => { e.stopPropagation(); handleDrag(e, 'start'); }} className="absolute h-16 w-1.5 bg-white rounded-full cursor-ew-resize z-20 shadow-lg" style={{ left: `calc(${range.start}% - 3px)` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Start</div>
                </div>
                <div onMouseDown={(e) => { e.stopPropagation(); handleDrag(e, 'end'); }} className="absolute h-16 w-1.5 bg-white rounded-full cursor-ew-resize z-20 shadow-lg" style={{ left: `calc(${range.end}% - 3px)` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">End</div>
                </div>

                <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10" style={{left: `${(currentTime/duration)*100}%`}} />
              </div>

              <audio ref={audioRef} src={audioUrl} onTimeUpdate={()=>setCurrentTime(audioRef.current.currentTime)} onLoadedMetadata={onLoadedMetadata} onEnded={()=>setIsPlaying(false)} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="flex flex-col space-y-1">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Timeline</span>
                    <span className="text-4xl font-black text-gray-900 font-mono tracking-tighter">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>

                <div className="flex justify-center items-center gap-6">
                  <button onClick={undo} disabled={historyIndex === 0} className="p-3 text-gray-400 hover:text-amber-600 disabled:opacity-30 transition-colors">
                    <RotateCcw size={24} />
                  </button>
                  <button onClick={()=>{isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying);}} className="w-20 h-20 bg-amber-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
                    {isPlaying ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" className="ml-1" />}
                  </button>
                  <button onClick={redo} disabled={historyIndex === history.length - 1} className="p-3 text-gray-400 hover:text-amber-600 disabled:opacity-30 transition-colors">
                    <RotateCw size={24} />
                  </button>
                </div>

                <div className="space-y-5 bg-gray-50 p-6 rounded-[32px]">
                  <div className="flex gap-4 items-center"><Volume2 size={18} className="text-gray-400"/><input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e)=>setVolume(Number(e.target.value))} className="w-full accent-amber-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" /></div>
                  <div className="flex gap-4 items-center"><Zap size={18} className="text-gray-400"/><input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={(e)=>setSpeed(Number(e.target.value))} className="w-full accent-amber-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" /></div>
                  
                  <div className="flex justify-between pt-2">
                    <button onClick={()=>setIsLooping(!isLooping)} className={`flex items-center gap-2 text-xs font-bold uppercase px-3 py-1.5 rounded-full transition-all ${isLooping ? 'bg-amber-600 text-white' : 'text-gray-400'}`}>
                        <Repeat size={14}/> Loop
                    </button>
                    <button onClick={()=>setFadeIn(!fadeIn)} className={`flex items-center gap-2 text-xs font-bold uppercase px-3 py-1.5 rounded-full transition-all ${fadeIn ? 'bg-amber-600 text-white' : 'text-gray-400'}`}>
                        Fade In
                    </button>
                    <button onClick={()=>setFadeOut(!fadeOut)} className={`flex items-center gap-2 text-xs font-bold uppercase px-3 py-1.5 rounded-full transition-all ${fadeOut ? 'bg-amber-600 text-white' : 'text-gray-400'}`}>
                        Fade Out
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t flex flex-wrap gap-4 justify-between items-center">
                <button onClick={()=>{setAudioUrl(null); setIsPlaying(false);}} className="flex items-center gap-2 px-6 py-3 text-rose-500 font-bold hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100">
                    <Trash2 size={18} /> Reset Editor
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 px-5 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold text-sm transition-colors">{format.toUpperCase()} <ChevronDown size={14} /></button>
                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}} className="absolute bottom-full mb-3 left-0 w-32 bg-white border rounded-2xl shadow-2xl overflow-hidden z-30">
                          {["mp3", "wav", "ogg"].map((f) => (
                            <button key={f} className="w-full px-4 py-3 text-left text-sm font-bold hover:bg-amber-50 transition-colors" onClick={() => { setFormat(f); setShowDropdown(false); }}>{f.toUpperCase()}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button onClick={handleExport} className="flex items-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-[24px] font-black text-sm uppercase hover:bg-black transition-all shadow-xl shadow-gray-200">
                    <Download size={18} /> Export Audio
                  </button>
                </div>
              </div>

              {/* How to use Dropdown Direction */}
              <div className="mt-10">
                <button onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-2 mx-auto bg-gray-50 px-6 py-3 rounded-full text-xs font-bold text-gray-500 hover:bg-amber-50 hover:text-amber-600 transition-all">
                  <Info size={16}/> HOW TO EDIT LIKE A PRO? <ChevronDown size={16} className={showGuide ? "rotate-180" : ""} />
                </button>
                <AnimatePresence>
                  {showGuide && (
                    <motion.div initial={{height:0, opacity:0}} animate={{height:"auto", opacity:1}} exit={{height:0, opacity:0}} className="overflow-hidden max-w-2xl mx-auto mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-amber-50/50 rounded-[32px] border border-amber-100">
                        <div className="space-y-2">
                           <h4 className="font-bold text-amber-900 text-sm">Trimming</h4>
                           <p className="text-xs text-amber-700/70 leading-relaxed">Drag the white vertical handles to set your start and end points. Your selection is highlighted in light amber.</p>
                        </div>
                        <div className="space-y-2">
                           <h4 className="font-bold text-amber-900 text-sm">Smooth Transitions</h4>
                           <p className="text-xs text-amber-700/70 leading-relaxed">Enable Fade In/Out to avoid abrupt starts or ends. It adds a professional 2-second volume ramp.</p>
                        </div>
                        <div className="space-y-2">
                           <h4 className="font-bold text-amber-900 text-sm">Precision Control</h4>
                           <p className="text-xs text-amber-700/70 leading-relaxed">Use Undo/Redo (arrows next to play) to jump between your previous selection changes.</p>
                        </div>
                        <div className="space-y-2">
                           <h4 className="font-bold text-amber-900 text-sm">Export Formats</h4>
                           <p className="text-xs text-amber-700/70 leading-relaxed">Choose MP3 for small file size or WAV for maximum quality before clicking Export.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-24">
          <RelatedTools categoryId="audio" />
        </div>
      </div>
    </div>
  );
};

export default Mp3Cutter;