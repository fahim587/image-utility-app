import React from 'react';
import { motion } from "framer-motion";
import { Scissors, Download, RefreshCw, RotateCw, Maximize, Image, Video } from "lucide-react";
import { Link } from "react-router-dom";

// ToolCard logic consistent with above...
const VideoTools = () => {
    const tools = [
  { to: "/video-cutter", icon: Scissors, color: "bg-violet-500", title: "Video Cutter", desc: "Frame-accurate trimming." },
  { to: "/video-compress", icon: Download, color: "bg-violet-500", title: "Video Compressor", desc: "HEVC/H.265 encoding." },
  { to: "/video-convert", icon: RefreshCw, color: "bg-violet-500", title: "Video Convert", desc: "MP4 to WebM and MKV." },
  { to: "/video-rotate", icon: RotateCw, color: "bg-violet-500", title: "Video Rotate", desc: "90/180/270 degree rotation." },
  { to: "/video-crop", icon: Maximize, color: "bg-violet-500", title: "Video Crop", desc: "Social media aspect ratios." },
  { to: "/video-to-gif", icon: Image, color: "bg-violet-500", title: "Video to GIF", desc: "High-quality gif generation." },
];
    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                        <Video className="text-violet-600" size={36} /> Video Tools
                    </h1>
                    <p className="text-gray-500 mt-2">Professional video processing in your browser.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                        <Link key={index} to={tool.to} className="group p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
                             <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${tool.color} text-white`}><tool.icon size={22}/></div>
                             <h3 className="font-bold">{tool.title}</h3>
                             <p className="text-xs text-gray-500 mt-2">{tool.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default VideoTools;