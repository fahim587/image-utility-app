import React from 'react';
import { motion } from "framer-motion";
import { 
    Download, FileDigit, Maximize, RefreshCw, RotateCw, 
    FlipHorizontal, ShieldCheck, Type, Droplets, Layers, 
    FileText, Eraser, ImageIcon, 
    Languages,
    Palette // ✅ এখানে Palette যোগ করা হয়েছে
} from "lucide-react";
import { Link } from "react-router-dom";

const ToolCard = ({ to, icon: ToolIcon, title, desc, color }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
    >
        <Link to={to} className="group relative block p-5 bg-white/80 backdrop-blur-md border border-gray-100/50 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color} text-white shadow-lg shadow-current/20`}>
                <ToolIcon className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-md font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{desc}</p>
        </Link>
    </motion.div>
);

const ImageTools = () => {
    const tools = [
        { to: "/compress", icon: Download, color: "bg-blue-500", title: "Compress Image", desc: "Ultra-fast lossy and lossless compression." },
        { to: "/resize", icon: FileDigit, color: "bg-blue-500", title: "Resize Image", desc: "Bulk resize with aspect ratio lock." },
        { to: "/crop", icon: Maximize, color: "bg-blue-500", title: "Crop Image", desc: "Preset ratios for Instagram, YT, and more." },
        { to: "/convert", icon: RefreshCw, color: "bg-blue-500", title: "Format Converter", desc: "Convert to WEBP, PNG, JPG, or AVIF." },
        { to: "/rotate", icon: RotateCw, color: "bg-blue-500", title: "Rotate Image", desc: "Lossless rotation for JPEG and PNG." },
        { to: "/flip", icon: FlipHorizontal, color: "bg-blue-500", title: "Flip Image", desc: "Horizontal and vertical mirror effects." },
        { to: "/watermark", icon: ShieldCheck, color: "bg-blue-500", title: "Add Watermark", desc: "Overlay logos with opacity control." },
        { to: "/add-text", icon: Type, color: "bg-blue-500", title: "Add Text", desc: "Rich text editor for quick annotations." },
        { to: "/blur", icon: Droplets, color: "bg-blue-500", title: "Blur Image", desc: "Selective blur for sensitive data." },
        { to: "/filters", icon: Layers, color: "bg-blue-500", title: "Image Filters" , desc: "Pro-grade color grading presets." },
        { to: "/image-to-pdf", icon: FileText, color: "bg-blue-500", title: "Image to PDF", desc: "Merge photos into one document." },
        { to: "/remove-bg", icon: Eraser, color: "bg-blue-500", title: "Remove BG", desc: "Smart AI object isolation technology." },
        { to: "/heic-to-jpg", icon: Languages, color: "bg-blue-500", title: "HEIC to JPG", desc: "Convert iPhone HEIC photos to JPG format." },
        { to: "/svg-optimizer", icon: Layers, color: "bg-blue-500", title: "SVG Optimizer", desc: "Reduce SVG file size without losing quality." },
        { to: "/color-palette-generator", icon: Palette, color: "bg-blue-500", title: "Color Palette Generator", desc: "Create harmonious color schemes." }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                        <ImageIcon className="text-blue-600" size={36} /> Image Tools
                    </h1>
                    <p className="text-gray-500 mt-2">Professional photo editing tools, processed locally in your browser.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tools.map((tool, index) => <ToolCard key={index} {...tool} />)}
                </div>
            </div>
        </div>
    );
};

export default ImageTools;