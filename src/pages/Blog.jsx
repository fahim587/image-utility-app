import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronDown, ChevronUp, CheckCircle2, Lightbulb, ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// উদাহরণস্বরূপ আপনার ছবি দুটি ইম্পোর্ট করা হচ্ছে
// আপনার প্রোজেক্টে সঠিক পাথ ব্যবহার করুন
import hallstattImage from '../assets/LAKE.png'; 
import camperVanImage from '../assets/LAKE2.png';
import ball from '../assets/ball.png';
import AMERICAN from '../assets/AMERICAN.png';
import PICLE from '../assets/PICLE.png';
import SCATING from '../assets/SCATING.png';

const toolsDetails = [
    {
        name: "Compress Image",
        link: "/compress",
        shortDesc: "Reduce file size without losing visual quality.",
        // Hallstatt Lake ছবিটি ল্যান্ডস্কেপ কন্টেন্টকে আরও সুন্দর করবে
        toolImage: <img src={hallstattImage} alt="Hallstatt Lake Optimization" className="size-full object-cover rounded-3xl" />, 
        howToUse: [
            "Upload your high-resolution image (JPG/PNG).",
            "Adjust the quality slider to your desired level.",
            "Click 'Compress' and download your optimized file."
        ],
        benefits: "Perfect for web developers to improve site speed and SEO. It saves storage space on your phone or cloud.",
        bg: "bg-amber-50"
    },
    {
        name: "Resize Image",
        link: "/resize",
        shortDesc: "Change dimensions for social media or web banners.",
        // Camper Van ছবিটি রেজাইজিং ও ক্রপিং গাইড করার জন্য চমৎকার
        toolImage: <img src={camperVanImage} alt="Camper Van Resizing" className="size-full object-cover rounded-3xl" />,
        howToUse: [
            "Select your image and enter the required width and height.",
            "Keep the 'Aspect Ratio' locked to avoid distortion.",
            "Download the resized image in one click."
        ],
        benefits: "Ensures your photos fit perfectly on Instagram, YouTube thumbnails, or Facebook covers without getting cropped awkwardly.",
        bg: "bg-blue-50"
    },
    {
        name: "Crop Image",
        link: "/crop",
        shortDesc: "Focus on the best parts of your photo.",
        toolImage: <img src={ball} alt="Camper Van Cropping Focus" className="size-full object-cover rounded-3xl" />, 
        howToUse: [
            "Drag the cropping box over the subject you want to keep.",
            "Use presets like 1:1 (Square) or 16:9 (Widescreen).",
            "Apply and save your new composition."
        ],
        benefits: "Removes distracting background elements and follows the 'Rule of Thirds' for a more professional look.",
        bg: "bg-emerald-50"
    },
    {
        name: "Convert Format",
        link: "/convert",
        shortDesc: "Switch between PNG, JPG, and WebP instantly.",
        toolImage: <img src={AMERICAN} alt="Hallstatt Landscape WebP Conversion" className="size-full object-cover rounded-3xl" />,
        howToUse: [
            "Upload your current image file.",
            "Choose the output format (WebP is recommended for web).",
            "Convert and download instantly."
        ],
        benefits: "WebP format makes your website load 3x faster than traditional JPG, which is a massive win for AdSense approval.",
        bg: "bg-purple-50"
    },
    {
        name: "Rotate & Flip",
        link: "/rotate",
        shortDesc: "Fix horizon lines or mirror your shots.",
        toolImage: <img src={PICLE} alt="Camper Van Orientation Fix" className="size-full object-cover rounded-3xl" />, 
        howToUse: [
            "Use the rotate buttons to fix tilted horizons.",
            "Use 'Flip' to change the direction of the subject.",
            "Save the corrected image."
        ],
        benefits: "Corrects mistakes made during shooting and helps in leading the viewer's eye toward your content.",
        bg: "bg-orange-50"
    },
    {
        name: "Remove Background",
        link: "/remove-bg",
        shortDesc: "AI-powered subject isolation in seconds.",
        toolImage: <img src={SCATING} alt="Camper Van Subject Isolation" className="size-full object-cover rounded-3xl" />, 
        howToUse: [
            "Upload any photo with a clear subject.",
            "Wait for the AI to process and remove the background.",
            "Download as a transparent PNG."
        ],
        benefits: "Crucial for e-commerce sellers (Amazon/Daraz) to create clean product photos and for creators to make stickers/collages.",
        bg: "bg-pink-50"
    }
];

const Blog = () => {
    const [expandedId, setExpandedId] = useState(null);

    return (
        <div className="min-h-screen bg-white pb-20 font-sans">
            {/* Header */}
            <header className="py-20 bg-slate-900 text-center px-6">
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
            <main className="max-w-6xl mx-auto px-6 -mt-10">
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
                                    {/* এখানে সাধারণ আইকনের জায়গায় ছবি ব্যবহার করা হয়েছে */}
                                    <div className={`size-30 rounded-3xl ${tool.bg} flex items-center justify-center shadow-inner`}>
                                        {tool.toolImage}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">{tool.name}</h2>
                                        <p className="text-slate-500 mt-1">{tool.shortDesc}</p>
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
                                            {/* How to use */}
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

                                            {/* Why use it */}
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

            {/* Final CTA */}
            <section className="mt-20 text-center px-6">
                <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 p-12 rounded-[50px] text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to optimize your images?</h2>
                    <p className="opacity-90 mb-8">Join thousands of users who edit their photos with 100% privacy.</p>
                    <Link to="/" className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black hover:scale-105 transition-transform inline-block">
                        Go to Tools Dashboard
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Blog;