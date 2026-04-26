import React, { useState, useEffect, useCallback } from "react";
import { 
  FileJson, Copy, Trash2, CheckCircle2, 
  AlertCircle, Code2, ArrowLeftRight, Download,
  ChevronDown, Zap, RefreshCw, Info 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RelatedTools from "../../components/RelatedTools";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(false);
  const indent = 2; 

  const formatJson = useCallback((data, isMinify = false) => {
    try {
      if (!data.trim()) {
        setOutput("");
        setError(null);
        return;
      }
      const parsed = JSON.parse(data);
      const formatted = isMinify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setError(null);
    } catch (err) {
      setError(err.message);
      setOutput("");
    }
  }, [indent]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      formatJson(input);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [input, formatJson]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(null), 2000);
  };

  // downloadJson এখন নিচের ডাউনলোড বাটনে ব্যবহৃত হচ্ছে
  const downloadJson = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "GOOGIZ_formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#fcfcfd]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header - motion ব্যবহৃত হয়েছে */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-2xl mb-4 border border-emerald-100 shadow-sm"
          >
            <FileJson className="text-emerald-600" size={28} />
          </motion.div>
          <h1 className="text-3xl font-black text-gray-900 ">JSON Studio</h1>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm">
          <div className="flex gap-2">
            <button 
              onClick={() => setInput('{"name":"GOOGIZ","type":"Utility","status":"Active"}')} 
              className="px-4 py-2 text-[10px] font-black text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all uppercase tracking-widest flex items-center gap-2"
            >
              <Zap size={14} /> Sample
            </button>
            <button 
              onClick={() => formatJson(input, true)} 
              className="px-4 py-2 text-[10px] font-black text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all uppercase tracking-widest flex items-center gap-2"
            >
              <RefreshCw size={14} /> Minify
            </button>
            <button 
              onClick={() => setInput("")} 
              className="px-4 py-2 text-[10px] font-black text-gray-400 hover:text-rose-500 transition-all uppercase tracking-widest flex items-center gap-1"
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
          
          <div className="flex gap-2">
            {/* downloadJson বাটন */}
            <button 
              onClick={downloadJson}
              className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
              title="Download JSON"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${copied ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              {copied ? <><CheckCircle2 size={18} /> Copied</> : <><Copy size={18} /> Copy JSON</>}
            </button>
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-2 gap-6 h-[550px]">
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 flex items-center gap-2">
              <Code2 size={12} /> Raw Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
              className="w-full flex-1 p-6 font-mono text-sm bg-white border border-gray-200 rounded-[32px] outline-none focus:border-emerald-400 shadow-sm resize-none scrollbar-hide"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2 flex items-center gap-2">
              <ArrowLeftRight size={12} /> Formatted Output
            </label>
            <div className={`w-full flex-1 p-6 font-mono text-sm overflow-auto rounded-[32px] border transition-all ${error ? 'bg-rose-50/50 border-rose-100 text-rose-500 shadow-inner' : 'bg-white border-gray-200 shadow-sm text-emerald-700'}`}>
              {error ? (
                <div className="flex items-start gap-2"><AlertCircle size={16} className="mt-0.5 shrink-0" /> <span className="leading-relaxed">{error}</span></div>
              ) : (
                <pre className="whitespace-pre-wrap">{output || "// Your beautiful JSON will appear here..."}</pre>
              )}
            </div>
          </div>
        </div>

        {/* Help Dropdown */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
            <button 
              onClick={() => setOpenFAQ(!openFAQ)} 
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><Info size={20} /></div>
                <div>
                   <span className="text-sm font-black text-gray-900 uppercase tracking-wider">Secure Processing</span>
                   <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5">Privacy First</p>
                </div>
              </div>
              <ChevronDown className={`text-emerald-400 transition-transform duration-300 ${openFAQ ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openFAQ && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  className="bg-gray-50/50 border-t border-gray-100 p-8 text-xs text-gray-500 leading-relaxed font-medium"
                >
                  This JSON tool works 100% on the client-side. No data is sent to any server, making it perfectly safe for formatting sensitive configuration files or API responses.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-20">
          <RelatedTools categoryId="utility" />
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;