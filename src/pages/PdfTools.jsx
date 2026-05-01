import React from 'react';
import { motion } from "framer-motion";
import { 
    Files, Scissors, Download, RotateCw, Image, 
    FileImage, ShieldCheck, Lock, FileText,Hash,
    LayoutGrid,
    Tag,
    Globe,
    FileEdit
} from "lucide-react";
import { Link } from "react-router-dom";

// Home.js এর মত ToolCard কম্পোনেন্ট
const ToolCard = ({ to, icon: ToolIcon, title, desc, color }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
    >
        <Link to={to} className="group relative block p-5 bg-white/80 backdrop-blur-md border border-gray-100/50 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color} text-white shadow-lg`}>
                <ToolIcon className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-md font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{desc}</p>
        </Link>
    </motion.div>
);

const PdfTools = () => {
    const tools = [
    { to: "/merge-pdf", icon: Files, color: "bg-rose-500", title: "Merge PDF", desc: "Join documents in seconds." },
    { to: "/split-pdf", icon: Scissors, color: "bg-rose-500", title: "Split PDF", desc: "Extract specific page ranges." },
    { to: "/compress-pdf", icon: Download, color: "bg-rose-500", title: "Compress PDF", desc: "Reduce size while keeping text sharp." },
    { to: "/rotate-pdf", icon: RotateCw, color: "bg-rose-500", title: "Rotate PDF", desc: "Fix orientation of scanned docs." },
    { to: "/pdf-to-jpg", icon: Image, color: "bg-rose-500", title: "PDF to JPG", desc: "High-resolution page extraction." },
    { to: "/jpg-to-pdf", icon: FileImage, color: "bg-rose-500", title: "JPG to PDF", desc: "Standardized document creation." },
    { to: "/watermark-pdf", icon: ShieldCheck, color: "bg-rose-500", title: "PDF Watermark", desc: "Stamps for official documentation." },
    { to: "/protect-pdf", icon: Lock, color: "bg-rose-500", title: "Protect PDF", desc: "AES-256 password encryption." },
    // নিচের লাইনগুলো আমি ফিক্স করে দিয়েছি
    { to: "/add-page-numbers", icon: Hash, color: "bg-rose-500", title: "Add Page Numbers", desc:"Add page numbers to your PDF documents easily."},
    { to: "/remove-pdf-pages", icon: FileText, color: "bg-rose-500", title: "Remove PDF Pages", desc:"Remove pages to your PDF documents easily."},
    { to: "/unlock-pdf", icon: Lock, color: "bg-rose-500", title: "Unlock PDF", desc:"Remove password protection from PDFs."},
    { to: "/sign-pdf", icon: FileText, color: "bg-rose-500", title: "Sign PDF", desc:"Add digital signatures to your PDF documents."},
    { to: "/organized-pdf", icon: LayoutGrid, color: "bg-rose-500", title: "Organize PDF", desc:"Rearrange pages in your PDF documents easily."},
    { to: "/metadata-editor", icon: Tag, color: "bg-rose-500", title: "Metadata Editor", desc:"Edit metadata in your PDF documents easily."},
    { to: "/html-to-pdf", icon: Globe, color: "bg-rose-500", title: "HTML to PDF", desc:"Convert web pages to PDF format easily."},
    { to: "/edit-pdf", icon: FileEdit, color: "bg-rose-500", title: "Edit PDF", desc:"Modify existing PDF documents easily."},
];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                        <FileText className="text-rose-600" size={36} /> PDF Tools
                    </h1>
                    <p className="text-gray-500 mt-2">Manage and edit your PDF documents locally.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tools.map((tool, index) => <ToolCard key={index} {...tool} />)}
                </div>
            </div>
        </div>
    );
};

export default PdfTools;