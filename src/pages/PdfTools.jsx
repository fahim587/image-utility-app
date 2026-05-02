import React from 'react';
import { motion } from "framer-motion";
import { 
    Files, Scissors, Download, RotateCw, Image, 
    FileImage, ShieldCheck, Lock, FileText,Hash,
    LayoutGrid,Tag,Globe,FileEdit,FileX,Unlock,PenTool,FileSpreadsheet,Presentation
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
    { path: "/merge-pdf", icon: Files, color: "bg-rose-500", title: "Merge PDF", desc: "Join documents in seconds." },
    { path: "/split-pdf", icon: Scissors, color: "bg-rose-500", title: "Split PDF", desc: "Extract specific page ranges." },
    { path: "/compress-pdf", icon: Download, color: "bg-rose-500", title: "Compress PDF", desc: "Reduce size while keeping text sharp." },
    { path: "/rotate-pdf", icon: RotateCw, color: "bg-rose-500", title: "Rotate PDF", desc: "Fix orientation of scanned docs." },
    { path: "/pdf-to-jpg", icon: Image, color: "bg-rose-500", title: "PDF to JPG", desc: "High-resolution page extraction." },
    { path: "/jpg-to-pdf", icon: FileImage, color: "bg-rose-500", title: "JPG to PDF", desc: "Standardized document creation." },
    { path: "/watermark-pdf", icon: ShieldCheck, color: "bg-rose-500", title: "PDF Watermark", desc: "Stamps for official documentation." },
    { path: "/protect-pdf", icon: Lock, color: "bg-rose-500", title: "Protect PDF", desc: "AES-256 password encryption." },
    { path: "/add-page-numbers", icon: Hash, color: "bg-rose-500", title: "Add Page Numbers", desc:"Add page numbers to your PDF documents easily."},
    { path: "/remove-pdf-pages", icon: FileX, color: "bg-rose-500", title: "Remove PDF Pages", desc:"Remove pages from your PDF documents easily."},
    { path: "/unlock-pdf", icon: Unlock, color: "bg-rose-500", title: "Unlock PDF", desc:"Remove password protection from PDFs."},
    { path: "/sign-pdf", icon: PenTool, color: "bg-rose-500", title: "Sign PDF", desc:"Add digital signatures to your PDF documents."},
    { path: "/organized-pdf", icon: LayoutGrid, color: "bg-rose-500", title: "Organize PDF", desc:"Rearrange pages in your PDF documents easily."},
    { path: "/metadata-editor", icon: Tag, color: "bg-rose-500", title: "Metadata Editor", desc:"Edit metadata in your PDF documents easily."},
    { path: "/html-to-pdf", icon: Globe, color: "bg-rose-500", title: "HTML to PDF", desc:"Convert web pages to PDF format easily."},
    { path: "/edit-pdf", icon: FileEdit, color: "bg-rose-500", title: "Edit PDF", desc:"Modify existing PDF documents easily."},

    // নতুন কনভার্সন টুলস (যা আপনি App.jsx-এ রাউট হিসেবে দিয়েছেন)
    { path: "/pdf-to-word", icon: FileText, color: "bg-rose-500", title: "PDF to Word", desc: "Convert PDF documents to editable Word format." },
    { path: "/word-to-pdf", icon: FileText, color: "bg-rose-500", title: "Word to PDF", desc: "Convert Word documents to professional PDF format." },
    { path: "/pdf-to-excel", icon: FileSpreadsheet, color: "bg-rose-500", title: "PDF to Excel", desc: "Extract data from PDF to Excel spreadsheets." },
    { path: "/excel-to-pdf", icon: FileSpreadsheet, color: "bg-rose-500", title: "Excel to PDF", desc: "Convert Excel spreadsheets to PDF format." },
    { path: "/pdf-to-powerpoint", icon: Presentation, color: "bg-rose-500", title: "PDF to PPT", desc: "Convert PDF to editable PowerPoint slideshows." },
    { path: "/powerpoint-to-pdf", icon: Presentation, color: "bg-rose-500", title: "PPT to PDF", desc: "Convert PowerPoint slideshows to PDF format." },
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