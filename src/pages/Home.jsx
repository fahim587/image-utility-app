import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Maximize, RotateCw, FileDigit, Eraser, Download, RefreshCw, ShieldCheck, Zap, Lock, 
    CheckCircle, HelpCircle, ChevronRight, ChevronDown, FileImage, 
    Files, Scissors, Type, Layers, Droplets, Image, FileText, Video, Music, Settings, 
    QrCode, Key, Link as LinkIcon, Palette, Braces, AlignLeft, Volume2, FastForward, Sparkles, FlipHorizontal,
    MousePointer2, Image as ImageIcon, PenTool, Mail, Search, Languages,
    Hash, FileX, Unlock, LayoutGrid, Tag, Globe, FileEdit,
    Eye, 
} from "lucide-react";
import Navbar from "../components/Navbar";
import BlogMarquee from "../components/BlogMarquee";



// --- Sub-component: DecorativeElements ---
const DecorativeElements = () => {
    const allIcons = [
        Maximize, RotateCw, FileDigit, Eraser, Download, RefreshCw, ShieldCheck, Zap, Lock,
        CheckCircle, FileImage, Files, Scissors, Type, Layers, Droplets, Image, FileText,
        Video, Music, Settings, QrCode, Key, LinkIcon, Palette, Braces, AlignLeft,
        Volume2, FastForward, Sparkles, FlipHorizontal, MousePointer2, ImageIcon, PenTool, Mail
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px] -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px] -z-10" />
            
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] right-[10%] p-3 bg-blue-500 rounded-xl text-white shadow-xl hidden lg:block opacity-90"
            >
                <PenTool size={24} />
            </motion.div>

            <motion.div
                animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[40%] left-[10%] p-3 bg-indigo-400 rounded-xl text-white shadow-xl hidden lg:block opacity-80"
            >
                <ImageIcon size={24} />
            </motion.div>

            <div className="absolute bottom-5 w-full overflow-hidden opacity-100">
                <motion.div 
                    initial={{ x: "-50%" }}
                    animate={{ x: 0 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap gap-6 md:gap-10 w-fit"
                >
                    {[...allIcons, ...allIcons].map((Icon, index) => (
                        <Icon key={index} className="text-gray-500 w-5 h-5 md:w-8 md:h-8 shrink-0" />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

// --- Animation Variants ---
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
};

const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.05 } }
};

// --- Sub-components ---
const ToolCard = ({ to, icon: ToolIcon, title, desc, color }) => {
    return (
        <motion.div 
            variants={fadeInUp}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <Link to={to} className="group relative block p-5 bg-white/80 backdrop-blur-md border border-gray-100/50 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full">
                <div className={`absolute -right-6 -top-6 w-20 h-20 ${color} opacity-[0.02] rounded-full group-hover:scale-[3] group-hover:opacity-[0.05] transition-all duration-700 ease-in-out`}></div>
                
                <motion.div 
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color} text-white transition-all duration-500 shadow-lg shadow-current/20`}
                >
                    <ToolIcon className="w-5.5 h-5.5" />
                </motion.div>

                <h3 className="text-md font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {title}
                </h3>
                
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100">
                    {desc}
                </p>

                <div className="mt-4 flex items-center text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 uppercase tracking-widest">
                    Launch Tool 
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <ChevronRight size={12} className="ml-1" />
                    </motion.span>
                </div>
                
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-0 group-hover:w-full transition-all duration-700"></div>
            </Link>
        </motion.div>
    );
};

const SectionHeader = ({ icon: HeaderIcon, title, count, color }) => {
    return (
        <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-8">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 shadow-inner backdrop-blur-sm`}>
                <HeaderIcon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    {title} 
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                        {count}
                    </span>
                </h2>
            </div>
        </motion.div>
    );
};

