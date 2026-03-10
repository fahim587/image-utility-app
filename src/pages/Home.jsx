import { useState, useEffect } from "react"; // Added useEffect for typing logic
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Added Framer Motion
import { Maximize, RotateCw, FileDigit, Eraser, Download, RefreshCw, ShieldCheck, Zap, Lock, Globe, CheckCircle, HelpCircle, ChevronRight, Menu, X, ChevronDown, FileImage } from "lucide-react";
// Animation Variants
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } }
};

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <a href="#top" className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                    <img src="/vite.svg" alt="logo" className="w-8 h-8" />
                    PicEditly
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 py-2" onMouseEnter={() => setIsProductDropdownOpen(true)} onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}>
                            Products <ChevronDown size={14} />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                        {(isProductDropdownOpen) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 transform origin-top-left"
                                onMouseLeave={() => setIsProductDropdownOpen(false)}
                            >
                                <Link to="/compress" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 hover:text-blue-600">
                                    <Download size={16} className="text-green-500" /> Compress Image
                                </Link>
                                <Link to="/resize" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 hover:text-blue-600">
                                    <FileDigit size={16} className="text-blue-500" /> Resize Image
                                </Link>
                                <Link to="/crop" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 hover:text-blue-600">
                                    <Maximize size={16} className="text-purple-500" /> Crop Image
                                </Link>
                                <Link to="/convert" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 hover:text-blue-600">
                                    <RefreshCw size={16} className="text-orange-500" /> Convert Format
                                </Link>
                                <Link to="/rotate" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 hover:text-blue-600">
                                    <RotateCw size={16} className="text-pink-500" /> Rotate & Flip
                                </Link>
                                <Link to="/remove-bg" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 hover:text-blue-600">
                                    <Eraser size={16} className="text-indigo-500" /> Remove Background
                                </Link>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                    <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                        Features
                    </a>
                    <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                        FAQ
                    </a>
                    <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                      Contact
                    </Link>
                    <Link to="/blog" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                      Blog
                    </Link>

                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link to="/compress" className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
            {isMenuOpen && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="md:hidden bg-white border-t border-gray-100 p-4 absolute top-16 left-0 w-full shadow-lg flex flex-col gap-4 overflow-hidden"
                >
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Products</span>
                        <Link to="/compress" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-gray-700">
                            <Download size={16} className="text-green-500" /> Compress
                        </Link>
                        <Link to="/resize" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-gray-700">
                            <FileDigit size={16} className="text-blue-500" /> Resize
                        </Link>
                        <Link to="/crop" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-gray-700">
                            <Maximize size={16} className="text-purple-500" /> Crop
                        </Link>
                        <Link to="/remove-bg" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-gray-700">
                            <Eraser size={16} className="text-indigo-500" /> Remove BG
                        </Link>
                        <Link to="/convert" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-gray-700">
                            <FileImage size={16} className="text-yellow-500" /> Convert Format
                        </Link>
                        <Link to="/rotate" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-gray-700">
                            <RotateCw size={16} className="text-red-500" /> Rotate & Flip
                        </Link>
                        </div>
                    <div className="h-px bg-gray-100"></div>
                    <a href="#features" className="text-gray-700 font-medium p-2">
                        Features
                    </a>
                    <a href="#faq" className="text-gray-700 font-medium p-2">
                        FAQ
                    </a>
                    <Link to="/contact" className="text-gray-700 font-medium p-2">
                        Contact Us
                    </Link>
                    <Link to="/blog" className="text-gray-700 font-medium p-2">
                        Blog
                    </Link>
                </motion.div>
            )}
            </AnimatePresence>
        </nav>
    );
};

const ToolCard = ({ to, icon: Icon, title, desc, color }) => (
    <motion.div variants={fadeInUp}>
        <Link to={to} className="group relative block p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} text-white transition-transform group-hover:scale-110`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">{desc}</p>
            <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Launch Tool <ChevronRight size={14} className="ml-1" />
            </div>
        </Link>
    </motion.div>
);

