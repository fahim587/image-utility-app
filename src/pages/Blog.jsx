import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Download, FileDigit, Focus, RefreshCcw, RotateCw, Layers,
    ChevronDown, ChevronUp, CheckCircle2, Lightbulb, ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const toolsDetails = [
    {
        name: "Compress Image",
        link: "/compress",
        shortDesc: "Reduce file size significantly while maintaining visual quality. Perfect for SEO and web performance.",
        icon: <Download className="size-10 text-white" />, 
        howToUse: [
            "Upload your high-resolution image (JPG/PNG).",
            "Adjust the quality slider to your desired level.",
            "Click 'Compress' and download your optimized file."
        ],
        benefits: "Perfect for web developers to improve site speed and SEO. It saves storage space on your phone or cloud.",
        bg: "bg-[#22c55e]"
    },
    {
        name: "Resize Image",
        link: "/resize",
        shortDesc: "Change dimensions by pixels or percentage. Scale images down for thumbnails or social media.",
        icon: <FileDigit className="size-10 text-white" />,
        howToUse: [
            "Select your image and enter the required width and height.",
            "Keep the 'Aspect Ratio' locked to avoid distortion.",
            "Download the resized image in one click."
        ],
        benefits: "Ensures your photos fit perfectly on Instagram, YouTube thumbnails, or Facebook covers without getting cropped awkwardly.",
        bg: "bg-[#3b82f6]"
    },
    {
        name: "Crop Image",
        link: "/crop",
        shortDesc: "Trim unwanted areas with precision. Use presets for Instagram, Twitter, and Facebook covers.",
        icon: <Focus className="size-10 text-white" />, 
        howToUse: [
            "Drag the cropping box over the subject you want to keep.",
            "Use presets like 1:1 (Square) or 16:9 (Widescreen).",
            "Apply and save your new composition."
        ],
        benefits: "Removes distracting background elements and follows the 'Rule of Thirds' for a more professional look.",
        bg: "bg-[#a855f7]"
    },
    {
        name: "Convert Format",
        link: "/convert",
        shortDesc: "Switch seamlessly between JPG, PNG, WEBP, and GIF formats. Modernize your assets.",
        icon: <RefreshCcw className="size-10 text-white" />,
        howToUse: [
            "Upload your current image file.",
            "Choose the output format (WebP is recommended for web).",
            "Convert and download instantly."
        ],
        benefits: "WebP format makes your website load 3x faster than traditional JPG, which is a massive win for AdSense approval.",
        bg: "bg-[#f97316]"
    },
    {
        name: "Rotate & Flip",
        link: "/rotate",
        shortDesc: "Fix orientation issues instantly. Rotate 90° or mirror images horizontally and vertically.",
        icon: <RotateCw className="size-10 text-white" />, 
        howToUse: [
            "Use the rotate buttons to fix tilted horizons.",
            "Use 'Flip' to change the direction of the subject.",
            "Save the corrected image."
        ],
        benefits: "Corrects mistakes made during shooting and helps in leading the viewer's eye toward your content.",
        bg: "bg-[#ec4899]"
    },
    {
        name: "Remove Background",
        link: "/remove-bg",
        shortDesc: "Use AI to automatically detect and remove backgrounds. Professional results in seconds.",
        icon: <Layers className="size-10 text-white" />, 
        howToUse: [
            "Upload any photo with a clear subject.",
            "Wait for the AI to process and remove the background.",
            "Download as a transparent PNG."
        ],
        benefits: "Crucial for e-commerce sellers (Amazon/Daraz) to create clean product photos and for creators to make stickers/collages.",
        bg: "bg-[#6366f1]"
    }
];

const Blog = () => {
    const [expandedId, setExpandedId] = useState(null);

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Header */}
            <header id="top" className="py-20 bg-slate-900 text-center px-6">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black text-white mb-6"
                >
                    Master Your <span className="text-blue-500">Editing</span>
                </motion.h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    A complete guide on how to use PicEditly tools effectively for professional results.
                </p>
            </header>

            {/* Content Grid */}
            <main className="max-w-6xl mx-auto px-6 -mt-10 pb-20">
                <div className="grid grid-cols-1 gap-8">
                    {toolsDetails.map((tool, index) => (
                        <motion.div 
                            key={index}
                            className={`rounded-[40px] border border-slate-100 overflow-hidden shadow-sm transition-all ${expandedId === index ? 'ring-2 ring-blue-500 shadow-xl' : 'bg-white'}`}
                        >
                            <div 
                                className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer"
                                onClick={() => setExpandedId(expandedId === index ? null : index)}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`size-20 rounded-2xl ${tool.bg} flex items-center justify-center shadow-lg shrink-0`}>
                                        {tool.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">{tool.name}</h2>
                                        <p className="text-slate-500 mt-1 max-w-md">{tool.shortDesc}</p>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 font-bold text-blue-600 bg-blue-50 px-6 py-3 rounded-2xl hover:bg-blue-100 transition-colors">
                                    {expandedId === index ? "Close Details" : "View Details"}
                                    {expandedId === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                            </div>

                            <AnimatePresence>
                                {expandedId === index && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-50 bg-slate-50/50 p-8 md:p-12"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div>
                                                <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-6">
                                                    <CheckCircle2 className="text-emerald-500" /> How to Use?
                                                </h3>
                                                <ul className="space-y-4">
                                                    {tool.howToUse.map((step, i) => (
                                                        <li key={i} className="flex gap-4 text-slate-600 leading-relaxed">
                                                            <span className="font-black text-blue-600">{i + 1}.</span>
                                                            {step}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-6">
                                                    <Lightbulb className="text-amber-500" /> Why You Need This?
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                                    {tool.benefits}
                                                </p>
                                                <Link 
                                                    to={tool.link}
                                                    className="mt-8 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                                >
                                                    Try {tool.name} Now <ExternalLink size={18} />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </main>

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

export default Blog;