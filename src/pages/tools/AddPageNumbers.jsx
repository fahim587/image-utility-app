import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import {
  Hash, Download, Loader2, FilePlus, Settings, 
  CheckCircle2, Trash2, FileText, ChevronDown, 
  HelpCircle, Sparkles, Layout, MousePointer2
} from "lucide-react";
import RelatedTools from '../../components/RelatedTools';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PageNumbers() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [position, setPosition] = useState("bottom-center");
  const [margin, setMargin] = useState(30);
  const [firstNumber, setFirstNumber] = useState(1);
  const [pageFrom, setPageFrom] = useState(1);
  const [pageTo, setPageTo] = useState(1);
  const [mode, setMode] = useState("single");
  const [textFormat, setTextFormat] = useState("number");
  const [showHowTo, setShowHowTo] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      setSuccess(false);
    }
  };

  const onLoad = ({ numPages }) => {
    setNumPages(numPages);
    setPageTo(numPages);
    setPageFrom(1);
  };

  const addPageNumbers = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();
      const total = pages.length;

      for (let index = 0; index < total; index++) {
        const pageNo = index + 1;
        if (pageNo < pageFrom || pageNo > pageTo) continue;

        const page = pages[index];
        const { width, height } = page.getSize();
        
        let text = "";
        const currentNum = index + firstNumber;
        if (textFormat === "number") text = `${currentNum}`;
        else if (textFormat === "page") text = `Page ${currentNum}`;
        else if (textFormat === "full") text = `Page ${currentNum} of ${total}`;

        const size = 10;
        const textWidth = font.widthOfTextAtSize(text, size);

        let currentPos = position;
        if (mode === "facing") {
          const isEven = pageNo % 2 === 0;
          if (position.includes("left")) {
            currentPos = isEven ? position.replace("left", "right") : position;
          } else if (position.includes("right")) {
            currentPos = isEven ? position.replace("right", "left") : position;
          }
        }

        let x = (width - textWidth) / 2;
        let y = margin;

        if (currentPos.includes("left")) x = margin;
        if (currentPos.includes("right")) x = width - textWidth - margin;
        if (currentPos.includes("top")) y = height - size - margin;

        page.drawText(text, {
          x, y, size, font,
          color: rgb(0.2, 0.2, 0.2),
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `numbered-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error processing PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  const positions = ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-rose-100 selection:text-rose-700 font-sans">
      <Helmet>
        <title>Professional PDF Page Numbering Tool | Fast & Secure</title>
        <meta name="description" content="Add professional page numbers to PDF documents. High-speed, secure, and fully customizable pagination for smart workflows." />
      </Helmet>

      {/* DYNAMIC BACKGROUND DECOR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-rose-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="relative max-w-[1400px] mx-auto p-4 md:p-8 space-y-8">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-widest mb-2">
               
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Add <span className="text-rose-600 ">Page Numbers</span> to PDF
            </h1>
            <p className="text-slate-500 font-medium">Streamline your documents with professional pagination.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {file && (
              <button 
                onClick={() => setFile(null)} 
                className="group p-4 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl border border-slate-100 transition-all duration-300"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={() => fileInputRef.current.click()}
              className="relative overflow-hidden group bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex gap-3 items-center hover:shadow-xl hover:shadow-slate-300 transition-all duration-300 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              <FilePlus size={20} className="group-hover:rotate-12 transition-transform" /> 
              <span>{file ? "Change PDF" : "Upload Document"}</span>
            </button>
          </div>
          <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} hidden />
        </header>

        {/* GUIDES / HOW IT WORKS */}
        <section className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-[2rem] overflow-hidden">
          <button 
            onClick={() => setShowHowTo(!showHowTo)}
            className="w-full flex justify-between items-center p-6 text-slate-700 font-bold hover:bg-white transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-xl"><HelpCircle size={20} className="text-slate-600" /></div>
              <span className="text-lg">How it works</span>
            </div>
            <ChevronDown className={`transition-transform duration-500 ${showHowTo ? "rotate-180" : ""}`} />
          </button>
          <div className={`grid transition-all duration-500 ease-in-out ${showHowTo ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
              <div className="p-8 pt-0 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100">
                {[
                  { icon: <FilePlus />, title: "Upload", desc: "Select your PDF document from your device." },
                  { icon: <Settings />, title: "Customize", desc: "Pick position, format, and page range." },
                  { icon: <Download />, title: "Download", desc: "Instantly get your numbered PDF ready for work." }
                ].map((item, i) => (
                  <div key={i} className="group p-6 rounded-2xl bg-white/50 hover:bg-white transition-all border border-transparent hover:border-slate-100">
                    <div className="w-10 h-10 mb-4 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">{item.icon}</div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {!file ? (
          <div 
            onClick={() => fileInputRef.current.click()} 
            className="relative group border-2 border-dashed border-slate-200 bg-white/40 p-24 md:p-40 text-center rounded-[4rem] cursor-pointer hover:border-rose-400 hover:bg-rose-50/20 transition-all duration-500"
          >
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white text-rose-500 flex items-center justify-center mx-auto rounded-[2rem] mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Layout size={44} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Drop your file here</h2>
              <div className="flex items-center justify-center gap-2 text-slate-400 font-medium bg-slate-100 w-fit mx-auto px-4 py-2 rounded-full">
                <MousePointer2 size={16} /> Click to browse files
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* PREVIEW PANEL */}
            <div className="flex-1 w-full bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-400 uppercase tracking-widest text-xs flex gap-2 items-center">
                  <FileText size={16} /> Document Preview
                </h3>
                <span className="px-4 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-full uppercase tracking-tighter">
                  {numPages} Total Pages
                </span>
              </div>
              
              <div className="max-h-[750px] overflow-y-auto pr-4 custom-scrollbar rounded-2xl bg-slate-50/50 p-6 border border-slate-100">
                <Document 
                  file={file} 
                  onLoadSuccess={onLoad}
                  loading={<div className="flex flex-col items-center py-40 gap-4"><Loader2 className="animate-spin text-rose-500" size={40} /><p className="font-bold text-slate-400">Rendering preview...</p></div>}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {Array.from({ length: Math.min(numPages || 0, 30) }).map((_, i) => (
                      <div key={i} className="relative group bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                        <Page
                          pageNumber={i + 1}
                          width={220}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          className="mx-auto"
                        />
                        <div className="absolute top-5 right-5 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          #{i + 1}
                        </div>
                        {/* Position Marker Indicator */}
                        <div className={`absolute w-4 h-4 bg-rose-500 rounded-full border-4 border-white shadow-lg animate-pulse transition-all duration-500 ${
                          position.includes("top") ? "top-8" : "bottom-8"
                        } ${
                          position.includes("left") ? "left-8" : position.includes("right") ? "right-8" : "left-1/2 -ml-2"
                        }`} />
                      </div>
                    ))}
                  </div>
                </Document>
                {numPages > 30 && (
                  <div className="text-center mt-12 p-6 bg-white rounded-2xl border border-slate-100 text-slate-400 text-sm font-medium italic">
                    Showing first 30 pages for performance.
                  </div>
                )}
              </div>
            </div>

            {/* CONTROL SIDEBAR */}
            <aside className="w-full lg:w-[420px] bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 space-y-10 sticky top-8">
              <div className="space-y-1">
                <h3 className="font-black text-2xl text-slate-800 flex items-center gap-2">
                   Settings
                </h3>
                <p className="text-slate-400 text-sm font-medium">Fine-tune your page layout.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Layout Mode</label>
                  <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
                    {["single", "facing"].map(m => (
                      <button key={m} onClick={() => setMode(m)} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${mode === m ? 'bg-white text-rose-600 shadow-md border border-rose-100' : 'text-slate-400 hover:text-slate-600'}`}>
                        {m === "single" ? "Single Page" : "Facing Pages"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Number Position</label>
                  <div className="grid grid-cols-3 gap-3">
                    {positions.map((p) => (
                      <button 
                        key={p} 
                        onClick={() => setPosition(p)} 
                        className={`h-12 border-2 rounded-xl transition-all duration-300 relative group ${position === p ? "bg-rose-500 border-rose-500 shadow-lg shadow-rose-200" : "bg-slate-50 border-slate-100 hover:border-rose-200"}`}
                        title={p}
                      >
                        <div className={`absolute w-1.5 h-1.5 rounded-full ${position === p ? "bg-white" : "bg-slate-300"} ${
                          p.includes("top") ? "top-2" : "bottom-2"
                        } ${
                          p.includes("left") ? "left-2" : p.includes("right") ? "right-2" : "left-1/2 -ml-0.75"
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Start From</label>
                    <input type="number" min="1" value={pageFrom} onChange={(e) => setPageFrom(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold focus:ring-2 ring-rose-500/10 focus:bg-white outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">End Page</label>
                    <input type="number" max={numPages} value={pageTo} onChange={(e) => setPageTo(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold focus:ring-2 ring-rose-500/10 focus:bg-white outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Format Style</label>
                  <div className="relative group">
                    <select value={textFormat} onChange={(e) => setTextFormat(e.target.value)} className="w-full appearance-none bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-rose-500/10 cursor-pointer transition-all">
                      <option value="number">Numeric (1, 2, 3)</option>
                      <option value="page">Simple (Page 1)</option>
                      <option value="full">Detail (Page 1 of {numPages || '...'})</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" size={18} />
                  </div>
                </div>
              </div>

              <button 
                onClick={addPageNumbers} 
                disabled={isProcessing} 
                className="group relative w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-slate-200 hover:bg-rose-600 transition-all duration-500 active:scale-95 disabled:opacity-50 overflow-hidden"
              >
                <div className="relative z-10 flex justify-center items-center gap-4">
                  {isProcessing ? <Loader2 className="animate-spin" size={20} /> : success ? <CheckCircle2 size={20} /> : <Download size={20} className="group-hover:translate-y-1 transition-transform" />}
                  {isProcessing ? "Adding Numbers..." : success ? "Download Ready" : "Generate & Save"}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>

              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Secure Local Processing • No Files Stored</p>
            </aside>
          </div>
        )}

        {/* RELATED TOOLS SECTION */}
        <RelatedTools categoryId='pdf' />
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .react-pdf__Page__canvas { border-radius: 12px !important; margin: 0 auto; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.05); }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .7; transform: scale(1.2); } }
      `}</style>
    </div>
  );
}