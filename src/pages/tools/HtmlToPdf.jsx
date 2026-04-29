import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import html2pdf from "html2pdf.js";
import {
  Globe,
  Download,
  Loader2,
  Code,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Layout
} from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const HtmlToPdf = () => {
  const [activeTab, setActiveTab] = useState("url");
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetStates = () => {
    setError("");
    setSuccess(false);
    setInputValue("");
  };

  const handleConvert = async () => {
    if (!inputValue) {
      setError(activeTab === "url" ? "Please enter a URL" : "Please enter HTML code");
      return;
    }

    setIsProcessing(true);
    setError("");
    setSuccess(false);

    try {
      let htmlContent = "";

      if (activeTab === "url") {
        let proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(inputValue)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error("Website blocked or unavailable");
        htmlContent = await res.text();
      } else {
        htmlContent = inputValue;
      }

      const container = document.createElement("div");
      container.style.padding = "30px";
      container.style.width = "800px";
      container.style.background = "#ffffff";
      container.style.color = "#000";
      container.innerHTML = htmlContent;

      const images = container.querySelectorAll("img");
      images.forEach((img) => {
        img.style.maxWidth = "100%";
        img.crossOrigin = "anonymous";
      });

      const options = {
        margin: 10,
        filename: `GOOGIZ-html-to-pdf-${Date.now()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(options).from(container).save();
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Conversion failed. Try different content.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Helmet>
        <title>HTML to PDF Converter | GOOGIZ</title>
      </Helmet>

      {/* Hero Accent */}
      <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-b from-rose-50 to-transparent -z-10" />

      <div className="max-w-4xl mx-auto px-4 pt-28">
        
        {/* HEADER */}
        <div className="text-center mb-12 space-y-4">
          
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
            HTML <span className="text-rose-600">→ PDF</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Transform any website or code snippet into a pro-grade PDF.
          </p>
        </div>

        {/* MAIN CONVERTER CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          {/* TABS WITH SLIDER FEEL */}
          <div className="flex p-2 bg-slate-50/80 m-4 rounded-2xl border border-slate-100">
            <button
              onClick={() => { setActiveTab("url"); resetStates(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all duration-300 ${
                activeTab === "url"
                  ? "bg-white text-rose-600 shadow-md ring-1 ring-slate-200"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Globe size={18} /> Website URL
            </button>

            <button
              onClick={() => { setActiveTab("code"); resetStates(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all duration-300 ${
                activeTab === "code"
                  ? "bg-white text-rose-600 shadow-md ring-1 ring-slate-200"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Code size={18} /> HTML Code
            </button>
          </div>

          <div className="p-8 pt-4 space-y-6">
            {/* INPUT AREA */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                {activeTab === "url" ? "Target Destination" : "Source Code"}
              </label>
              
              {activeTab === "url" ? (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-rose-500 transition-colors">
                    <Globe size={20} />
                  </div>
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-rose-500 focus:bg-white transition-all text-slate-700 shadow-inner"
                  />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-900">
                  <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] text-slate-500 font-mono ml-2 uppercase">index.html</span>
                  </div>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    rows={10}
                    placeholder="<h1 style='color: red'>Hello World</h1>"
                    className="w-full p-6 bg-slate-900 text-rose-400 font-mono text-sm outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              )}
            </div>

            {/* STATUS MESSAGES */}
            {error && (
              <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-4 rounded-2xl text-xs font-bold border border-rose-100 animate-shake">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-2xl text-xs font-bold border border-green-100">
                <CheckCircle2 size={18} /> PDF generated and downloaded successfully!
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={resetStates}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                <RefreshCcw size={18} /> Clear Data
              </button>

              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="flex-[2] flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-rose-600 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-30"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>Start Conversion <ArrowRight size={18} /></>
                )}
              </button>
            </div>
          </div>

          {/* BOTTOM BADGE */}
          <div className="bg-slate-50 px-8 py-4 flex items-center justify-between border-t border-slate-100">
            <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-green-500" /> SSL Secure
            </span>
            <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Layout size={14} className="text-blue-500" /> A4 Format
            </span>
          </div>
        </div>

        {/* RELATED TOOLS */}
        <div className="mt-24 pt-10 border-t border-slate-100">
          <RelatedTools categoryId="pdf" />
        </div>
      </div>

      {/* MODERN LOADING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center text-white z-50 animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap size={24} fill="white" />
            </div>
          </div>
          <p className="mt-6 font-black uppercase tracking-[0.3em] text-sm animate-pulse">Rendering PDF</p>
          <p className="text-rose-100/60 text-xs mt-2">Please keep this tab active</p>
        </div>
      )}
    </div>
  );
};

export default HtmlToPdf;