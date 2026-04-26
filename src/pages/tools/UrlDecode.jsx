import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Copy, Trash2, CheckCircle, Info } from "lucide-react";
import Navbar from "../../components/Navbar"; // Adjusted path to match your folder structure
import RelatedTools from "../../components/RelatedTools";


const UrlDecode = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const handleDecode = () => {
        if (!input.trim()) return;
        try {
            setError("");
            // Decodes percent-encoding and converts + back to spaces
            const decoded = decodeURIComponent(input.replace(/\+/g, " "));
            setOutput(decoded);
        } catch (err) {
            setError("Invalid URL encoding. Please check your input.");
            setOutput("");
        }
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInput("");
        setOutput("");
        setError("");
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-emerald-100">
            <Navbar />
            
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest mb-4 border border-emerald-100"
                        >
                            <RefreshCw size={14} className="animate-spin-slow" /> Utility Tool
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                            URL Decoder
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Transform encoded URL strings back into human-readable text instantly.
                        </p>
                    </div>

                    <div className="grid gap-8">
                        {/* Input Section */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
                        >
                            <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                                Encoded URL / Query String
                            </label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Paste encoded text (e.g., hello%20world%21)"
                                className="w-full h-40 p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none font-mono text-sm"
                            />
                            
                            <div className="flex flex-wrap gap-3 mt-4">
                                <button
                                    onClick={handleDecode}
                                    className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 group"
                                >
                                    <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" /> Decode String
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="px-6 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>

                        {/* Error Message */}
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-sm font-medium flex items-center gap-3"
                            >
                                <Info size={18} /> {error}
                            </motion.div>
                        )}

                        {/* Output Section */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all ${output ? 'opacity-100' : 'opacity-60'}`}
                        >
                            <div className="flex items-center justify-between mb-3 ml-1">
                                <label className="text-sm font-bold text-gray-700">Decoded Result</label>
                                {output && (
                                    <button 
                                        onClick={handleCopy}
                                        className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                                    >
                                        {copied ? <><CheckCircle size={12} /> Copied</> : <><Copy size={12} /> Copy Result</>}
                                    </button>
                                )}
                            </div>
                            <div className="w-full min-h-[160px] p-5 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl font-mono text-sm text-gray-800 break-all whitespace-pre-wrap">
                                {output || <span className="text-gray-400 italic">Results will appear here...</span>}
                            </div>
                        </motion.div>

                        {/* Privacy Footer */}
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-medium">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Client-side processing. No data is sent to any server.
                        </div>
                    </div>
                </div>
                <RelatedTools categoryId="utility" />
            </main>
        </div>
    );
};

export default UrlDecode;