const Step = ({ number, title, desc, icon: StepIcon, color }) => {
    return (
        <motion.div 
            variants={fadeInUp} 
            className="group relative flex flex-col items-center text-center p-10 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
        >
            <div className={`absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 ${color} text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-xl rotate-12 group-hover:rotate-0 transition-transform duration-500 ring-4 ring-white`}>
                {number}
            </div>
            <div className={`w-24 h-24 rounded-3xl ${color.replace('bg-', 'bg-opacity-10 ')} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 relative`}>
                <div className={`absolute inset-0 ${color.replace('bg-', 'bg-opacity-5 ')} blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700`}></div>
                <StepIcon size={40} className={`relative z-10 ${color.replace('bg-', 'text-')}`} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed px-2">{desc}</p>
        </motion.div>
    );
};

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div layout className="bg-white/70 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-100">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-8 py-6 flex items-center justify-between focus:outline-none"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${isOpen ? 'bg-blue-600 text-white rotate-12' : 'bg-blue-50 text-blue-600'}`}>
                        <HelpCircle className="w-5 h-5" />
                    </div>
                    <h4 className={`text-lg font-bold tracking-tight transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-900'}`}>{question}</h4>
                </div>
                <div className={`p-2 rounded-lg transition-all duration-300 ${isOpen ? 'bg-blue-50 rotate-180' : 'bg-gray-50'}`}>
                    <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-8 pb-8 pt-0 ml-14">
                            <p className="text-gray-600 leading-relaxed antialiased">{answer}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Home = () => {
    const [displayedText, setDisplayedText] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(100);

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef(null);

    const words = useMemo(() => [
        { text: "Professional Content Tools", color: "text-[#010326]" },
        { text: "Smart Browser Utilities", color: "text-[#0583F2]" },
        { text: "One-Click Creative Suite", color: "text-[#0A0140]" }
    ], []);

    // Active Tab State (Default AI Magic)
    const [activeTab, setActiveTab] = useState('AI Magic');

    const categories = [
        { id: 'AI Magic', title: 'AI Magic', icon: Sparkles, color: 'text-indigo-600', bg: 'bg-indigo-50', count: 4 },
        { id: 'Image Tools', title: 'Image Tools', icon: ImageIcon, color: 'text-blue-600', bg: 'bg-blue-50', count: 16 },
        { id: 'PDF Tools', title: 'PDF Tools', icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50', count: 16 },
        { id: 'Video Tools', title: 'Video Tools', icon: Video, color: 'text-violet-600', bg: 'bg-violet-50', count: 6 },
        { id: 'Audio Tools', title: 'Audio Tools', icon: Music, color: 'text-amber-600', bg: 'bg-amber-50', count: 4 },
        { id: 'Utility Tools', title: 'Utility Tools', icon: Settings, color: 'text-emerald-600', bg: 'bg-emerald-50', count: 13 },
    ];

    const allTools = useMemo(() => [
        // AI Magic Tools
        { title: "AI Content Writer", path: "/ai-content-writer", icon: PenTool, category: "AI Magic", desc: "Generate high-quality blogs and articles in seconds.", color: "bg-indigo-600" },
        { title: "AI Video Script", path: "/ai-video-script", icon: Video, category: "AI Magic", desc: "Craft engaging scripts for YouTube, Reels, and TikTok.", color: "bg-violet-600" },
        { title: "AI Image Explainer", path: "/ai-image-explainer", icon: Eye, category: "AI Magic", desc: "Get detailed descriptions and insights from any image.", color: "bg-blue-600" },
        { title: "AI PDF Summary", path: "/ai-pdf-summarizer", icon: Sparkles, category: "AI Magic", desc: "Extract key insights from long PDF documents instantly.", color: "bg-fuchsia-600" },

        // Image Tools
        { title: "Compress Image", path: "/compress", icon: Download, category: "Image Tools", desc: "Ultra-fast lossy and lossless compression.", color: "bg-blue-500" },
        { title: "Resize Image", path: "/resize", icon: FileDigit, category: "Image Tools", desc: "Bulk resize with aspect ratio lock.", color: "bg-blue-500" },
        { title: "Crop Image", path: "/crop", icon: Maximize, category: "Image Tools", desc: "Preset ratios for Instagram, YT, and more.", color: "bg-blue-500" },
        { title: "Format Converter", path: "/convert", icon: RefreshCw, category: "Image Tools", desc: "Convert to WEBP, PNG, JPG, or AVIF.", color: "bg-blue-500" },
        { title: "Rotate Image", path: "/rotate", icon: RotateCw, category: "Image Tools", desc: "Lossless rotation for JPEG and PNG.", color: "bg-blue-500" },
        { title: "Flip Image", path: "/flip", icon: FlipHorizontal, category: "Image Tools", desc: "Horizontal and vertical mirror effects.", color: "bg-blue-500" },
        { title: "Add Watermark", path: "/watermark", icon: ShieldCheck, category: "Image Tools", desc: "Overlay logos with opacity control.", color: "bg-blue-500" },
        { title: "Add Text", path: "/add-text", icon: Type, category: "Image Tools", desc: "Rich text editor for quick annotations.", color: "bg-blue-500" },
        { title: "Blur Image", path: "/blur", icon: Droplets, category: "Image Tools", desc: "Selective blur for sensitive data.", color: "bg-blue-500" },
        { title: "Image Filters", path: "/filters", icon: Layers, category: "Image Tools", desc: "Pro-grade color grading presets.", color: "bg-blue-500" },
        { title: "Image to PDF", path: "/image-to-pdf", icon: FileText, category: "Image Tools", desc: "Merge photos into one document.", color: "bg-blue-500" },
        { title: "Remove Background", path: "/remove-bg", icon: Eraser, category: "Image Tools", desc: "Smart AI object isolation technology.", color: "bg-blue-500" },
        { title: "HEIC to JPG", path: "/heic-to-jpg", icon: Languages, category: "Image Tools", desc: "Convert iPhone HEIC photos to JPG format.", color: "bg-blue-500" },
        { title: "SVG Optimizer", path: "/svg-optimizer", icon: Layers, category: "Image Tools", desc: "Clean and minify SVG files for web use.", color: "bg-blue-500" },
        { title: "Image to Text", path: "/image-to-text", icon: Type, category: "Image Tools", desc: "Extract text from images with OCR.", color: "bg-blue-500" },
        { title: "Color Palette Generator", path: "/color-palette-generator", icon: Palette, category: "Image Tools", desc: "Create harmonious color schemes.", color: "bg-blue-500" },

        // PDF Tools
        { title: "Merge PDF", path: "/merge-pdf", icon: Files, category: "PDF Tools", desc: "Join documents in seconds.", color: "bg-rose-500" },
        { title: "Split PDF", path: "/split-pdf", icon: Scissors, category: "PDF Tools", desc: "Extract specific page ranges.", color: "bg-rose-500" },
        { title: "Compress PDF", path: "/compress-pdf", icon: Download, category: "PDF Tools", desc: "Reduce size while keeping text sharp.", color: "bg-rose-500" },
        { title: "Rotate PDF", path: "/rotate-pdf", icon: RotateCw, category: "PDF Tools", desc: "Fix orientation of scanned docs.", color: "bg-rose-500" },
        { title: "PDF to JPG", path: "/pdf-to-jpg", icon: Image, category: "PDF Tools", desc: "High-resolution page extraction.", color: "bg-rose-500" },
        { title: "JPG to PDF", path: "/jpg-to-pdf", icon: FileImage, category: "PDF Tools", desc: "Standardized document creation.", color: "bg-rose-500" },
        { title: "PDF Watermark", path: "/watermark-pdf", icon: ShieldCheck, category: "PDF Tools", desc: "Stamps for official documentation.", color: "bg-rose-500" },
        { title: "Protect PDF", path: "/protect-pdf", icon: Lock, category: "PDF Tools", desc: "AES-256 password encryption.", color: "bg-rose-500" },
        { title: "Add Page Numbers", path: "/add-page-numbers", icon: Hash, category: "PDF Tools", desc: "Add page numbers to your PDF documents easily.", color: "bg-rose-500" },
        { title: "Remove PDF Pages", path: "/remove-pdf-pages", icon: FileX, category: "PDF Tools", desc: "Remove pages to your PDF documents easily.", color: "bg-rose-500" },
        { title: "Unlock PDF", path: "/unlock-pdf", icon: Unlock, category: "PDF Tools", desc: "Remove password protection from PDFs.", color: "bg-rose-500" },
        { title: "Sign PDF", path: "/sign-pdf", icon: PenTool, category: "PDF Tools", desc: "Add digital signatures to your PDF documents.", color: "bg-rose-500" },
        { title: "Organized PDF", path: "/organized-pdf", icon: LayoutGrid, category: "PDF Tools", desc: "Rearrange pages in your PDF documents easily.", color: "bg-rose-500" },
        { title: "Metadata Editor", path: "/metadata-editor", icon: Tag, category: "PDF Tools", desc: "Edit metadata in your PDF documents easily.", color: "bg-rose-500" },
        { title: "HTML to PDF", path: "/html-to-pdf", icon: Globe, category: "PDF Tools", desc: "Convert web pages to PDF format easily.", color: "bg-rose-500" },
        { title: "Edit PDF", path: "/edit-pdf", icon: FileEdit, category: "PDF Tools", desc: "Modify existing PDF documents easily.", color: "bg-rose-500" },

        // Video Tools
        { title: "Video Cutter", path: "/video-cutter", icon: Scissors, category: "Video Tools", desc: "Frame-accurate trimming.", color: "bg-violet-500" },
        { title: "Video Compressor", path: "/video-compressor", icon: Download, category: "Video Tools", desc: "HEVC/H.265 browser encoding.", color: "bg-violet-500" },
        { title: "Video Converter", path: "/video-converter", icon: RefreshCw, category: "Video Tools", desc: "MP4 to WebM and MKV.", color: "bg-violet-500" },
        { title: "Video Rotate", path: "/video-rotate", icon: RotateCw, category: "Video Tools", desc: "90/180/270 degree rotation.", color: "bg-violet-500" },
        { title: "Video Crop", path: "/video-crop", icon: Maximize, category: "Video Tools", desc: "Social media aspect ratios.", color: "bg-violet-500" },
        { title: "Video to GIF", path: "/video-to-gif", icon: Image, category: "Video Tools", desc: "High-quality gif generation.", color: "bg-violet-500" },

        // Audio Tools
        { title: "Audio Cutter", path: "/audio-cutter", icon: Scissors, category: "Audio Tools", desc: "Visual waveform audio trimmer.", color: "bg-amber-500" },
        { title: "Audio Converter", path: "/audio-converter", icon: RefreshCw, category: "Audio Tools", desc: "WAV, MP3, AAC conversion.", color: "bg-amber-500" },
        { title: "Volume Booster", path: "/volume-booster", icon: Volume2, category: "Audio Tools", desc: "Clean gain with peak limiting.", color: "bg-amber-500" },
        { title: "Speed Changer", path: "/audio-speed", icon: FastForward, category: "Audio Tools", desc: "Pitch-preserved time stretching.", color: "bg-amber-500" },

        // Utility Tools
        { title: "QR Generator", path: "/qr-generator", icon: QrCode, category: "Utility Tools", desc: "SVG & PNG output.", color: "bg-emerald-500" },
        { title: "Barcode Gen", path: "/barcode", icon: FileDigit, category: "Utility Tools", desc: "EAN, UPC, and Code128.", color: "bg-emerald-500" },
        { title: "Password Gen", path: "/password-gen", icon: Key, category: "Utility Tools", desc: "Cryptographically secure.", color: "bg-emerald-500" },
        { title: "Base64 Encode", path: "/base64-encode", icon: Lock, category: "Utility Tools", desc: "Data to string encoding.", color: "bg-emerald-500" },
        { title: "Base64 Decode", path: "/base64-decode", icon: Zap, category: "Utility Tools", desc: "String back to data.", color: "bg-emerald-500" },
        { title: "URL Encoder", path: "/url-encode", icon: LinkIcon, category: "Utility Tools", desc: "RFC 3986 encoding.", color: "bg-emerald-500" },
        { title: "URL Decoder", path: "/url-decode", icon: RefreshCw, category: "Utility Tools", desc: "Query param extractor.", color: "bg-emerald-500" },
        { title: "Text Case Converter", path: "/case-converter", icon: AlignLeft, category: "Utility Tools", desc: "Camel, Pascal, Snake case.", color: "bg-emerald-500" },
        { title: "JSON Formatter", path: "/json-formatter", icon: Braces, category: "Utility Tools", desc: "Validator and prettifier.", color: "bg-emerald-500" },
        { title: "Color Picker", path: "/color-picker", icon: Palette, category: "Utility Tools", desc: "HEX, RGBA, HSL picker.", color: "bg-emerald-500" },
        { title: "Temp Email", path: "/temp-email", icon: Mail, category: "Utility Tools", desc: "Disposable email address generator.", color: "bg-emerald-500" },
        { title: "Typing Test", path: "/typing-test", icon: Zap, category: "Utility Tools", desc: "Measure your typing speed and accuracy.", color: "bg-emerald-500" },
        { title: "Lorem Ipsum Generator", path: "/lorem-ipsum", icon: FileText, category: "Utility Tools", desc: "Generate professional placeholder text for your designs.", color: "bg-emerald-500" },
    ], []);         

    // ১. সার্চ ফিল্টারিং লজিক (ফর ড্রপডাউন)
    const filteredTools = useMemo(() => {
        if (!searchQuery) return [];
        return allTools.filter(tool => 
            tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6);
    }, [searchQuery, allTools]);

    // ২. ক্যাটাগরি ফিল্টারিং লজিক (কার্ডে ক্লিক করলে যা চেঞ্জ হবে)
    const filteredCategoryTools = useMemo(() => {
        return allTools.filter(tool => tool.category === activeTab);
    }, [activeTab, allTools]);

    // অ্যাক্টিভ ক্যাটাগরির বিস্তারিত তথ্য জানার জন্য
    const currentCategoryInfo = useMemo(() => {
        return categories.find(cat => cat.id === activeTab);
    }, [activeTab, categories]);

    // Close search dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Typing Effect
    useEffect(() => {
        const currentFullWord = words[wordIndex].text; 
        const timer = setTimeout(() => {
            if (isDeleting) {
                setDisplayedText(prev => prev.substring(0, prev.length - 1));
                setTypingSpeed(40);
            } else {
                setDisplayedText(currentFullWord.substring(0, displayedText.length + 1));
                setTypingSpeed(100);
            }

            if (!isDeleting && displayedText === currentFullWord) {
                setTypingSpeed(2500);
                setIsDeleting(true);
            } else if (isDeleting && displayedText === "") {
                setIsDeleting(false);
                setWordIndex((prev) => (prev + 1) % words.length);
                setTypingSpeed(500);
            }
        }, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, wordIndex, typingSpeed, words]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />

            <section className="bg-white border-b border-gray-100 pt-44 pb-32 px-6 text-center relative overflow-hidden z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>
                
                <DecorativeElements />

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-5xl mx-auto relative z-20 -mt-20 md:-mt-32">
                    
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter leading-[0.95] min-h-fit">
                        <span className={`inline-block relative ${words[wordIndex].color} transition-colors duration-500`}>
                            {displayedText}
                            <motion.span 
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="inline-block w-1 md:w-2 h-10 md:h-16 bg-blue-600 ml-2 align-middle rounded-full"
                            />
                        </span>
                    </h1>
                    
                    <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        Privacy-First Creative Suite. Local PDF, Image, and Video tools. Your files never leave your device.
                    </p>

                    {/* --- Search Bar --- */}
                    <div className="max-w-2xl mx-auto mb-14 relative" ref={searchRef}>
                        <div className={`relative flex items-center transition-all duration-300 ${isSearchFocused ? 'scale-105' : 'scale-100'}`}>
                            <div className="absolute left-6 text-gray-400">
                                <Search size={22} />
                            </div>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                placeholder="Search for tools (e.g. 'pdf', 'resize', 'email')..."
                                className="w-full pl-16 pr-6 py-6 bg-white border-2 border-gray-100 rounded-[2.5rem] text-lg font-medium shadow-xl focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {isSearchFocused && searchQuery && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 w-full mt-4 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-[2rem] shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="p-4">
                                        {filteredTools.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-2">
                                                {filteredTools.map((tool, idx) => (
                                                    <Link 
                                                        key={idx} 
                                                        to={tool.path}
                                                        className="flex items-center gap-4 p-4 hover:bg-blue-50 rounded-2xl transition-all group"
                                                    >
                                                        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                                                            <tool.icon size={20} />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="font-bold text-gray-900 group-hover:text-blue-600">{tool.title}</div>
                                                            <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">{tool.category}</div>
                                                        </div>
                                                        <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-gray-500 font-medium">No tools found matching "{searchQuery}"</div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <a href="#products" className="group relative bg-[#0583F2] text-white px-8 py-4 rounded-[2rem] font-bold text-base hover:bg-[#010326] transition-all shadow-[0_15px_40px_-12px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(37,99,235,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2.5 w-full sm:w-auto overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            Explore Tools <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="#how-it-works" className="group bg-white text-gray-700 border-2 border-gray-100 px-8 py-4 rounded-[2rem] font-bold text-base hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-2.5 w-full sm:w-auto shadow-sm">
                            <Zap size={18} className="text-amber-500 group-hover:scale-110 transition-transform" /> How it Works
                        </a>
                    </div>
                </motion.div>
            </section>  

            {/* --- Category Cards --- */}
            <section className="max-w-7xl mx-auto px-6 mt-10 relative z-30"> 
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat.id}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setActiveTab(cat.id);
                                // স্ক্রল করে নিচে নিয়ে যাওয়ার অপশন (optional)
                                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center text-center gap-3 bg-white shadow-sm hover:shadow-xl ${
                                activeTab === cat.id ? 'border-blue-500 ring-4 ring-blue-50' : 'border-transparent'
                            }`}
                        >
                            <div className={`w-14 h-14 ${cat.bg} ${cat.color} rounded-2xl flex items-center justify-center mb-1`}>
                                <cat.icon size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight">
                                    {cat.title}
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                                    {cat.count} Tools
                                </p>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* --- Dynamic Tools Grid Section --- */}
            <section className="py-32 px-6 max-w-7xl mx-auto" id="products">
                <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-black text-[#020F59] mb-4 tracking-tighter">Everything you need.</h2>    
                    <p className="text-gray-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed">High-performance tools for content creators, developers, and office pros.</p>
                </motion.div>

                <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={staggerContainer}>
                    {/* যে ক্যাটাগরি সিলেক্ট করা হবে সেই ডাইনামিক হেডার আসবে */}
                    {currentCategoryInfo && (
                        <SectionHeader 
                            icon={currentCategoryInfo.icon} 
                            title={currentCategoryInfo.title} 
                            count={currentCategoryInfo.count} 
                            color={currentCategoryInfo.color.replace('text-', 'bg-')} 
                        />
                    )}
                    
                    {/* এখানে শুধুমাত্র ফিল্টার হওয়া টুলগুলো দেখাবে */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                        {filteredCategoryTools.map((tool, idx) => (
                            <ToolCard 
                                key={idx}
                                to={tool.path} 
                                icon={tool.icon} 
                                color={tool.color} 
                                title={tool.title} 
                                desc={tool.desc} 
                            />
                        ))}
                    </div>
                </motion.div>
            </section>

            
<BlogMarquee />

            {/* --- How It Works --- */}
            <section id="how-it-works" className="bg-white border-y border-gray-100 py-40 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-28">
                        <h2 className="text-5xl font-black text-[#010326] mb-8 tracking-tighter">Native Performance. Browser Privacy.</h2>
                        <div className="w-24 h-2.5 bg-[#0583F2] mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                        <Step number="01" icon={Download} color="bg-gray-900" title="Load Media" desc="Your files are loaded into your local memory. Nothing touches our server." />
                        <Step number="02" icon={Zap} color="bg-blue-600" title="Process" desc="Leveraging WebAssembly (WASM) for near-native hardware speed." />
                        <Step number="03" icon={CheckCircle} color="bg-green-500" title="Save" desc="Download your processed assets instantly. High-quality, no watermarks." />
                    </div>
                </div>
            </section>
            
            {/* --- FAQ --- */}
            <section className="bg-[#F8FAFC] py-40 px-6" id="faq">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-[#010326] mb-6 tracking-tight">Common Questions</h2>
                        <p className="text-gray-500 text-lg">Everything you need to know about our privacy-first approach.</p>
                    </div>
                    <div className="space-y-6">
                        <FAQItem question="How is it faster than other online tools?" answer="Traditional tools upload your file to a server, process it there, and make you download it again. GOOGIZ processes the file directly on your computer's CPU/GPU using WASM, eliminating all upload and download wait times." />
                        <FAQItem question="Are there any file size limits?" answer="The only limit is your device's RAM. Since processing happens locally, we don't impose artificial limits on file sizes like cloud-based competitors do." />
                        <FAQItem question="Is my data really 100% private?" answer="Yes. You can even turn off your internet after loading the page and the tools will still work. Your data literally never leaves your browser window." />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;