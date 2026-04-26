import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import html2pdf from "html2pdf.js";
import { 
  Globe, 
  Download, 
  Loader2, 
  Code, 
  FileCode, 
  RefreshCcw, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import RelatedTools from "../../components/RelatedTools";

const HtmlToPdf = () => {
  const [activeTab, setActiveTab] = useState("url"); // url or code
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const previewRef = useRef(null);

  const handleConvert = async () => {
    if (!inputValue) {
      setError(`Please enter a ${activeTab === 'url' ? 'URL' : 'HTML code'}`);
      return;
    }
    setError("");
    setIsProcessing(true);

    try {
      let element = document.createElement("div");
      element.style.padding = "20px";
      element.style.width = "800px";

      if (activeTab === "url") {
        // URL এর জন্য একটি আইফ্রেম বা প্রক্সি মেকানিজম (সীমিত সাফল্য)
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(inputValue)}`);
        const data = await response.json();
        element.innerHTML = data.contents;
      } else {
        // সরাসরি কোড রেন্ডার (১০০% সাকসেস)
        element.innerHTML = inputValue;
      }

      const opt = {
        margin: 10,
        filename: `GOOGIZ_${activeTab}_to_pdf.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      setError("Failed to convert. Some sites block direct access due to security policies.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-4">
      <Helmet title="HTML to PDF Converter - Smart Web to PDF | GOOGIZ" />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-rose-600 mb-4 flex items-center justify-center gap-3">
            <Globe className="text-rose-600" size={36} /> HTML to PDF
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Convert Webpages or HTML Code instantly</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-50 overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => {setActiveTab("url"); setInputValue(""); setError("");}}
              className={`flex-1 p-6 font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'url' ? 'bg-rose-50 text-rose-600 border-b-4 border-rose-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Globe size={18} /> URL Address
            </button>
            <button 
              onClick={() => {setActiveTab("code"); setInputValue(""); setError("");}}
              className={`flex-1 p-6 font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'code' ? 'bg-rose-50 text-rose-600 border-b-4 border-rose-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Code size={18} /> HTML Code
            </button>
          </div>

          <div className="p-8 md:p-12">
            {activeTab === "url" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Globe size={12} /> Enter Website Link
                </div>
                <input 
                  type="url" 
                  value={inputValue}
                  placeholder="https://example.com"
                  className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-bold text-slate-700"
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <FileCode size={12} /> Paste HTML Snippet
                </div>
                <textarea 
                  rows="8"
                  value={inputValue}
                  placeholder="<h1>Hello GOOGIZ!</h1><p>Start typing your HTML code here...</p>"
                  className="w-full p-6 bg-slate-900 border border-slate-800 rounded-3xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all font-mono text-sm text-rose-400"
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setInputValue("")}
                className="flex-1 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCcw size={16} /> Clear
              </button>
              <button 
                onClick={handleConvert}
                disabled={isProcessing}
                className={`flex-[2] text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 ${activeTab === 'url' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-100' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'}`}
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <Download size={18} />}
                {isProcessing ? "Generating PDF..." : "Convert & Download"}
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-6">
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                  <CheckCircle2 size={14} className="text-green-500" /> CSS3 Support
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                  <CheckCircle2 size={14} className="text-green-500" /> High Resolution
               </div>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <RelatedTools categoryId="pdf" />
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-white">
            <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4 ${activeTab === 'url' ? 'border-rose-500' : 'border-rose-500'}`}></div>
            <p className="font-black uppercase tracking-[0.3em] text-[10px]">Processing HTML Content</p>
        </div>
      )}
    </div>
  );
};

export default HtmlToPdf;