const Step = ({ number, title, desc, icon: Icon, color }) => (
    <motion.div 
        variants={fadeInUp} 
        className="group relative flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
    >
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 ${color} text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg ring-4 ring-white z-20`}>
            {number}
        </div>
        <div className={`w-20 h-20 rounded-2xl ${color.replace('bg-', 'bg-opacity-10 ')} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
            <Icon size={32} className={`${color.replace('bg-', 'text-')}`} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 ${color} rounded-full group-hover:w-1/3 transition-all duration-500`}></div>
     
    </motion.div>
);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div layout className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <HelpCircle className="w-4 h-4" />
                    </div>
                    <h4 className={`font-bold transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-900'}`}>{question}</h4>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <div className="px-6 pb-6 pt-0 ml-11">
                            <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Home = () => {
    // --- Typewriter Logic Added ---
    const [displayedText, setDisplayedText] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(100);

    const words = ["Professional Image Tools", "Right in Your Browser"];

    useEffect(() => {
        const timer = setTimeout(() => {
            const currentFullWord = words[wordIndex];
            
            if (isDeleting) {
                setDisplayedText(currentFullWord.substring(0, displayedText.length - 1));
                setTypingSpeed(50);
            } else {
                setDisplayedText(currentFullWord.substring(0, displayedText.length + 1));
                setTypingSpeed(100);
            }

            if (!isDeleting && displayedText === currentFullWord) {
                setTypingSpeed(2000); // Wait before deleting
                setIsDeleting(true);
            } else if (isDeleting && displayedText === "") {
                setIsDeleting(false);
                setWordIndex((prev) => (prev + 1) % words.length);
                setTypingSpeed(500); // Small pause before next word
            }
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, wordIndex, typingSpeed,words]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div id="top"></div>
            <Navbar />

            {/* Hero Section */}
            <section className="bg-white border-b border-gray-200 pt-32 pb-20 px-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto relative z-10"
                >
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-sm border border-blue-100 overflow-hidden cursor-default group"
                    >
                        {/* Animated Glow Pulse */}
                        <motion.span 
                            animate={{ 
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                duration: 2, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                            }}
                            className="absolute inset-0 bg-blue-200/40 rounded-full blur-md"
                        />

                        {/* Shimmering Light Streak */}
                        <motion.div 
                            animate={{ x: ['-150%', '150%'] }}
                            transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                ease: "linear",
                                repeatDelay: 1
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"
                        />

                        {/* Animated Icon */}
                        <motion.div
                            animate={{ 
                                scale: [1, 1.25, 1],
                                filter: ["drop-shadow(0 0 0px #3b82f6)", "drop-shadow(0 0 4px #3b82f6)", "drop-shadow(0 0 0px #3b82f6)"]
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 2,
                                ease: "easeInOut"
                            }}
                            className="relative z-10 flex items-center"
                        >
                            <Zap size={14} fill="gray-900" className="text-blue-600" />
                        </motion.div>

                        <span className="relative z-10 drop-shadow-sm">Now Live</span>
                    </motion.div>
                    {/* Updated Heading with Typewriter logic and min-height to prevent layout shift */}
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight min-h-[160px]">
                        <span className="inline-block">
                            {displayedText}
                            <motion.span 
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="inline-block w-1.5 h-12 md:h-14 bg-blue-600 ml-2 align-middle"
                            />
                        </span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Edit and Optimize Instantly</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Edit, resize, convert, and optimize your images instantly.
                        <span className="text-gray-900 font-medium"> No uploads. No sign-ups.</span>
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/compress" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                            Start Editing Now <ChevronRight size={18} />
                        </Link>
                        <a href="#how-it-works" className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                            Learn More <ChevronRight size={18} />
                        </a>
                        
                    </div>

                   <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.8 }}
    className="mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-8"
>
    {[
        { 
        icon: CheckCircle, 
        text: "Free Forever", 
        color: "text-white", 
        iconColor: "text-blue-400", // Soft contrast for the dark card
        bg: "bg-gray-900", 
        border: "border-gray-700/50",
        shadow: "shadow-blue-500/20",
        glow: "group-hover:bg-blue-500/10"
    },
    { 
        icon: ShieldCheck, 
        text: "Privacy First", 
        color: "text-blue-700", 
        iconColor: "text-blue-600",
        bg: "bg-blue-50/50", 
        border: "border-blue-100",
        shadow: "shadow-blue-200/40",
        glow: "group-hover:bg-blue-100/50"
    },
    { 
        icon: Globe, 
        text: "Works Offline", 
        color: "text-emerald-700", 
        iconColor: "text-emerald-500",
        bg: "bg-emerald-50/50", 
        border: "border-emerald-100", 
        shadow: "shadow-emerald-200/40",
        glow: "group-hover:bg-emerald-100/50"
    }
    ].map((feature, index) => (
        <motion.div
            key={index}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border ${feature.bg} ${feature.border} shadow-sm ${feature.shadow} transition-all duration-300`}
        >
            <feature.icon size={18} className={`${feature.color}`} />
            <span className={`text-sm font-bold ${feature.color.replace('500', '700')} tracking-tight`}>
                {feature.text}
            </span>
        </motion.div>
    ))}
</motion.div>
                </motion.div>
            </section>

            {/* Tools Grid */}
            <section className="py-20 px-6 max-w-7xl mx-auto" id="products">
                <motion.div 
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need At A Glance</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">A complete suite of image manipulation tools available at your fingertips.</p>
                </motion.div>

                <motion.div 
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <ToolCard to="/compress" icon={Download} color="bg-green-500" title="Compress Image" desc="Reduce file size significantly while maintaining visual quality. Perfect for SEO and web performance." />
                    <ToolCard to="/resize" icon={FileDigit} color="bg-blue-500" title="Resize Image" desc="Change dimensions by pixels or percentage. Scale images down for thumbnails or social media." />
                    <ToolCard to="/crop" icon={Maximize} color="bg-purple-500" title="Crop Image" desc="Trim unwanted areas with precision. Use presets for Instagram, Twitter, and Facebook covers." />
                    <ToolCard to="/convert" icon={RefreshCw} color="bg-orange-500" title="Convert Format" desc="Switch seamlessly between JPG, PNG, WEBP, and GIF formats. Modernize your assets." />
                    <ToolCard to="/resize" icon={RotateCw} color="bg-pink-500" title="Rotate & Flip" desc="Fix orientation issues instantly. Rotate 90° or mirror images horizontally and vertically." />
                    <ToolCard to="/remove-bg" icon={Eraser} color="bg-indigo-500" title="Remove Background" desc="Use AI to automatically detect and remove backgrounds. Professional results in seconds." />
                </motion.div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="bg-gray-50/30 border-y border-gray-100 py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60"></div>

                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-20"
                    >
                        <span className="text-blue-600 font-bold tracking-[0.8em] uppercase text-xs mb-4 block">How It Works</span>
                        <h2 className="text-4xl font-black text-gray-900 mb-4">Simple, fast, and secure processing in three steps.</h2>
                        <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                    </motion.div>

                    <motion.div 
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-12"
                    >
                        <Step 
                            number="01" 
                            icon={Download} 
                            color="bg-gray-900" 
                            title="Upload Image" 
                            desc="Drag & drop your files into the browser. We support JPG, PNG, WEBP, and more." 
                        />
                        <Step 
                            number="02" 
                            icon={Zap} 
                            color="bg-blue-600" 
                            title="Edit Instantly" 
                            desc="Choose your tool. Crop, resize, or compress. Changes happen in real-time." 
                        />
                        <Step 
                            number="03" 
                            icon={CheckCircle} 
                            color="bg-green-500" 
                            title="Download" 
                            desc="Get your optimized image instantly. No watermarks, no sign-up required." 
                        />
                    </motion.div>
                </div>
            </section>

            {/* FAQ */}
            <section className="bg-gray-50/50 py-24 px-6 border-y border-gray-100" id="faq">
                <div className="max-w-3xl mx-auto">
                    <motion.div 
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3 block">Got Questions?</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
                    </motion.div>
                    <motion.div 
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="space-y-4"
                    >
                        <FAQItem question="Is this tool really free?" answer="Yes! PicEditly is completely free and open source. There are no hidden fees, premium tiers, or watermarks on your exported images. We believe essential tools should be accessible to everyone." />
                        <FAQItem question="Are my photos uploaded to a server?" answer="Absolutely not. We prioritize your privacy above all else. PicEditly utilizes advanced client-side technologies like HTML5 Canvas and WebAssembly to process every image directly within your browser. Your data never touches our servers." />
                        <FAQItem question="What image formats do you support?" answer="We currently support a wide range of popular formats including JPEG, PNG, WEBP, and GIF for input. Our powerful conversion tool allows you to easily switch between these formats depending on your needs." />
                        <FAQItem question="Can I use PicEditly on my mobile device?" answer="Yes, definitely. PicEditly is designed with a mobile-first approach. The interface is fully responsive, ensuring a smooth, app-like experience on both iOS and Android smartphones and tablets." />
                        <FAQItem question="Is there a limit to the file size I can edit?" answer="While there's no strict limit imposed by us, performance depends on your device's capabilities since all processing happens locally. For extremely large files (e.g., raw photos), older devices might experience slight delays." />
                    </motion.div>
                </div>
            </section>

            {/* Features / Why Us */}
            <section className="py-24 px-6 relative overflow-hidden bg-white" id="features">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -z-10 rounded-l-[100px] hidden lg:block"></div>
                <div className="max-w-5xl mx-auto">
                    <motion.div 
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="text-center mb-16 max-w-3xl mx-auto"
                    >
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3 block">Why Choose PicEditly</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Designed for Professionals, Built for Everyone</h2>
                        <p className="text-lg text-gray-500">Experience desktop-class image editing right in your browser. No compromises on quality or privacy.</p>
                    </motion.div>

                    <motion.div 
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        <motion.div 
                            variants={fadeInUp} 
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-300 group"
                        >
                            <div className="size-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                                <Lock size={26} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Privacy Guaranteed</h3>
                            <p className="text-gray-500 leading-relaxed">Your photos never leave your device. All processing happens locally in your browser using secure WebAssembly technology. Absolute peace of mind.</p>
                        </motion.div>

                        <motion.div 
                            variants={fadeInUp} 
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-300 group"
                        >
                            <div className="size-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                                <Zap size={26} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Lightning Fast</h3>
                            <p className="text-gray-500 leading-relaxed">No server uploads means zero latency. Experience instant edits, even with high-resolution files. Your workflow, uninterrupted.</p>
                        </motion.div>

                        <motion.div 
                            variants={fadeInUp} 
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:border-emerald-100 transition-all duration-300 group"
                        >
                            <div className="size-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-teal-500/30">
                                <Globe size={26} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-500 transition-colors">Universal Access</h3>
                            <p className="text-gray-500 leading-relaxed">Whether you're on a desktop, tablet, or smartphone, PixEdit adapts perfectly. A seamless, native-feeling app experience everywhere.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-950 text-gray-400 pt-20 pb-10 px-6 border-t border-gray-900 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div className="lg:col-span-1">
                            <a href="#top" className="text-2xl font-extrabold text-white flex items-center gap-3 mb-6">
                                <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md">
                                    <img src="/vite.svg" alt="PicEditly Logo" className="w-7 h-7 object-contain" />
                                </div>
                                PicEditly
                            </a>
                            <p className="text-sm leading-relaxed mb-6">
                                Professional-grade image editing tools right in your browser. Fast, secure, and completely free.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Products</h4>
                            <ul className="space-y-4 text-sm">
                                <li><Link to="/compress" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Compress Image</Link></li>
                                <li><Link to="/resize" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Resize Image</Link></li>
                                <li><Link to="/crop" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Crop Image</Link></li>
                                <li><Link to="/convert" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Convert Format</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">More Tools</h4>
                            <ul className="space-y-4 text-sm">
                                <li><Link to="/resize" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Rotate & Flip</Link></li>
                                <li><Link to="/remove-bg" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Remove Background</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Resources</h4>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#features" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Features</a></li>
                                <li><a href="#faq" className="hover:text-white hover:translate-x-1 transition-transform inline-block">FAQ</a></li>
                                <li><Link to="/contact" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Contact Us</Link></li>
                                <li><Link to="/blog" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Blog</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                        <p>&copy; {new Date().getFullYear()} PicEditly. Released under ISC License.</p>
                        <div className="flex gap-6">
                           <Link to="/contact" className="hover:text-white hover:translate-x-1 transition-transform inline-block">Contact Us</Link>
                           <Link to="/privacy" className="cursor-pointer hover:text-white transition-colors">Privacy Policy</Link>
                           <Link to="/terms" className="cursor-pointer hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
export default Home;