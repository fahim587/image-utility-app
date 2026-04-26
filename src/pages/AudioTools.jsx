import React from 'react';
import { motion } from "framer-motion";
import { Scissors, RefreshCw, Volume2, FastForward, Music, Mic2 } from "lucide-react";
import { Link } from "react-router-dom";

const ToolCard = ({ to, icon: ToolIcon, title, desc, color, index }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
    >
        <Link 
            to={to} 
            className="group relative block p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-amber-500/15 transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full"
        >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${color} text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-500`}>
                <ToolIcon size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors tracking-tight uppercase">
                {title}
            </h3>
            <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">
                {desc}
            </p>
            <div className="mt-4 flex items-center text-amber-600 text-[10px] font-black tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                LAUNCH TOOL <FastForward size={12} className="ml-1" />
            </div>
        </Link>
    </motion.div>
);

const AudioTools = () => {
    // এখানে আপনার ৬টি টুলই আছে
    const tools = [
        { to: "/mp3-cutter", icon: Scissors, color: "bg-amber-500", title: "MP3 Cutter", desc: "Precision visual waveform trimmer for your audio files." },
        { to: "/audio-convert", icon: RefreshCw, color: "bg-amber-500", title: "Audio Converter", desc: "Change formats between MP3, WAV, and AAC instantly." },
        { to: "/volume-booster", icon: Volume2, color: "bg-amber-500", title: "Volume Booster", desc: "Increase audio volume with clean gain and peak limiting." },
        { to: "/audio-speed", icon: FastForward, color: "bg-amber-500", title: "Speed Changer", desc: "Change playback speed without affecting the audio pitch." },
        { to: "/text-to-speech", icon: Music, color: "bg-amber-500", title: "Text to Speech", desc: "Natural AI voices for your video and content creation." },
        { to: "/voice-recorder", icon: Mic2, color: "bg-amber-500", title: "Voice Recorder", desc: "High-quality browser-based recording in WAV format." },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4 italic tracking-tight uppercase">
                            <div className="p-3 bg-amber-100 rounded-2xl">
                                <Music className="text-amber-600" size={38} />
                            </div>
                            Audio Processing
                        </h1>
                        <p className="text-slate-500 mt-4 text-lg font-medium max-w-2xl leading-relaxed">
                            Professional audio processing tools for GOOGIZ. Fast, secure, and runs entirely in your browser.
                        </p>
                    </motion.div>
                </div>
                
                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {tools.map((tool, index) => (
                        <ToolCard key={index} index={index} {...tool} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AudioTools;