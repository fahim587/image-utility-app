import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronDown, Download, FileDigit, Maximize, RefreshCw, 
    Menu, X, RotateCw, Eraser, FileImage, FileText, Video, 
    Music, Settings, Scissors, Files, Lock, QrCode, Key, 
    Braces, Palette, Volume2, FastForward, Type, Droplets, 
    Layers, ShieldCheck, Image, FlipHorizontal, Sparkles,
    Hash, CaseUpper, Link as LinkIcon, ScanBarcode, Eye, EyeOff, Search, Mail, Zap, Languages,
    FileX, Unlock, PenTool, LayoutGrid, Tag, Globe, FileEdit, User,
} from "lucide-react";


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    const location = useLocation();
    const [prevPath, setPrevPath] = useState(location.pathname);

    useEffect(() => {
        if (location.pathname !== prevPath) {
            setPrevPath(location.pathname);
            setIsMenuOpen(false);
            setOpenDropdown(null);
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    }, [location.pathname, prevPath]);

    const closeAllMenus = useCallback(() => {
        setIsMenuOpen(false);
        setOpenDropdown(null);
        setIsSearchOpen(false);
        setSearchQuery("");
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navigate = useNavigate();

    const toolCategories = useMemo(() => [
        {
            name: "AI Magic", 
            id: "ai", 
            colorClass: "violet",
            accent: "bg-indigo-600",
            icon: <Sparkles size={16} className="text-indigo-600 animate-pulse" />,
            items: [
                { name: "AI Content Writer", path: "/ai-content-writer", icon: <PenTool size={14} /> },
                { name: "AI Video Script", path: "/ai-video-script", icon: <Video size={14} /> },
                { name: "AI Image Explainer", path: "/ai-image-explainer", icon: <Eye size={14} /> },
                { name: "AI PDF Summary", path: "/ai-pdf-summarizer", icon: <Sparkles size={14} /> },
            ]
        },
        {
            name: "Image", id: "image", colorClass: "blue", accent: "bg-blue-600",
            icon: <FileImage size={16} className="text-blue-600" />,
            items: [
                { name: "Compress Image", path: "/compress", icon: <Download size={14} /> },
                { name: "Resize Image", path: "/resize", icon: <FileDigit size={14} /> },
                { name: "Crop Image", path: "/crop", icon: <Maximize size={14} /> },
                { name: "Convert Format", path: "/convert", icon: <RefreshCw size={14} /> },
                { name: "Rotate Image", path: "/rotate", icon: <RotateCw size={14} /> },
                { name: "Flip Image", path: "/flip", icon: <FlipHorizontal size={14} /> },
                { name: "Add Watermark", path: "/watermark", icon: <ShieldCheck size={14} /> },
                { name: "Add Text", path: "/add-text", icon: <Type size={14} /> },
                { name: "Blur Image", path: "/blur", icon: <Droplets size={14} /> },
                { name: "Image Filters", path: "/filters", icon: <Layers size={14} /> },
                { name: "Image to PDF", path: "/image-to-pdf", icon: <FileText size={14} /> },
                { name: "Remove Background", path: "/remove-bg", icon: <Eraser size={14} /> },
                { name: "HEIC to JPG", path: "/heic-to-jpg", icon: <Languages size={14} /> },
                { name: "SVG Optimizer", path: "/svg-optimizer", icon: <Layers size={14} /> },
                { name: "Image to Text", path: "/image-to-text", icon: <Type size={14} /> },
                { name: "Color Palette Generator", path: "/color-palette-generator", icon: <Palette size={14} /> },
            ]
        },
        {
            name: "PDF", id: "pdf", colorClass: "rose", accent: "bg-rose-600",
            icon: <FileText size={16} className="text-rose-600" />,
            items: [
                { name: "Merge PDF", path: "/merge-pdf", icon: <Files size={14} /> },
                { name: "Split PDF", path: "/split-pdf", icon: <Scissors size={14} /> },
                { name: "Compress PDF", path: "/compress-pdf", icon: <Download size={14} /> },
                { name: "Rotate PDF", path: "/rotate-pdf", icon: <RotateCw size={14} /> },
                { name: "PDF to JPG", path: "/pdf-to-jpg", icon: <Image size={14} /> },
                { name: "JPG to PDF", path: "/jpg-to-pdf", icon: <FileImage size={14} /> },
                { name: "Watermark PDF", path: "/watermark-pdf", icon: <ShieldCheck size={14} /> },
                { name: "Protect PDF", path: "/protect-pdf", icon: <Lock size={14} /> },
                { name: "Add Page Numbers", path: "/add-page-numbers", icon: <Hash size={14}/> },
                { name: "Remove PDF Pages", path: "/remove-pdf-pages", icon: <FileX size={14}/> },
                { name: "Unlock PDF", path: "/unlock-pdf", icon: <Unlock size={14} /> },
                { name: "Sign PDF", path: "/sign-pdf", icon: <PenTool size={14} /> },
                { name: "Organized PDF", path: "/organized-pdf", icon: <LayoutGrid size={14} /> },
                { name: "Metadata Editor", path: "/metadata-editor", icon: <Tag size={14} /> },
                { name: "HTML to PDF", path: "/html-to-pdf", icon: <Globe size={14} /> },
                { name: "Edit PDF", path: "/edit-pdf", icon: <FileEdit size={14} /> },

            ]
        },
        {
            name: "Video", id: "video", colorClass: "violet", accent: "bg-violet-600",
            icon: <Video size={16} className="text-violet-600" />,
            items: [
                { name: "Video Cutter", path: "/video-cutter", icon: <Scissors size={14} /> },
                { name: "Video Compressor", path: "/video-compress", icon: <Download size={14} /> },
                { name: "Video Convert", path: "/video-convert", icon: <RefreshCw size={14} /> },
                { name: "Video Rotate", path: "/video-rotate", icon: <RotateCw size={14} /> },
                { name: "Video Crop", path: "/video-crop", icon: <Maximize size={14} /> },
                { name: "Video to GIF", path: "/video-to-gif", icon: <Image size={14} /> },
            ]
        },
        {
            name: "Audio", id: "audio", colorClass: "amber", accent: "bg-amber-600",
            icon: <Music size={16} className="text-amber-600" />,
            items: [
                { name: "MP3 Cutter", path: "/mp3-cutter", icon: <Scissors size={14} /> },
                { name: "Audio Convert", path: "/audio-convert", icon: <RefreshCw size={14} /> },
                { name: "Volume Booster", path: "/volume-booster", icon: <Volume2 size={14} /> },
                { name: "Audio Speed", path: "/audio-speed", icon: <FastForward size={14} /> },
            ]
        },
        {
            name: "Utility", id: "utility", colorClass: "emerald", accent: "bg-emerald-600",
            icon: <Settings size={16} className="text-emerald-600" />,
            items: [
                { name: "QR Generator", path: "/qr-generator", icon: <QrCode size={14} /> },
                { name: "Barcode", path: "/barcode", icon: <ScanBarcode size={14} /> },
                { name: "Password Gen", path: "/password-gen", icon: <Key size={14} /> },
                { name: "Base64 Encode", path: "/base64-encode", icon: <EyeOff size={14} /> },
                { name: "Base64 Decode", path: "/base64-decode", icon: <Eye size={14} /> },
                { name: "URL Encode", path: "/url-encode", icon: <LinkIcon size={14} /> },
                { name: "URL Decode", path: "/url-decode", icon: <LinkIcon size={14} /> },
                { name: "Case Converter", path: "/case-converter", icon: <CaseUpper size={14} /> },
                { name: "JSON Formatter", path: "/json-formatter", icon: <Braces size={14} /> },
                { name: "Color Picker", path: "/color-picker", icon: <Palette size={14} /> },
                { name: "Temp Email", path: "/temp-email", icon: <Mail size={14} /> },
                { name: "Typing Test", path: "/typing-test", icon: <Zap size={14} /> },
                { name: "Lorem Ipsum", path: "/lorem-ipsum", icon: <FileText size={14} /> },

            ]
        }
    ], []);

    const filteredTools = useMemo(() => {
        if (!searchQuery) return [];
        const allItems = toolCategories.flatMap(cat => cat.items);
        return allItems.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, toolCategories]);

    const getThemeClasses = (color) => {
        const themes = {
            blue: "hover:bg-blue-50/80 hover:text-blue-600",
            rose: "hover:bg-rose-50/80 hover:text-rose-600",
            violet: "hover:bg-violet-50/80 hover:text-violet-600",
            amber: "hover:bg-amber-50/80 hover:text-amber-600",
            emerald: "hover:bg-emerald-50/80 hover:text-emerald-600"
        };
        return themes[color] || themes.blue;
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "pt-2" : "pt-4"}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <nav className={`relative flex items-center justify-between px-6 h-16 rounded-3xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-all duration-500 ${scrolled ? "bg-white/80 shadow-lg" : "bg-white/50"}`}>
                    
                    <Link to="/" onClick={closeAllMenus} className="flex items-center gap-2.5 group shrink-0">
                        <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <img src="/vite.svg" alt="GOOGIZ Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-black text-[#010326] tracking-tight">GOOGIZ<span className="text-[#010326]">.</span></span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1 mx-4">
                        {toolCategories.map((category) => (
                            <div 
                                key={category.id} 
                                className="relative"
                                onMouseEnter={() => setOpenDropdown(category.id)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <button className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${openDropdown === category.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                                    {(category.name)}
                                    {category.id === 'ai' && (
                                        <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 text-[9px] font-black uppercase rounded-md animate-pulse">
                                            New
                                        </span>
                                    )}
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === category.id ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {openDropdown === category.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-[110%] left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-4xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-100 p-5 grid grid-cols-3 gap-2"
                                        >
                                            {category.items.map((item, index) => (
                                                <motion.div
                                                    key={item.path}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.02 }}
                                                >
                                                    <Link 
                                                        to={item.path}
                                                        onClick={closeAllMenus}
                                                        className={`flex items-center gap-3 p-3 rounded-2xl transition-all group/item ${getThemeClasses(category.colorClass)}`}
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-white group-hover/item:shadow-sm transition-all shrink-0">
                                                            {item.icon}
                                                        </div>
                                                        <span className="text-[12px] font-bold text-slate-700 leading-tight">{(item.name)}</span>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        <div className="relative">
                            <button 
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 transition-all"
                            >
                                <Search size={20} />
                            </button>
                            
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 top-[120%] w-75 md:w-100 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4"
                                    >
                                        <div className="relative flex items-center">
                                            {/* Search Icon Container fixed at left */}
                                            <div className="absolute left-4 w-6 shrink-0 flex items-center justify-center pointer-events-none">
                                                <Search className="text-slate-400" size={16} />
                                            </div>
                                            <input 
                                                autoFocus
                                                type="text"
                                                placeholder={("Search tools...")}
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 ring-blue-500/20"
                                            />
                                        </div>

                                        {searchQuery && (
                                            <div className="mt-4 max-h-75 overflow-y-auto space-y-1 custom-scrollbar">
                                                {filteredTools.length > 0 ? (
                                                    filteredTools.map((item) => (
                                                        <Link 
                                                            key={item.path}
                                                            to={item.path}
                                                            onClick={closeAllMenus}
                                                            className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-all group"
                                                        >
                                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                                                {item.icon}
                                                            </div>
                                                            <span className="text-sm font-bold text-slate-700">{(item.name)}</span>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <div className="py-8 text-center text-slate-400 text-sm">{("No tools found")}</div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <button 
                            onClick={() => navigate("/pricing")} 
                            className="px-4 py-2 font-medium text-gray-700 hover:text-blue-600"
                        >
                            Pricing
                        </button>

                        <div className="hidden lg:flex items-center gap-4">
                            <Link to="/signup" className="bg-[#0583F2] text-white px-7 py-2.5 rounded-full text-sm font-bold hover:bg-[#010326] transition-all active:scale-95 shadow-none">
                                {('Get Started')}
                            </Link>
                        </div>

                        <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        className="fixed inset-0 bg-white z-[60] lg:hidden p-6 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-xl font-black text-slate-900">Menu<span className="text-blue-600">.</span></span>
                            <button onClick={closeAllMenus} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"><X size={20}/></button>
                        </div>

                        <div className="mb-8 relative flex items-center">
                            {/* Mobile Search Icon fixed at left */}
                            <div className="absolute left-4 w-8 shrink-0 flex items-center justify-center pointer-events-none">
                                <Search className="text-slate-400" size={18} />
                            </div>
                            <input 
                                type="text"
                                placeholder={("Search tools...")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 ring-blue-500/20"
                            />
                            
                            {searchQuery && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-10">
                                    {filteredTools.slice(0, 5).map((item) => (
                                        <Link 
                                            key={item.path}
                                            to={item.path}
                                            onClick={closeAllMenus}
                                            className="flex items-center gap-4 p-4 hover:bg-slate-50 border-b border-slate-50 last:border-none"
                                        >
                                            <div className="text-blue-600">{item.icon}</div>
                                            <span className="font-bold text-slate-800 text-sm">{(item.name)}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {toolCategories.map((category) => (
                            <div key={category.id} className="mb-8">
                                <div className="flex items-center gap-2 mb-4 px-2">
                                    <div className={`w-1 h-4 rounded-full ${category.accent}`}></div>
                                    <span className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">{(category.name)}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {category.items.map((item) => (
                                        <Link 
                                            key={item.path} 
                                            to={item.path} 
                                            onClick={closeAllMenus}
                                            className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">{item.icon}</div>
                                            <span className="font-bold text-slate-800 text-sm">{(item.name)}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        <div className="flex flex-col gap-4 mt-4 border-t pt-6">
                             <Link to="/login" onClick={closeAllMenus} className="text-lg font-bold text-blue-600 flex items-center gap-2">
                                <User size={20} /> Login / Sign Up
                             </Link>
                             <Link to="/contact" className="text-lg font-bold text-slate-800">{('Contact')}</Link>
                             <Link to="/privacy" className="text-lg font-bold text-slate-800">{('Privacy')}</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;