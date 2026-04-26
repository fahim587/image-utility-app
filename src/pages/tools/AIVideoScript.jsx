import React, { useState } from 'react';
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Sparkles, Copy, Check, Download, Upload, Loader2, ChevronDown, AlertCircle, ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const AIVideoScript = () => {
    const [topic, setTopic] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [fileType, setFileType] = useState("txt");

    const handleGenerate = async () => {
        if (!topic) return alert("Please enter a video topic!");
        
        setLoading(true);
        setResult(""); // নতুন রেজাল্টের জন্য আগেরটা ক্লিয়ার করা
        
        try {
            const response = await fetch("http://localhost:5000/api/ai/generate-content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    topic: `Write a viral video script for: ${topic}. Include Hook, Body, and Call to Action.`, 
                    type: "video-script" 
                })
            });
            const data = await response.json();
            if (data.success) {
                setResult(data.content);
            } else {
                throw new Error("Failed to generate script");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("⚠️ Connection Error: Please ensure your backend server is running.");
        }
        setLoading(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadScript = () => {
        if (!result) return;

        let content = result;
        let mime = "text/plain";
        let filename = "ai-video-script";

        if (fileType === "md") {
            mime = "text/markdown";
            filename += ".md";
        } else if (fileType === "html") {
            mime = "text/html";
            content = `<html><body style="font-family:Arial;padding:40px;line-height:1.6;"><h2>Video Script</h2><p>${result.replace(/\n/g, "<br/>")}</p></body></html>`;
            filename += ".html";
        } else if (fileType === "doc") {
            mime = "application/msword";
            content = result;
            filename += ".doc";
        } else {
            mime = "text/plain";
            filename += ".txt";
        }

        const element = document.createElement("a");
        const fileBlob = new Blob([content], { type: mime + ';charset=utf-8' });
        element.href = URL.createObjectURL(fileBlob);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <>
            <Helmet>
                <title>AI Video Script Generator | Create Viral Content Fast</title>
                <meta name="description" content="Generate high-converting scripts for YouTube, TikTok, and Reels using AI." />
            </Helmet>

            <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6 font-sans">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Back Link */}
                    <Link to="/ai-tools" className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 mb-8 font-bold transition-all hover:-translate-x-1">
                        <ArrowLeft size={18} /> Back to AI Magic
                    </Link>

                    {/* SEO Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            AI Video Script: <span className="text-violet-600">Create Viral Stories</span>
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Transform your ideas into engaging scripts for YouTube, Reels, and TikTok in seconds.
                        </p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
                        
                        <div className="relative z-10 space-y-8">
                            
                            {/* Input Area */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                    <Video size={18} className="text-violet-600" /> Video Topic or Idea
                                </label>
                                <textarea 
                                    className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-violet-500/5 focus:bg-white focus:border-violet-300 outline-none transition-all min-h-[180px] text-lg text-gray-800"
                                    placeholder="Describe your video idea... (e.g. 5 Minute Morning Routine for Busy People)"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="w-full md:flex-1 bg-violet-600 hover:bg-violet-700 text-white py-5 rounded-2xl font-bold text-xl shadow-lg shadow-violet-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                                    {loading ? "Writing Script..." : "Generate Script"}
                                </button>

                                {/* Dropdown Options */}
                                <div className="relative w-full md:w-auto">
                                    <button 
                                        onClick={() => setShowOptions(!showOptions)}
                                        className="w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-5 rounded-2xl font-bold flex items-center justify-between gap-3 transition-all"
                                    >
                                        Actions <ChevronDown size={20} className={`transition-transform ${showOptions ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {showOptions && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute bottom-full mb-3 right-0 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50"
                                            >
                                                <div className="px-3 py-2">
                                                    <select 
                                                        value={fileType}
                                                        onChange={(e) => setFileType(e.target.value)}
                                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm font-bold outline-none"
                                                    >
                                                        <option value="txt">TXT File</option>
                                                        <option value="md">Markdown</option>
                                                        <option value="html">HTML File</option>
                                                        <option value="doc">DOC File</option>
                                                    </select>
                                                </div>
                                                <button onClick={copyToClipboard} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-violet-50 rounded-xl text-left text-sm font-bold text-gray-700 transition-colors">
                                                    <Copy size={16} /> {copied ? "Copied!" : "Copy Script"}
                                                </button>
                                                <button onClick={downloadScript} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-violet-50 rounded-xl text-left text-sm font-bold text-gray-700 transition-colors">
                                                    <Download size={16} /> Download Result
                                                </button>
                                                <button onClick={() => {setTopic(""); setResult(""); setShowOptions(false)}} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl text-left text-sm font-bold text-red-600 border-t mt-1">
                                                    <Trash2 size={16} /> Clear All
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Result Display with Loading Animation */}
                            <AnimatePresence>
                                {loading && !result && (
                                    <motion.div 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        className="py-12 flex flex-col items-center justify-center text-violet-600 gap-4"
                                    >
                                        <div className="relative">
                                            <Loader2 size={48} className="animate-spin" />
                                            <Sparkles size={20} className="absolute -top-1 -right-1 animate-pulse" />
                                        </div>
                                        <p className="font-bold text-lg animate-pulse">Crafting your viral story...</p>
                                    </motion.div>
                                )}

                                {result && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="pt-10 border-t border-gray-100"
                                    >
                                        <div className="flex items-center gap-3 mb-6 text-violet-600 font-black uppercase tracking-widest">
                                            <Sparkles size={20} /> <span>AI Generated Script</span>
                                        </div>
                                        <div className="p-8 bg-gray-50 rounded-[2.5rem] text-gray-800 leading-relaxed border border-gray-100 text-lg shadow-inner whitespace-pre-wrap font-medium">
                                            {result}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AIVideoScript;