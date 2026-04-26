import { motion } from "framer-motion";
import { 
    Sparkles, PenTool, Video, Eye, FileText, 
    ChevronRight, Zap, ShieldCheck, Globe 
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const aiTools = [
    {
        title: "AI Content Writer",
        desc: "Generate high-quality blogs, articles, and SEO content in seconds using advanced AI.",
        icon: PenTool,
        path: "/ai-content-writer",
        color: "bg-indigo-600",
        tag: "Popular"
    },
    {
        title: "AI Video Script",
        desc: "Create engaging scripts for YouTube, Instagram Reels, and TikTok instantly.",
        icon: Video,
        path: "/ai-video-script",
        color: "bg-violet-600",
        tag: "New"
    },
    {
        title: "AI Image Explainer",
        desc: "Upload any image and get detailed descriptions, object detection, and insights.",
        icon: Eye,
        path: "/ai-image-explainer",
        color: "bg-blue-600",
        tag: "Beta"
    },
    {
        title: "AI PDF Summarizer",
        desc: "Save hours of reading. Extract key points and summaries from long PDF documents.",
        icon: Sparkles,
        path: "/ai-pdf-summarizer",
        color: "bg-fuchsia-600",
        tag: "Fast"
    }
];

const AIMagic = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />
            
            <main className="pt-32 pb-20 px-6">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto text-center mb-20">
            
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight"
                    >
                        AI Magic <span className="text-indigo-600">Studio</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
                    >
                        Enhance your workflow with our next-generation AI tools. 
                        Fast, secure, and powered by advanced language models.
                    </motion.p>
                </section>

                {/* Tools Grid */}
                <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {aiTools.map((tool, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Link to={tool.path} className="group block p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                                <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                                    <div className={`w-16 h-16 rounded-2xl ${tool.color} text-white flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
                                        <tool.icon size={32} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-black text-gray-900">{tool.title}</h3>
                                            <span className="px-2.5 py-1 rounded-md bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-tighter border border-gray-100">
                                                {tool.tag}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 leading-relaxed mb-6">
                                            {tool.desc}
                                        </p>
                                        <div className="flex items-center text-sm font-bold text-indigo-600 uppercase tracking-widest group-hover:gap-2 transition-all">
                                            Open Tool <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                                {/* Background Decorative Circle */}
                                <div className={`absolute -right-10 -bottom-10 w-40 h-40 ${tool.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
                            </Link>
                        </motion.div>
                    ))}
                </section>

               
            </main>

            <Footer />
        </div>
    );
};

export default AIMagic;