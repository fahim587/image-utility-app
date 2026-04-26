import React from "react";
import { Link } from "react-router-dom";
// Path check koro: jodi data folder src/ data folder e hoy
import { toolCategories } from "../data/toolsData"; 

const RelatedTools = ({ categoryId }) => {
    const currentCategory = toolCategories.find(cat => cat.id === categoryId);

    if (!currentCategory) return null;

    const themeMap = {
        image: { text: "text-blue-600", bg: "bg-blue-50", hover: "hover:border-blue-200", icon: "text-blue-600" },
        pdf: { text: "text-rose-600", bg: "bg-rose-50", hover: "hover:border-rose-200", icon: "text-rose-600" },
        video: { text: "text-violet-600", bg: "bg-violet-50", hover: "hover:border-violet-200", icon: "text-violet-600" },
        audio: { text: "text-amber-600", bg: "bg-amber-50", hover: "hover:border-amber-200", icon: "text-amber-600" },
        utility: { text: "text-emerald-600", bg: "bg-emerald-50", hover: "hover:border-emerald-200", icon: "text-emerald-600" }
    };

    const theme = themeMap[categoryId] || themeMap.image;

    return (
        <div className="mt-12 max-w-5xl mx-auto px-6"> {/* max-w-5xl for rose theme */}
            <div className="flex items-center gap-3 mb-8">
                <div className={`w-1.5 h-8 ${theme.text.replace('text', 'bg')} rounded-full`}></div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                    More {currentCategory.name} Tools
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentCategory.items.map((item) => (
                    <Link 
                        key={item.path} 
                        to={item.path}
                        className={`group p-5 bg-white border border-gray-100 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-gray-100/50 ${theme.hover}`}
                    >
                        <div className={`w-12 h-12 ${theme.bg} ${theme.icon} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            {/* Lucide icon checking */}
                            {item.icon && React.cloneElement(item.icon, { size: 24 })}
                        </div>
                        <h3 className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors uppercase text-[11px] tracking-wider">
                            {item.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-1 font-medium">Free Online Tool</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedTools;