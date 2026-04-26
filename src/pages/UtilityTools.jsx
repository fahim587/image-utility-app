import React from 'react';
import { motion } from "framer-motion";
import { 
    QrCode, FileDigit, Key, Lock, Zap, 
    Link as LinkIcon, RefreshCw, AlignLeft, Braces, Palette, Mail, Settings ,
    FileText,

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

const UtilityTools = () => {
    const tools = [
        { to: "/qr-generator", icon: QrCode, color: "bg-emerald-500", title: "QR Generator", desc: "SVG & PNG output." },
        { to: "/barcode", icon: FileDigit, color: "bg-emerald-500", title: "Barcode Gen", desc: "EAN, UPC, and Code128." },
        { to: "/password-gen", icon: Key, color: "bg-emerald-500", title: "Password Gen", desc: "Cryptographically secure." },
        { to: "/base64-encode", icon: Lock, color: "bg-emerald-500", title: "Base64 Encode", desc: "Data to string encoding." },
        { to: "/base64-decode", icon: Zap, color: "bg-emerald-500", title: "Base64 Decode", desc: "String back to data." },
        { to: "/url-encode", icon: LinkIcon, color: "bg-emerald-500", title: "URL Encoder", desc: "RFC 3986 encoding." },
        { to: "/url-decode", icon: RefreshCw, color: "bg-emerald-500", title: "URL Decoder", desc: "Query param extractor." },
        { to: "/case-converter", icon: AlignLeft, color: "bg-emerald-500", title: "Text Case", desc: "Camel, Pascal, Snake case." },
        { to: "/json-formatter", icon: Braces, color: "bg-emerald-500", title: "JSON Formatter", desc: "Validator and prettifier." },
        { to: "/color-picker", icon: Palette, color: "bg-emerald-500", title: "Color Picker", desc: "HEX, RGBA, HSL picker." },
        { to: "/temp-email", icon: Mail, color: "bg-emerald-500", title: "Temp Email", desc: "Disposable email generator." },
        { to: "/typing-test", icon: Zap, color: "bg-emerald-500", title: "Typing Test", desc: "Measure your typing speed." },
        { to: "/lorem-ipsum", icon: FileText, color: "bg-emerald-500", title: "Lorem Ipsum", desc:"Generate professional placeholder text for your designs."},
        
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                        <Settings className="text-emerald-600" size={36} /> Utility Tools
                    </h1>
                    <p className="text-gray-500 mt-2">Essential developer and productivity utilities in one place.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                    {tools.map((tool, index) => <ToolCard key={index} {...tool} />)}
                </div>
            </div>
        </div>
    );
};

export default UtilityTools;