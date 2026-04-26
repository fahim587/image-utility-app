import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { ArrowLeft, Share2, Bookmark, Clock, Copy, Download, CheckCircle2 } from "lucide-react";
import { blogPosts } from "../data/blogData";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);
  const { scrollYProgress } = useScroll();

  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (post) {
      const savedPosts = JSON.parse(localStorage.getItem("bookmarks")) || [];
      setIsSaved(savedPosts.some(p => p.slug === post.slug));
    }
  }, [post]);

  const readingTime = useMemo(() => {
    if (!post) return 0;
    const wordsPerMinute = 200;
    const noOfWords = post.content.split(/\s+/).length;
    return Math.ceil(noOfWords / wordsPerMinute);
  }, [post]);

  if (!post) {
    return (
      <div className="py-40 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Post Not Found</h2>
        <Link to="/blog" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Blog
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(post.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([`${post.title}\n\n${post.content}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${post.slug}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const toggleSave = () => {
    const savedPosts = JSON.parse(localStorage.getItem("bookmarks")) || [];
    if (isSaved) {
      const filtered = savedPosts.filter(p => p.slug !== post.slug);
      localStorage.setItem("bookmarks", JSON.stringify(filtered));
      setIsSaved(false);
    } else {
      savedPosts.push(post);
      localStorage.setItem("bookmarks", JSON.stringify(savedPosts));
      setIsSaved(true);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>{post.title} | GOOGIZ Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-blue-600 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <AnimatePresence>
        {copied && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold"
          >
            <CheckCircle2 className="text-green-400" size={20} />
            Copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      <header className="pt-24 pb-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-10 transition-colors">
            <ArrowLeft size={16} /> Back to Insights
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest">
              {post.category}
            </span>
            <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
              <Clock size={14} /> {readingTime} min read
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-8 border-y border-slate-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {post.author[0]}
              </div>
              <div>
                <p className="text-slate-900 font-bold">{post.author}</p>
                <p className="text-slate-500 text-xs font-medium">{post.date}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button onClick={handleShare} className="p-3 rounded-full border border-slate-200 hover:bg-white hover:shadow-md transition-all active:scale-95">
                <Share2 size={18} className="text-slate-600" />
              </button>
              <button 
                onClick={toggleSave}
                className={`p-3 rounded-full border transition-all active:scale-95 ${isSaved ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-200' : 'border-slate-200 hover:bg-white'}`}
              >
                <Bookmark size={18} className={isSaved ? "text-white" : "text-slate-600"} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl ring-1 ring-slate-200">
          <img src={post.image} className="w-full h-auto object-cover max-h-[500px]" alt={post.title} />
        </div>

        <article className="prose prose-lg prose-slate max-w-none">
          <div className="text-2xl leading-relaxed font-medium text-slate-700 border-l-4 border-blue-600 pl-8 my-12 bg-slate-50 py-6 pr-4 rounded-r-xl">
            {post.excerpt}
          </div>

          <div className="text-lg text-slate-800 leading-loose whitespace-pre-line mb-16">
            {post.content}
          </div>

          <div className="flex flex-wrap gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 items-center justify-between">
            <p className="text-slate-900 font-bold text-sm uppercase tracking-widest">Article Tools:</p>
            <div className="flex gap-3">
              <button 
                onClick={handleCopyContent}
                className="flex items-center gap-2 bg-white text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all border border-slate-200 active:scale-95"
              >
                <Copy size={16} /> Copy Content
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
              >
                <Download size={16} /> Download .TXT
              </button>
            </div>
          </div>
        </article>

        <section className="mt-24 p-12 bg-slate-900 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            {subscribed ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-bold">You're on the list!</h3>
                <p className="text-slate-400">Thanks for joining our creative community.</p>
              </motion.div>
            ) : (
              <>
                <h3 className="text-3xl font-bold mb-4">Enjoying these insights?</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">Join 10,000+ creators and get the latest tools and tips delivered to your inbox.</p>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
                  />
                  <button type="submit" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20">
                    Subscribe
                  </button>
                </form>
              </>
            )}
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32 rounded-full" />
        </section>
      </main>
    </div>
  );
};

export default BlogPost;