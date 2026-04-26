import React, { useState } from "react";
import { motion, useMotionValue, useAnimationFrame, useTransform } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { blogPosts } from "../data/blogData";
import { ArrowRight, Clock, Sparkles } from "lucide-react";

const BlogMarquee = () => {
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  
  const duplicatedPosts = [...blogPosts, ...blogPosts];

  const x = useMotionValue(0);
  const baseVelocity = -0.035; 
  
  const xPos = useTransform(x, (value) => `${value}%`);

  useAnimationFrame((t, delta) => {
    if (!isPaused) {
      let moveBy = baseVelocity * (delta / 16);
      let currentX = x.get() + moveBy;

      if (currentX <= -50) {
        currentX = 0;
      } else if (currentX > 0) {
        currentX = -50;
      }
      
      x.set(currentX);
    }
  });

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-[#0583F2] font-bold text-sm uppercase tracking-[0.2em] mb-3"
          >
            <Sparkles size={16} /> <span>What's New</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-black text-[#0583F2] leading-tight"
          >
            Latest <span className="text-[#010326]">Insights</span>
          </motion.h2>
        </div>
        <Link 
          to="/blog" 
          className="group flex items-center gap-3 bg-[#0583F2] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#010326] transition-all duration-500 shadow-xl"
        >
          Explore All Articles 
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div 
        className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className="flex gap-8 w-max"
          style={{ x: xPos }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => setIsPaused(true)}
          onDragEnd={() => setIsPaused(false)}
          onDrag={(e, info) => {
            const dragMovement = (info.delta.x / window.innerWidth) * 100;
            x.set(x.get() + dragMovement);
          }}
        >
          {duplicatedPosts.map((post, index) => {
             const readingTime = Math.ceil((post.content?.split(/\s+/).length || 0) / 200) || 5;

             return (
              <div
                key={index}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="w-[350px] md:w-[420px] shrink-0 group/card bg-white rounded-[2.5rem] border border-slate-100 p-6 transition-all duration-500 hover:border-blue-100 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] cursor-pointer select-none"
              >
                <div className="relative h-56 rounded-[1.8rem] overflow-hidden mb-6 pointer-events-none">
                  <img
                    src={post.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643"} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase">
                    <div className="flex items-center gap-1.5 text-blue-500">
                       <Clock size={14} />
                       <span>{readingTime} Min Read</span>
                    </div>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-snug line-clamp-2 group-hover/card:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-sm font-bold text-slate-900 group-hover/card:translate-x-2 transition-transform duration-300">
                    Read Story <ArrowRight size={16} className="text-blue-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogMarquee;