import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { blogPosts } from "../data/blogData";
import { Search, ArrowRight, Clock, Inbox } from "lucide-react";

const categories = ["All", "Image", "PDF", "Video", "Audio", "Utility", "AI Magic"];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-6">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto text-center mb-20">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold tracking-wide uppercase"
        >
          Our Journal
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-slate-900 mt-6 mb-6 tracking-tight"
        >
          GOOGIZ <span className="text-blue-600">Insights</span>
        </motion.h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Explore expert guides, industry news, and creative workflows to supercharge your digital assets.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col lg:flex-row gap-8 items-center justify-between bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeCategory === cat 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredPosts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            <AnimatePresence mode='popLayout'>
              {filteredPosts.map((post, index) => {
                // রিডিং টাইম ক্যালকুলেশন
                const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);
                
                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    key={post.slug}
                    className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={post.image} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={post.title}
                        loading="lazy"
                      />
                      <div className="absolute top-5 left-5">
                        <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-10 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                         <span className="flex items-center gap-1.5 text-blue-500/80"><Clock size={14}/> {readingTime} Min Read</span>
                         <span>•</span>
                         <span>{post.date}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-snug">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-slate-500 leading-relaxed line-clamp-3 mb-8 text-sm">
                        {post.excerpt}
                      </p>
                      
                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                            {post.author[0]}
                          </div>
                          <span className="text-sm font-bold text-slate-700">{post.author}</span>
                        </div>
                        <Link 
                          to={`/blog/${post.slug}`} 
                          className="p-3 bg-slate-50 rounded-full group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-[-45deg] transition-all duration-300"
                        >
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200"
          >
            <div className="inline-flex p-6 bg-slate-50 rounded-full mb-6">
              <Inbox className="text-slate-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No articles found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search or category filter.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog;