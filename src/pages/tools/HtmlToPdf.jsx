import React, { useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import html2pdf from "html2pdf.js";
import { 
  Globe, Download, Loader2, Code, FileCode, 
  RefreshCcw, AlertCircle, CheckCircle2, Layout 
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
      setError(`Please enter a ${activeTab === 'url' ? 'URL' : 'HTML code'}`);
      return;
    }
    setError("");
    setSuccess(false);
    setIsProcessing(true);

    try {
      let contentToConvert = "";

      if (activeTab === "url") {
        // URL ফেচিং উইথ বেটার এরর হ্যান্ডলিং
        const response = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(inputValue)}`
        );
        
        if (!response.ok) throw new Error("Could not connect to the proxy server.");
        
        const data = await response.json();
        
        if (!data || !data.contents) {
          throw new Error("This website is protected or refused to return content. Try pasting the HTML code directly.");
        }
        contentToConvert = data.contents;
      } else {
        contentToConvert = inputValue;
      }

      // কন্টেন্ট রেন্ডার করার জন্য একটি ইনভিজিবল কন্টেইনার তৈরি
      const element = document.createElement("div");
      element.style.padding = "40px";
      element.style.width = "800px";
      element.style.backgroundColor = "white";
      element.innerHTML = contentToConvert;

      // স্টাইল ফিক্সিং (যাতে ইমেজ এবং লেআউট ঠিক থাকে)
      const style = document.createElement('style');
      style.innerHTML = `
        img { max-width: 100%; height: auto; }
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
      `;
      element.appendChild(style);

      const opt = {
        margin: [10, 10],
        filename: `GOOGIZ_${activeTab}_to_pdf_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true 
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // কনভার্সন রান করা
      await html2pdf().set(opt).from(element).save();
      setSuccess(true);

    } catch (err) {
      console.error("Conversion Error:", err);
      setError(err.message || "Failed to convert. Some sites block direct access due to security policies.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-4">
      <Helmet>
        <title>HTML to PDF Converter - Web to PDF | GOOGIZ</title>
        <meta name="description" content="Convert any webpage or HTML code into high-quality PDF documents instantly with GOOGIZ." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10 space-y-4">
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            HTML <span className="text-rose-600">to</span> PDF
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Convert Webpages or HTML Code instantly</p>
        </header>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => {setActiveTab("url"); resetStates();}}
              className={`flex-1 p-8 font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'url' ? 'bg-rose-50/50 text-rose-600 border-b-4 border-rose-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Globe size={20} /> URL Address
            </button>
            <button 
              onClick={() => {setActiveTab("code"); resetStates();}}
              className={`flex-1 p-8 font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'code' ? 'bg-rose-50/50 text-rose-600 border-b-4 border-rose-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Code size={20} /> HTML Code
            </button>
          </div>

          <div className="p-8 md:p-12">
            {activeTab === "url" ? (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Globe size={12} /> Enter Website Link
                </div>
                <input 
                  type="url" 
                  value={inputValue}
                  placeholder="https://example.com"
                  className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-bold text-slate-700"
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <FileCode size={12} /> Paste HTML Snippet
                </div>
                <textarea 
                  rows="10"
                  value={inputValue}
                  placeholder="<div style='color: red'><h1>Hello GOOGIZ!</h1></div>"
                  className="w-full p-8 bg-slate-900 border border-slate-800 rounded-3xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-mono text-sm text-rose-400 shadow-inner"
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            )}

            {error && (
              <div className="mt-6 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-shake">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {success && (
              <div className="mt-6 p-5 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 text-xs font-bold">
                <CheckCircle2 size={18} /> PDF Generated successfully!
              </div>
            )}

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={resetStates}
                className="flex-1 px-8 py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCcw size={18} /> Clear
              </button>
              <button 
                onClick={handleConvert}
                disabled={isProcessing || !inputValue}
                className="flex-[2] text-white px-8 py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 bg-slate-900 hover:bg-rose-600"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <Download size={20} />}
                {isProcessing ? "Generating PDF..." : "Convert & Download"}
              </button>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-8">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                   <CheckCircle2 size={14} className="text-green-500" /> CSS3 Support
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                   <CheckCircle2 size={14} className="text-green-500" /> High Resolution
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                   <CheckCircle2 size={14} className="text-green-500" /> Secure SSL
                </div>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <RelatedTools categoryId="pdf" />
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="w-20 h-20 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Processing</h2>
            <p className="text-slate-400 font-medium max-w-xs uppercase text-[10px] tracking-[0.2em]">Please wait while we capture and convert the content</p>
        </div>
      )}
    </div>
  );
};

export default HtmlToPdf;