import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, ArrowLeft, Plus, ChevronDown } from "lucide-react";
import { toolCategories } from "../data/toolsData"; // আপনার ডাটা ফাইলের পাথ নিশ্চিত করুন

// --- ToolCard Component ---
const ToolCard = ({ to, icon, title, color }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -5 }}
        className="group relative block p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
    >
        <Link to={to} className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} text-white shadow-lg shadow-current/20`}>
                {icon}
            </div>
            <div className="flex-1 text-left">
                <h3 className="text-[13px] font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">
                    {title}
                </h3>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Free Utility</p>
            </div>
            <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-all" />
        </Link>
    </motion.div>
);

// --- Category Section Component ---
const CategorySection = ({ category }) => {
    const [showAll, setShowAll] = useState(false);
    
    // প্রথমে ৬টি টুল দেখাবে, showAll true হলে সব দেখাবে
    const visibleItems = showAll ? category.items : category.items.slice(0, 6);

    return (
        <div className="mb-16">
            {/* সেকশন হেডার */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white shadow-sm border border-gray-100 rounded-2xl text-blue-600">
                    {category.icon}
                </div>
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                        {category.name}
                    </h2>
                    <p className="text-[11px] text-gray-400 font-medium">{category.items.length} Total Tools</p>
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-100 to-transparent ml-4"></div>
            </div>

            {/* টুলস গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                    {visibleItems.map((tool, idx) => (
                        <ToolCard 
                            key={tool.path + idx} 
                            to={tool.path} 
                            icon={tool.icon} 
                            title={tool.name} 
                            color={tool.color} 
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* More/Less Tools Button */}
            {category.items.length > 6 && (
                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={() => setShowAll(!showAll)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-full text-sm font-bold transition-all border border-gray-200 hover:border-blue-200 shadow-sm"
                    >
                        {showAll ? (
                            <>Show Less <ChevronDown size={16} className="rotate-180" /></>
                        ) : (
                            <>Show More {category.name} Tools ({category.items.length - 6}+) <ChevronDown size={16} /></>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

const AllTools = () => {
    const [searchQuery, setSearchQuery] = useState("");

    // সার্চের জন্য সব টুলসকে ফ্ল্যাট করা
    const flatTools = useMemo(() => {
        let all = [];
        toolCategories.forEach(cat => {
            cat.items.forEach(item => {
                all.push({ ...item, categoryName: cat.name });
            });
        });
        return all;
    }, []);

    const filteredTools = flatTools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FBFCFE] pb-24">
            {/* টিনিওয়াও স্টাইল হেডার */}
            <header className="pt-16 pb-12 px-6 bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto text-center">
                    <Link to="/" className="inline-flex items-center gap-2 text-blue-600 font-bold mb-6 hover:translate-x-[-4px] transition-transform text-xs uppercase tracking-widest">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">
                        All <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Power</span> Tools
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
                        We offer a wide range of free tools to help you with your daily digital tasks. No registration required.
                    </p>

                    {/* সার্চ বার */}
                    <div className="max-w-xl mx-auto relative mt-10">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={20} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="What can we help you with?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-100 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all shadow-sm text-md font-medium"
                        />
                    </div>
                </div>
            </header>

            {/* মেইন কন্টেন্ট */}
            <main className="py-16 px-6 max-w-6xl mx-auto">
                {searchQuery ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredTools.map((tool, idx) => (
                            <ToolCard key={idx} to={tool.path} icon={tool.icon} title={tool.name} color={tool.color} />
                        ))}
                    </div>
                ) : (
                    toolCategories.map((category) => (
                        <CategorySection key={category.id} category={category} />
                    ))
                )}

                {/* Empty State */}
                {filteredTools.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex p-5 bg-gray-100 rounded-full mb-4 text-gray-400">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No tools found for "{searchQuery}"</h3>
                        <button onClick={() => setSearchQuery("")} className="text-blue-600 font-bold mt-2 hover:underline">Clear search</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AllTools;