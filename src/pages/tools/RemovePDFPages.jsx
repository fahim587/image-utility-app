import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { PDFDocument } from "pdf-lib";
import { Document, Page, pdfjs } from "react-pdf";
import { 
  Trash2, FilePlus, Download, Loader2, 
  Scissors, CheckCircle2, Info, MousePointerClick,
  FileX2, Sparkles, X, ListFilter, RotateCcw, CheckSquare
} from "lucide-react";
import RelatedTools from '../../components/RelatedTools';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function RemovePages() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [manualInput, setManualInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // ম্যানুয়াল ইনপুট থেকে পেজ সিলেক্ট করার লজিক
  const handleManualSelect = () => {
    if (!manualInput.trim()) return;
    
    const pages = new Set();
    const parts = manualInput.split(",");
    
    parts.forEach(part => {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(num => parseInt(num.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
            if (i > 0 && i <= numPages) pages.add(i - 1);
          }
        }
      } else {
        const num = parseInt(part.trim());
        if (!isNaN(num) && num > 0 && num <= numPages) pages.add(num - 1);
      }
    });

    setSelectedPages(Array.from(pages));
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      setSelectedPages([]);
      setSuccess(false);
      setManualInput("");
    }
  };

  const togglePageSelection = (pageIndex) => {
    setSelectedPages((prev) =>
      prev.includes(pageIndex) ? prev.filter((p) => p !== pageIndex) : [...prev, pageIndex]
    );
  };

  const removePages = async () => {
    if (!file || selectedPages.length === 0) return;
    setIsProcessing(true);
    setSuccess(false);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const pagesToRemove = [...selectedPages].sort((a, b) => b - a);
      pagesToRemove.forEach((index) => pdf.removePage(index));

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `optimized-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to process PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans selection:bg-rose-100 selection:text-rose-600">
        <Helmet>
          <title>Smart PDF Page Remover | Professional Web Utility</title>
        </Helmet>

        {/* BG DECOR */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-50">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-blue-50 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-[1400px] mx-auto space-y-8">
          
          {/* HEADER */}
          <header className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-widest mb-2">
                <Sparkles size={12} /> Smart Document Processor
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Delete <span className="text-rose-600">PDF Pages</span>
              </h1>
              <p className="text-slate-500 font-medium">Remove pages visually or by entering page numbers manually.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {file && (
                <button onClick={() => {setFile(null); setSelectedPages([]);}} className="p-4 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl border border-slate-100 transition-all">
                  <RotateCcw size={20} />
                </button>
              )}
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex gap-3 items-center hover:shadow-xl hover:shadow-slate-300 transition-all active:scale-95"
              >
                <FilePlus size={20} />
                <span>{file ? "Change File" : "Upload PDF"}</span>
              </button>
            </div>
            <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} hidden />
          </header>

          {!file ? (
            <div onClick={() => fileInputRef.current.click()} className="group border-2 border-dashed border-slate-200 bg-white/40 p-24 md:p-40 text-center rounded-[4rem] cursor-pointer hover:border-rose-400 hover:bg-rose-50/20 transition-all duration-500">
              <div className="w-24 h-24 bg-white text-rose-500 flex items-center justify-center mx-auto rounded-[2rem] mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <FileX2 size={44} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-3">Drop your PDF here</h2>
              <p className="text-slate-400 font-medium">Click to select the document you want to edit.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* LEFT: MANUAL CONTROL PANEL */}
              <aside className="lg:col-span-1 space-y-6">
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-6 sticky top-8">
                  <div className="space-y-2">
                    <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                      <ListFilter size={20} className="text-rose-600" /> Quick Select
                    </h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">Type pages like 1, 3, 5-10 and press apply.</p>
                  </div>

                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="e.g. 1, 2, 5-10" 
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold focus:ring-2 ring-rose-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                    />
                    <button 
                      onClick={handleManualSelect}
                      className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all"
                    >
                      Apply Range
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex gap-2">
                    <button onClick={() => setSelectedPages(Array.from({length: numPages}, (_, i) => i))} className="flex-1 py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                      <CheckSquare size={14} /> All
                    </button>
                    <button onClick={() => setSelectedPages([])} className="flex-1 py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                      <RotateCcw size={14} /> Clear
                    </button>
                  </div>

                  <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-2">
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Selection Info</p>
                    <p className="text-sm font-bold text-rose-900">{selectedPages.length} pages marked for deletion.</p>
                  </div>
                </div>
              </aside>

              {/* RIGHT: SCROLLABLE PREVIEW GRID */}
              <div className="lg:col-span-3 bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm flex flex-col max-h-[85vh]">
                <div className="flex items-center justify-between mb-8 px-4">
                  <h3 className="font-black text-slate-400 uppercase tracking-widest text-xs flex gap-2 items-center">
                    <MousePointerClick size={16} /> Interactive Grid
                  </h3>
                  <span className="px-4 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-full uppercase tracking-tighter">
                    Total {numPages} Pages
                  </span>
                </div>

                {/* CUSTOM SCROLLBAR AREA */}
                <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                  <Document 
                    file={file} 
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)} 
                    loading={<div className="flex flex-col items-center py-40 gap-4"><Loader2 className="animate-spin text-rose-500" size={40} /><p className="font-bold text-slate-400">Loading Grid...</p></div>}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
                      {Array.from({ length: numPages || 0 }).map((_, i) => (
                        <div 
                          key={i} 
                          onClick={() => togglePageSelection(i)} 
                          className={`group relative p-3 rounded-[2rem] cursor-pointer transition-all duration-300 border-2 ${
                            selectedPages.includes(i) 
                            ? "border-rose-500 bg-rose-50 shadow-lg shadow-rose-100" 
                            : "border-transparent bg-slate-50 hover:bg-white hover:shadow-xl hover:-translate-y-1"
                          }`}
                        >
                          <Page 
                            pageNumber={i + 1} 
                            width={180} 
                            renderTextLayer={false} 
                            renderAnnotationLayer={false} 
                            className="rounded-xl overflow-hidden mx-auto shadow-sm"
                          />
                          <div className={`absolute top-5 left-5 text-[10px] font-black px-2 py-1 rounded-lg ${
                            selectedPages.includes(i) ? "bg-rose-500 text-white" : "bg-slate-900 text-white"
                          }`}>
                            {i + 1}
                          </div>
                          {selectedPages.includes(i) && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-500/10 backdrop-blur-[2px] rounded-[2rem]">
                              <div className="bg-rose-600 text-white p-2 rounded-full shadow-xl">
                                <X size={20} strokeWidth={3} />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Document>
                </div>

                {/* ACTION FOOTER */}
                <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Info size={16} />
                    <span className="text-xs font-bold">Files are processed locally for security.</span>
                  </div>
                  <button 
                    onClick={removePages} 
                    disabled={isProcessing || selectedPages.length === 0}
                    className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 disabled:bg-slate-200 disabled:text-slate-400 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-rose-100"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={20} /> : success ? <CheckCircle2 size={20} /> : <Scissors size={20} />}
                    {isProcessing ? "Cleaning PDF..." : success ? "Download Started" : "Delete Selected Pages"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
          
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; border: 2px solid white; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
          
          .react-pdf__Page__canvas { border-radius: 12px !important; margin: 0 auto !important; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        `}</style>

      </div>
      <RelatedTools categoryId='pdf' />
    </>
  );
}